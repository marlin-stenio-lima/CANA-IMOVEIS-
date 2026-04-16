import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Hello from webhook-whatsapp!")

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const supabase = createClient(supabaseUrl!, supabaseKey!)

        const rawBody = await req.text();
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            return new Response('Invalid JSON', { status: 400 });
        }

        if (!body || !body.data) return new Response('No data', { status: 200 });

        // Log the full payload for debugging
        await supabase.from('webhook_logs').insert({ payload: body })

        const { event, instance, data, sender } = body

        // Handle Status Updates
        if (event && event.includes('MESSAGES_UPDATE')) {
            const { key, status } = data
            if (key?.remoteJid && status) {
                await supabase.from('messages').update({ status: status.toLowerCase() }).eq('remote_jid', key.remoteJid).eq('wamid', key.id);
            }
            return new Response('Status updated', { status: 200 })
        }

        const normalizedEvent = (event || "").toString().toUpperCase().replace(/\./g, '_');
        if (normalizedEvent !== 'MESSAGES_UPSERT' && normalizedEvent !== 'SEND_MESSAGE') return new Response('Ignored', { status: 200 });

        if (!data || !data.key) return new Response('Missing key', { status: 200 });

        const messageData = data.message || data
        let remoteJid = data.key.remoteJid
        const fromMe = data.key.fromMe || false
        const messageId = data.key.id
        const status = data.status || 'DELIVERED'
        const participant = data.key.participant || data.participant

        if (remoteJid.includes('@g.us') || remoteJid.includes('@broadcast')) return new Response('Ignored Group', { status: 200 });

        // 1. Get Instance
        const { data: instanceData } = await supabase.from('instances').select('id, company_id, assigned_to').eq('name', instance).single();
        if (!instanceData) return new Response('Instance not found', { status: 404 });

        // 2. Resolve Contact
        let senderNumber = remoteJid.split('@')[0];
        if (remoteJid.includes('@lid') && participant) {
            senderNumber = participant.split('@')[0];
            remoteJid = `${senderNumber}@s.whatsapp.net`;
        }
        const pushName = data.pushName || senderNumber;

        // Correctly handle contact name: only update if it's an inbound message
        const contactPayload: any = {
            remote_jid: remoteJid, 
            phone: senderNumber, 
            company_id: instanceData.company_id, 
            updated_at: new Date().toISOString()
        };
        
        // Only update the name if it's NOT from me (it's from the contact)
        if (!fromMe && pushName && pushName !== senderNumber) {
            contactPayload.name = pushName;
        }

        const { data: contact } = await supabase.from('contacts').upsert(
            contactPayload, 
            { onConflict: 'remote_jid' }
        ).select().single();
        
        if (!contact) return new Response('Contact error', { status: 500 });
        const contactId = contact.id;

        // 3. Extract Message Content & Media (Fixed Labels & Download)
        let content = ""
        let messageType = "text"
        let mediaUrl = null
        let mime = 'text/plain'

        if (messageData.conversation) content = messageData.conversation
        else if (messageData.extendedTextMessage?.text) content = messageData.extendedTextMessage.text
        else {
            const media = messageData.imageMessage || messageData.audioMessage || messageData.videoMessage || messageData.documentMessage || messageData.stickerMessage;
            if (media) {
                const mimeRaw = (media.mimetype || '').split(';')[0].trim();
                messageType = messageData.imageMessage ? 'image' : 
                              messageData.audioMessage ? 'audio' : 
                              messageData.videoMessage ? 'video' : 
                              (messageData.documentMessage && mimeRaw.startsWith('image/')) ? 'image' :
                              messageData.documentMessage ? 'document' : 'image';
                mime = mimeRaw;
                const cleanSourceUrl = (media.url || media.directPath || "").split(';')[0].trim();

                // Portuguese Labels for UI Consistency
                const labelMap: Record<string, string> = { 'image': 'Imagem', 'audio': 'Áudio', 'video': 'Vídeo', 'document': 'Documento' };
                content = media.caption || labelMap[messageType] || 'Arquivo';

                // Try signing existing Supabase links
                if (cleanSourceUrl && cleanSourceUrl.includes('/chat-media/')) {
                    const pathParts = cleanSourceUrl.split('/chat-media/');
                    if (pathParts.length > 1) {
                        const { data: signed } = await supabase.storage.from('chat-media').createSignedUrl(pathParts[1].split('?')[0], 315360000);
                        if (signed?.signedUrl) mediaUrl = signed.signedUrl;
                    }
                }

                // Fallback: Robust download and upload
                if (!mediaUrl && cleanSourceUrl && !fromMe) {
                    try {
                        const evoKey = Deno.env.get('EVOLUTION_API_KEY');
                        const evoUrl = Deno.env.get('EVOLUTION_API_URL');
                        
                        let finalDownloadUrl = cleanSourceUrl;
                        if (cleanSourceUrl.startsWith('/') && evoUrl) {
                            const baseUrl = evoUrl.endsWith('/') ? evoUrl.slice(0, -1) : evoUrl;
                            finalDownloadUrl = `${baseUrl}${cleanSourceUrl}`;
                        }

                        console.log(`Downloading inbound media from: ${finalDownloadUrl}`);
                        const res = await fetch(finalDownloadUrl, { headers: { 'apikey': evoKey! } });
                        
                        if (res.ok) {
                            const blob = await res.blob();
                            if (blob.size > 10) { // Some small files might be valid placeholders
                                const extMap: Record<string, string> = { 
                                    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 
                                    'application/pdf': 'pdf', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 
                                    'video/mp4': 'mp4' 
                                };
                                const ext = extMap[mime] || mime.split('/')[1] || 'bin';
                                const d = new Date();
                                const fileDir = `${instanceData.id}/${d.getFullYear()}${d.getMonth()+1}`;
                                const fileName = `${fileDir}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
                                
                                const { error: upErr } = await supabase.storage.from('chat-media').upload(fileName, blob, { contentType: mime, upsert: true });
                                
                                if (!upErr) {
                                    const { data: signedData } = await supabase.storage.from('chat-media').createSignedUrl(fileName, 315360000);
                                    if (signedData?.signedUrl) {
                                         mediaUrl = signedData.signedUrl;
                                         console.log(`Successfully persisted and signed inbound media: ${fileName}`);
                                    } else {
                                        // Fallback to public URL if signing fails
                                        const { data: pData } = supabase.storage.from('chat-media').getPublicUrl(fileName);
                                        mediaUrl = pData?.publicUrl;
                                    }
                                } else {
                                    console.error("Storage upload error:", upErr);
                                    await supabase.from('webhook_logs').insert({ 
                                        payload: { error: "Storage Upload Failed", details: upErr, fileName } 
                                    });
                                }

                            }
                        } else {
                            const errText = await res.text().catch(() => "N/A");
                            console.error(`Download failed: ${res.status} ${errText}`);
                            await supabase.from('webhook_logs').insert({ 
                                payload: { error: "Media Download Failed", status: res.status, url: finalDownloadUrl, details: errText } 
                            });
                        }
                    } catch (e: any) { 
                        console.error("Media processing exception:", e);
                        await supabase.from('webhook_logs').insert({ 
                            payload: { error: "Media processing exception", details: e.message } 
                        });
                    }
                }
            }
        }

        // 4. Update Conversation
        const { data: conv } = await supabase.from('conversations').upsert({
            company_id: instanceData.company_id, contact_id: contactId, instance_id: instanceData.id, channel: 'whatsapp', last_message: content, last_message_at: new Date().toISOString()
        }, { onConflict: 'contact_id,instance_id' }).select().single();

        // 5. Save Message
        if (conv) {
            const { data: existingMsg } = await supabase.from('messages').select('id, media_url').eq('wamid', messageId).maybeSingle();
            if (!existingMsg) {
                await supabase.from('messages').insert({
                    wamid: messageId, conversation_id: conv.id, instance_id: instanceData.id, contact_id: contactId, remote_jid: remoteJid, content, message_type: messageType, media_url: mediaUrl, mimetype: mime, direction: fromMe ? 'outbound' : 'inbound', status: status.toLowerCase(), sender_type: fromMe ? 'user' : 'contact', created_at: new Date().toISOString()
                });
            } else {
                const upPayload: any = { status: status.toLowerCase() };
                if (mediaUrl) upPayload.media_url = mediaUrl;
                await supabase.from('messages').update(upPayload).eq('id', existingMsg.id);
            }
        }

        return new Response('ok', { status: 200 });

    } catch (err) {
        console.error("Critical error:", err);
        return new Response('error', { status: 500 });
    }
});

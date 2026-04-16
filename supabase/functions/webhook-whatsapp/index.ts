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
        let updateName = false;
        if (!fromMe && pushName && pushName !== senderNumber) {
            updateName = true;
        }

        // 2a. Find existing contact by remote_jid OR phone
        const { data: existingContacts } = await supabase.from('contacts')
            .select('id, name, remote_jid, phone')
            .or(`remote_jid.eq.${remoteJid},phone.eq.${senderNumber}`)
            .eq('company_id', instanceData.company_id)
            .order('created_at', { ascending: true })
            .limit(1);

        let contactId;

        if (existingContacts && existingContacts.length > 0) {
            const existing = existingContacts[0];
            contactId = existing.id;
            
            // If the contact exists but lacks remote_jid, or we need to update the name (only if current name is generic)
            const updates: any = { updated_at: new Date().toISOString() };
            if (!existing.remote_jid) updates.remote_jid = remoteJid;
            
            // Only update name if it's currently generic (like a phone number) or empty
            if (updateName && (!existing.name || existing.name === existing.phone)) {
                updates.name = pushName;
            }

            if (Object.keys(updates).length > 1) { // More than just updated_at
                await supabase.from('contacts').update(updates).eq('id', contactId);
            }
        } else {
            // 2b. Create new contact
            const contactPayload: any = {
                remote_jid: remoteJid, 
                phone: senderNumber, 
                company_id: instanceData.company_id, 
                name: updateName ? pushName : senderNumber,
                updated_at: new Date().toISOString()
            };
            const { data: newContact } = await supabase.from('contacts').insert(contactPayload).select('id').single();
            if (newContact) contactId = newContact.id;
        }
        
        if (!contactId) return new Response('Contact error', { status: 500 });

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

                let rawBase64 = data.base64 || messageData.base64 || (media && media.base64);

                // Fallback: Robust download and upload
                if (!mediaUrl && (cleanSourceUrl || rawBase64)) {
                    try {
                        const evoKey = Deno.env.get('EVOLUTION_API_KEY');
                        const evoUrl = Deno.env.get('EVOLUTION_API_URL');
                        
                        let arrayBuffer: ArrayBuffer | null = null;
                        let downloadError = "";

                        // Try base64 natively first if provided seamlessly by Evolution Webhook!
                        if (rawBase64) {
                            try {
                                const b64Data = rawBase64.includes(',') ? rawBase64.split(',')[1] : rawBase64;
                                const byteCharacters = atob(b64Data);
                                const byteArray = new Uint8Array(byteCharacters.length);
                                for (let i = 0; i < byteCharacters.length; i++) {
                                    byteArray[i] = byteCharacters.charCodeAt(i);
                                }
                                arrayBuffer = byteArray.buffer;
                                console.log(`Successfully decoded Base64 directly from Webhook payload (length: ${arrayBuffer.byteLength}).`);
                            } catch (e: any) {
                                console.error("Error decoding base64:", e.message);
                            }
                        }

                        // If no base64, use Evolution API's dedicated decryption endpoint!
                        if (!arrayBuffer) {
                            console.log(`Asking Evolution API to decrypt media message via /chat/getBase64FromMediaMessage...`);
                            const baseUrl = evoUrl!.endsWith('/') ? evoUrl!.slice(0, -1) : evoUrl!;
                            
                            const res = await fetch(`${baseUrl}/chat/getBase64FromMediaMessage/${instance}`, { 
                                method: 'POST',
                                headers: { 
                                    'apikey': evoKey!,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ message: data })
                            });

                            if (res.ok) {
                                const apiData = await res.json();
                                let apiBase64 = apiData.base64 || apiData.data || null;
                                
                                if (apiBase64) {
                                    apiBase64 = apiBase64.includes(',') ? apiBase64.split(',')[1] : apiBase64;
                                    const byteCharacters = atob(apiBase64);
                                    const byteArray = new Uint8Array(byteCharacters.length);
                                    for (let i = 0; i < byteCharacters.length; i++) {
                                        byteArray[i] = byteCharacters.charCodeAt(i);
                                    }
                                    arrayBuffer = byteArray.buffer;
                                    console.log(`Successfully decoded Base64 from Evolution API Decrypter (length: ${arrayBuffer.byteLength})!`);
                                } else {
                                    downloadError = "Evolution API returned success but empty base64 data.";
                                }
                            } else {
                                downloadError = await res.text().catch(() => "N/A");
                                console.error(`Evolution Decryption API failed: ${res.status} ${downloadError}`);
                            }
                        }

                        // Third Fallback: Assume it's a direct S3 or public URL!
                        if (!arrayBuffer && cleanSourceUrl && cleanSourceUrl.startsWith('http')) {
                             console.log(`Attempting direct download from assumed S3/Public URL: ${cleanSourceUrl}`);
                             let fetchHeaders: any = {};
                             if (cleanSourceUrl.includes(evoUrl!)) {
                                 fetchHeaders = { 'apikey': evoKey! };
                             }
                             const res = await fetch(cleanSourceUrl, { headers: fetchHeaders });
                             if (res.ok) {
                                 const blob = await res.blob();
                                 arrayBuffer = await blob.arrayBuffer();
                                 console.log(`Successfully downloaded media directly from URL (length: ${arrayBuffer.byteLength})`);
                             } else {
                                 const rTxt = await res.text().catch(() => "N/A");
                                 console.error(`S3/Public fetch failed: ${res.status} ${rTxt}`);
                             }
                        }
                        
                        if (arrayBuffer && arrayBuffer.byteLength > 10) { 
                            const extMap: Record<string, string> = { 
                                'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 
                                'application/pdf': 'pdf', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 
                                'video/mp4': 'mp4' 
                            };
                            const ext = extMap[mime] || mime.split('/')[1] || 'bin';
                            const d = new Date();
                            const fileDir = `${instanceData.id}/${d.getFullYear()}${d.getMonth()+1}`;
                            const fileName = `${fileDir}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
                            
                            const { error: upErr } = await supabase.storage.from('chat-media').upload(fileName, arrayBuffer, { contentType: mime, upsert: true });
                            
                            if (!upErr) {
                                const { data: signedData } = await supabase.storage.from('chat-media').createSignedUrl(fileName, 315360000);
                                if (signedData?.signedUrl) {
                                     mediaUrl = signedData.signedUrl;
                                     console.log(`Successfully persisted and signed inbound media: ${fileName}`);
                                } else {
                                    const { data: pData } = supabase.storage.from('chat-media').getPublicUrl(fileName);
                                    mediaUrl = pData?.publicUrl;
                                }
                            } else {
                                console.error("Storage upload error:", upErr);
                                await supabase.from('webhook_logs').insert({ 
                                    payload: { error: "Storage Upload Failed", details: upErr, fileName } 
                                });
                            }
                        } else if (!arrayBuffer) {
                            await supabase.from('webhook_logs').insert({ 
                                payload: { error: "Media Download Failed", details: downloadError } 
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

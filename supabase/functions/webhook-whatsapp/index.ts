import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Hello from webhook-whatsapp!")

Deno.serve(async (req) => {
    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const supabase = createClient(supabaseUrl!, supabaseKey!)

        // Clone request to read text for detailed logging if JSON fails
        const clonedReq = req.clone();
        const rawBody = await clonedReq.text();

        console.log("Raw Webhook Body:", rawBody);

        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            await supabase.from('webhook_logs').insert({
                payload: { error: 'JSON Parse Error', raw: rawBody }
            });
            return new Response('Invalid JSON', { status: 400 });
        }

        if (!body || !body.data) {
            await supabase.from('webhook_logs').insert({ payload: body || { error: 'No body', raw: rawBody } })
            return new Response('No data', { status: 200 })
        }

        // Log the full payload for debugging
        await supabase.from('webhook_logs').insert({ payload: body })

        const { event, instance, data, sender } = body

        // Handle Status Updates (Blue Ticks)
        if (event === 'MESSAGES_UPDATE') {
            const { key, status } = data
            if (key?.remoteJid && status) {
                await supabase
                    .from('messages')
                    .update({ status: status.toLowerCase() }) // delivered, read, etc.
                    .eq('remote_jid', key.remoteJid)
                    .eq('id', key.id) // Evolution usually sends the message ID in 'id' or 'key.id'

                // If read, we might want to update conversation unread count? 
                // Usually handled by reading the conversation in UI.
            }
            return new Response('Status updated', { status: 200 })
        }

        const validEvents = ['MESSAGES_UPSERT', 'messages.upsert', 'SEND_MESSAGE', 'send.message'];
        if (!validEvents.includes(event)) {
            // We allow send.message (API outbound) and messages.upsert (Sync)
            return new Response('Event ignored', { status: 200 })
        }

        const messageData = data.message || data
        const remoteJid = data.key.remoteJid
        const fromMe = data.key.fromMe
        const messageId = data.key.id
        const participant = data.key.participant || data.participant; // For groups or LIDs

        // FILTER: Ignore Group Messages (Strict)
        if (remoteJid.includes('@g.us') || remoteJid.includes('@broadcast')) {
            console.log(`Ignored group/broadcast message from ${remoteJid}`);
            return new Response('Group/Broadcast message ignored', { status: 200 });
        }

        // FILTER: Ignore Status Updates (Stories)
        if (remoteJid === 'status@broadcast') {
            return new Response('Status message ignored', { status: 200 });
        }

        // 1. Get Instance
        const { data: instanceData, error: instanceError } = await supabase
            .from('instances')
            .select('id, company_id')
            .eq('name', instance)
            .single()

        if (instanceError || !instanceData) {
            console.error("Instance not found:", instance)
            return new Response('Instance not found', { status: 404 })
        }

        // 2. Upsert Contact
        let senderNumber = remoteJid.split('@')[0];

        // Handle LID JIDs (Device IDs) - We ONLY want to process if we can resolve to a real phone
        if (remoteJid.includes('@lid')) {
            if (participant && participant.includes('@s.whatsapp.net')) {
                senderNumber = participant.split('@')[0];
            } else {
                // If we can't find the real number, we CANNOT create a valid contact.
                // LIDs are internal integers, not phone numbers.
                console.log(`Ignored LID message without participant mapping: ${remoteJid}`);
                return new Response('LID message ignored (no phone map)', { status: 200 });
            }
        }

        let pushName = data.pushName || sender?.name || senderNumber
        const profilePicUrl = sender?.image || null;

        // Clean up pushName if it equals senderNumber (optional)
        if (pushName === senderNumber && !senderNumber.includes('@')) {
            // Keep it
        }

        let contactId = null;
        // We use maybeSingle to check if it exists first to avoid overwriting good names with bad ones (optional optimization)

        const { data: contact, error: contactError } = await supabase
            .from('contacts')
            .upsert({
                remote_jid: remoteJid,
                name: pushName,
                phone: senderNumber,
                profile_pic_url: profilePicUrl,
                company_id: instanceData.company_id,
                updated_at: new Date().toISOString()
            }, { onConflict: 'remote_jid' })
            .select()
            .single()

        if (contactError) {
            console.error("Error upserting contact:", contactError)
            return new Response('Error saving contact: ' + JSON.stringify(contactError), { status: 500 })
        }
        contactId = contact.id

        // 3. Extract Content & Type
        let content = ""
        let messageType = "text"
        let mediaUrl = null

        if (messageData.conversation) {
            content = messageData.conversation
        } else if (messageData.extendedTextMessage?.text) {
            content = messageData.extendedTextMessage.text
        } else {
            // Check for Media Types
            let incomingMedia = null

            if (messageData.imageMessage) {
                messageType = "image"
                content = messageData.imageMessage.caption || "Imagem"
                incomingMedia = messageData.imageMessage
            } else if (messageData.audioMessage) {
                messageType = "audio"
                content = "Áudio"
                incomingMedia = messageData.audioMessage
            } else if (messageData.videoMessage) {
                messageType = "video"
                content = "Vídeo"
                incomingMedia = messageData.videoMessage
            } else if (messageData.documentMessage) {
                messageType = "document"
                content = messageData.documentMessage.fileName || "Documento"
                incomingMedia = messageData.documentMessage
            } else if (messageData.stickerMessage) {
                messageType = "image"
                content = "Sticker"
                incomingMedia = messageData.stickerMessage
            }

            if (incomingMedia) {
                // Determine mime type
                let mime = incomingMedia.mimetype || 'application/octet-stream';

                // Try Base64 (Evolution v2 sometimes puts it in 'base64' or 'jpegThumbnail' if configured)
                // But typically for full media we rely on download.

                // Evolution v2 URL often comes in 'url' or 'directPath' but might need keys.
                // However, Evolution often converts media to base64 if 'webhookBase64' is true in instance config.
                // If it's a URL, we attempt fetch.

                // Fallback: If we can't find a direct download URL or Base64, we might log it.
                // But usually 'url' is present if not base64.

                const mediaSourceUrl = incomingMedia.url || incomingMedia.directPath; // directPath is internal WA
                // NOTE: 'url' in Evolution might be a local container URL or a signed one.
                // Evolution also has a separate route GET /message/base64 could be used if we have the message ID.

                // For now, let's look for known fields in the payload that Evolution V2 sends when media is received.
                // If 'mediaData' event is used, it's different. But we use 'messages.upsert'.

                // If we get a URL:
                if (mediaSourceUrl) {
                    try {
                        console.log(`Attempting to download media from: ${mediaSourceUrl}`);
                        const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')
                        const fetchHeaders = {}
                        if (evolutionKey) fetchHeaders['apikey'] = evolutionKey

                        const fileRes = await fetch(mediaSourceUrl, { headers: fetchHeaders })

                        if (fileRes.ok) {
                            const fileBlob = await fileRes.blob();
                            const ext = mime.split('/')[1] || 'bin';
                            const fileName = `${instanceData.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

                            const { data: uploadData, error: uploadError } = await supabase.storage
                                .from('chat-media')
                                .upload(fileName, fileBlob, {
                                    contentType: mime,
                                    upsert: false
                                });

                            if (!uploadError && uploadData) {
                                const { data: publicUrlData } = supabase.storage.from('chat-media').getPublicUrl(fileName);
                                mediaUrl = publicUrlData.publicUrl;
                                console.log("Media uploaded to:", mediaUrl);
                            } else {
                                console.error("Upload error:", uploadError);
                            }
                        } else {
                            console.error("Failed to fetch media from Evolution URL:", fileRes.status);
                        }
                    } catch (err) {
                        console.error("Error processing media:", err);
                    }
                }
            }
        }

        // 4. Upsert Conversation
        const { data: existingConv } = await supabase
            .from('conversations')
            .select('id, unread_count')
            .eq('contact_id', contactId)
            .eq('instance_id', instanceData.id)
            .single()

        let conversationId = existingConv?.id

        if (conversationId) {
            await supabase
                .from('conversations')
                .update({
                    last_message: content,
                    last_message_at: new Date().toISOString(),
                    unread_count: fromMe ? 0 : (existingConv.unread_count || 0) + 1
                })
                .eq('id', conversationId)
        } else {
            const { data: newConv } = await supabase
                .from('conversations')
                .insert({
                    company_id: instanceData.company_id,
                    contact_id: contactId,
                    instance_id: instanceData.id,
                    channel: 'whatsapp',
                    last_message: content,
                    last_message_at: new Date().toISOString(),
                    unread_count: fromMe ? 0 : 1
                })
                .select()
                .single()
            conversationId = newConv?.id
        }

        // 5. Insert Message
        const { error: msgError } = await supabase
            .from('messages')
            .insert({
                // id: messageId, // Use default UUID or store Evolution ID in a separate column if needed
                conversation_id: conversationId,
                instance_id: instanceData.id,
                contact_id: contactId,
                remote_jid: remoteJid,
                content: content,
                message_type: messageType,
                media_url: mediaUrl,
                direction: fromMe ? 'outbound' : 'inbound',
                status: 'delivered',
                sender_type: fromMe ? 'user' : 'contact'
            })

        if (msgError) {
            console.error("Error inserting message:", msgError)
            return new Response('Error saving message', { status: 500 })
        }

        return new Response('Message saved', { status: 200 })

    } catch (error) {
        console.error("Webhook error:", error)
        return new Response(`Error: ${error.message}`, { status: 500 })
    }
})

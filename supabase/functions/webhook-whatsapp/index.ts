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
            // Only log if it's not an empty body which sometimes happens with keepalives
            if (rawBody.trim().length > 0) {
                await supabase.from('webhook_logs').insert({
                    payload: { error: 'JSON Parse Error', raw: rawBody, event: 'PARSE_ERROR' }
                });
            }
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
                const statusToUpdate = status.toLowerCase(); // delivered, read, etc.
                if (statusToUpdate === 'played') {
                    // evolution sends 'played' for audio
                }

                await supabase
                    .from('messages')
                    .update({ status: statusToUpdate })
                    .eq('remote_jid', key.remoteJid)
                    .eq('wamid', key.id) // Use WAMID, not ID (ID is uuid)

                // If read, we might want to update conversation unread count? 
                // Usually handled by reading the conversation in UI.
            }
            return new Response('Status updated', { status: 200 })
        }

        const validEvents = ['MESSAGES_UPSERT', 'SEND_MESSAGE'];
        const incomingEvent = event ? event.toUpperCase() : '';

        if (!validEvents.includes(incomingEvent) && !validEvents.includes(incomingEvent.replace('.', '_'))) {
            // We allow send.message (API outbound) and messages.upsert (Sync)
            // But log ignored events just in case
            console.log(`Event ignored: ${event}`);
            return new Response('Event ignored', { status: 200 })
        }

        // Check for required data
        if (!data || !data.key) {
            console.log("Missing key in data", data);
            return new Response('Missing key', { status: 200 });
        }

        const messageData = data.message || data
        const remoteJid = data.key.remoteJid
        const fromMe = data.key.fromMe || false
        const messageId = data.key.id
        const status = data.status || 'DELIVERED';
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
                // Update remoteJid to the real phone number JID for storage transparency
                // But keep original for replying? No, usually we reply to the phone JID.
                // Let's normalize everything to s.whatsapp.net for contacts.
                remoteJid = `${senderNumber}@s.whatsapp.net`;
            } else {
                console.log(`Ignored LID message without participant mapping: ${remoteJid}`);
                return new Response('LID message ignored (no phone map)', { status: 200 });
            }
        }

        let pushName = data.pushName || sender?.name || senderNumber
        const profilePicUrl = sender?.image || null;

        // Fetch existing contact to decide if we should update the name
        const { data: existingContact } = await supabase
            .from('contacts')
            .select('id, name, profile_pic_url, remote_jid')
            .or(`remote_jid.eq.${remoteJid},phone.eq.${senderNumber}`)
            .maybeSingle();

        let contactId = existingContact?.id;

        // Logic: specific logic to NOT overwrite a good name with a phone number or empty string
        let shouldUpdateName = false;
        let nameToSave = existingContact?.name || pushName;

        if (!existingContact) {
            shouldUpdateName = true; // New contact, save whatever we have
        } else {
            // If we have a name already, only update if the new one is better (not the phone number) and not from me
            if (!fromMe && pushName && pushName !== senderNumber && pushName !== existingContact.name) {
                shouldUpdateName = true;
                nameToSave = pushName;
            }
            // Always update profile pic if available and different
            if (profilePicUrl && profilePicUrl !== existingContact.profile_pic_url) {
                shouldUpdateName = true;
            }
        }

        const contactPayload: any = {
            remote_jid: remoteJid,
            phone: senderNumber, // Always save the phone number
            company_id: instanceData.company_id,
            updated_at: new Date().toISOString()
        };

        if (shouldUpdateName) {
            contactPayload.name = nameToSave;
            if (profilePicUrl) contactPayload.profile_pic_url = profilePicUrl;
        }

        const { data: contact, error: contactError } = await supabase
            .from('contacts')
            .upsert(contactPayload, { onConflict: 'remote_jid' })
            .select()
            .single()

        if (contactError) {
            console.error("Error upserting contact:", contactError)
            // Fallback: try to just get the contact again if upsert failed (race condition)
            const { data: retryContact } = await supabase.from('contacts').select('id').eq('remote_jid', remoteJid).single();
            if (retryContact) {
                contactId = retryContact.id;
            } else {
                return new Response('Error saving contact: ' + JSON.stringify(contactError), { status: 500 })
            }
        } else {
            contactId = contact.id
        }

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
                    // Check if it's already a Supabase URL (Outbound message we just sent)
                    if (mediaSourceUrl.includes('supabase.co') && mediaSourceUrl.includes('/storage/v1/object/public/')) {
                        console.log("Detected existing Supabase URL, skipping download:", mediaSourceUrl);
                        mediaUrl = mediaSourceUrl;
                    } else {
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
        } // Close else for media type checking

        // 4. Upsert Conversation
        const { data: existingConv } = await supabase
            .from('conversations')
            .select('id, unread_count')
            .eq('contact_id', contactId)
            .eq('instance_id', instanceData.id)
            .eq('contact_id', contactId)
            .eq('instance_id', instanceData.id)
            .maybeSingle()

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

        if (!conversationId) {
            // Fallback if creation didn't return data for some reason
            const { data: fetchConv } = await supabase
                .from('conversations')
                .select('id')
                .eq('contact_id', contactId)
                .eq('instance_id', instanceData.id)
                .maybeSingle();
            conversationId = fetchConv?.id;
        }

        // 5. Insert Message
        // 5. Upsert Message (Handle WAMID)
        // Check if message already exists by WAMID (to preserve media_url if we inserted it via manager)
        const { data: existingMsg } = await supabase
            .from('messages')
            .select('id, media_url')
            .eq('wamid', messageId)
            .single();

        if (existingMsg) {
            console.log(`Message ${messageId} already exists. Updating status...`);
            const updatePayload: any = {
                status: 'delivered', // Or whatever status comes in, but usually this is UPSERT so 'delivered' is fine
                content: content, // Update content just in case
            }
            // Only update media_url if we actually found one in the webhook (e.g. inbound media)
            // For outbound, if we already have it from manager, we don't want to overwrite with null
            if (mediaUrl) {
                updatePayload.media_url = mediaUrl;
            }

            await supabase
                .from('messages')
                .update(updatePayload)
                .eq('id', existingMsg.id);
        } else {
            // Only insert if it doesn't exist
            const { error: msgError } = await supabase
                .from('messages')
                .insert({
                    // id: messageId, // Use default UUID or store Evolution ID in a separate column if needed
                    wamid: messageId,
                    conversation_id: conversationId,
                    instance_id: instanceData.id,
                    contact_id: contactId,
                    remote_jid: remoteJid,
                    content: content,
                    message_type: messageType,
                    media_url: mediaUrl,
                    direction: fromMe ? 'outbound' : 'inbound',
                    status: status.toLowerCase(), // Use the status from the event if available, else 'delivered'
                    sender_type: fromMe ? 'user' : 'contact'
                })

            if (msgError) {
                // If it's a unique constraint error on wamid, it means we raced. Let's try to update instead.
                if (msgError.code === '23505') { // Unique violation
                    console.log(`Race condition detected for ${messageId}, updating instead.`);
                    const updatePayloadRace: any = {
                        status: 'delivered',
                        content: content
                    }
                    if (mediaUrl) updatePayloadRace.media_url = mediaUrl;

                    await supabase.from('messages').update(updatePayloadRace).eq('wamid', messageId);
                } else {
                    console.error("Error inserting message:", msgError)
                    // Log fatal error
                    await supabase.from('webhook_logs').insert({ payload: { error: 'Message Insert Failed', details: msgError, wamid: messageId } })
                    return new Response('Error saving message', { status: 500 })
                }
            }
        }



        return new Response('Message saved', { status: 200 })

    } catch (error) {
        console.error("Webhook error:", error)
        return new Response(`Error: ${error.message}`, { status: 500 })
    }
})

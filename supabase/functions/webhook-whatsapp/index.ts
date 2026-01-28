import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Hello from webhook-whatsapp!")

Deno.serve(async (req) => {
    try {
        const body = await req.json()
        console.log("Webhook received:", JSON.stringify(body))

        if (!body || !body.data) {
            return new Response('No data', { status: 200 })
        }

        const { event, instance, data, sender } = body

        if (event !== 'MESSAGES_UPSERT') {
            return new Response('Event ignored', { status: 200 })
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const supabase = createClient(supabaseUrl!, supabaseKey!)

        const messageData = data.message || data
        const remoteJid = data.key.remoteJid
        const fromMe = data.key.fromMe

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
        const pushName = data.pushName || sender?.name || remoteJid.split('@')[0]
        const senderNumber = remoteJid.split('@')[0]
        const profilePicUrl = sender?.image || null;

        let contactId = null;
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
            return new Response('Error saving contact', { status: 500 })
        }
        contactId = contact.id

        // 3. Extract Content
        let content = ""
        let messageType = "text"

        if (messageData.conversation) {
            content = messageData.conversation
        } else if (messageData.extendedTextMessage?.text) {
            content = messageData.extendedTextMessage.text
        } else if (messageData.imageMessage) {
            messageType = "image"
            content = messageData.imageMessage.caption || "Imagem"
        } else if (messageData.audioMessage) {
            messageType = "audio"
            content = "Áudio"
        } else if (messageData.videoMessage) {
            messageType = "video"
            content = "Vídeo"
        }

        // 4. Upsert Conversation
        const { data: existingConv } = await supabase
            .from('conversations')
            .select('id')
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
                    unread_count: fromMe ? 0 : undefined
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
                conversation_id: conversationId,
                instance_id: instanceData.id,
                contact_id: contactId,
                remote_jid: remoteJid,
                content: content,
                message_type: messageType,
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

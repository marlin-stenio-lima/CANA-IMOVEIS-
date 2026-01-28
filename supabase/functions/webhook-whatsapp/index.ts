import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')!
        const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')!

        const supabase = createClient(supabaseUrl, supabaseKey)

        const payload = await req.json()
        console.log('Webhook payload:', JSON.stringify(payload).substring(0, 200))

        // 1. Identify Instance & Broker
        const instanceName = payload.instance
        if (!instanceName) return new Response(JSON.stringify({ message: 'No instance' }), { headers: corsHeaders })

        // Fetch Instance definition from DB to find the Broker
        const { data: instanceData } = await supabase
            .from('instances')
            .select('id, assigned_to, company_id')
            .eq('name', instanceName)
            .single()

        if (!instanceData) {
            console.error(`Instance ${instanceName} not found in DB`)
            return new Response(JSON.stringify({ error: 'Unknown Instance' }), { headers: corsHeaders })
        }

        const { id: instanceId, assigned_to: brokerId, company_id: companyId } = instanceData

        // Check Evolution Event
        const eventType = payload.event || payload.type
        if (eventType !== 'messages.upsert') {
            return new Response(JSON.stringify({ message: 'Ignored event' }), { headers: corsHeaders })
        }

        const messageData = payload.data
        if (!messageData || messageData.key.fromMe) {
            return new Response(JSON.stringify({ message: 'Ignored outbound' }), { headers: corsHeaders })
        }

        const senderPhone = messageData.key.remoteJid.replace('@s.whatsapp.net', '')
        const content = messageData.message?.conversation || messageData.message?.extendedTextMessage?.text
        const pushName = messageData.pushName || 'Unknown'

        if (!content) {
            return new Response(JSON.stringify({ message: 'No content' }), { headers: corsHeaders })
        }

        // 2. Upsert Contact (Linked to THIS Broker)
        // Try find contact for this company
        const { data: existingContact } = await supabase
            .from('contacts')
            .select('id, assigned_to')
            .eq('company_id', companyId)
            .eq('phone', senderPhone)
            .maybeSingle()

        let contactId = existingContact?.id

        if (!contactId) {
            // New Lead! Assign to the owner of this instance (BrokerId)
            const { data: newContact } = await supabase
                .from('contacts')
                .insert({
                    company_id: companyId,
                    name: pushName,
                    phone: senderPhone,
                    status: 'new',
                    assigned_to: brokerId // Capture the lead for this broker
                })
                .select('id')
                .single()
            contactId = newContact.id
        }

        // 3. Find or Create Conversation (Contextual to Instance)
        const { data: conversation } = await supabase
            .from('conversations')
            .select('id')
            .eq('contact_id', contactId)
            .eq('instance_id', instanceId) // Critical: Chat is tied to this line
            .eq('status', 'open')
            .maybeSingle()

        let conversationId = conversation?.id
        if (!conversationId) {
            const { data: newConv } = await supabase
                .from('conversations')
                .insert({
                    company_id: companyId,
                    contact_id: contactId,
                    instance_id: instanceId,
                    channel: 'whatsapp',
                    status: 'open'
                })
                .select('id')
                .single()
            conversationId = newConv.id
        }

        // 4. Log Message
        await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_type: 'contact',
            content: content,
            metadata: messageData
        })

        // 5. Call AI Agent (Pass Instance Context)
        // Fetch History
        const { data: history } = await supabase
            .from('messages')
            .select('sender_type, content')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .limit(10)

        const formattedHistory = history?.map(h => ({
            role: h.sender_type === 'contact' ? 'user' : 'assistant',
            content: h.content
        })) || []

        await fetch(`${supabaseUrl}/functions/v1/ai-agent`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: content,
                contact_id: contactId,
                company_id: companyId,
                conversation_id: conversationId,
                instance_name: instanceName, // Pass the sender identity
                broker_id: brokerId,
                conversation_history: formattedHistory
            })
        })

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })

    } catch (error) {
        console.error('Webhook Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

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
        const { message, conversation_id } = await req.json()

        // 1. Get Conversation details (Phone AND Instance Name)
        const { data: conversation } = await supabase
            .from('conversations')
            .select(`
            contact:contacts(phone),
            instance:instances(name)
        `)
            .eq('id', conversation_id)
            .single()

        if (!conversation || !conversation.contact) {
            throw new Error('Contact not found')
        }

        const phone = conversation.contact.phone
        // Use linked instance OR fallback to global env (legacy)
        const instanceName = conversation.instance?.name || Deno.env.get('EVOLUTION_INSTANCE_NAME')

        if (!instanceName) {
            throw new Error('No WhatsApp instance connected for this conversation')
        }

        // 2. Send via Evolution
        const sendUrl = `${evolutionUrl}/message/sendText/${instanceName}`
        const evoRes = await fetch(sendUrl, {
            method: 'POST',
            headers: {
                'apikey': evolutionKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number: phone,
                options: { delay: 0 },
                textMessage: { text: message }
            })
        })

        if (!evoRes.ok) {
            // Log basic error
            console.error('Evolution Error:', await evoRes.text())
            throw new Error('Failed to send WhatsApp message via ' + instanceName)
        }

        // 3. Insert to DB
        const { data: newMessage, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversation_id,
                sender_type: 'user',
                content: message,
                metadata: { via: 'crm_ui', instance: instanceName }
            })
            .select()
            .single()

        if (error) throw error

        return new Response(JSON.stringify(newMessage), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (error) {
        console.error('Send Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

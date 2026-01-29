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
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Ensure Instance
    let { data: instance } = await supabase.from('instances').select('id').eq('name', 'primary').single()
    
    if (!instance) {
        const { data: newInstance, error: instError } = await supabase.from('instances').insert({
            name: 'primary',
            status: 'open'
        }).select().single()
        
        if (instError) throw instError
        instance = newInstance
    }

    // 2. Ensure Contact
    const contactJid = '5511999999999@s.whatsapp.net'
    let { data: contact } = await supabase.from('contacts').select('id').eq('remote_jid', contactJid).single()

    if (!contact) {
        const { data: newContact, error: contError } = await supabase.from('contacts').insert({
            remote_jid: contactJid,
            name: 'Cliente Teste',
            phone: '5511999999999',
            profile_pic_url: 'https://github.com/shadcn.png',
            company_id: instance.company_id
        }).select().single()
        
        if (contError) throw contError
        contact = newContact
    }

    // 3. Ensure Conversation
    let { data: conversation } = await supabase.from('conversations').select('id').eq('contact_id', contact.id).single()

    if (!conversation) {
        const { data: newConv, error: convError } = await supabase.from('conversations').insert({
            contact_id: contact.id,
            instance_id: instance.id,
            last_message: 'Olá! Mensagem de teste gerada automaticamente.',
            last_message_at: new Date().toISOString(),
            unread_count: 1,
            company_id: instance.company_id
        }).select().single()
        
        if (convError) throw convError
        conversation = newConv
    }

    // 4. Ensure Message
    const { error: msgError } = await supabase.from('messages').insert({
        conversation_id: conversation.id,
        contact_id: contact.id,
        instance_id: instance.id,
        content: 'Olá! Mensagem de teste gerada automaticamente.',
        sender_type: 'contact',
        direction: 'inbound',
        status: 'delivered',
        remote_jid: contactJid
    })
    
    if (msgError) throw msgError

    return new Response(JSON.stringify({ success: true, message: "Data seeded successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

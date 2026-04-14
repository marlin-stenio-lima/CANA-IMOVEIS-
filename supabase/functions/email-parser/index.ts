import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

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
    const openAiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAiKey) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }), { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const openai = new OpenAI({ apiKey: openAiKey })

    const { company_id, email_body, subject } = await req.json()

    if (!company_id || !email_body) {
      return new Response(JSON.stringify({ error: 'Missing company_id or email_body' }), { status: 400 })
    }

    console.log(`Processing email lead for company ${company_id}`)

    // 1. Use AI to extract structured JSON from email body
    const prompt = `
      Você é um robô extrator de leads para imobiliárias.
      Dada a mensagem de e-mail abaixo (pode conter HTML), extraia as informações do LEAD em formato JSON.
      
      CAMPOS NECESSÁRIOS:
      - name: Nome completo do interessado.
      - email: Endereço de e-mail do interessado.
      - phone: Telefone com DDD.
      - property_id: ID do imóvel ou código de referência citado (se houver).
      - message: Mensagem ou comentário deixado pelo cliente.
      - portal: Nome do portal de origem (ex: Luxury Estate, Properstar, etc).

      REGRAS:
      - Responda APENAS o JSON puro.
      - Se não encontrar um campo, deixe vázio "".
      - Limpe o HTML se necessário para ler o conteúdo.

      E-MAIL:
      Assunto: ${subject || "Novidade"}
      Corpo:
      ${email_body}
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: "json_object" }
    })

    const extractedData = JSON.parse(completion.choices[0].message.content || '{}')
    console.log('Extracted Data:', extractedData)

    if (!extractedData.name && !extractedData.email && !extractedData.phone) {
      throw new Error('Could not extract meaningful lead data from email.')
    }

    // 2. Insert into leads table
    const { data: leadRecord, error: leadError } = await supabase
      .from('leads')
      .insert({
        company_id,
        portal_source: extractedData.portal || 'email-robo',
        name: extractedData.name,
        email: extractedData.email,
        phone: extractedData.phone,
        message: extractedData.message,
        property_id: extractedData.property_id,
        raw_payload: { original_email: email_body, subject, extracted: extractedData }
      })
      .select()
      .single()

    if (leadError) throw leadError

    // 3. Trigger Roleta (Lead Distribution)
    let assignedBrokerId = null
    const { data: broker_id, error: roletaError } = await supabase.rpc('distribute_lead', {
      company_id_input: company_id
    })

    if (broker_id) {
        assignedBrokerId = broker_id
        await supabase.from('leads').update({ assigned_to: broker_id }).eq('id', leadRecord.id)
        
        // Auto-create Contact
        await supabase.from('contacts').insert({
          company_id,
          name: extractedData.name,
          email: extractedData.email,
          phone: extractedData.phone,
          assigned_to: broker_id,
          status: 'new',
          custom_fields: {
            lead_id: leadRecord.id,
            source: 'email-robo',
            portal: extractedData.portal
          }
        })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      lead_id: leadRecord.id, 
      assigned_to: assignedBrokerId,
      data: extractedData 
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error('Error in email-parser:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})

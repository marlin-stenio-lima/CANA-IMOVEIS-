import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InquiryPayload {
  property_id: string
  name: string
  email: string
  phone: string
  message?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload: InquiryPayload = await req.json()
    
    console.log('Received inquiry:', payload)

    // Validate required fields
    if (!payload.property_id || !payload.name || !payload.email || !payload.phone) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: property_id, name, email, phone' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, title, price, company_id')
      .eq('id', payload.property_id)
      .single()

    if (propertyError || !property) {
      console.error('Property not found:', propertyError)
      return new Response(
        JSON.stringify({ error: 'Imóvel não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Property found:', property)

    // Check if contact already exists by email
    let contact_id: string | null = null
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .eq('company_id', property.company_id)
      .eq('email', payload.email)
      .maybeSingle()

    if (existingContact) {
      contact_id = existingContact.id
      console.log('Existing contact found:', contact_id)
    } else {
      // Create new contact
      const { data: newContact, error: contactError } = await supabase
        .from('contacts')
        .insert({
          company_id: property.company_id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          source: 'Portal Imobiliário',
          status: 'lead',
          tags: ['Portal', 'Imóvel'],
          notes: `Lead interessado no imóvel: ${property.title}`
        })
        .select('id')
        .single()

      if (contactError) {
        console.error('Error creating contact:', contactError)
      } else {
        contact_id = newContact.id
        console.log('New contact created:', contact_id)
      }
    }

    // Get the default pipeline and first stage
    let deal_id: string | null = null
    const { data: defaultPipeline } = await supabase
      .from('pipelines')
      .select('id')
      .eq('company_id', property.company_id)
      .eq('is_default', true)
      .maybeSingle()

    if (defaultPipeline) {
      const { data: firstStage } = await supabase
        .from('pipeline_stages')
        .select('id')
        .eq('pipeline_id', defaultPipeline.id)
        .order('position', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (firstStage) {
        // Create deal
        const { data: newDeal, error: dealError } = await supabase
          .from('deals')
          .insert({
            company_id: property.company_id,
            contact_id: contact_id,
            title: `Interesse: ${property.title}`,
            description: payload.message || `Lead interessado no imóvel via portal`,
            value: property.price || 0,
            pipeline_id: defaultPipeline.id,
            stage_id: firstStage.id
          })
          .select('id')
          .single()

        if (dealError) {
          console.error('Error creating deal:', dealError)
        } else {
          deal_id = newDeal.id
          console.log('New deal created:', deal_id)
        }
      }
    }

    // Create the inquiry record
    const { data: inquiry, error: inquiryError } = await supabase
      .from('property_inquiries')
      .insert({
        property_id: payload.property_id,
        company_id: property.company_id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
        contact_id: contact_id,
        deal_id: deal_id,
        status: 'novo'
      })
      .select('id')
      .single()

    if (inquiryError) {
      console.error('Error creating inquiry:', inquiryError)
      return new Response(
        JSON.stringify({ error: 'Erro ao registrar interesse' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Inquiry created successfully:', inquiry.id)

    // Create activity log
    if (contact_id) {
      await supabase
        .from('activities')
        .insert({
          company_id: property.company_id,
          contact_id: contact_id,
          deal_id: deal_id,
          type: 'note',
          description: `Novo lead do portal imobiliário interessado em: ${property.title}. Mensagem: ${payload.message || 'Sem mensagem'}`
        })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Interesse registrado com sucesso!',
        inquiry_id: inquiry.id,
        contact_id: contact_id,
        deal_id: deal_id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

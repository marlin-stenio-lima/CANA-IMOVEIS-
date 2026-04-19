import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface PortalLead {
  portal: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: string;
}

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const company_id = url.searchParams.get('company_id')

  if (!company_id) {
    return new Response(JSON.stringify({ error: 'Missing company_id' }), { status: 400 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const payload = await req.json()
    console.log(`Received lead for company ${company_id}:`, payload)

    // Basic Parsing Logic (To be expanded based on specific portal payloads)
    let leadData: PortalLead = {
      portal: 'unknown',
      name: '',
      email: '',
      phone: '',
      message: '',
      property_id: ''
    }

    // Example ZAP / VivaReal Payload detection
    if (payload.lead_origin === 'ZAP' || payload.portal === 'ZAP') {
      leadData = {
        portal: 'zap',
        name: payload.client_name || payload.name,
        email: payload.client_email || payload.email,
        phone: payload.client_phone || payload.phone,
        message: payload.message,
        property_id: payload.property_id
      }
    } else if (payload.portal === 'vivareal') {
      leadData = {
        portal: 'vivareal',
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
        property_id: payload.property_id
      }
    } else {
      // Generic fallback
      leadData = {
        portal: payload.portal || payload.leadOrigin || url.searchParams.get('source') || 'canal_pro',
        name: payload.name || payload.client?.name || payload.nome || 'Cliente do Portal',
        email: payload.email || payload.client?.email || payload.emailCliente || 'sem-email@portal.com',
        phone: payload.phone || payload.client?.phone || payload.telefone || 'Sem telefone',
        message: payload.message || payload.comments || payload.mensagem || JSON.stringify(payload),
        property_id: payload.property_id || payload.listing_id || payload.clientListingId
      }
    }

    // 1. Insert into leads table
    const { data: leadRecord, error: leadError } = await supabase
      .from('leads')
      .insert({
        company_id,
        portal_source: leadData.portal,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        message: leadData.message,
        property_id: leadData.property_id,
        raw_payload: payload
      })
      .select()
      .single()

    if (leadError) throw leadError

    // 2. Trigger Roleta (Lead Distribution)
    const { data: broker_id, error: roletaError } = await supabase.rpc('distribute_lead', {
      company_id_input: company_id
    })

    if (broker_id) {
      await supabase.from('leads').update({ assigned_to: broker_id }).eq('id', leadRecord.id)
    }
      
    // 3. Auto-create Contact from Lead
    await supabase.from('contacts').insert({
      company_id,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      assigned_to: broker_id || null,
      status: 'new',
      custom_fields: {
        lead_id: leadRecord.id,
        portal: leadData.portal,
        property_id: leadData.property_id
      }
    })

    // 4. Inserir em property_inquiries para aparecer no painel de Leads do CRM
    const portalSrc = leadData.portal || url.searchParams.get('source') || 'webhook';
    let finalPropertyId = null;

    try {
      const listingRef = leadData.property_id || payload.clientListingId || payload.listing_id || payload.codigo || payload.internalReference;
      
      if (listingRef) {
        // Se já for um UUID (ex: inserido por um sistema que usa UUID nativo)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(listingRef));
        
        if (isUUID) {
          finalPropertyId = listingRef;
        } else {
          // Se for código curto, vamos achar o UUID real no banco
          const { data: matchedProp } = await supabase.from('properties')
              .select('id').eq('company_id', company_id).eq('internal_id', String(listingRef)).limit(1).maybeSingle();
          if (matchedProp) {
            finalPropertyId = matchedProp.id;
          }
        }
      }
    } catch(e) {
      console.warn('Error fetching matched property', e);
    }

    try {
      await supabase.from('property_inquiries').insert({
        company_id,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        message: leadData.message,
        status: 'novo',
        source: portalSrc,
        property_id: finalPropertyId
      });
    } catch (e) {
      console.warn('Could not insert in property_inquiries', e);
    }

    return new Response(JSON.stringify({ success: true, lead_id: leadRecord.id }), { status: 200 })

  } catch (error) {
    console.error('Error processing portal lead:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})

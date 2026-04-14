import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PROPERTY_TYPE_MAP: Record<string, string> = {
  'apartamento': 'Residential / Apartment',
  'casa': 'Residential / Home',
  'comercial': 'Commercial / Commercial Building',
  'terreno': 'Land / Residential Lot',
  'rural': 'Land / Farm',
  'cobertura': 'Residential / Penthouse',
  'kitnet': 'Residential / Kitnet',
  'sala_comercial': 'Commercial / Office',
  'galpao': 'Commercial / Warehouse',
  'fazenda': 'Land / Farm'
}

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const company_id = url.searchParams.get('company_id')
  const portal = url.searchParams.get('portal') || 'zap' 

  if (!company_id) {
    return new Response('Missing company_id', { status: 400 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch properties for this company that are published AND enabled for this portal
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('company_id', company_id)
      .eq('is_published', true)
      .contains('portal_config', { [portal]: true })

    if (propsError) throw propsError

    console.log(`Generating ${portal} feed. Found ${properties?.length || 0} properties.`)

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<ListingData>\n`
    xml += `  <Header>\n`
    xml += `    <Provider>CRM Suite Pro</Provider>\n`
    xml += `    <Email>suporte@seucrm.com</Email>\n`
    xml += `    <ContactName>Central de Integração</ContactName>\n`
    xml += `  </Header>\n`

    for (const prop of properties || []) {
      const pType = PROPERTY_TYPE_MAP[prop.property_type] || 'Residential / Apartment'
      const usage = prop.property_type.includes('comercial') || prop.property_type.includes('sala') || prop.property_type.includes('galpao') ? 'Commercial' : 'Residential'
      
      xml += `  <Listing>\n`
      xml += `    <ListingID>${prop.id}</ListingID>\n`
      xml += `    <Title><![CDATA[${prop.title}]]></Title>\n`
      xml += `    <TransactionType>${prop.transaction_type === 'venda' ? 'For Sale' : 'For Rent'}</TransactionType>\n`
      xml += `    <Details>\n`
      xml += `      <PropertyType>${pType}</PropertyType>\n`
      xml += `      <Description><![CDATA[${prop.description || ''}]]></Description>\n`
      xml += `      <ListPrice currency="BRL">${prop.price}</ListPrice>\n`
      
      if (prop.condo_fee > 0) xml += `      <AdminFee currency="BRL">${prop.condo_fee}</AdminFee>\n`
      if (prop.iptu > 0) xml += `      <PropertyTax currency="BRL">${prop.iptu}</PropertyTax>\n`
      
      xml += `      <LivingArea unit="square metres">${prop.area_total || prop.area_built || 0}</LivingArea>\n`
      xml += `      <Bedrooms>${prop.bedrooms || 0}</Bedrooms>\n`
      xml += `      <Bathrooms>${prop.bathrooms || 0}</Bathrooms>\n`
      xml += `      <Garage>${prop.parking_spots || 0}</Garage>\n`
      xml += `      <UsageTypes>\n`
      xml += `        <UsageType>${usage}</UsageType>\n`
      xml += `      </UsageTypes>\n`
      xml += `    </Details>\n`
      xml += `    <Location displayAddress="All">\n`
      xml += `      <State>${prop.state || ''}</State>\n`
      xml += `      <City>${prop.city || ''}</City>\n`
      xml += `      <Neighborhood>${prop.neighborhood || ''}</Neighborhood>\n`
      xml += `      <Address>${prop.address || ''}</Address>\n`
      xml += `      <PostalCode>${prop.zip_code || ''}</PostalCode>\n`
      xml += `    </Location>\n`
      xml += `    <Media>\n`
      
      const images = prop.property_images || []
      images.forEach((img: any, index: number) => {
        xml += `      <Item id="${index + 1}" caption="${img.is_cover ? 'Capa' : 'Foto'}" primary="${img.is_cover}">${img.url}</Item>\n`
      })
      
      xml += `    </Media>\n`
      xml += `  </Listing>\n`
    }

    xml += `</ListingData>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    console.error('Error generating feed:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})

const fs = require('fs');

async function main() {
  const xml = fs.readFileSync('jetimob.xml', 'utf8');
  const properties = [];
  
  // Basic regex parser since XML structure is consistent
  const listingRegex = /<Listing>([\s\S]*?)<\/Listing>/g;
  let match;
  
  while ((match = listingRegex.exec(xml)) !== null) {
    const listingContent = match[1];
    
    const getTag = (content, tag) => {
      const regex = new RegExp(`<${tag}(?:\\s+[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i');
      const m = content.match(regex);
      return m ? m[1].trim() : null;
    };

    const hasTagAttribute = (content, tag, attrName, attrValue) => {
      const regex = new RegExp(`<${tag}[^>]*?${attrName}="${attrValue}"[^>]*>`,'i');
      return regex.test(content);
    };
    
    const id = getTag(listingContent, 'ListingID');
    const title = getTag(listingContent, 'Title');
    const description = getTag(listingContent, 'Description');
    const listPrice = getTag(listingContent, 'ListPrice');
    const bedrooms = getTag(listingContent, 'Bedrooms');
    const bathrooms = getTag(listingContent, 'Bathrooms');
    const garageRegex = /<Garage[^>]*>(\d+)<\/Garage>/i;
    const garMatch = listingContent.match(garageRegex);
    const garage = garMatch ? garMatch[1] : 0;
    
    const area = getTag(listingContent, 'LivingArea');
    const neighborhood = getTag(listingContent, 'Neighborhood');
    const city = getTag(listingContent, 'City');
    const state = getTag(listingContent, 'State');
    const address = getTag(listingContent, 'Address');
    
    // Extract images
    const images = [];
    const mediaRegex = /<Item medium="image"[^>]*primary="(true|false)"[^>]*>([^<]+)<\/Item>/g;
    let mMatch;
    let pos = 0;
    while ((mMatch = mediaRegex.exec(listingContent)) !== null) {
      images.push({
        id: `img-${id}-${pos}`,
        property_id: id,
        url: mMatch[2].split('+')[0],
        position: pos,
        is_cover: mMatch[1] === 'true'
      });
      pos++;
    }

    // Attempt to map propertyType
    const pt = getTag(listingContent, 'PropertyType') || '';
    let mappedType = 'casa';
    if(pt.toLowerCase().includes('condo') || pt.toLowerCase().includes('apartment')) mappedType = 'apartamento';
    if(pt.toLowerCase().includes('land')) mappedType = 'terreno';
    
    properties.push({
      id: "mock-" + id,
      company_id: "mock-company",
      title: title || 'Imóvel sem título',
      description: description || '',
      property_type: mappedType,
      transaction_type: 'venda',
      price: parseFloat(listPrice || '0'),
      bedrooms: parseInt(bedrooms || '0'),
      bathrooms: parseInt(bathrooms || '0'),
      parking_spots: parseInt(garage || '0'),
      area_total: parseInt(area || '0'),
      area_built: parseInt(area || '0'),
      address: address || '',
      neighborhood: neighborhood || '',
      city: city || '',
      state: state || '',
      zip_code: '',
      latitude: null,
      longitude: null,
      features: [],
      status: 'disponivel',
      is_featured: false,
      is_published: true,
      created_by: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      condo_fee: 0,
      iptu: 0,
      year_built: null,
      internal_id: id,
      portal_config: null,
      images: images
    });
  }

  // Save to src/data/mockProperties.json
  if (!fs.existsSync('src/data')) {
    fs.mkdirSync('src/data', { recursive: true });
  }
  fs.writeFileSync('src/data/mockProperties.json', JSON.stringify(properties, null, 2), 'utf8');
  console.log('Saved ' + properties.length + ' properties to mockProperties.json');
}

main().catch(console.error);

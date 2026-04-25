import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://uscfxlmtqzqifizunyoz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ3NzA4NSwiZXhwIjoyMDkwMDUzMDg1fQ.2dzxljw8RjmYhXHDFGH84P4y6_fFWygeNoF83mT19Xo';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const MOCK_DATA_PATH = path.resolve(process.cwd(), 'src/data/mockProperties.json');

async function main() {
  console.log('📂 Lendo mockProperties.json...');
  const mockData = JSON.parse(readFileSync(MOCK_DATA_PATH, 'utf-8'));
  
  // Create a map of internal_id -> images
  const imageMap = {};
  for (const item of mockData) {
    if (item.internal_id && item.images && item.images.length > 0) {
      imageMap[item.internal_id] = item.images;
    }
  }
  
  console.log(`Encontrados ${Object.keys(imageMap).length} imóveis com imagens no mock data.`);

  // Get all properties from Supabase
  const { data: properties, error: pError } = await supabase
    .from('properties')
    .select('id, internal_id');
    
  if (pError) throw pError;
  
  console.log(`Total properties no DB: ${properties.length}`);

  // Get existing property images to avoid duplicates
  const { data: existingImages, error: eError } = await supabase
    .from('property_images')
    .select('property_id');
  
  if (eError) throw eError;

  const existingPropIds = new Set(existingImages.map(img => img.property_id));
  
  const imagesToInsert = [];
  let skipped = 0;
  
  for (const p of properties) {
    if (existingPropIds.has(p.id)) {
      skipped++;
      continue; // Skip properties that already have images
    }

    if (p.internal_id && imageMap[p.internal_id]) {
      const images = imageMap[p.internal_id];
      for (const img of images) {
        imagesToInsert.push({
          property_id: p.id,
          url: img.url,
          position: img.position || 0,
          is_cover: img.is_cover || false
        });
      }
    }
  }
  
  console.log(`Pulados ${skipped} imóveis que já possuíam imagens.`);
  console.log(`Pronto para inserir ${imagesToInsert.length} novas imagens no total.`);
  
  if (imagesToInsert.length === 0) {
    console.log('Nenhuma imagem nova para importar.');
    return;
  }

  const BATCH_SIZE = 500;
  let inserted = 0;
  let errors = 0;
  
  for (let i = 0; i < imagesToInsert.length; i += BATCH_SIZE) {
    const batch = imagesToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('property_images')
      .insert(batch);
      
    if (error) {
      console.error(`\n❌ Erro no batch ${i}-${i+BATCH_SIZE}:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`\r⏳ Inseridos: ${inserted}/${imagesToInsert.length}`);
    }
  }
  
  console.log(`\n\n🎉 Importação de imagens concluída!`);
  console.log(`✅ Inseridas com sucesso: ${inserted}`);
  if (errors > 0) console.log(`❌ Com erro: ${errors}`);
}

main().catch(console.error);

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uscfxlmtqzqifizunyoz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ3NzA4NSwiZXhwIjoyMDkwMDUzMDg1fQ.2dzxljw8RjmYhXHDFGH84P4y6_fFWygeNoF83mT19Xo';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function removeDuplicates() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, internal_id, price')
    .order('created_at', { ascending: true }); // keep the oldest one

  if (error) {
    console.error('Error fetching properties:', error);
    return;
  }

  const titleCounts = {};
  properties.forEach(p => {
    const key = p.title.trim().toLowerCase() + ' - ' + p.price;
    if (!titleCounts[key]) {
      titleCounts[key] = { count: 0, items: [] };
    }
    titleCounts[key].count++;
    titleCounts[key].items.push(p);
  });

  const idsToDelete = [];
  Object.values(titleCounts).forEach(data => {
    if (data.count > 1) {
      // Pula o primeiro, deleta o resto
      for (let i = 1; i < data.items.length; i++) {
        idsToDelete.push(data.items[i].id);
      }
    }
  });

  console.log(`Encontrados ${idsToDelete.length} imóveis duplicados para remover.`);

  if (idsToDelete.length === 0) {
    console.log('Nenhuma duplicata para remover.');
    return;
  }

  let deletedCount = 0;
  for (const id of idsToDelete) {
    const { data, error: delError } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .select();

    if (delError) {
      console.error(`Erro ao deletar ${id}:`, delError);
    } else if (data && data.length > 0) {
      deletedCount++;
      process.stdout.write(`\rDeletados: ${deletedCount}/${idsToDelete.length}`);
    } else {
       // already deleted or not found
    }
  }

  console.log('\n✅ Limpeza concluída!');
}

removeDuplicates();

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');
const envVars = {};
lines.forEach(l => {
  const [k, ...v] = l.split('=');
  if (k && v) {
    envVars[k.trim()] = v.join('=').trim().replace(/"/g, '');
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_PUBLISHABLE_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, internal_id, price');

  if (error) {
    console.error('Error fetching properties:', error);
    return;
  }

  const titleCounts = {};
  properties.forEach(p => {
    // Normalizar título para encontrar duplicatas
    const key = p.title.trim().toLowerCase() + ' - ' + p.price;
    if (!titleCounts[key]) {
      titleCounts[key] = { count: 0, items: [] };
    }
    titleCounts[key].count++;
    titleCounts[key].items.push(p);
  });

  const duplicates = Object.entries(titleCounts)
    .filter(([_, data]) => data.count > 1)
    .sort((a, b) => b[1].count - a[1].count);

  console.log(`Total de imóveis no banco: ${properties.length}`);
  console.log(`Total de grupos duplicados (mesmo título e preço): ${duplicates.length}`);

  let totalDupesToRemove = 0;
  duplicates.forEach(([title, data]) => {
    totalDupesToRemove += (data.count - 1);
  });

  console.log(`Número de registros excedentes (que poderiam ser apagados): ${totalDupesToRemove}\n`);

  if (duplicates.length > 0) {
    console.log('Exemplos de duplicatas:');
    duplicates.slice(0, 5).forEach(([key, data]) => {
      console.log(`- "${key}": aparece ${data.count} vezes`);
    });
  }
}

checkDuplicates();

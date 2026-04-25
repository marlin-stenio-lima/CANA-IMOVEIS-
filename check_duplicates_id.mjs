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
    console.error('Error:', error);
    return;
  }

  const idCounts = {};
  properties.forEach(p => {
    if (!p.internal_id) return;
    if (!idCounts[p.internal_id]) {
      idCounts[p.internal_id] = { count: 0, items: [] };
    }
    idCounts[p.internal_id].count++;
    idCounts[p.internal_id].items.push(p);
  });

  const duplicates = Object.entries(idCounts)
    .filter(([_, data]) => data.count > 1)
    .sort((a, b) => b[1].count - a[1].count);

  console.log(`Duplicatas por internal_id: ${duplicates.length}`);
  if (duplicates.length > 0) {
    console.log('Exemplos:', duplicates.slice(0, 5).map(([id, data]) => `${id}: ${data.count}`));
  }
}

checkDuplicates();

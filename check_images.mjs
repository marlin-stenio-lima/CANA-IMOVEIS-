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

async function check() {
  const { data: properties, error: pError } = await supabase
    .from('properties')
    .select('id, internal_id');
  
  if (pError) throw pError;
  
  console.log(`Total properties: ${properties.length}`);
  
  const numericIds = properties.filter(p => p.internal_id && /^\d+$/.test(p.internal_id));
  const otherIds = properties.filter(p => p.internal_id && !/^\d+$/.test(p.internal_id));
  
  console.log(`Numeric IDs (like 3074): ${numericIds.length}`);
  console.log(`Other IDs (like LC-...): ${otherIds.length}`);
  
  if (otherIds.length > 0) {
    console.log('Sample other IDs:', otherIds.slice(0, 5).map(p => p.internal_id));
  }
  if (numericIds.length > 0) {
    console.log('Sample numeric IDs:', numericIds.slice(0, 5).map(p => p.internal_id));
  }
}

check();

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

async function inspect() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, internal_id, price, created_at, area, bedrooms, bathrooms')
    .ilike('title', '%Apartamento em Brookiln%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(properties);
}

inspect();

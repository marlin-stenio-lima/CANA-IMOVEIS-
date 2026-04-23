import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL="([^"]+)"/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="([^"]+)"/);

const url = urlMatch ? urlMatch[1] : '';
const key = keyMatch ? keyMatch[1] : '';

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('properties').select('id, title, owner_name, owner_phone, owner_email').limit(10);
  console.log(JSON.stringify(data, null, 2));
}

run();

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL="([^"]+)"/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="([^"]+)"/);

const url = urlMatch ? urlMatch[1] : '';
const key = keyMatch ? keyMatch[1] : '';

const supabase = createClient(url, key);

async function run() {
  const changes = {
    title: "Apartamento em Praia do Forte",
    price: 3000000,
    owner_name: "THIAGO LACORTE TESTE",
    owner_phone: "+5522999982084",
    owner_email: "teste@teste.com"
  };

  const propertyId = "92d7375c-d7c3-4f2e-9ba6-d1b1e38ff5bd";

  const { data: updatedProp, error: propError } = await supabase
    .from('properties')
    .update(changes)
    .eq('id', propertyId)
    .select();

  console.log("Error:", propError);
  console.log("Updated:", JSON.stringify(updatedProp, null, 2));
}

run();

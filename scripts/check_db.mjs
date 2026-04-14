
import { createClient } from '@supabase/supabase-client';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key missing in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProperties() {
  const { data, error } = await supabase.from('properties').select('id, company_id, title').limit(10);
  if (error) {
    console.error("Error fetching properties:", error);
  } else {
    console.log("Found properties:", data);
  }
}

checkProperties();

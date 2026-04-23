import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: companies } = await supabase.from('companies').select('*');
  console.log("Companies:", companies);
  
  const { data: profiles } = await supabase.from('profiles').select('*').limit(5);
  console.log("Profiles:", profiles);
}

check();

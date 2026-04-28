import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: team_members } = await supabase.from('team_members').select('*').limit(3);
  console.log("Team Members:", JSON.stringify(team_members, null, 2));
  
  const { data: instance_members } = await supabase.from('instance_members').select('*').limit(3);
  console.log("\nInstance Members:", JSON.stringify(instance_members, null, 2));
}

check();

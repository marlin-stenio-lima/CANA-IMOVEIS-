import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, role');
  console.log("Profiles:");
  console.table(profiles);
  
  const { data: team_members } = await supabase.from('team_members').select('id, name, active, user_id');
  console.log("\nTeam Members:");
  console.table(team_members);
}

check();

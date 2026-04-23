import { createClient } from '@supabase/supabase-js';

// Read args
const supabaseUrl = process.argv[2];
const supabaseKey = process.argv[3];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: profiles, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5);
  console.log("Last 5 Profiles:", profiles);
  if (error) console.error("Error:", error);
}

check();

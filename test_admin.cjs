const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://uscfxlmtqzqifizunyoz.supabase.co"; // Current env URL

// Try fetching using anon key: this will fail for auth.users
async function run() {
  const supabase = createClient(SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const { data, error } = await supabase.auth.admin.listUsers();
  console.log(error);
}
run();

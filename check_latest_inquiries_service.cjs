const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL="?(.*?)"?(\r|\n|$)/)[1].trim();
// Use the secret service key to bypass RLS!
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(supabaseUrl, "YOUR_SERVICE_KEY");
// Wait, I don't have the service role key locally.

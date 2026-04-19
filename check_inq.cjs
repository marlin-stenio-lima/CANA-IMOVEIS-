const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL="?(.*?)"?(\r|\n|$)/)[1].trim();
const anonKey = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="?(.*?)"?(\r|\n|$)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(supabaseUrl, anonKey);
sb.from('property_inquiries').select('*').order('created_at', { ascending: false }).limit(5)
  .then(r => console.log('INQUIRIES:', r.data))
  .catch(console.error);

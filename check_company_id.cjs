const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL="?(.*?)"?(\r|\n|$)/)[1].trim();
const anonKey = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="?(.*?)"?(\r|\n|$)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(supabaseUrl, anonKey);
sb.from('properties').select('company_id').limit(1).then(r => console.log('PROP COMPANY_ID:', r.data));
sb.from('leads').select('company_id').limit(1).then(r => console.log('LEAD COMPANY_ID:', r.data));

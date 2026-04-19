const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL="?(.*?)"?(\r|\n|$)/)[1].trim();
const anonKey = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="?(.*?)"?(\r|\n|$)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(supabaseUrl, anonKey);
sb.from('properties').select('company_id').limit(1).then(prop => {
  sb.from('property_inquiries').insert({
    company_id: prop.data[0].company_id,
    name: 'TESTE NULL ID',
    email: 'teste@null.com',
    phone: '5586999511727',
    message: 'TESTE',
    status: 'novo',
    source: 'teste',
    property_id: null
  }).then(r => console.log('INSERT NULL:', JSON.stringify(r))).catch(console.error);
});

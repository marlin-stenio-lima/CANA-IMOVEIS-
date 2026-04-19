const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL="?(.*?)"?(\r|\n|$)/)[1].trim();
const anonKey = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="?(.*?)"?(\r|\n|$)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(supabaseUrl, anonKey);
sb.from('leads').select('*').limit(1).then(leadReq => {
  const l = leadReq.data[0];
  console.log('Got lead:', l.id, l.company_id);
  sb.from('property_inquiries').insert({
    company_id: l.company_id,
    name: 'TESTE FORCE', // hardcoded to bypass name issues
    email: 'teste@teste.com',
    phone: '0000',
    message: 'test insert',
    status: 'novo',
    source: 'test_script',
    property_id: null
  }).then(r => console.log('INSERT RESULT:', JSON.stringify(r, null, 2))).catch(console.error);
});

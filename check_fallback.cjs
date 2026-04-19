const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL="?(.*?)"?(\r|\n|$)/)[1].trim();
const anonKey = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="?(.*?)"?(\r|\n|$)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(supabaseUrl, anonKey);
sb.from('properties').select('id').eq('company_id', 'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a').limit(1).maybeSingle()
  .then(fProp => {
      console.log('FALLBACK PROP:', fProp);
      return sb.from('property_inquiries').insert({
        company_id: 'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a',
        name: 'TEST',
        email: 'test@teste.com',
        phone: '123',
        message: '123',
        status: 'novo',
        source: 'teste',
        property_id: fProp.data.id
      });
  }).then(r => console.log('INQUIRY INSERT:', r)).catch(console.error);

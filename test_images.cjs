const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envData = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
  envData.split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const [k, ...v] = l.split('=');
      return [k.trim(), v.join('=').trim().replace(/['"]/g, '')];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

supabase.from('properties')
  .select('id, title, is_published, images:property_images(id)')
  .eq('is_published', true)
  .limit(2)
  .then(r => console.log('Props with images:', JSON.stringify(r.data, null, 2)))
  .catch(console.error);

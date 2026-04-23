const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';
envFile.split('\n').forEach(line => {
  if (line.includes('VITE_SUPABASE_URL')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.includes('VITE_SUPABASE_ANON_KEY')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('properties').select('*').limit(1);
  if(error) {
    console.log('Error:', error);
  } else {
    console.log('COLUMNS:', Object.keys(data[0] || {}));
  }
}
run();

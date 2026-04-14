const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('e:\\Samsung\\Downloads\\ANTIGRAVITY = GITHUB - NÃO EXCLUIR\\crm-suite-pro\\.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length > 0) {
        env[key.trim()] = rest.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'] || env['VITE_SUPABASE_PUBLISHABLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking profiles...");
    const { data: profiles, error } = await supabase.from('profiles').select('id, full_name, company_id');
    if (error) console.error("Error:", error);
    else console.log("Profiles in DB:", JSON.stringify(profiles, null, 2));
}

check();

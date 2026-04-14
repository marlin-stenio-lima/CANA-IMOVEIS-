const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length > 0) {
        env[key.trim()] = rest.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_PUBLISHABLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Supabase URL:", supabaseUrl);
    
    // We can't use auth easily here, so let's just list tables we CAN see
    const { data: tm, error: e1 } = await supabase.from('team_members').select('*').limit(5);
    console.log("Team Members Sample:", JSON.stringify(tm, null, 2));

    const { data: comp, error: e2 } = await supabase.from('companies').select('*').limit(5);
    console.log("Companies Sample:", JSON.stringify(comp, null, 2));
}

check();

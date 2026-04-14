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
    console.log("Listing tables from information_schema...");
    const { data, error } = await supabase.rpc('get_tables_info'); // Might not exist
    
    // Fallback: try to select from likely tables
    const tables = ['instances', 'instance_members', 'team_members', 'companies', 'profiles'];
    for (const t of tables) {
        const { error: e } = await supabase.from(t).select('count', { count: 'exact', head: true });
        if (e) console.log(`Table '${t}' error: ${e.message}`);
        else console.log(`Table '${t}' exists.`);
    }
}

check();

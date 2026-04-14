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

async function inspect() {
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'tatiana@canaaluxo.com',
        password: 'Alanh310896'
    });

    // Test the insert without company_id to see if it triggers the same error
    const { data, error } = await supabase.from('tasks').insert({
        title: "Test",
        company_id: "c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a"
    }).select();

    console.log("Insert result:");
    console.log(error);
}

inspect();

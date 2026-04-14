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

async function testRLS() {
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'tatiana@canaaluxo.com',
        password: 'Alanh310896'
    });

    // Call RPC to see what get_user_company_id returns for this user
    console.log("Calling get_user_company_id()...");
    const { data: rpcData, error: rpcErr } = await supabase.rpc('get_user_company_id');
    console.log("RPC Data:", rpcData, "Error:", rpcErr);
}

testRLS();

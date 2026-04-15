const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
        let value = match[2] ? match[2].trim() : '';
        if (value.startsWith('"') && value.endsWith('"')) { value = value.substring(1, value.length - 1); }
        env[match[1]] = value;
    }
});
const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_PUBLISHABLE_KEY']);

async function run() {
    // try to call the rpc directly to see if we can get logs? We don't have an RPC for handle_new_user
    // The only way to see error is to use service role key and query postgres logs if they are available via API, or try inserting into profiles manually
    const { data: c, error: ce } = await supabase.from('companies').insert({ name: 'test_c', slug: 'test_c_' + Date.now() }).select('*');
    console.log("Company insert:", ce ? ce : "success");
    
    if(!ce) {
        const { data: p, error: pe } = await supabase.from('profiles').insert({ id: "00000000-0000-0000-0000-000000000000", company_id: c[0].id, full_name: 'Test' });
        console.log("Profiles insert:", pe ? pe : "success");
        
        const { data: r, error: re } = await supabase.from('user_roles').insert({ user_id: '00000000-0000-0000-0000-000000000000', company_id: c[0].id, role: 'owner' });
        console.log("User roles insert:", re ? re : "success");
    }
}
run();

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
    console.log('Dumping task company_id and created_by...');
    const { data: tasks } = await supabase.from('tasks').select('id, title, company_id, created_by, related_contact_id');
    console.log(tasks);

    console.log('\nDumping profile for Tatiana...');
    const { data: profiles } = await supabase.from('profiles').select('*');
    console.log(profiles);
}
run();

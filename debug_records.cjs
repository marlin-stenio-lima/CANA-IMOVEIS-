const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
        let value = match[2] ? match[2].trim() : '';
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
        }
        env[match[1]] = value;
    }
});

const url = env['VITE_SUPABASE_URL'];
const key = env['VITE_SUPABASE_PUBLISHABLE_KEY'] || env['VITE_SUPABASE_ANON_KEY'];

if (!url || !key) {
    console.error('Missing URL or Key in .env');
    console.log('ENV keys found:', Object.keys(env));
    process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
    console.log('Checking Tasks...');
    const { data: tasks, error: tErr } = await supabase.from('tasks').select('id, title, contact_id, related_contact_id, company_id, assigned_to');
    console.log('Total Tasks:', tasks?.length || 0);
    if (tErr) console.error('Tasks Error:', tErr);
    if (tasks?.length) console.log('Last task:', tasks[tasks.length - 1]);

    console.log('\nChecking Appointments...');
    const { data: appts, error: aErr } = await supabase.from('appointments').select('id, title, contact_id, company_id, assigned_to');
    console.log('Total Appointments:', appts?.length || 0);
    if (aErr) console.error('Appointments Error:', aErr);
    if (appts?.length) console.log('Last appointment:', appts[appts.length - 1]);

    console.log('\nChecking Profiles...');
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, full_name, company_id');
    console.log('Total Profiles:', profiles?.length || 0);
    if (profiles) console.log('Profiles:', profiles);
}

run();

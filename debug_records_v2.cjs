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
const supabase = createClient(url, key);

async function run() {
    console.log('Checking Tasks...');
    // In step 488 useTasks was using related_contact_id
    const { data: tasks, error: tErr } = await supabase.from('tasks').select('id, title, related_contact_id, company_id, assigned_to');
    console.log('Total Tasks:', tasks?.length || 0);
    if (tErr) console.error('Tasks Error:', tErr);
    if (tasks?.length) console.log('Tasks found:', tasks.map(t => ({ id: t.id, title: t.title, contact: t.related_contact_id })));

    console.log('\nChecking Appointments...');
    const { data: appts, error: aErr } = await supabase.from('appointments').select('id, title, contact_id, company_id, assigned_to');
    console.log('Total Appointments:', appts?.length || 0);
    if (aErr) console.error('Appointments Error:', aErr);
    if (appts?.length) console.log('Appointments found:', appts.map(a => ({ id: a.id, title: a.title, contact: a.contact_id })));
}

run();

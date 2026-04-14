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

const url = env['VITE_SUPABASE_URL'] || env['SUPABASE_URL'];
const key = env['VITE_SUPABASE_ANON_KEY'] || env['SUPABASE_ANON_KEY'] || env['SUPABASE_SERVICE_ROLE_KEY'];
const supabase = createClient(url, key);

async function run() {
    console.log('Fetching tasks...');
    const { data: tasks, error: tasksErr } = await supabase.from('tasks').select('*');
    console.log('Tasks:', tasks?.length, tasksErr);
    if (tasks && tasks.length > 0) { console.log(tasks[tasks.length - 1]); }

    console.log('Fetching appointments...');
    const { data: appts, error: apptErr } = await supabase.from('appointments').select('*');
    console.log('Appointments:', appts?.length, apptErr);
    if (appts && appts.length > 0) { console.log(appts[appts.length - 1]); }
}
run();

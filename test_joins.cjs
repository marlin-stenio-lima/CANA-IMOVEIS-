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
    console.log('Testing Tasks join...');
    const { data: t, error: errT } = await supabase.from('tasks').select('*, profiles:assigned_to(full_name)').limit(1);
    console.log('Tasks result:', !!t, errT);

    console.log('Testing Appointments join...');
    const { data: a, error: errA } = await supabase.from('appointments').select('*, profiles:assigned_to(full_name)').limit(1);
    console.log('Appointments result:', !!a, errA);
}
run();

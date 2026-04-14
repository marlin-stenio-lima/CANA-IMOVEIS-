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
    console.log('Fetching tasks with frontend join...');
    const { data: tasks, error } = await supabase.from('tasks').select('*, profiles:assigned_to(full_name)').eq('related_contact_id', 'c6347da5-1ef9-4a8d-99b4-2c50928c9d07');
    console.log('Frontend Request tasks:', tasks?.length, error);

    const { data: alltasks, error2 } = await supabase.from('tasks').select('*');
    console.log('Frontend ALL tasks:', alltasks?.length, error2);
}
run();

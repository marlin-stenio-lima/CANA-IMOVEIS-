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
    // I will use a query to information_schema.table_constraints
    // Note: Default anon user might not have access to information_schema.
    // If this fails, I'll ask the user to run a SQL in the dashboard.
    console.log('Querying constraints...');
    const { data, error } = await supabase.rpc('get_table_constraints', { t_name: 'appointments' });
    if (error) {
        console.warn('RPC failed, trying raw query (might fail RLS)...');
        const { data: d2, error: e2 } = await supabase.from('pg_constraint').select('*').limit(1);
        console.error('Direct access to pg_catalog likely blocked:', e2);
    } else {
        console.log('Constraints:', data);
    }
}
run();

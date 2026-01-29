const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContacts() {
    console.log("Checking Contacts in DB...");

    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'debug-db',
            table: 'contacts',
            limit: 100, // Search more
            instanceName: 'vendas'
        }
    });

    if (error) {
        console.error("Function Error:", error);
        return;
    }

    if (data && data.data) {
        console.log("Contacts:", JSON.stringify(data.data, null, 2));
        const target = data.data.find(c => c.phone.includes('1851') || c.remote_jid.includes('1851'));
        console.log("Found Target Contact:", JSON.stringify(target, null, 2));
    }
}

checkContacts();

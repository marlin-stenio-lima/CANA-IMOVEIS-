const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDuplicates() {
    console.log("Inspecting duplicates for '55869' via evolution-manager...");

    const { data: result, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'debug-db',
            table: 'contacts',
            limit: 1 // Just one to see schema
        }
    });

    if (error) {
        console.error("Function Error:", error);
    } else if (result) {
        if (result.error) {
            console.error("Internal Function Error:", result.error);
        } else {
            console.log(`Found ${result.data?.length || 0} contacts.`);
            console.table(result.data?.map(c => ({
                id: c.id,
                name: c.name,
                phone: c.phone,
                remote_jid: c.remote_jid,
                created_at: c.created_at
            })));
        }
    }
}

inspectDuplicates();

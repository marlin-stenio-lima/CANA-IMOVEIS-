const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
    console.log("Checking for duplicate contacts by phone (55869)...");

    const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .or('phone.ilike.%55869%,remote_jid.ilike.%55869%');

    if (error) {
        console.error("Error fetching contacts:", error);
    } else {
        console.log(`Found ${contacts.length} contacts matching phone '55869'.`);
        console.table(contacts.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            remote_jid: c.remote_jid,
            created_at: c.created_at
        })));
    }
}

checkDuplicates();

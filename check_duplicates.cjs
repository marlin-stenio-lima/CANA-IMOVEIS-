const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
    console.log("Checking for duplicate contacts (Luiz Filipe)...");

    const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .ilike('name', '%Luiz Filipe%');

    if (error) {
        console.error("Error fetching contacts:", error);
    } else {
        console.log(`Found ${contacts.length} contacts matching 'Luiz Filipe'.`);
        console.table(contacts.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            remote_jid: c.remote_jid,
            email: c.email
        })));
    }
}

checkDuplicates();

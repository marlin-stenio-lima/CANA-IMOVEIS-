const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContacts() {
    console.log("Checking for bad contacts...");

    const { data: badContacts, error } = await supabase
        .from('contacts')
        .select('*')
        .or('remote_jid.is.null,phone.is.null,name.is.null')
        .limit(50);

    if (error) {
        console.error("Error checking contacts:", error);
    } else {
        console.log(`Found ${badContacts.length} potentially bad contacts.`);
        if (badContacts.length > 0) {
            console.table(badContacts);
        }
    }
}

checkContacts();

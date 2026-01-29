const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchContact() {
    console.log("Searching for contact 2537...");

    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .ilike('phone', '%2537%') // Flexible search
        .limit(5);

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Found Contacts:", JSON.stringify(data, null, 2));
    }
}

searchContact();

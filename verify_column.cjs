const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyColumn() {
    console.log("Verifying columns in 'contacts'...");
    // Try to select all columns to see what we get, or specific ones
    const { data, error } = await supabase.from('contacts').select('remote_jid, profile_pic_url, name').limit(1);

    if (error) {
        console.error("Verification Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Columns Exist. Data:", JSON.stringify(data, null, 2));
    }
}

verifyColumn();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompaniesSchema() {
    console.log("Checking columns for 'companies' table...");

    // We can't access information_schema easily via client unless exposed.
    // Instead, let's try to select * from a non-existent row and check the error or return type, 
    // BUT better: try to select just ID and Name which should exist.

    const { data, error } = await supabase.from('companies').select('*').limit(1);

    if (error) {
        console.error("Error fetching companies:", error);
    } else {
        // Even if empty, data might have structure if using typed client, but here it's JS.
        // If data is empty array, we don't know columns.
        console.log("Data result:", JSON.stringify(data, null, 2));
    }
}

checkCompaniesSchema();

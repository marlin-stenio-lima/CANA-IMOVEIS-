const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDeals() {
    console.log("Checking recent Deals...");

    // 1. Fetch recent deals
    const { data: deals, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Deals Data Error:", error);
    } else {
        console.log("Found Deals:", deals.length);
        if (deals.length > 0) {
            console.log("Recent Deal:", JSON.stringify(deals[0], null, 2));
        } else {
            console.log("No deals found.");
        }
    }

    // 2. Fetch Profiles to check User IDs
    const { data: profiles } = await supabase.from('profiles').select('id, email, company_id, full_name, role');
    console.log("Profiles/Users:", JSON.stringify(profiles, null, 2));

    // 3. Fetch Pipelines
    const { data: pipelines } = await supabase.from('pipelines').select('id, name, company_id');
    console.log("Pipelines:", JSON.stringify(pipelines, null, 2));
}

checkDeals();

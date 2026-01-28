const { createClient } = require('@supabase/supabase-js');

// Hardcoded for testing - directly from your .env
const SUPABASE_URL = "https://ahvaqriovmsxixgilkxa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
    console.log("---- DIAGNOSTIC START ----");
    console.log(`Target Project: ${SUPABASE_URL}`);

    // 1. Test Select from team_members
    console.log("\n1. Testing 'team_members' access...");
    const { data: members, error: memberError } = await supabase
        .from('team_members')
        .select('count')
        .limit(1);

    if (memberError) {
        console.error("FAIL: Could not query 'team_members'.");
        console.error("Error Details:", memberError);
    } else {
        console.log("SUCCESS: 'team_members' table is accessible.");
        console.log("Data:", members);
    }

    // 2. Test Select from instances
    console.log("\n2. Testing 'instances' access...");
    const { data: instances, error: instanceError } = await supabase
        .from('instances')
        .select('count')
        .limit(1);

    if (instanceError) {
        console.error("FAIL: Could not query 'instances'.");
        console.error("Error Details:", instanceError);
    } else {
        console.log("SUCCESS: 'instances' table is accessible.");
        console.log("Data:", instances);
    }
    console.log("---- DIAGNOSTIC END ----");
}

testConnection();

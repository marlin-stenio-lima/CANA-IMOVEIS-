const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVendasStatus() {
    console.log("Checking status for instance 'vendas'...");

    // 1. Check Evolution API
    const { data: apiData, error: apiError } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'status',
            instanceName: 'vendas'
        }
    });

    if (apiError) {
        console.error("API Error:", apiError);
    } else {
        console.log("API Response:", JSON.stringify(apiData, null, 2));
    }

    // 2. Check Supabase DB
    const { data: dbData, error: dbError } = await supabase
        .from('instances')
        .select('*')
        .eq('name', 'vendas');

    if (dbError) {
        console.error("DB Error:", dbError);
    } else {
        console.log("DB Entry:", JSON.stringify(dbData, null, 2));
    }
}

checkVendasStatus();

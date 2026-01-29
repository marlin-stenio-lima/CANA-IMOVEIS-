const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixInstance() {
    console.log("Fetching valid companies...");
    const { data: companies, error } = await supabase.from('companies').select('id, name').limit(1);

    if (error || !companies || companies.length === 0) {
        console.error("No companies found or error:", error);
        return;
    }

    const validCompanyId = companies[0].id;
    console.log(`Found valid company: ${companies[0].name} (${validCompanyId})`);

    console.log("Updating 'vendas' instance with valid company_id...");
    const { error: updateError } = await supabase
        .from('instances')
        .update({ company_id: validCompanyId })
        .eq('name', 'vendas');

    if (updateError) {
        console.error("Update failed:", updateError);
    } else {
        console.log("Instance updated successfully.");
    }
}

fixInstance();

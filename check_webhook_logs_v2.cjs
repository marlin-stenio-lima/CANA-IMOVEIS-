const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
    console.log("Checking Messages...");
    try {
        const { data, error } = await supabase.functions.invoke('evolution-manager', {
            body: {
                action: 'debug-db',
                table: 'messages',
                limit: 50,
                instanceName: 'vendas'
            }
        });

        if (error) {
            console.error("Function Error:", error);
        } else {
            console.log("Messages:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Script Error:", err);
    }
}

checkLogs();

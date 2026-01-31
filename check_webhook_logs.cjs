const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
    console.log("Checking Webhook Logs...");

    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'debug-db',
            query: `
          select * from webhook_logs 
          order by created_at desc 
          limit 50
        `
        }
    });

    if (error) {
        console.error("Function Error:", error);
        return;
    }

    if (data && data.data) {
        console.log("Recent Logs:", JSON.stringify(data.data, null, 2));
    } else {
        console.log("No data returned:", data);
    }
}

checkLogs();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMediaDB() {
    console.log("Verifying Media in DB...");

    // We use the debug-db action to bypass RLS and query messages directly
    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'debug-db',
            table: 'messages',
            limit: 5,
            instanceName: 'vendas' // required for validation
        }
    });

    if (error) {
        console.error("Function Error:", error);
        return;
    }

    if (data && data.data) {
        // Filter locally for our test number
        const messages = data.data.filter(m => m.remote_jid === '5511999999999@s.whatsapp.net');
        console.log("Found Messages:", JSON.stringify(messages, null, 2));
    } else {
        console.log("No data returned or error:", data);
    }
}

verifyMediaDB();

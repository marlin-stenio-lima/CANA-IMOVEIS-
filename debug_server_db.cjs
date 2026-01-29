const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDB() {
    console.log("Fetching DB content via Server...");

    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'debug-db',
            instanceName: 'vendas',
            email: 'marlinstenio0312@gmail.com',
            userId: 'ddff3b1f-1d39-4fa8-98ad-2ffb16b22380'
        }
    });

    if (error) {
        console.error("Error invoking function:", error);
        if (error.context && typeof error.context.json === 'function') {
            try {
                const errBody = await error.context.json();
                console.error("Error Body:", JSON.stringify(errBody, null, 2));
            } catch (e) { }
        }
    } else {
        if (data.specificContact) console.log("Specific Contact (from JID match):", JSON.stringify(data.specificContact, null, 2));
        if (data.specificMessages) console.log("Specific Messages (for contact):", JSON.stringify(data.specificMessages, null, 2));

        if (data.logs) console.log("Webhook Logs:", JSON.stringify(data.logs, null, 2));
    }
}

debugDB();

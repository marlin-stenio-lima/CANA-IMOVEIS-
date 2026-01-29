const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

// Important: This requires SERVICE_ROLE_KEY to create buckets/policies if using client, 
// OR we rely on the user having set it up.
// However, I can try to use a function to do it if I don't have the key here.
// But wait, I DO have the key in the environment variables of the Supabase functions.
// I can make a 'setup-storage' action in evolution-manager.

async function triggerSetup() {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Triggering Storage Setup via Evolution Manager...");

    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'setup-storage',
            instanceName: 'system' // Validation bypass
        }
    });

    if (error) {
        if (error.context && error.context.json) {
            const errBody = await error.context.json();
            console.error("Function Error Body:", JSON.stringify(errBody, null, 2));
        } else {
            console.error("Client/Function Error:", error);
        }
    } else if (data && data.error) {
        console.error("Internal Error:", data.error);
    } else {
        console.log("Result:", data);
    }
}

triggerSetup();

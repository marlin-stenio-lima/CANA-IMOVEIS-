const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWebhookConfig() {
    console.log("Checking Webhook Configuration...");

    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'check-webhook', // This calls /webhook/find/:instanceName
            instanceName: 'vendas'
        }
    });

    if (error) {
        console.error("Function Error:", error);
        return;
    }

    console.log("Webhook Config:", JSON.stringify(data, null, 2));
}

checkWebhookConfig();

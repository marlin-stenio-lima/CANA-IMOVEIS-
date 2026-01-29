const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setWebhook() {
    console.log("Setting Webhook for 'vendas' with comprehensive event list...");

    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'set-webhook',
            instanceName: 'vendas',
            webhookUrl: 'https://ahvaqriovmsxixgilkxa.supabase.co/functions/v1/webhook-whatsapp'
        }
    });

    if (error) {
        console.error("Error invoking function:", error);
    } else {
        console.log("Set Webhook Response:", JSON.stringify(data, null, 2));
    }
}

setWebhook();

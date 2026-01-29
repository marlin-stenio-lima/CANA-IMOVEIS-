const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setWebhookVendas() {
    console.log("Updating webhook for instance 'vendas'...");
    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'set-webhook',
            instanceName: 'vendas'
        }
    });

    if (error) {
        console.error("Error invoking function:", error);
        if (error.context && typeof error.context.json === 'function') {
            try {
                const errBody = await error.context.json();
                console.error("Error Body:", JSON.stringify(errBody, null, 2));
            } catch (e) {
                console.error("Could not parse error body");
            }
        }
    } else {
        console.log("Function Response:", JSON.stringify(data, null, 2));
    }
}

setWebhookVendas();

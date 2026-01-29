const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendMessage() {
    console.log("Sending Test Message...");

    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'send-text',
            instanceName: 'vendas',
            number: '5519991213192', // The number from the logs/screenshot
            text: 'Teste de verificação FINAL ' + Date.now()
        }
    });

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Send Message Response:", JSON.stringify(data, null, 2));
    }
}

sendMessage();

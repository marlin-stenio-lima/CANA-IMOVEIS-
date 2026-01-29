const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

async function testWebhook() {
    console.log("Simulating Webhook Event...");

    const payload = {
        event: "MESSAGES_UPSERT",
        instance: "vendas",
        data: {
            key: {
                remoteJid: "5511888888888@s.whatsapp.net", // Dummy sender
                fromMe: false,
                id: "TEST_MSG_ID_" + Date.now()
            },
            pushName: "Simulated User",
            message: {
                conversation: "Teste Manual via Script"
            }
        },
        sender: "5511888888888@s.whatsapp.net"
    };

    const res = await fetch(`${supabaseUrl}/functions/v1/webhook-whatsapp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        console.error("Webhook Error:", res.status, await res.text());
    } else {
        console.log("Webhook Success:", await res.text());
    }
}

testWebhook();

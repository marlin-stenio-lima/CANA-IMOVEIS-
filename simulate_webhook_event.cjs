const { createClient } = require('@supabase/supabase-js');

// Function URL
const webhookUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co/functions/v1/webhook-whatsapp';

async function simulateWebhook() {
    console.log("Simulating Webhook Event...");

    const payload = {
        event: 'MESSAGES_UPSERT',
        instance: 'vendas',
        data: {
            key: {
                remoteJid: '5511999999999@s.whatsapp.net',
                fromMe: false,
                id: 'FAKE_MSG_ID_' + Date.now()
            },
            pushName: 'Simulated User',
            message: {
                conversation: 'Hello from Simulation!'
            },
            messageTimestamp: Math.floor(Date.now() / 1000)
        },
        sender: '5511999999999@s.whatsapp.net'
    };

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text);

    } catch (err) {
        console.error("Error simulating webhook:", err);
    }
}

simulateWebhook();

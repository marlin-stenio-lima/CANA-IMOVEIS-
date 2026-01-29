const webhookUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co/functions/v1/webhook-whatsapp';

async function testWebhook() {
    console.log("Simulating Webhook Event to:", webhookUrl);

    const payload = {
        "event": "MESSAGES_UPSERT",
        "instance": "vendas",
        "data": {
            "key": {
                "remoteJid": "5599999999999@s.whatsapp.net",
                "fromMe": false,
                "id": "TEST_WEBHOOK_MSG_ID"
            },
            "pushName": "Teste Webhook Manual",
            "message": {
                "conversation": "Teste de Webhook via Script Node"
            },
            "messageType": "conversation"
        },
        "sender": "5599999999999@s.whatsapp.net"
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("Response Status:", response.status);
        console.log("Response Body:", text);
    } catch (error) {
        console.error("Error sending webhook:", error);
    }
}

testWebhook();

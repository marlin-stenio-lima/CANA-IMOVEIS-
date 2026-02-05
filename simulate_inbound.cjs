// Native fetch is available in modern Node.js
// const fetch = require('node-fetch'); // Removed

// CONFIGURAÇÃO
const WEBHOOK_URL = "https://ahvaqriovmsxixgilkxa.supabase.co/functions/v1/webhook-whatsapp";
// O número que vai "enviar" a mensagem (simulado)
const TEST_PHONE = "5519991213192";
const TEST_MESSAGE = "Olá, gostaria de saber mais sobre a casa.";

async function simulate() {
    console.log(`📡 Simulando mensagem de ${TEST_PHONE} para ${WEBHOOK_URL}...`);

    const payload = {
        event: "messages.upsert",
        instance: "Stenio",
        data: {
            key: {
                remoteJid: `${TEST_PHONE}@s.whatsapp.net`,
                fromMe: false, // Importante: false = mensagem recebida (Inbound)
                id: "TEST_MSG_" + Date.now()
            },
            pushName: "Cliente Teste Simulado",
            message: {
                conversation: TEST_MESSAGE
            },
            messageType: "conversation",
            messageTimestamp: Math.floor(Date.now() / 1000),
            owner: "Simulador",
            source: "ios"
        },
        destination: "https://minha-url.com"
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log("Resposta:", text);

        if (response.ok) {
            console.log("✅ Webhook disparado com sucesso! Verifique se o Agente respondeu no banco de dados (tabela messages) ou no WhatsApp real (se conectado).");
        } else {
            console.error("❌ Falha no webhook.");
        }
    } catch (error) {
        console.error("Erro ao conectar:", error);
    }
}

simulate();

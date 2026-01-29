const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminLogs() {
    console.log("Checking Webhook Logs via Admin (Server-Side)...");

    const { data: result, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'debug-db',
            instanceName: 'vendas',
            table: 'webhook_logs',
            limit: 50
        }
    });

    if (result && result.data && result.data.length > 0) {
        const data = result.data;
        const messageEvent = data.find(l => l.payload.event === 'messages.upsert' || l.payload.event === 'MESSAGES_UPSERT');
        if (messageEvent) {
            console.log("FOUND MESSAGES_UPSERT:", JSON.stringify(messageEvent, null, 2));
        } else {
            console.log("No messages.upsert found in last 50 logs. Found events:", [...new Set(data.map(d => d.payload.event))].join(', '));

            // Check send.message
            const sendEvent = data.find(l => l.payload.event === 'send.message');
            if (sendEvent) console.log("FOUND SEND_MESSAGE sample:", JSON.stringify(sendEvent, null, 2));
        }
    } else if (result && result.data && result.data.length === 0) {
        console.log("Logs are empty.");
    }

    if (error) console.error(error);
}

async function checkMessages() {
    console.log("Checking Messages in DB...");
    const { data: result, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'debug-db',
            instanceName: 'vendas',
            table: 'messages',
            limit: 20
        }
    });

    if (result && result.data) {
        const messages = result.data;
        const myMsg = messages.find(m => m.content && m.content.includes('Teste de verificação'));
        if (myMsg) {
            console.log("FOUND MY TEST MESSAGE:", JSON.stringify(myMsg, null, 2));
        } else {
            console.log("Did not find my test message in last 20 messages.");
            console.log("Recent contents:", messages.map(m => m.content).join(' | '));
        }
    } else {
        console.log("No messages found or parse error.");
        if (error) console.error(error);
    }
}

async function run() {
    await checkAdminLogs();
    await checkMessages();
}

run();

const { createClient } = require('@supabase/supabase-js');

const url = "https://uscfxlmtqzqifizunyoz.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(url, key);

async function fix() {
    const webhookUrl = `${url}/functions/v1/webhook-whatsapp`;
    console.log("--- Fixing Webhooks via set-webhook ---");
    const instances = [{ name: 'corretor Tatiana' }];
    for (const inst of instances) {
        console.log(`Setting Webhook for: ${inst.name}...`);
        try {
            const res = await fetch(`${url}/functions/v1/evolution-manager`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`,
                    'apikey': key
                },
                body: JSON.stringify({
                    action: 'set-webhook',
                    instanceName: inst.name,
                    webhookUrl: webhookUrl
                })
            });
            const data = await res.json();
            console.log(`Result for ${inst.name}:`, JSON.stringify(data));
        } catch (e) {
            console.error(`Error fixing ${inst.name}:`, e.message);
        }
    }
}

fix();

const { createClient } = require('@supabase/supabase-js');

const url = "https://uscfxlmtqzqifizunyoz.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(url, key);

async function fix() {
    console.log("--- Fetching Instances ---");
    const { data: instances, error: instError } = await supabase.from('instances').select('name');
    if (instError) return console.error(instError);

    for (const inst of instances) {
        console.log(`Syncing Webhook for: ${inst.name}...`);
        try {
            const res = await fetch(`${url}/functions/v1/evolution-manager`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`,
                    'apikey': key
                },
                body: JSON.stringify({
                    action: 'sync-webhook',
                    instanceName: inst.name
                })
            });
            const data = await res.json();
            console.log(`Result for ${inst.name}:`, JSON.stringify(data));
        } catch (e) {
            console.error(`Error syncing ${inst.name}:`, e.message);
        }
    }
}

fix();

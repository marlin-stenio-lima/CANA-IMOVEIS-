const { createClient } = require('@supabase/supabase-js');

const url = "https://uscfxlmtqzqifizunyoz.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(url, key);

async function check() {
    console.log("--- Checking Recent Webhook Logs ---");
    const { data: logs, error: logsError } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (logsError) console.error("Logs Error:", logsError);
    else console.log("Recent Logs:", JSON.stringify(logs, null, 2));

    console.log("\n--- Checking Recent Messages ---");
    const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (messagesError) console.error("Messages Error:", messagesError);
    else console.log("Recent Messages:", JSON.stringify(messages, null, 2));
}

check();

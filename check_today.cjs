const { createClient } = require('@supabase/supabase-js');

const url = "https://uscfxlmtqzqifizunyoz.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(url, key);

async function check() {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
        .from('webhook_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);
    
    console.log("Webhooks received today:", count);

    const { data: messages } = await supabase
        .from('messages')
        .select('created_at, content, direction')
        .order('created_at', { ascending: false })
        .limit(5);
    
    console.log("Last 5 messages:", JSON.stringify(messages, null, 2));
}

check();

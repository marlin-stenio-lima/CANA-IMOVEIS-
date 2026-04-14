import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMessages() {
    const { data, error } = await supabase
        .from('messages')
        .select('id, content, media_url, message_type, created_at')
        .eq('message_type', 'image')
        .order('created_at', { ascending: false })
        .limit(50);



    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Recent Messages:", JSON.stringify(data, null, 2));
    }
}

checkMessages();

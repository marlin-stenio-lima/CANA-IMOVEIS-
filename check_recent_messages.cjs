const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const evolutionApiKey = process.env.EVOLUTION_API_KEY;
const evolutionApiUrl = process.env.EVOLUTION_API_URL;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

// Manually defining fetch for the edge function context simulation if needed (not needed for direct client)

async function checkRecentMessages() {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Checking last 10 messages...");
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching messages:", error);
    } else {
        console.log("Recent Messages:", JSON.stringify(data, null, 2));
    }
}

checkRecentMessages();

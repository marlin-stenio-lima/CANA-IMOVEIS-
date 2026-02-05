const { createClient } = require('@supabase/supabase-js');

// Config from .env
const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAgent() {
    console.log("Testing AI Agent Invocation...");

    // Mock Payload
    const payload = {
        message: "quero fotos da casa duplex",
        contact_id: "cadaac6e-1be0-4fa0-a455-e2524b4c4d46", // Use a real or valid-looking ID (from previous logs if possible)
        company_id: "68ec7b47-05a1-4051-8b61-9b9b230054b8", // From logs
        conversation_id: "cb2d820f-c143-4fa8-a407-5f4c328df47f", // From logs
        instance_name: "vendas",
        broker_id: null // Optional
    };

    // Note: You need a valid contact_id that exists in the DB for the agent to work (it fetches contact data)
    // I grabbed these IDs from the logs in previous steps (check_remote_messages output)
    // instance_id "68ec7b47..." -> company? id?

    // Let's try to get a valid contact first to be safe, or just try running.
    // If contact lookup fails, agent might error. 

    // We can fetch a contact first.
    const { data: contact } = await supabase.from('contacts').select('id, company_id').limit(1).single();
    if (contact) {
        payload.contact_id = contact.id;
        payload.company_id = contact.company_id;
    }

    const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: payload
    });

    if (error) {
        console.error("AI Agent Failed:", error);
    } else {
        console.log("AI Agent Response:", JSON.stringify(data, null, 2));
    }
}

testAgent();

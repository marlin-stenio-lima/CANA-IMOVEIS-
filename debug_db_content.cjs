const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log("Checking recent database entries...");

    // 1. Check Messages
    const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (msgError) console.error("Messages Error:", msgError);
    else console.log("Recent Messages:", JSON.stringify(messages, null, 2));

    // 2. Check Conversations
    const { data: convs, error: convError } = await supabase
        .from('conversations')
        .select('*, contact:contacts(name, phone)')
        .order('last_message_at', { ascending: false })
        .limit(5);

    if (convError) console.error("Conversations Error:", convError);
    else console.log("Recent Conversations:", JSON.stringify(convs, null, 2));

    // 3. Check Instance ID for 'vendas'
    const { data: instance } = await supabase.from('instances').select('*').eq('name', 'vendas').single();
    console.log("Instance 'vendas':", instance);
}

checkData();

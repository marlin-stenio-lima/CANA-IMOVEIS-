const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL="(.+)"/)[1];
const key = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.+)"/)?.[1] || env.match(/VITE_SUPABASE_ANON_KEY="(.+)"/)?.[1];

const supabase = createClient(url, key);

async function check() {
    const { data: messages, error: messagesError } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(100);
    if (messagesError) console.error(messagesError);
    else console.log("Messages Count:", messages.length);
    const recent = messages.filter(m => m.created_at.includes('2026-04-09T19:4'));
    console.log("Recent 19:4x Messages:", JSON.stringify(recent, null, 2));
}

check();

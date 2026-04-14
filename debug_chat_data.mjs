import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function debug() {
  const phone = '558688216571';
  console.log(`Checking data for phone: ${phone}`);

  // 1. Get Contact
  const { data: contact } = await supabase.from('contacts').select('*').eq('phone', phone).maybeSingle();
  if (!contact) {
    console.log("Contact not found");
    return;
  }
  console.log(`Contact ID: ${contact.id}`);

  // 2. Get Conversations for this contact
  const { data: conversations } = await supabase.from('conversations').select('*, instance:instances(name)').eq('contact_id', contact.id);
  console.log(`Found ${conversations?.length || 0} conversations:`);
  conversations?.forEach(c => {
    console.log(`- Conv ID: ${c.id} | Instance: ${c.instance?.name} | Last Message: ${c.last_message}`);
  });

  // 3. Get Messages for the most recent conversation
  if (conversations && conversations.length > 0) {
    const convId = conversations[0].id;
    const { data: messages } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: false }).limit(10);
    console.log(`Found ${messages?.length || 0} messages for Conv ${convId}:`);
    messages?.forEach(m => {
      console.log(`  [${m.created_at}] ${m.sender_type}: ${m.content} (Type: ${m.message_type})`);
    });
  }
}

debug();

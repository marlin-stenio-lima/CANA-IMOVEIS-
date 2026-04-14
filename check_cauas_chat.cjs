const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentMessages() {
  const phone = '558699481639';
  console.log(`Buscando mensagens para o contato ${phone}...`);

  const { data: contacts } = await supabase.from('contacts').select('id').eq('phone', phone);
  if (!contacts || contacts.length === 0) {
    console.log("Contato não encontrado.");
    return;
  }

  const contactIds = contacts.map(c => c.id);
  
  const { data: convs } = await supabase.from('conversations').select('id').in('contact_id', contactIds);
  if (!convs || convs.length === 0) {
     console.log("Conversas não encontradas.");
     return;
  }
  
  const convIds = convs.map(c => c.id);

  const { data: msgs } = await supabase
    .from('messages')
    .select('id, content, message_type, media_url, created_at, conversation_id')
    .in('conversation_id', convIds)
    .order('created_at', { ascending: false })
    .limit(5);

  msgs.forEach(m => {
    console.log(`[${m.created_at}] | C_ID: ${m.conversation_id} | Tipo: ${m.message_type} | Content: ${m.content} | URL: ${m.media_url}`);
  });
}

checkRecentMessages();

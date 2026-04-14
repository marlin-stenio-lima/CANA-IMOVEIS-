const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUnread() {
  const contactId = 'f54b8653-1df3-426a-880a-acf2976e6f61';
  
  const { data: convs, error } = await supabase
    .from('conversations')
    .select('id, instance_id, unread_count, last_message_at')
    .eq('contact_id', contactId);

  if (error) {
    console.error(error);
    return;
  }

  convs.forEach(c => {
    console.log(`Conv: ${c.id} | Instance: ${c.instance_id} | Unread: ${c.unread_count} | LastMsg: ${c.last_message_at}`);
  });
}

checkUnread();

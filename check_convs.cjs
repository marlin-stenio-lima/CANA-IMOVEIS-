const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConvDuplicates() {
  const contactId = 'f54b8653-1df3-426a-880a-acf2976e6f61';
  console.log(`Verificando conversas para o contact_id ${contactId}...`);

  const { data: convs, error } = await supabase
    .from('conversations')
    .select('id, contact_id, instance_id, created_at')
    .eq('contact_id', contactId);

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Encontradas ${convs.length} conversas.`);
  convs.forEach(c => {
    console.log(`ID: ${c.id} | Instance: ${c.instance_id} | Criado em: ${c.created_at}`);
  });
}

checkConvDuplicates();

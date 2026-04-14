const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContactDuplicates() {
  const phone = '558699481639';
  console.log(`Verificando duplicatas para o telefone ${phone}...`);

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('id, name, phone, created_at')
    .eq('phone', phone);

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Encontrados ${contacts.length} registros de contato.`);
  contacts.forEach(c => {
    console.log(`ID: ${c.id} | Nome: ${c.name} | Criado em: ${c.created_at}`);
  });
}

checkContactDuplicates();

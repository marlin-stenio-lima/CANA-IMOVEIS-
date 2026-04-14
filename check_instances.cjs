const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInstanceTypes() {
  const ids = ['a5d9e8df-d2fb-44b2-a432-0f1281e90175', '6cb4ac8c-c61f-44f7-b911-8e6a75326c4f'];
  console.log(`Verificando instâncias...`);

  const { data: instances, error } = await supabase
    .from('instances')
    .select('id, name, business_type')
    .in('id', ids);

  if (error) {
    console.error(error);
    return;
  }

  instances.forEach(i => {
    console.log(`ID: ${i.id} | Nome: ${i.name} | Tipo: ${i.business_type}`);
  });
}

checkInstanceTypes();

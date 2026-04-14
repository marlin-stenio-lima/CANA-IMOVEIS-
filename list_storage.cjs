const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function listFiles() {
  // We need to know the folder. Based on my previous output:
  // a5d9e8df-d2fb-44b2-a432-0f1281e90175/1774645040757_ibh1v5.ogg;%20codecs=opus
  const folder = "a5d9e8df-d2fb-44b2-a432-0f1281e90175";
  
  console.log(`--- Arquivos na pasta ${folder} ---`);
  const { data, error } = await supabase.storage.from('chat-media').list(folder, {
    limit: 10,
    offset: 0,
    sortBy: { column: 'name', order: 'desc' },
  });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(f => {
    console.log(`Nome: [${f.name}] | Tamanho: ${f.metadata?.size} bytes`);
  });
}

listFiles();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTestMessage() {
  // Get the last broken message
  const { data: msgs } = await supabase
    .from('messages')
    .select('id, media_url')
    .eq('message_type', 'audio')
    .ilike('media_url', '%;%')
    .order('created_at', { ascending: false })
    .limit(1);

  if (!msgs || msgs.length === 0) {
    console.log('Nenhuma mensagem corrompida encontrada.');
    return;
  }

  const msg = msgs[0];
  const cleanUrl = msg.media_url.split(';')[0];
  console.log(`Original: ${msg.media_url}`);
  console.log(`Corrigido: ${cleanUrl}`);

  // Test fetch
  const resp = await fetch(cleanUrl, { method: 'HEAD' });
  console.log(`Status HTTP (Corrigido): ${resp.status} | Content-Length: ${resp.headers.get('content-length')}`);

  if (resp.status === 200) {
    console.log('A CORREÇÃO FUNCIONOU! O ARQUIVO EXISTE SEM O SUFIXO.');
  } else {
    console.log('A correção NÃO funcionou. O arquivo também não existe sem o sufixo.');
  }
}

fixTestMessage();

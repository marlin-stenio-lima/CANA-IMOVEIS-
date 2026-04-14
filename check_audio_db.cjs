const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAudioMessages() {
  console.log('--- Ultimas 5 mensagens de áudio ---');
  const { data, error } = await supabase
    .from('messages')
    .select('id, media_url, mimetype, created_at')
    .eq('message_type', 'audio')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Erro DB:', error);
    return;
  }

  for (const msg of data) {
    console.log(`ID: ${msg.id} | ${msg.created_at}`);
    console.log(`URL: ${msg.media_url}`);
    
    try {
      const resp = await fetch(msg.media_url, { method: 'HEAD' });
      console.log(`Status HTTP: ${resp.status} | Content-Length: ${resp.headers.get('content-length')}`);
    } catch (e) {
      console.log(`Erro ao acessar URL: ${e.message}`);
    }
    console.log(`---`);
  }
}

checkAudioMessages();

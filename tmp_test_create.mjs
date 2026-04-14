import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uscfxlmtqzqifizunyoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEdgeFunction() {
  console.log("Testing create...");
  const { data, error } = await supabase.functions.invoke('evolution-manager', {
    body: { action: 'create', instanceName: 'test3' }
  });
  
  if (error) {
    console.error("Master Error:", error.message);
    if (error.context) {
        try {
            console.log("Context:", await error.context.json());
        } catch(e){}
    }
  } else {
    console.log("Success:", data);
  }
}

testEdgeFunction();

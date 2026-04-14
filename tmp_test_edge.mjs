import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uscfxlmtqzqifizunyoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEdgeFunction() {
  console.log("Testing without Auth...");
  const { data, error } = await supabase.functions.invoke('evolution-manager', {
    body: { action: 'status', instanceName: 'test' }
  });
  
  if (error) {
    if (error.context) {
        try {
            console.log("Context JSON:", await error.context.json());
        } catch(e) {
            console.log("Context Text:", await error.context.text());
        }
    }
    console.error("Error calling edge function anon:", error.message);
  } else {
    console.log("Success anon:", data);
  }

  // To simulate the user, let's see if we can just make a raw fetch with bad JWT
  console.log("Testing with bad Auth...");
  const res = await fetch(`${supabaseUrl}/functions/v1/evolution-manager`, {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer bad_jwt_token_123',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'status', instanceName: 'test' })
  });
  
  console.log("Bad Auth Status:", res.status);
  console.log("Bad Auth Body:", await res.text());
}

testEdgeFunction();

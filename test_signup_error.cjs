const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://uscfxlmtqzqifizunyoz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const email = `test_signup_${Date.now()}@example.com`;
  console.log("Trying to sign up", email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password: "Password123!",
    options: {
      data: {
        company_id: "c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a",
        company_name: "Canaã Luxo", 
        full_name: "Test Name",
        is_owner: true,
        invite_role: "agent",
        invite_areas: ["imoveis"]
      }
    }
  });
  console.log("Error:", JSON.stringify(error, null, 2));
  console.log("Data:", data);
}

run();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY; 
const supabase = createClient(url, key);

async function run() {
  const query = `
CREATE OR REPLACE FUNCTION public.claim_bolsao_lead(p_deal_id UUID, p_contact_id UUID)
RETURNS boolean AS $$
BEGIN
  UPDATE public.deals 
  SET assigned_to = auth.uid(), 
      updated_at = NOW() 
  WHERE id = p_deal_id;

  UPDATE public.contacts 
  SET assigned_to = auth.uid(), 
      updated_at = NOW() 
  WHERE id = p_contact_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // We invoke the REST API to execute SQL if possible, but since we don't have exec_sql guaranteed, 
  // we'll instruct the user to run this in their Supabase Editor!
}
run();

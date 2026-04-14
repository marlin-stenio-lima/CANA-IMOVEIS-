import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env manually to avoid dotenv issues with paths
const envPath = path.resolve('e:/Samsung/Downloads/ANTIGRAVITY = GITHUB - NÃO EXCLUIR/crm-suite-pro/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const env: Record<string, string> = {};
envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
  console.log("Connecting to:", supabaseUrl);
  
  // Just list team members and companies to see what's there
  const { data: teamMembers, error: errTM } = await supabase.from('team_members').select('*');
  if (errTM) console.error("TM Error:", errTM);
  else console.log("Team Members:", JSON.stringify(teamMembers, null, 2));
  
  const { data: companies, error: errC } = await supabase.from('companies').select('*');
  if (errC) console.error("Companies Error:", errC);
  else console.log("Companies:", JSON.stringify(companies, null, 2));
}

checkUser();

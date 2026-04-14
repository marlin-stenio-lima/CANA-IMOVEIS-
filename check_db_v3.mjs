import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = 'e:/Samsung/Downloads/ANTIGRAVITY = GITHUB - NÃO EXCLUIR/crm-suite-pro/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking DB content...");
    
    const { data: members, error: err1 } = await supabase.from('team_members').select('*');
    if (err1) console.error("Error team_members:", err1);
    else console.log("Team Members:", JSON.stringify(members, null, 2));

    const { data: profiles, error: err2 } = await supabase.from('profiles').select('*');
    if (err2) console.error("Error profiles:", err2);
    else console.log("Profiles:", JSON.stringify(profiles, null, 2));
    
    const { data: companies, error: err3 } = await supabase.from('companies').select('*');
    if (err3) console.error("Error companies:", err3);
    else console.log("Companies:", JSON.stringify(companies, null, 2));
}

check();


import { createClient } from '@supabase/supabase-js';

// Load .env manually since we are running a standalone script
const SUPABASE_URL = "https://ahvaqriovmsxixgilkxa.supabase.co";
const SUPABASE_KEY = "sb_publishable_21nLFfJtO2BWuH_1qtc3vA_xPSXXx2n";

console.log("Initializing Supabase client...");
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testCreateInstance() {
    console.log("Invoking evolution-manager function...");

    try {
        const { data, error } = await supabase.functions.invoke('evolution-manager', {
            body: {
                action: 'create',
                instanceName: 'teste_antigravity_v1'
            }
        });

        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Success! Function Response:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

testCreateInstance();

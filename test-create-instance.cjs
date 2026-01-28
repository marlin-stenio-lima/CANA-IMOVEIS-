
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ahvaqriovmsxixgilkxa.supabase.co";
const SUPABASE_KEY = "sb_publishable_21nLFfJtO2BWuH_1qtc3vA_xPSXXx2n";

console.log("Starting test script (CJS)...");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
    console.log("Invoking function...");
    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'create',
            instanceName: 'teste_antigravity_v1'
        }
    });

    if (error) {
        console.error("Function Error Status:", error.context?.status);
        try {
            // Try to read the body from the response context if possible
            if (error.context && typeof error.context.text === 'function') {
                const body = await error.context.text();
                console.error("Error Body:", body);
            }
        } catch (e) {
            console.error("Could not read error body", e);
        }
    } else {
        console.log("Function Success:", JSON.stringify(data, null, 2));
    }
}

run();

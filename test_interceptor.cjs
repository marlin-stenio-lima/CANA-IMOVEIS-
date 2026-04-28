const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// We need to use the ANON KEY since we don't have SERVICE_ROLE_KEY locally
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    // 1. Get instance
    const { data: instanceData, error: instErr } = await supabase
        .from('instances')
        .select('id, company_id, name')
        .eq('name', 'Principal') // Assuming name is Principal based on screenshot "Enviando via WhatsApp: Principal"
        .maybeSingle();
        
    console.log("Instance:", instanceData, instErr?.message);

    if (instanceData?.company_id) {
        // 2. Get profiles
        const { data: profiles, error: profErr } = await supabase
            .from('profiles')
            .select('id, full_name, phone, company_id')
            .eq('company_id', instanceData.company_id);
            
        console.log("Profiles in company:", profiles, profErr?.message);
        
        // 3. Match
        const senderNumber = "5524999949992"; // Example from earlier
        const brokerData = profiles?.find(p => {
            if (!p.phone) return false;
            const cleanPhone = p.phone.replace(/\D/g, '');
            const last8Sender = senderNumber.slice(-8);
            const last8Profile = cleanPhone.slice(-8);
            return last8Sender === last8Profile;
        });
        
        console.log("Matched Broker:", brokerData);
    }
}

test();

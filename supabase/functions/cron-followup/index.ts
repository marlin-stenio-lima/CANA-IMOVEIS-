import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        console.log("Running Follow-up Cron...")

        // 0. Auto-Activate Inactive Leads (7 Days)
        // Find contacts updated > 7 days ago, with NO ai_status (or stopped)
        // We use updated_at as proxy for inactivity.
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: inactiveContacts, error: activationError } = await supabase
            .from('contacts')
            .select('id')
            .neq('ai_status', 'active')
            .lt('updated_at', sevenDaysAgo.toISOString())
            .limit(20);

        if (!activationError && inactiveContacts && inactiveContacts.length > 0) {
            console.log(`Auto-activating ${inactiveContacts.length} inactive contacts...`);
            const ids = inactiveContacts.map(c => c.id);

            // Activate them setting step to 0, next_follow_up_at = NOW
            // so they get processed in the next step immediately.
            await supabase
                .from('contacts')
                .update({
                    ai_status: 'active',
                    follow_up_step: 0,
                    next_follow_up_at: new Date().toISOString()
                })
                .in('id', ids);
        }

        // 1. Fetch Candidates for Execution
        // active, due for follow-up (lte Now), not yet finished (step < 7)
        // We handle Step 1 to 6. If step is 6, we stop.
        const { data: contacts, error } = await supabase
            .from('contacts')
            .select('id, company_id, assigned_to, conversation_id, phone, custom_fields, follow_up_step, interest_property_id')
            .in('ai_status', ['active', 'scheduled']) // Support both Active (Full) and Scheduled (Follow-up Only)
            .lte('next_follow_up_at', new Date().toISOString())
            .lt('follow_up_step', 7)
            .limit(50)

        if (error) throw error
        if (!contacts || contacts.length === 0) {
            return new Response(JSON.stringify({ message: 'No contacts to process' }), { headers: { 'Content-Type': 'application/json' } })
        }

        // 1b. Fetch Instance Settings to respect "Global AI Switch"
        // We need to know which instance handles which company to check "is_global_ai_active"
        const { data: instances } = await supabase
            .from('instances')
            .select('id, name, company_id, settings');

        const companyInstanceMap: Record<string, { name: string, active: boolean }> = {};

        if (instances) {
            instances.forEach(inst => {
                const settings = inst.settings || {};
                // We now explicitly check 'is_followup_active' instead of 'is_global_ai_active'
                // because the user requested that the Global AI Switch NOT affect automated follow-ups.
                const isActive = settings.is_followup_active !== false; // Default true
                // We map company_id to the FIRST instance found (assuming 1:1 for now or taking the first one)
                if (!companyInstanceMap[inst.company_id]) {
                    companyInstanceMap[inst.company_id] = {
                        name: inst.name,
                        active: isActive
                    };
                }
            });
        }

        console.log(`Processing ${contacts.length} contacts...`)

        const results = []

        for (const contact of contacts) {
            try {
                // Check Global AI Switch
                const instanceConfig = companyInstanceMap[contact.company_id];

                // If we found an instance config and it is explicitly inactive, skip
                if (instanceConfig && !instanceConfig.active) {
                    console.log(`Skipping contact ${contact.id} (Company ${contact.company_id}): Global AI is OFF.`);
                    results.push({ id: contact.id, status: 'skipped', reason: 'Global AI OFF' });
                    continue;
                }

                // 2. Trigger AI Agent
                // Use dynamic instance name if available, else fallback
                const instanceName = instanceConfig?.name || "Stenio";

                console.log(`Triggering AI Follow-up Step ${contact.follow_up_step + 1} for ${contact.id} via ${instanceName}`);

                const { data: agentRes, error: agentErr } = await supabase.functions.invoke('ai-agent', {
                    body: {
                        mode: 'follow_up',
                        contact_id: contact.id,
                        company_id: contact.company_id,
                        conversation_id: contact.conversation_id, // Might be null
                        instance_name: instanceName,
                        broker_id: contact.assigned_to
                    }
                })

                if (agentErr) {
                    console.error(`Result for ${contact.id}:`, agentErr);
                    // Don't stop loop, just log
                }

                // 3. Update Schedule
                const step = (contact.follow_up_step || 0) + 1; // Current step executed
                let nextRun = new Date();

                // Scheduling Rules (Hours to Add):
                // Step 1 Executed -> Schedule Step 2 (+48h)
                // Step 2 Executed -> Schedule Step 3 (+5 days = 7 days from start)
                // Step 3 Executed -> Schedule Step 4 (+7 days = 14 days from start)
                // Step 4 Executed -> Schedule Step 5 (+16 days = 30 days from start)
                // Step 5 Executed -> Schedule Step 6 (+15 days = 45 days from start)
                // Step 6 Executed -> Stop

                const hoursMap: Record<number, number> = {
                    1: 48,      // 48 hours
                    2: 120,     // 5 days
                    3: 168,     // 7 days
                    4: 384,     // 16 days
                    5: 360      // 15 days
                }

                const updatePayload: any = {
                    follow_up_step: step,
                    last_ai_message_at: new Date().toISOString()
                };

                if (step >= 6) {
                    // End of Cycle
                    updatePayload.ai_status = 'stopped';
                    updatePayload.next_follow_up_at = null;
                    console.log(`Contact ${contact.id} finished follow-up cycle.`);
                } else {
                    const hours = hoursMap[step] || 24;
                    nextRun.setHours(nextRun.getHours() + hours);
                    updatePayload.next_follow_up_at = nextRun.toISOString();
                    console.log(`Contact ${contact.id} scheduled for step ${step + 1} at ${nextRun.toISOString()}`);
                }

                await supabase.from('contacts').update(updatePayload).eq('id', contact.id)

                results.push({ id: contact.id, status: 'ok', step })
            } catch (err) {
                console.error(`Failed contact ${contact.id}:`, err)
                results.push({ id: contact.id, status: 'error', error: err.message })
            }
        }

        return new Response(JSON.stringify({ processed: results.length, details: results }), { headers: { 'Content-Type': 'application/json' } })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
})

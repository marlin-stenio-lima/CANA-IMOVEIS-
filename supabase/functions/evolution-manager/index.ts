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
        const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')!
        const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')!
        // We no longer rely on a single global instance name for everything

        const { action, instanceName, number } = await req.json()

        if (!instanceName) {
            throw new Error('Instance Name required')
        }

        const headers = {
            'apikey': evolutionKey,
            'Content-Type': 'application/json'
        }

        if (action === 'create') {
            const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
            const webhookUrl = `${supabaseUrl}/functions/v1/webhook-whatsapp`;

            // Prepare body, conditionally adding number if present
            const bodyPayload: any = {
                instanceName: instanceName,
                qrcode: true,
                integration: "WHATSAPP-BAILEYS",
                webhook: {
                    enabled: true,
                    url: webhookUrl,
                    byEvents: false,
                    events: ["MESSAGES_UPSERT", "MESSAGES_UPDATE", "SEND_MESSAGE"]
                }
            };

            if (number) {
                bodyPayload.number = number;
            }

            // Create instance with Webhook already configured
            const res = await fetch(`${evolutionUrl}/instance/create`, {
                method: 'POST',
                headers,
                body: JSON.stringify(bodyPayload)
            })

            if (!res.ok) {
                const errText = await res.text();
                console.error("Evolution Create Error:", res.status, errText);
                throw new Error(`Evolution API Error (${res.status}): ${errText}`);
            }
            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }


        if (action === 'status') {
            const res = await fetch(`${evolutionUrl}/instance/connectionState/${instanceName}`, { headers })
            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'connect') {
            const res = await fetch(`${evolutionUrl}/instance/connect/${instanceName}`, { headers })

            if (!res.ok) {
                const errText = await res.text();
                // If it's 403, it's likely "Forbidden", which means we should log it clearly
                console.error("Evolution Connect Error:", res.status, errText);
                throw new Error(`Evolution API Connect Error (${res.status}): ${errText}`);
            }

            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // Fetch user info (picture/number)
        if (action === 'info') {
            const res = await fetch(`${evolutionUrl}/chat/fetchProfilePictureUrl/${instanceName}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ number: instanceName }) // Often needs just instance context, but let's try
            })
            // Evolution v2 might vary on this endpoint, basic status is enough for now
        }

        if (action === 'delete') {
            const res = await fetch(`${evolutionUrl}/instance/delete/${instanceName}`, {
                method: 'DELETE',
                headers
            })
            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        throw new Error('Invalid action')

    } catch (error) {
        console.error('Manager Error:', error)
        return new Response(
            JSON.stringify({
                error: error.message,
                details: error.stack
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

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
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (!RESEND_API_KEY) {
            throw new Error('Missing RESEND_API_KEY')
        }

        const payload = await req.json()
        
        let apiEndpoint = 'https://api.resend.com/emails';
        let apiBody;

        if (Array.isArray(payload)) {
            apiEndpoint = 'https://api.resend.com/emails/batch';
            apiBody = payload.map(p => ({
                from: p.from || 'onboarding@resend.dev',
                to: Array.isArray(p.to) ? p.to : [p.to],
                subject: p.subject || 'Mensagem do CRM',
                html: p.html || '<p>Mensagem em branco.</p>',
                reply_to: p.reply_to || undefined
            }));
        } else {
            apiBody = {
                from: payload.from || 'onboarding@resend.dev',
                to: Array.isArray(payload.to) ? payload.to : [payload.to],
                subject: payload.subject || 'Mensagem do CRM',
                html: payload.html || '<p>Mensagem em branco.</p>',
                reply_to: payload.reply_to || undefined
            };
        }

        const res = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify(apiBody)
        })

        const data = await res.json()

        if (res.ok) {
            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        } else {
            return new Response(JSON.stringify({ error: data }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

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

        const body = await req.json()
        const { action, instanceName, text, number, mediaUrl, mediaType, email, userId } = body

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
                body: JSON.stringify({ number: instanceName })
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

        if (action === 'send-text') {
            const { text } = body;

            if (!text || !number) {
                throw new Error('Text and Number are required for send-text');
            }

            const res = await fetch(`${evolutionUrl}/message/sendText/${instanceName}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    number: number,
                    text: text,
                    delay: 1200
                })
            })

            if (!res.ok) {
                const errText = await res.text();
                console.error("Evolution Send Error:", res.status, errText);
                throw new Error(`Evolution API Send Error (${res.status}): ${errText}`);
            }

            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'send-media') {
            const { instanceName, number, mediaUrl, mediaType, caption } = body
            if (!instanceName || !number || !mediaUrl || !mediaType) {
                return new Response('Missing parameters', { status: 400 })
            }

            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

            const response = await fetch(`${evolutionUrl}/message/sendMedia/${instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': evolutionKey!
                },
                body: JSON.stringify({
                    number,
                    media: mediaUrl,
                    mediatype: mediaType, // image, video, document
                    caption: caption || ''
                })
            })

            const data = await response.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'send-audio') {
            const { instanceName, number, audioUrl } = body
            if (!instanceName || !number || !audioUrl) {
                return new Response('Missing parameters', { status: 400 })
            }

            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

            const response = await fetch(`${evolutionUrl}/message/sendWhatsAppAudio/${instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': evolutionKey!
                },
                body: JSON.stringify({
                    number,
                    audio: audioUrl
                })
            })

            const data = await response.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'setup-storage') {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
            const adminSupabase = createClient(supabaseUrl!, supabaseKey!)

            // 1. Create Bucket
            const { data: bucket, error: bucketError } = await adminSupabase
                .storage
                .createBucket('chat-media', {
                    public: true,
                    fileSizeLimit: 20971520, // 20MB
                    allowedMimeTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf']
                });

            let message = 'Bucket chat-media checked/created';

            if (bucketError) {
                if (bucketError.message.includes('already exists')) {
                    message = 'Bucket chat-media already exists';
                } else {
                    return new Response(JSON.stringify({ error: bucketError }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
                }
            }

            return new Response(JSON.stringify({ message, bucket }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }



        if (action === 'debug-config') {
            // Check webhook config for instance
            const res = await fetch(`${evolutionUrl}/webhook/find/${instanceName}`, { headers });

            // If that fails (v2 vs v1), try instance fetch
            if (!res.ok) {
                const res2 = await fetch(`${evolutionUrl}/instance/fetchInstances`, { headers });
                const data2 = await res2.json();
                return new Response(JSON.stringify({ method: 'fetchInstances', data: data2 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }

            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'check-webhook') {
            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

            // Fetch specific instance config
            // Endpoint: /webhook/find/:instanceName
            const res = await fetch(`${evolutionUrl}/webhook/find/${instanceName}`, {
                headers: {
                    'apikey': evolutionKey!,
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'set-webhook') {
            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')
            const { webhookUrl } = body; // Read from already parsed body

            console.log(`Setting webhook for ${instanceName} to ${webhookUrl}`);

            const res = await fetch(`${evolutionUrl}/webhook/set/${instanceName}`, {
                method: 'POST',
                headers: {
                    'apikey': evolutionKey!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "webhook": {
                        "enabled": true,
                        "url": webhookUrl,
                        "webhookByEvents": true,
                        "events": [
                            "MESSAGES_UPSERT",
                            "MESSAGES_UPDATE",
                            "SEND_MESSAGE",
                            "CONTACTS_UPSERT",
                            "CONTACTS_UPDATE",
                            "PRESENCE_UPDATE",
                            "CHATS_UPSERT",
                            "CHATS_UPDATE"
                        ]
                    }
                })
            })

            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'restart-instance') {
            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

            console.log(`Restarting instance ${instanceName}...`);

            const res = await fetch(`${evolutionUrl}/instance/restart/${instanceName}`, {
                method: 'POST',
                headers: {
                    'apikey': evolutionKey!,
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'send-media') {
            // Payload: { instanceName, number, mediaType, mimetype, caption, mediaUrl }
            const { instanceName, number, mediaType, mimetype, caption, mediaUrl } = body;
            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

            console.log(`Sending media (${mediaType}) to ${number} via ${instanceName}...`);

            const res = await fetch(`${evolutionUrl}/message/send/media/${instanceName}`, {
                method: 'POST',
                headers: {
                    'apikey': evolutionKey!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number,
                    mediatype: mediaType, // image, document, video
                    mimetype,
                    caption,
                    media: mediaUrl
                })
            })

            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'send-audio') {
            // Payload: { instanceName, number, mediaUrl }
            const { instanceName, number, mediaUrl } = body;
            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

            console.log(`Sending audio to ${number} via ${instanceName}...`);

            const res = await fetch(`${evolutionUrl}/message/send/whatsappAudio/${instanceName}`, {
                method: 'POST',
                headers: {
                    'apikey': evolutionKey!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number,
                    media: mediaUrl
                })
            })

            const data = await res.json()
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }





        if (action === 'debug-db') {
            const table = body.table || 'webhook_logs';
            const limit = body.limit || 10;

            const supabaseUrl = Deno.env.get('SUPABASE_URL')
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
            const adminSupabase = createClient(supabaseUrl!, supabaseKey!)

            const { data, error } = await adminSupabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                return new Response(JSON.stringify({ error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }

            return new Response(JSON.stringify({ data }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        throw new Error('Invalid action')

    } catch (error) {
        console.error('Manager Error:', error)

        // Log to database for debugging
        try {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
            if (supabaseUrl && supabaseKey) {
                const adminSupabase = createClient(supabaseUrl, supabaseKey)
                await adminSupabase.from('webhook_logs').insert({
                    payload: {
                        source: 'evolution-manager-error',
                        error: error.message,
                        stack: error.stack,
                        timestamp: new Date().toISOString()
                    }
                })
            }
        } catch (logErr) {
            console.error("Failed to log error to DB:", logErr)
        }

        return new Response(
            JSON.stringify({
                error: error.message,
                details: error.stack
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

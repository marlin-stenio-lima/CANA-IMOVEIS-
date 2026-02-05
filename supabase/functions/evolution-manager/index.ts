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

        if (!instanceName && action !== 'debug-db' && action !== 'setup-storage') {
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
            const wamid = data?.key?.id || data?.id

            if (wamid) {
                const supabaseUrl = Deno.env.get('SUPABASE_URL')
                const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
                const adminSupabase = createClient(supabaseUrl!, supabaseKey!)

                // Resolve Instance ID and Contact ID
                const { data: instanceData } = await adminSupabase.from('instances').select('id, company_id').eq('name', instanceName).single()

                if (instanceData) {
                    let remoteJid = number.includes('@') ? number : `${number}@s.whatsapp.net`
                    if (instanceData) {
                        let remoteJid = number.includes('@') ? number : `${number}@s.whatsapp.net`

                        // 1. Ensure Contact Exists
                        const { data: contact } = await adminSupabase.from('contacts').select('id, name').eq('remote_jid', remoteJid).single()
                        let contactId = contact?.id

                        if (!contactId) {
                            console.log(`Contact not found for ${remoteJid}, creating...`);
                            const { data: newContact, error: createContactError } = await adminSupabase.from('contacts').insert({
                                remote_jid: remoteJid,
                                name: number, // Default name is number until we get info
                                company_id: instanceData.company_id,
                                profile_pic_url: null,
                                updated_at: new Date().toISOString()
                            }).select().single();

                            if (newContact) {
                                contactId = newContact.id;
                            } else {
                                console.error("Failed to create contact on send:", createContactError);
                            }
                        }

                        if (contactId) {
                            // 2. Ensure Conversation Exists
                            const { data: existingConv } = await adminSupabase.from('conversations')
                                .select('id, unread_count').eq('contact_id', contactId).eq('instance_id', instanceData.id).single()

                            let conversationId = existingConv?.id
                            if (!conversationId) {
                                const { data: newConv } = await adminSupabase.from('conversations').insert({
                                    company_id: instanceData.company_id,
                                    contact_id: contactId,
                                    instance_id: instanceData.id,
                                    channel: 'whatsapp',
                                    last_message: text,
                                    last_message_at: new Date().toISOString(),
                                    unread_count: 0
                                }).select().single();
                                conversationId = newConv?.id;
                            }

                            if (conversationId) {
                                // 3. Upsert Message
                                await adminSupabase.from('messages').upsert({
                                    wamid: wamid,
                                    conversation_id: conversationId,
                                    instance_id: instanceData.id,
                                    contact_id: contactId,
                                    remote_jid: remoteJid,
                                    content: text,
                                    message_type: 'text',
                                    direction: 'outbound',
                                    status: 'sent',
                                    sender_type: 'user',
                                    created_at: new Date().toISOString()
                                }, { onConflict: 'wamid' })

                                await adminSupabase.from('conversations').update({
                                    last_message: text,
                                    last_message_at: new Date().toISOString()
                                }).eq('id', conversationId)
                            }
                        } else {
                            console.error("Could not resolve contact ID, message will rely on webhook to be saved.");
                        }
                    }
                }
            }

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
            const { instanceName, number, mediaType, mimetype, caption, mediaUrl, mediaBase64 } = body;
            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

            console.log(`Sending media (${mediaType}) to ${number} via ${instanceName} (V1 API)...`);

            // V1 Logic: Prefer URL since S3 is configured, fallback to Base64
            let mediaPayload = mediaUrl || mediaBase64;

            // Only strip prefix if we are actually using Base64
            if (!mediaUrl && mediaPayload && mediaPayload.startsWith('data:')) {
                mediaPayload = mediaPayload.split(',')[1];
            }

            // V1 Endpoint: /message/sendMedia/{instance}
            const res = await fetch(`${evolutionUrl}/message/sendMedia/${instanceName}`, {
                method: 'POST',
                headers: {
                    'apikey': evolutionKey!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number,
                    mediatype: mediaType === 'document' ? 'document' : 'image',
                    mimetype: mimetype || 'image/jpeg',
                    media: mediaPayload,
                    caption: caption || ""
                })
            })

            const data = await res.json()

            // --- PERSISTENCE LOGIC START ---
            const wamid = data?.key?.id || data?.id

            if (wamid) {
                const supabaseUrl = Deno.env.get('SUPABASE_URL')
                const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
                const adminSupabase = createClient(supabaseUrl!, supabaseKey!)

                // Resolve Instance ID
                const { data: instanceData } = await adminSupabase.from('instances').select('id, company_id').eq('name', instanceName).single()

                if (instanceData) {
                    let remoteJid = number.includes('@') ? number : `${number}@s.whatsapp.net`

                    // 1. Ensure Contact
                    const { data: contact } = await adminSupabase.from('contacts')
                        .select('id')
                        .or(`remote_jid.eq.${remoteJid},phone.eq.${number}`)
                        .maybeSingle();

                    let contactId = contact?.id;
                    if (!contactId && instanceData.company_id) {
                        const { data: newContact } = await adminSupabase.from('contacts').insert({
                            remote_jid: remoteJid,
                            name: number,
                            phone: number,
                            company_id: instanceData.company_id,
                            updated_at: new Date().toISOString()
                        }).select('id').single();
                        contactId = newContact?.id;
                    }

                    if (contactId) {
                        // 2. Ensure Conversation
                        const { data: existingConv } = await adminSupabase.from('conversations')
                            .select('id').eq('contact_id', contactId).eq('instance_id', instanceData.id).maybeSingle()

                        let conversationId = existingConv?.id
                        if (!conversationId) {
                            const { data: newConv } = await adminSupabase.from('conversations').insert({
                                company_id: instanceData.company_id,
                                contact_id: contactId,
                                instance_id: instanceData.id,
                                channel: 'whatsapp',
                                last_message: mediaType === 'image' ? 'Imagem' : 'Arquivo',
                                last_message_at: new Date().toISOString(),
                                unread_count: 0
                            }).select('id').single();
                            conversationId = newConv?.id;
                        }

                        if (conversationId) {
                            // 3. Insert Message
                            await adminSupabase.from('messages').upsert({
                                wamid: wamid,
                                conversation_id: conversationId,
                                instance_id: instanceData.id,
                                contact_id: contactId,
                                remote_jid: remoteJid,
                                content: caption || (mediaType === 'image' ? 'Imagem' : 'Arquivo'),
                                message_type: mediaType === 'document' ? 'document' : mediaType,
                                direction: 'outbound',
                                status: 'sent',
                                sender_type: 'user',
                                media_url: mediaUrl,
                                created_at: new Date().toISOString()
                            }, { onConflict: 'wamid' })

                            await adminSupabase.from('conversations').update({
                                last_message: mediaType === 'image' ? 'Imagem' : 'Arquivo',
                                last_message_at: new Date().toISOString()
                            }).eq('id', conversationId)
                        }
                    }
                }
            }
            // --- PERSISTENCE LOGIC END ---

            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'send-audio') {
            // Payload: { instanceName, number, mediaUrl, mediaBase64 }
            const { instanceName, number, mediaUrl, mediaBase64 } = body;
            const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
            const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

            console.log(`Sending audio to ${number} via ${instanceName} (V1 API)...`);

            // V1 Logic for Audio: Prefer URL, fallback to Base64
            let audioPayload = mediaUrl || mediaBase64;

            // Strip prefix only if using Base64
            if (!mediaUrl && audioPayload && audioPayload.startsWith('data:')) {
                audioPayload = audioPayload.split(',')[1];
            }

            const res = await fetch(`${evolutionUrl}/message/sendWhatsAppAudio/${instanceName}`, {
                method: 'POST',
                headers: {
                    'apikey': evolutionKey!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number,
                    audio: audioPayload // V1 expects 'audio' field (raw base64)
                })
            })

            const data = await res.json()

            // --- PERSISTENCE LOGIC START ---
            const wamid = data?.key?.id || data?.id

            if (wamid) {
                const supabaseUrl = Deno.env.get('SUPABASE_URL')
                const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
                const adminSupabase = createClient(supabaseUrl!, supabaseKey!)

                // Resolve Instance ID
                const { data: instanceData } = await adminSupabase.from('instances').select('id, company_id').eq('name', instanceName).single()

                if (instanceData) {
                    let remoteJid = number.includes('@') ? number : `${number}@s.whatsapp.net`

                    // 1. Ensure Contact
                    const { data: contact } = await adminSupabase.from('contacts')
                        .select('id')
                        .or(`remote_jid.eq.${remoteJid},phone.eq.${number}`)
                        .maybeSingle();

                    let contactId = contact?.id;
                    if (!contactId && instanceData.company_id) {
                        const { data: newContact } = await adminSupabase.from('contacts').insert({
                            remote_jid: remoteJid,
                            name: number,
                            phone: number,
                            company_id: instanceData.company_id,
                            updated_at: new Date().toISOString()
                        }).select('id').single();
                        contactId = newContact?.id;
                    }

                    if (contactId) {
                        // 2. Ensure Conversation
                        const { data: existingConv } = await adminSupabase.from('conversations')
                            .select('id').eq('contact_id', contactId).eq('instance_id', instanceData.id).maybeSingle()

                        let conversationId = existingConv?.id
                        if (!conversationId) {
                            const { data: newConv } = await adminSupabase.from('conversations').insert({
                                company_id: instanceData.company_id,
                                contact_id: contactId,
                                instance_id: instanceData.id,
                                channel: 'whatsapp',
                                last_message: 'Áudio',
                                last_message_at: new Date().toISOString(),
                                unread_count: 0
                            }).select('id').single();
                            conversationId = newConv?.id;
                        }

                        if (conversationId) {
                            // 3. Insert Message
                            await adminSupabase.from('messages').upsert({
                                wamid: wamid,
                                conversation_id: conversationId,
                                instance_id: instanceData.id,
                                contact_id: contactId,
                                remote_jid: remoteJid,
                                content: 'Áudio',
                                message_type: 'audio',
                                direction: 'outbound',
                                status: 'sent',
                                sender_type: 'user',
                                media_url: mediaUrl,
                                created_at: new Date().toISOString()
                            }, { onConflict: 'wamid' })

                            await adminSupabase.from('conversations').update({
                                last_message: 'Áudio',
                                last_message_at: new Date().toISOString()
                            }).eq('id', conversationId)
                        }
                    }
                }
            }
            // --- PERSISTENCE LOGIC END ---

            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }





        if (action === 'debug-db') {
            const table = body.table || 'webhook_logs';
            const limit = body.limit || 10;
            const filter = body.filter; // Optional filter string

            const supabaseUrl = Deno.env.get('SUPABASE_URL')
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
            const adminSupabase = createClient(supabaseUrl!, supabaseKey!)

            const filterColumn = body.filterColumn;

            let query = adminSupabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (filter && filterColumn) {
                query = query.ilike(filterColumn, `%${filter}%`);
            } else if (filter) {
                // Fallback for legacy calls (assuming webhook_logs)
                query = query.ilike('payload->>event', `%${filter}%`);
            }

            const { data, error } = await query;

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

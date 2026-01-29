const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateInboundMedia() {
    console.log("Simulating Inbound Media Webhook...");

    const payload = {
        event: "messages.upsert",
        instance: "vendas",
        data: {
            key: {
                remoteJid: "5511999999999@s.whatsapp.net",
                fromMe: false,
                id: "TEST_MEDIA_ID_" + Date.now()
            },
            pushName: "Test User",
            message: {
                imageMessage: {
                    url: "https://httpbin.org/image/png", // We use a public URL we can fetch
                    mimetype: "image/png",
                    caption: "Incoming Image Test"
                }
            }
        },
        sender: "5511999999999@s.whatsapp.net"
    };

    const { data, error } = await supabase.functions.invoke('webhook-whatsapp', {
        body: payload
    });

    if (error) {
        console.error("Function Error:", error);
    } else {
        console.log("Result:", data);
    }
}

simulateInboundMedia();

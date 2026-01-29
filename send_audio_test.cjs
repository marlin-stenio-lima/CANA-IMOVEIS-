const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSendAudio() {
    console.log("Testing Send Audio...");

    const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: {
            action: 'send-audio',
            instanceName: 'vendas',
            number: '5519991213192', // Target number
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Dummy audio
        }
    });

    if (error) {
        console.error("Function Error:", error);
    } else {
        console.log("Result:", JSON.stringify(data, null, 2));
    }
}

testSendAudio();

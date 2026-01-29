const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahvaqriovmsxixgilkxa.supabase.co';
// Using the ANON key from the frontend code (visible in setup_storage_trigger.cjs, assuming it's the anon one)
// Wait, the key I used before was:
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodmFxcmlvdm1zeGl4Z2lsa3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzIyOTcsImV4cCI6MjA4MTUwODI5N30.c9UVEqZ2s_FoHa35cs3D8xfLJjEIQbERLqh2lryphpE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
    console.log("Testing Upload with Anon Key...");

    // Create a dummy file
    const fileName = `test_upload_${Date.now()}.png`;

    // Create a dummy PNG blob (header only)
    const fileContent = Buffer.from('89504E470D0A1A0A', 'hex');

    // NOTE: In a real app, user is logged in. Here we are anon.
    // If bucket is public, usually only READ is public. WRITE usually requires auth.
    // We can try to upload.

    const { data, error } = await supabase.storage
        .from('chat-media')
        .upload(fileName, fileContent, {
            contentType: 'image/png'
        });

    if (error) {
        console.error("Upload Error:", error);
    } else {
        console.log("Upload Success:", data);
        // Cleanup
        // await supabase.storage.from('chat-media').remove([fileName]);
    }
}

testUpload();

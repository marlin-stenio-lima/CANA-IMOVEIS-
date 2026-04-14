async function checkPublicUrl() {
    const url = "https://uscfxlmtqzqifizunyoz.supabase.co/storage/v1/object/public/chat-media/6cb4ac8c-c61f-44f7-b911-8e6a75326c4f/1775845565028_1xwiaa.jpg";
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    console.log(`OK: ${res.ok}`);
}
checkPublicUrl();

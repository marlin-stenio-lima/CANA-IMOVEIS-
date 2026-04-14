async function checkPublicUrl() {
    const url = "https://uscfxlmtqzqifizunyoz.supabase.co/storage/v1/object/public/chat-media/6cb4ac8c-c61f-44f7-b911-8e6a75326c4f/1775843093354_0kgmx6.jpg";
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    console.log(`OK: ${res.ok}`);
}
checkPublicUrl();

SELECT 
    id, 
    created_at, 
    message_type, 
    status, 
    content, 
    media_url, 
    wamid, 
    remote_jid 
FROM messages 
ORDER BY created_at DESC 
LIMIT 5;

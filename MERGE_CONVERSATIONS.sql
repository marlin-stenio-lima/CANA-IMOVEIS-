-- MERGE DUPLICATE CONVERSATIONS
-- This script fixes the issue where a contact has multiple conversation rows (causing duplicates in the UI)

-- 1. Create temp table to identify duplicate conversations per contact
CREATE TEMP TABLE IF NOT EXISTS duplicate_convs AS
SELECT 
    contact_id,
    MIN(id) as master_conversation_id -- Keep the oldest conversation
FROM conversations
GROUP BY contact_id
HAVING COUNT(*) > 1;

-- 2. Move Messages inside the Duplicate Conversations to the Master Conversation
UPDATE messages
SET conversation_id = dc.master_conversation_id
FROM conversations c
JOIN duplicate_convs dc ON c.contact_id = dc.contact_id
WHERE messages.conversation_id = c.id
AND c.id != dc.master_conversation_id;

-- 3. Delete the Duplicate Conversations
DELETE FROM conversations
USING duplicate_convs dc
WHERE conversations.contact_id = dc.contact_id
AND conversations.id != dc.master_conversation_id;

-- 4. Clean up
DROP TABLE IF EXISTS duplicate_convs;

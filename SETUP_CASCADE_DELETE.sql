-- Ensure deleting a conversation deletes all associated messages
-- 1. Drop the existing foreign key constraint (the name might vary, trying standard naming)
alter table messages
drop constraint if exists messages_conversation_id_fkey;

-- 2. Add the constraint back with ON DELETE CASCADE
alter table messages
add constraint messages_conversation_id_fkey
foreign key (conversation_id)
references conversations(id)
on delete cascade;

-- Optional: Do the same for other related tables if they exist (e.g. notes/tags linked to conversation)

-- Clean up duplicate conversations and enforce integrity
-- 1. Identify and merge duplicates (keeping the most recent one)
WITH duplicates AS (
    SELECT contact_id, instance_id, array_agg(id ORDER BY last_message_at DESC) as ids
    FROM conversations
    GROUP BY contact_id, instance_id
    HAVING count(*) > 1
)
UPDATE messages m
SET conversation_id = d.ids[1]
FROM duplicates d
WHERE m.conversation_id = ANY(d.ids)
AND m.conversation_id != d.ids[1];

-- Delete the now-empty duplicate conversations
DELETE FROM conversations
WHERE id IN (
    SELECT id FROM (
        SELECT id, row_number() OVER (PARTITION BY contact_id, instance_id ORDER BY last_message_at DESC) as rn
        FROM conversations
    ) t
    WHERE t.rn > 1
);

-- 2. Add Unique Constraint to prevent future duplicates
-- This is the most important step for data integrity
ALTER TABLE conversations ADD CONSTRAINT unique_contact_instance UNIQUE (contact_id, instance_id);

-- 3. Fix messages table RLS (allow public read for now to solve visibility issue)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.messages;
CREATE POLICY "Enable public read access for messages" ON public.messages FOR SELECT TO public USING (true);
CREATE POLICY "Enable public insert access for messages" ON public.messages FOR INSERT TO public WITH CHECK (true);

-- 4. Fix conversations table RLS
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.conversations;
CREATE POLICY "Enable public read access for conversations" ON public.conversations FOR SELECT TO public USING (true);
CREATE POLICY "Enable public update access for conversations" ON public.conversations FOR UPDATE TO public USING (true);

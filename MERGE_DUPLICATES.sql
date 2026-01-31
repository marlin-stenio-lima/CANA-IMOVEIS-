-- 1. Cria tabela temporária para identificar quem está duplicado
-- Usamos array_agg para pegar o ID mais antigo (baseado em created_at)
CREATE TEMP TABLE IF NOT EXISTS duplicate_groups AS
SELECT 
    phone,
    (array_agg(id ORDER BY created_at ASC))[1] as master_id
FROM contacts
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone
HAVING COUNT(*) > 1;

-- 2. Move as conversas para o contato oficial
UPDATE conversations
SET contact_id = dg.master_id
FROM contacts c
JOIN duplicate_groups dg ON c.phone = dg.phone
WHERE conversations.contact_id = c.id
AND c.id != dg.master_id;

-- 3. Move as mensagens para o contato oficial
UPDATE messages
SET contact_id = dg.master_id
FROM contacts c
JOIN duplicate_groups dg ON c.phone = dg.phone
WHERE messages.contact_id = c.id
AND c.id != dg.master_id;

-- 4. Move as property_inquiries para o contato oficial (CORREÇÃO DE FK)
UPDATE property_inquiries
SET contact_id = dg.master_id
FROM contacts c
JOIN duplicate_groups dg ON c.phone = dg.phone
WHERE property_inquiries.contact_id = c.id
AND c.id != dg.master_id;

-- 5. Apaga os contatos duplicados sobressalentes
DELETE FROM contacts
USING duplicate_groups dg
WHERE contacts.phone = dg.phone
AND contacts.id != dg.master_id;

-- 6. Limpa a tabela temporária
DROP TABLE IF EXISTS duplicate_groups;

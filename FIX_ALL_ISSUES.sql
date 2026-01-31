-- ==========================================
-- SCRIPT DE CORREÇÃO GERAL (FIX ALL)
-- 1. Unifica Conversas Duplicadas
-- 2. Corrige Permissões de Envio de Arquivos
-- ==========================================

BEGIN;

-- ---------------------------------------------------------
-- PARTE 1: UNIFICAR CONVERSAS (Corrige os múltiplos chats)
-- ---------------------------------------------------------
CREATE TEMP TABLE IF NOT EXISTS duplicate_convs AS
SELECT 
    contact_id,
    (array_agg(id ORDER BY last_message_at DESC))[1] as master_id -- Mantém a conversa mais recente/ativa
FROM conversations
GROUP BY contact_id
HAVING COUNT(*) > 1;

-- Move mensagens das conversas antigas para a principal
UPDATE messages
SET conversation_id = dc.master_id
FROM conversations c
JOIN duplicate_convs dc ON c.contact_id = dc.contact_id
WHERE messages.conversation_id = c.id
AND c.id != dc.master_id;

-- Apaga as conversas vazias duplicadas
DELETE FROM conversations
USING duplicate_convs dc
WHERE conversations.contact_id = dc.contact_id
AND conversations.id != dc.master_id;

DROP TABLE IF EXISTS duplicate_convs;

-- ---------------------------------------------------------
-- PARTE 2: CORRIGIR ENVIO DE MÍDIA (Permissões de Storage)
-- ---------------------------------------------------------
-- Garante que o balde 'chat-media' existe e é público
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-media', 'chat-media', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove políticas antigas (para evitar conflitos)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Read chat-media" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload chat-media" ON storage.objects;

-- Cria política: Qualquer um pode VER os arquivos (necessário para o WhatsApp baixar)
CREATE POLICY "Public Read chat-media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'chat-media');

-- Cria política: Usuários logados podem FAZER UPLOAD
CREATE POLICY "Auth Upload chat-media" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'chat-media');

-- Cria política: Usuários logados podem atualizar/deletar (opcional)
CREATE POLICY "Auth Manage chat-media"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'chat-media');

COMMIT;

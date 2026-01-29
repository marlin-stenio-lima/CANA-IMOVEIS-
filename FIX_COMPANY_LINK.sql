-- CORREÇÃO FINAL DE VÍNCULO DE EMPRESA
-- O usuário 'MARLON' pertence à empresa '863d1959-fe72-4e1c-b84f-546bfa5e7ca3' (Imperio Multi Marcas)
-- A instância 'vendas' foi criada na empresa provisória 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0' (Empresa Padrão)

-- 1. Mover a Instância para a empresa correta
UPDATE public.instances
SET company_id = '863d1959-fe72-4e1c-b84f-546bfa5e7ca3'
WHERE name = 'vendas';

-- 2. Mover Contatos órfãos (criados na empresa padrão) para a empresa correta
UPDATE public.contacts
SET company_id = '863d1959-fe72-4e1c-b84f-546bfa5e7ca3'
WHERE company_id = 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0';

-- 3. Mover Conversas órfãs para a empresa correta
UPDATE public.conversations
SET company_id = '863d1959-fe72-4e1c-b84f-546bfa5e7ca3'
WHERE company_id = 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0';

-- Mensagens não têm company_id direto (usam conversation_id), então ao migrar a conversa, as mensagens aparecem.

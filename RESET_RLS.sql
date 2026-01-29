-- RESET TOTAL DE PERMISSÕES DE SEGURANÇA (RLS)
-- Este script remove todas as regras conflitantes antigas e libera o acesso para o usuário logado.

-- 1. INSTANCES (Instâncias do WhatsApp)
ALTER TABLE public.instances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.instances;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.instances;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.instances;
-- Remove policies from core_crm_setup if any (generic)
-- Create fresh permissive policy
CREATE POLICY "Allow All Authenticated - Instances" ON public.instances FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 2. CONTACTS (Contatos)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
-- Remove policies from SETUP_CHAT_DB.sql
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.contacts;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.contacts;
-- Remove policies from core_crm_setup.sql (The restrictive ones)
DROP POLICY IF EXISTS "Agents view assigned contacts" ON public.contacts;
DROP POLICY IF EXISTS "Agents update assigned contacts" ON public.contacts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.contacts;
-- Create fresh permissive policy
CREATE POLICY "Allow All Authenticated - Contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 3. CONVERSATIONS (Conversas)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.conversations;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.conversations;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.conversations;
DROP POLICY IF EXISTS "View conversations" ON public.conversations; -- From core_crm
-- Create fresh permissive policy
CREATE POLICY "Allow All Authenticated - Conversations" ON public.conversations FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 4. MESSAGES (Mensagens)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.messages;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.messages;
DROP POLICY IF EXISTS "View messages" ON public.messages; -- From core_crm
-- Create fresh permissive policy
CREATE POLICY "Allow All Authenticated - Messages" ON public.messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

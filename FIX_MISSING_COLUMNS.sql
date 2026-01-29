-- Adiciona colunas faltantes na tabela contacts
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS profile_pic_url text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS company_id uuid;

-- Garante que RLS está habilitado
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Garante policies básicas
DROP POLICY IF EXISTS "permitir_tudo_contacts" ON public.contacts;
CREATE POLICY "permitir_tudo_contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Notifica o PostgREST para recarregar o cache de schema
NOTIFY pgrst, 'reload config';

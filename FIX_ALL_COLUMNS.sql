-- Garante TODAS as colunas necessárias na tabela contacts
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS remote_jid text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS profile_pic_url text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS company_id uuid;

-- Garante constraint UNIQUE em remote_jid (evita duplicatas e erro no upsert)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contacts_remote_jid_key') THEN
        ALTER TABLE public.contacts ADD CONSTRAINT contacts_remote_jid_key UNIQUE (remote_jid);
    END IF;
END $$;

-- Garante que RLS está habilitado
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Garante policies
DROP POLICY IF EXISTS "permitir_tudo_contacts" ON public.contacts;
CREATE POLICY "permitir_tudo_contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Notifica PostgREST
NOTIFY pgrst, 'reload config';

-- 1. Garante colunas (slug pode já existir, mas garantimos os outros)
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS plan text DEFAULT 'pro';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS slug text; -- Caso não exista

-- 2. Habilita RLS e permissões (Segurança)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "permitir_tudo_companies" ON public.companies;
CREATE POLICY "permitir_tudo_companies" ON public.companies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Insere a empresa padrão (AGORA COM SLUG)
INSERT INTO public.companies (id, name, document, status, plan, slug)
VALUES (
    'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 
    'Empresa Padrão', 
    '00000000000', 
    'active', 
    'pro', 
    'empresa-padrao' -- Slug obrigatório
)
ON CONFLICT (id) DO NOTHING;

-- 4. Atualiza instância
UPDATE public.instances SET company_id = 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0' WHERE name = 'vendas';

NOTIFY pgrst, 'reload config';

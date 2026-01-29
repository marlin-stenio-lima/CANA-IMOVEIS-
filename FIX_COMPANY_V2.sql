-- 1. Garante estrutura da tabela companies
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    document text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Adiciona colunas status e plan se não existirem
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS plan text DEFAULT 'pro';

-- 2. Habilita RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 3. Cria policy permissiva para evitar erros de RLS
DROP POLICY IF EXISTS "permitir_tudo_companies" ON public.companies;
CREATE POLICY "permitir_tudo_companies" ON public.companies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Insere a empresa padrão
INSERT INTO public.companies (id, name, document, status, plan, created_at, updated_at)
VALUES (
  'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 
  'Empresa Padrão', 
  '00000000000', 
  'active', 
  'pro', 
  NOW(), 
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET name = 'Empresa Padrão', updated_at = NOW();

-- 5. Atualiza a instância 'vendas'
UPDATE public.instances 
SET company_id = 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0'
WHERE name = 'vendas';

NOTIFY pgrst, 'reload config';

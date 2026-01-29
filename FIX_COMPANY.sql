-- 1. Cria uma empresa padrão se não existir (evita conflito)
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
ON CONFLICT (id) DO NOTHING;

-- 2. Atualiza a instância 'vendas' para usar essa empresa válida
UPDATE public.instances 
SET company_id = 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0'
WHERE name = 'vendas';

-- 3. Verifica o resultado
SELECT name, company_id FROM public.instances WHERE name = 'vendas';

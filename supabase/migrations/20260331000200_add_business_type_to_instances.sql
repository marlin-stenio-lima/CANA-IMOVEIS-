-- Adiciona a coluna business_type à tabela de instâncias
ALTER TABLE public.instances ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'imoveis';

-- Garante que todas as instâncias atuais sejam marcadas como 'imoveis'
UPDATE public.instances SET business_type = 'imoveis' WHERE business_type IS NULL;

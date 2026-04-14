-- Adiciona a coluna business_type à tabela de pipelines
ALTER TABLE public.pipelines ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'imoveis';

-- Garante que todos os pipelines atuais sejam marcados como 'imoveis'
UPDATE public.pipelines SET business_type = 'imoveis' WHERE business_type IS NULL;

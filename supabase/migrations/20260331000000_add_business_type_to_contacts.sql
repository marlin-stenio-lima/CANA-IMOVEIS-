-- Adicionar a coluna business_type à tabela de contatos
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'imoveis';

-- Garantir que contatos existentes tenham um valor (já incluído no DEFAULT acima, mas reforçando)
UPDATE public.contacts SET business_type = 'imoveis' WHERE business_type IS NULL;

-- (Opcional) Criar um índice para melhorar as consultas por tipo de negócio
CREATE INDEX IF NOT EXISTS contacts_business_type_idx ON public.contacts (business_type);

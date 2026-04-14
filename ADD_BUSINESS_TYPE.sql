-- Script para adicionar a categoria de negócio (Imóveis/Barcos) às instâncias de WhatsApp
ALTER TABLE public.instances ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'imoveis';

-- Opcional: Atualizar instâncias existentes se necessário
-- UPDATE public.instances SET business_type = 'imoveis' WHERE business_type IS NULL;

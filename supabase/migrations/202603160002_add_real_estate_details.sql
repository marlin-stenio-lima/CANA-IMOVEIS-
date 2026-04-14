-- Add essential real estate fields for portal integration
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS condo_fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS iptu NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS year_built INTEGER,
ADD COLUMN IF NOT EXISTS internal_id TEXT;

-- Add comments
COMMENT ON COLUMN public.properties.condo_fee IS 'Monthly condominium fee (Taxa de condomínio).';
COMMENT ON COLUMN public.properties.iptu IS 'Annual or monthly property tax (IPTU).';
COMMENT ON COLUMN public.properties.internal_id IS 'Agency internal reference code (Código de referência).';

-- Adiciona colunas faltantes na tabela properties para importação dos imóveis

ALTER TABLE public.properties
    ADD COLUMN IF NOT EXISTS area NUMERIC,
    ADD COLUMN IF NOT EXISTS bedrooms INTEGER,
    ADD COLUMN IF NOT EXISTS bathrooms INTEGER,
    ADD COLUMN IF NOT EXISTS parking_spots INTEGER,
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS neighborhood TEXT,
    ADD COLUMN IF NOT EXISTS city TEXT,
    ADD COLUMN IF NOT EXISTS state TEXT,
    ADD COLUMN IF NOT EXISTS zip_code TEXT,
    ADD COLUMN IF NOT EXISTS latitude NUMERIC,
    ADD COLUMN IF NOT EXISTS longitude NUMERIC,
    ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'sale',
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS property_type TEXT,
    ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_properties_company ON public.properties(company_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_status_company ON public.properties(company_id, status);

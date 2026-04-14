-- Seed the primary company for Canaã Luxo
-- Fixed UUID for consistent internal linking
INSERT INTO public.companies (id, name, slug)
VALUES (
    'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a', 
    'Canaã Luxo', 
    'canaa-luxo'
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    slug = EXCLUDED.slug;

-- Create a default pipeline for this company if none exists
INSERT INTO public.pipelines (company_id, name, is_default, business_type)
VALUES (
    'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a',
    'Vendas Imóveis',
    true,
    'imoveis'
),
(
    'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a',
    'Vendas Barcos',
    true,
    'barcos'
)
ON CONFLICT DO NOTHING;

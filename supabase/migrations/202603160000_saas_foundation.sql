-- SAAS FOUNDATION: Multi-tenancy Setup (ROBUST VERSION)

-- 1. Criar Tabela de Empresas (Tenants)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    portal_config JSONB DEFAULT '{
        "zap": {"enabled": false},
        "vivareal": {"enabled": false},
        "imovelweb": {"enabled": false},
        "luxury_estate": {"enabled": false},
        "properstar": {"enabled": false}
    }',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- INSERIR OU ATUALIZAR EMPRESA PADRÃO (Resolvendo conflito de slug)
DO $$ 
BEGIN 
    -- Se existir alguma empresa com o slug 'empresa-padrao' mas com ID diferente, nós removemos para evitar o erro de duplicidade
    DELETE FROM public.companies WHERE slug = 'empresa-padrao' AND id != '00000000-0000-0000-0000-000000000000';
END $$;

INSERT INTO public.companies (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000000', 'Empresa Padrão', 'empresa-padrao')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- Habilitar RLS na tabela de empresas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 2. Vincular Membros da Equipe às Empresas
-- Usando um bloco DO para evitar erro se a constraint já existir
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_company') THEN
        ALTER TABLE public.team_members 
            ADD CONSTRAINT fk_company 
            FOREIGN KEY (company_id) 
            REFERENCES public.companies(id) 
            ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Create leads table (Optimized for Portals)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    portal_source TEXT NOT NULL, 
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    property_id TEXT, 
    raw_payload JSONB, 
    status TEXT DEFAULT 'new',
    assigned_to UUID REFERENCES public.team_members(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Set up RLS Policies for Multi-tenancy
-- Usando DROP antes de CREATE para evitar erro de "policy already exists"

-- Contacts Privacy
DROP POLICY IF EXISTS "Tenant isolation for contacts" ON public.contacts;
DROP POLICY IF EXISTS "Agents view assigned contacts" ON public.contacts;
CREATE POLICY "Tenant isolation for contacts" ON public.contacts
    FOR ALL
    USING (
        company_id IN (
            SELECT company_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );

-- Leads Privacy
DROP POLICY IF EXISTS "Tenant isolation for leads" ON public.leads;
CREATE POLICY "Tenant isolation for leads" ON public.leads
    FOR ALL
    USING (
        company_id IN (
            SELECT company_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );

-- Companies Privacy
DROP POLICY IF EXISTS "View own company" ON public.companies;
CREATE POLICY "View own company" ON public.companies
    FOR SELECT
    USING (
        id IN (
            SELECT company_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );

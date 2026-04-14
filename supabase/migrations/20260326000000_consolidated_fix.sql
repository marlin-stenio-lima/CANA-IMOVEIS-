-- =============================================================================
-- MIGRAÇÃO CONSOLIDADA - CRM Suite Pro
-- Data: 2026-03-26
-- Propósito: Garante que TODO o schema existe corretamente, de forma idempotente.
--            Corrige conflitos entre migrações anteriores e adiciona colunas
--            faltantes exigidas pelo webhook do WhatsApp (Evolution API).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSÕES
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- ENUMS (idempotentes)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'manager', 'seller', 'agent', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'agent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.deal_stage AS ENUM ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.contact_status AS ENUM ('active', 'inactive', 'lead', 'customer', 'churned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.activity_type AS ENUM ('call', 'email', 'meeting', 'note', 'task', 'deal_update');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.channel_type AS ENUM ('whatsapp', 'email', 'sms', 'webchat');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 1. COMPANIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    document TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    logo_url TEXT,
    plan TEXT DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
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

CREATE INDEX IF NOT EXISTS idx_companies_parent ON public.companies(parent_company_id);

-- Empresa padrão (para ambiente single-tenant / testes)
INSERT INTO public.companies (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000000', 'Empresa Padrão', 'empresa-padrao')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own company and subsidiaries" ON public.companies;
DROP POLICY IF EXISTS "View own company" ON public.companies;
CREATE POLICY "Users can view own company and subsidiaries"
    ON public.companies FOR SELECT TO authenticated
    USING (public.can_view_company_data(id));

DROP POLICY IF EXISTS "Users can update own company" ON public.companies;
CREATE POLICY "Users can update own company"
    ON public.companies FOR UPDATE TO authenticated
    USING (public.can_modify_company_data(id))
    WITH CHECK (public.can_modify_company_data(id));

-- ---------------------------------------------------------------------------
-- 2. PROFILES (usuários do sistema)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    job_title TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_company ON public.profiles(company_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view profiles from own company and subsidiaries" ON public.profiles;
CREATE POLICY "Users can view profiles from own company and subsidiaries"
    ON public.profiles FOR SELECT TO authenticated
    USING (public.can_view_company_data(company_id));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. USER_ROLES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, company_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_company ON public.user_roles(company_id);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view roles from own company" ON public.user_roles;
CREATE POLICY "Users can view roles from own company"
    ON public.user_roles FOR SELECT TO authenticated
    USING (public.can_view_company_data(company_id));

-- ---------------------------------------------------------------------------
-- 4. TEAM_MEMBERS (controle de instâncias WhatsApp / Roleta)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    role public.user_role DEFAULT 'agent',
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    active BOOLEAN DEFAULT true,
    last_assigned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own team members" ON public.team_members;
CREATE POLICY "Users can view their own team members" ON public.team_members
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.team_members tm
            WHERE tm.company_id = team_members.company_id
        )
    );

-- ---------------------------------------------------------------------------
-- 5. PROPERTIES (imóveis)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT, -- apartamento, casa, terreno, etc.
    listing_type TEXT DEFAULT 'sale', -- sale, rent
    price NUMERIC DEFAULT 0,
    condo_fee NUMERIC DEFAULT 0,
    iptu NUMERIC DEFAULT 0,
    area NUMERIC,
    bedrooms INTEGER,
    bathrooms INTEGER,
    parking_spots INTEGER,
    address TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    images JSONB DEFAULT '[]',
    features TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active', -- active, sold, rented, inactive
    internal_id TEXT,
    year_built INTEGER,
    portal_config JSONB DEFAULT '{
        "zap": true,
        "vivareal": true,
        "imovelweb": true,
        "luxury_estate": false,
        "properstar": false,
        "olx": true
    }',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON COLUMN public.properties.condo_fee IS 'Taxa de condomínio mensal.';
COMMENT ON COLUMN public.properties.iptu IS 'IPTU anual ou mensal.';
COMMENT ON COLUMN public.properties.internal_id IS 'Código de referência interno da imobiliária.';
COMMENT ON COLUMN public.properties.portal_config IS 'Controle de publicação por portal.';

CREATE INDEX IF NOT EXISTS idx_properties_company ON public.properties(company_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(company_id, status);
CREATE INDEX IF NOT EXISTS idx_properties_portal_config ON public.properties USING GIN (portal_config);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company isolation for properties" ON public.properties
    FOR ALL USING (
        company_id IN (SELECT company_id FROM public.team_members WHERE user_id = auth.uid())
        OR company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    );

-- ---------------------------------------------------------------------------
-- 6. CONTACTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    document TEXT,
    status public.contact_status DEFAULT 'lead',
    source TEXT,
    assigned_to UUID,  -- referência flexível (team_members.id ou profiles.id)
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    -- WhatsApp / Evolution API
    remote_jid TEXT UNIQUE,
    profile_pic_url TEXT,
    -- AI Agent
    ai_status TEXT DEFAULT 'stopped',
    human_intervened BOOLEAN DEFAULT false,
    active_agent_id INTEGER DEFAULT 1,
    follow_up_step INTEGER DEFAULT 0,
    last_customer_message_at TIMESTAMPTZ,
    last_ai_message_at TIMESTAMPTZ,
    next_follow_up_at TIMESTAMPTZ,
    interest_property_id UUID REFERENCES public.properties(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar colunas faltantes em instâncias já existentes (idempotente)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='remote_jid') THEN
        ALTER TABLE public.contacts ADD COLUMN remote_jid TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='profile_pic_url') THEN
        ALTER TABLE public.contacts ADD COLUMN profile_pic_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='ai_status') THEN
        ALTER TABLE public.contacts ADD COLUMN ai_status TEXT DEFAULT 'stopped';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='human_intervened') THEN
        ALTER TABLE public.contacts ADD COLUMN human_intervened BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='active_agent_id') THEN
        ALTER TABLE public.contacts ADD COLUMN active_agent_id INTEGER DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='follow_up_step') THEN
        ALTER TABLE public.contacts ADD COLUMN follow_up_step INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='last_customer_message_at') THEN
        ALTER TABLE public.contacts ADD COLUMN last_customer_message_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='last_ai_message_at') THEN
        ALTER TABLE public.contacts ADD COLUMN last_ai_message_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='next_follow_up_at') THEN
        ALTER TABLE public.contacts ADD COLUMN next_follow_up_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='interest_property_id') THEN
        ALTER TABLE public.contacts ADD COLUMN interest_property_id UUID REFERENCES public.properties(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='company_id') THEN
        ALTER TABLE public.contacts ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Remover check constraint antiga de ai_status (se existir) e recriar corretamente
ALTER TABLE public.contacts DROP CONSTRAINT IF EXISTS contacts_ai_status_check;
ALTER TABLE public.contacts ADD CONSTRAINT contacts_ai_status_check
    CHECK (ai_status IN ('active', 'chat_only', 'paused', 'stopped'));

CREATE INDEX IF NOT EXISTS idx_contacts_company ON public.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_remote_jid ON public.contacts(remote_jid);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_ai_followup ON public.contacts(ai_status, next_follow_up_at);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation for contacts" ON public.contacts;
DROP POLICY IF EXISTS "Agents view assigned contacts" ON public.contacts;
DROP POLICY IF EXISTS "Agents update assigned contacts" ON public.contacts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.contacts;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.contacts;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.contacts;
DROP POLICY IF EXISTS "Users can view contacts from own company and subsidiaries" ON public.contacts;
DROP POLICY IF EXISTS "Users can insert contacts in own company" ON public.contacts;
DROP POLICY IF EXISTS "Users can update contacts in own company" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete contacts in own company" ON public.contacts;

CREATE POLICY "Company isolation for contacts" ON public.contacts
    FOR ALL TO authenticated
    USING (
        company_id IN (SELECT company_id FROM public.team_members WHERE user_id = auth.uid())
        OR company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    );

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
EXCEPTION WHEN others THEN NULL; END $$;
ALTER TABLE public.contacts REPLICA IDENTITY FULL;

-- ---------------------------------------------------------------------------
-- 7. INSTANCES (instâncias WhatsApp - Evolution API)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.team_members(id),
    name TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'disconnected', -- disconnected, connecting, open
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(name)
);

ALTER TABLE public.instances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Brokers view own instance" ON public.instances;
CREATE POLICY "Company isolation for instances" ON public.instances
    FOR ALL USING (
        auth.uid() IN (SELECT user_id FROM public.team_members WHERE id = instances.assigned_to)
        OR EXISTS (
            SELECT 1 FROM public.team_members
            WHERE user_id = auth.uid()
            AND company_id = instances.company_id
            AND role IN ('admin', 'manager')
        )
    );

-- ---------------------------------------------------------------------------
-- 8. CONVERSATIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    instance_id UUID REFERENCES public.instances(id),
    channel public.channel_type DEFAULT 'whatsapp',
    status TEXT DEFAULT 'open', -- open, closed, snoozed
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    unread_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Garantir coluna instance_id se a tabela já existia
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='conversations' AND column_name='instance_id') THEN
        ALTER TABLE public.conversations ADD COLUMN instance_id UUID REFERENCES public.instances(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='conversations' AND column_name='company_id') THEN
        ALTER TABLE public.conversations ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_conversations_company ON public.conversations(company_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contact ON public.conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_conversations_instance ON public.conversations(instance_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View conversations" ON public.conversations;
CREATE POLICY "Company isolation for conversations" ON public.conversations
    FOR ALL USING (
        company_id IN (SELECT company_id FROM public.team_members WHERE user_id = auth.uid())
        OR company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    );

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
EXCEPTION WHEN others THEN NULL; END $$;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;

-- ---------------------------------------------------------------------------
-- 9. MESSAGES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Relacionamentos
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    instance_id UUID REFERENCES public.instances(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    -- WhatsApp / Evolution API
    wamid TEXT UNIQUE,       -- WhatsApp Message ID (da Evolution API)
    remote_jid TEXT,         -- JID do contato no WhatsApp
    -- Conteúdo
    content TEXT,
    message_type TEXT DEFAULT 'text', -- text, image, audio, video, document
    media_url TEXT,
    -- Metadados
    direction TEXT CHECK (direction IN ('inbound', 'outbound')),
    status TEXT DEFAULT 'sent', -- sent, delivered, read, played, failed
    sender_type TEXT,        -- 'contact', 'user', 'ai'
    sender_id UUID,          -- team_members.id quando sender_type='user'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Garantir colunas faltantes em instâncias existentes da tabela messages
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='wamid') THEN
        ALTER TABLE public.messages ADD COLUMN wamid TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='remote_jid') THEN
        ALTER TABLE public.messages ADD COLUMN remote_jid TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='instance_id') THEN
        ALTER TABLE public.messages ADD COLUMN instance_id UUID REFERENCES public.instances(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='contact_id') THEN
        ALTER TABLE public.messages ADD COLUMN contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='conversation_id') THEN
        ALTER TABLE public.messages ADD COLUMN conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='content') THEN
        ALTER TABLE public.messages ADD COLUMN content TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='message_type') THEN
        ALTER TABLE public.messages ADD COLUMN message_type TEXT DEFAULT 'text';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='media_url') THEN
        ALTER TABLE public.messages ADD COLUMN media_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='direction') THEN
        ALTER TABLE public.messages ADD COLUMN direction TEXT CHECK (direction IN ('inbound', 'outbound'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='status') THEN
        ALTER TABLE public.messages ADD COLUMN status TEXT DEFAULT 'sent';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='sender_type') THEN
        ALTER TABLE public.messages ADD COLUMN sender_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='sender_id') THEN
        ALTER TABLE public.messages ADD COLUMN sender_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' AND column_name='metadata') THEN
        ALTER TABLE public.messages ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_contact ON public.messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_messages_wamid ON public.messages(wamid);
CREATE INDEX IF NOT EXISTS idx_messages_remote_jid ON public.messages(remote_jid);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View messages" ON public.messages;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.messages;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.messages;
CREATE POLICY "Authenticated users can manage messages" ON public.messages
    FOR ALL TO authenticated USING (true);

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN others THEN NULL; END $$;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- ---------------------------------------------------------------------------
-- 10. WEBHOOK_LOGS (obrigatório para o webhook Evolution API)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages webhook logs" ON public.webhook_logs
    FOR ALL TO service_role USING (true);
CREATE POLICY "Admins can view webhook logs" ON public.webhook_logs
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
        )
        OR EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- ---------------------------------------------------------------------------
-- 11. KNOWLEDGE BASE (para o agente AI)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read KB" ON public.knowledge_base;
DROP POLICY IF EXISTS "Write KB" ON public.knowledge_base;
CREATE POLICY "Company members can read KB" ON public.knowledge_base
    FOR SELECT TO authenticated
    USING (
        company_id IN (SELECT company_id FROM public.team_members WHERE user_id = auth.uid())
        OR company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    );
CREATE POLICY "Admins can manage KB" ON public.knowledge_base
    FOR ALL TO authenticated
    USING (
        company_id IN (
            SELECT company_id FROM public.team_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- ---------------------------------------------------------------------------
-- 12. APPOINTMENTS (agenda)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    contact_id UUID REFERENCES public.contacts(id),
    assigned_to UUID REFERENCES public.team_members(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
    notes TEXT,
    meeting_link TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View appointments" ON public.appointments;
CREATE POLICY "Company isolation for appointments" ON public.appointments
    FOR ALL TO authenticated
    USING (
        company_id IN (SELECT company_id FROM public.team_members WHERE user_id = auth.uid())
        OR company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    );

-- ---------------------------------------------------------------------------
-- 13. DEALS (pipeline de vendas)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    value DECIMAL(15,2) DEFAULT 0,
    stage public.deal_stage DEFAULT 'lead',
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_deals_company ON public.deals(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(company_id, stage);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view deals from own company and subsidiaries" ON public.deals;
DROP POLICY IF EXISTS "Users can insert deals in own company" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals in own company" ON public.deals;
DROP POLICY IF EXISTS "Users can delete deals in own company" ON public.deals;
CREATE POLICY "Company isolation for deals" ON public.deals
    FOR ALL TO authenticated
    USING (public.can_view_company_data(company_id));

-- ---------------------------------------------------------------------------
-- 14. TASKS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status public.task_status DEFAULT 'pending',
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    related_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    related_deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tasks_company ON public.tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(company_id, status);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tasks from own company and subsidiaries" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks in own company" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks in own company" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks in own company" ON public.tasks;
CREATE POLICY "Company isolation for tasks" ON public.tasks
    FOR ALL TO authenticated
    USING (public.can_view_company_data(company_id));

-- ---------------------------------------------------------------------------
-- 15. ACTIVITIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    type public.activity_type NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_company ON public.activities(company_id);
CREATE INDEX IF NOT EXISTS idx_activities_contact ON public.activities(contact_id);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view activities from own company and subsidiaries" ON public.activities;
DROP POLICY IF EXISTS "Users can insert activities in own company" ON public.activities;
CREATE POLICY "Company isolation for activities" ON public.activities
    FOR ALL TO authenticated
    USING (public.can_view_company_data(company_id));

-- ---------------------------------------------------------------------------
-- 16. LEADS (portais imobiliários)
-- ---------------------------------------------------------------------------
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

DROP POLICY IF EXISTS "Tenant isolation for leads" ON public.leads;
CREATE POLICY "Company isolation for leads" ON public.leads
    FOR ALL USING (
        company_id IN (SELECT company_id FROM public.team_members WHERE user_id = auth.uid())
        OR company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    );

-- ---------------------------------------------------------------------------
-- 17. FOLLOW_UP_LOGS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.follow_up_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT now(),
    message_content TEXT,
    status TEXT DEFAULT 'sent',
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.follow_up_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.follow_up_logs;
CREATE POLICY "Authenticated users manage follow up logs" ON public.follow_up_logs
    FOR ALL TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- 18. FUNÇÕES AUXILIARES (RLS helpers)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
    UNION ALL
    SELECT company_id FROM public.team_members WHERE user_id = auth.uid()
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_subsidiary_of(child_company_id UUID, parent_company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.companies c
        WHERE c.id = child_company_id AND c.parent_company_id = is_subsidiary_of.parent_company_id
    );
$$;

CREATE OR REPLACE FUNCTION public.can_view_company_data(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT
        target_company_id = public.get_user_company_id()
        OR public.is_subsidiary_of(target_company_id, public.get_user_company_id());
$$;

CREATE OR REPLACE FUNCTION public.can_modify_company_data(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT target_company_id = public.get_user_company_id();
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    );
$$;

-- ---------------------------------------------------------------------------
-- 19. FUNÇÃO DE DISTRIBUIÇÃO DE LEADS (Roleta)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.distribute_lead(company_id_input UUID)
RETURNS UUID AS $$
DECLARE
    selected_broker_id UUID;
BEGIN
    SELECT id INTO selected_broker_id
    FROM public.team_members
    WHERE company_id = company_id_input
      AND active = true
      AND role = 'agent'
      AND EXISTS (
          SELECT 1 FROM public.instances
          WHERE assigned_to = team_members.id AND status = 'open'
      )
    ORDER BY last_assigned_at ASC NULLS FIRST
    LIMIT 1;

    IF selected_broker_id IS NOT NULL THEN
        UPDATE public.team_members
        SET last_assigned_at = now()
        WHERE id = selected_broker_id;
    END IF;

    RETURN selected_broker_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- 20. TRIGGERS
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- updated_at automático
DO $$ BEGIN
    CREATE TRIGGER update_companies_updated_at
        BEFORE UPDATE ON public.companies
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_contacts_updated_at
        BEFORE UPDATE ON public.contacts
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_deals_updated_at
        BEFORE UPDATE ON public.deals
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_tasks_updated_at
        BEFORE UPDATE ON public.tasks
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_properties_updated_at
        BEFORE UPDATE ON public.properties
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_instances_updated_at
        BEFORE UPDATE ON public.instances
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger: criar profile + role automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    _company_id UUID;
BEGIN
    _company_id := (NEW.raw_user_meta_data ->> 'company_id')::UUID;

    IF _company_id IS NULL THEN
        RETURN NEW; -- Sem company_id no metadata, pula criação de perfil
    END IF;

    INSERT INTO public.profiles (id, company_id, full_name)
    VALUES (
        NEW.id,
        _company_id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_roles (user_id, company_id, role)
    VALUES (
        NEW.id,
        _company_id,
        CASE
            WHEN (NEW.raw_user_meta_data ->> 'is_owner')::BOOLEAN = true THEN 'owner'::public.app_role
            ELSE 'viewer'::public.app_role
        END
    )
    ON CONFLICT (user_id, company_id, role) DO NOTHING;

    RETURN NEW;
END;
$$;

DO $$ BEGIN
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 21. STORAGE BUCKET para mídias do WhatsApp
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: qualquer usuário autenticado pode fazer upload
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
    CREATE POLICY "Allow authenticated uploads" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'chat-media');

    DROP POLICY IF EXISTS "Allow public read chat-media" ON storage.objects;
    CREATE POLICY "Allow public read chat-media" ON storage.objects
        FOR SELECT USING (bucket_id = 'chat-media');

    DROP POLICY IF EXISTS "Allow service role manage chat-media" ON storage.objects;
    CREATE POLICY "Allow service role manage chat-media" ON storage.objects
        FOR ALL TO service_role
        USING (bucket_id = 'chat-media');
END $$;

-- ---------------------------------------------------------------------------
-- FIM DA MIGRAÇÃO
-- ---------------------------------------------------------------------------

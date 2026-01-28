-- ==============================================================================
-- "GHL KILLER" CRM - COMPLETE SETUP SCRIPT
-- ==============================================================================
-- This script sets up the entire database structure for the AI CRM.
-- Includes:
-- 1. Core Tables (Contacts, Messages, Appointments)
-- 2. Multi-Tenant / Multi-Instance Support (WhatsApp)
-- 3. AI Knowledge Base
-- 4. Role-Based Access Control (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "vector"; 
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ROLES & TEAM MEMBERS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'agent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL,
    role user_role DEFAULT 'agent',
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    active BOOLEAN DEFAULT true,
    last_assigned_at TIMESTAMPTZ, -- For Roleta
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own team members" ON public.team_members
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.team_members WHERE company_id = team_members.company_id));


-- 3. CONTACTS
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    assigned_to UUID REFERENCES public.team_members(id),
    status TEXT DEFAULT 'new', 
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
-- Policy: Agents see assigned, Admin/Managers see all
CREATE POLICY "Agents view assigned contacts" ON public.contacts
    FOR SELECT USING (
        auth.uid() IN (SELECT user_id FROM public.team_members WHERE id = contacts.assigned_to)
        OR 
        EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager'))
    );

CREATE POLICY "Agents update assigned contacts" ON public.contacts
    FOR UPDATE USING (
        auth.uid() IN (SELECT user_id FROM public.team_members WHERE id = contacts.assigned_to)
        OR 
        EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager'))
    );
CREATE POLICY "Enable insert for authenticated users" ON public.contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 4. INSTANCES (WhatsApp Connections)
CREATE TABLE IF NOT EXISTS public.instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    assigned_to UUID REFERENCES public.team_members(id),
    name TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'disconnected',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(name)
);

ALTER TABLE public.instances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brokers view own instance" ON public.instances
    FOR SELECT USING (
        auth.uid() IN (SELECT user_id FROM public.team_members WHERE id = instances.assigned_to)
        OR 
        EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager'))
    );


-- 5. CONVERSATIONS & MESSAGES
DO $$ BEGIN
    CREATE TYPE channel_type AS ENUM ('whatsapp', 'email', 'sms', 'webchat');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    channel channel_type DEFAULT 'whatsapp',
    status TEXT DEFAULT 'open',
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    unread_count INT DEFAULT 0,
    instance_id UUID REFERENCES public.instances(id), -- Linked to specific line
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL,
    sender_id UUID,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View conversations" ON public.conversations FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View messages" ON public.messages FOR ALL USING (auth.role() = 'authenticated');


-- 6. KNOWLEDGE BASE
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read KB" ON public.knowledge_base FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Write KB" ON public.knowledge_base FOR ALL USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager'))
);


-- 7. APPOINTMENTS
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    title TEXT NOT NULL,
    contact_id UUID REFERENCES public.contacts(id),
    assigned_to UUID REFERENCES public.team_members(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    meeting_link TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View appointments" ON public.appointments FOR ALL USING (auth.role() = 'authenticated');


-- 8. ROLETA FUNCTION (Lead Distribution)
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
      AND EXISTS (SELECT 1 FROM public.instances WHERE assigned_to = team_members.id AND status = 'open')
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

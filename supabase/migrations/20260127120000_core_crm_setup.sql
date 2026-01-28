-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI Embeddings if needed later
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ----------------------------
-- 1. Team & Permissions (Simple RBAC)
-- ----------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'agent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL, -- Logical separation for multi-tenant feel (or single company)
    role user_role DEFAULT 'agent',
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- RLS: Only easy access for now. 
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own team members" ON public.team_members
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.team_members WHERE company_id = team_members.company_id));


-- ----------------------------
-- 2. Contacts (Enhancement to existing or new)
-- Assuming 'contacts' table might exist, we'll ensure these fields are present
-- ----------------------------
-- (Skipping full creation if it exists, but adding columns just in case)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    assigned_to UUID REFERENCES public.team_members(id), -- Lead distribution
    status TEXT DEFAULT 'new', 
    custom_fields JSONB DEFAULT '{}', -- Flexible storage for qualification answers
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------
-- 3. Conversations & Messages (WhatsApp/Email)
-- ----------------------------
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
    status TEXT DEFAULT 'open', -- open, closed, snoozed
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    unread_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'contact', 'user' (agent), 'ai'
    sender_id UUID, -- NULL for contact, team_member.id for user
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- Store MessageID from Evolution, status (sent/delivered), attachments
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------
-- 4. Knowledge Base (for AI)
-- ----------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------
-- 5. Appointments (Calendar)
-- ----------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
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

-- ----------------------------
-- RLS Policies (Basic Setup)
-- ----------------------------

-- Contacts: Agents see only assigned, Admins see all
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents view assigned contacts" ON public.contacts
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.team_members WHERE id = contacts.assigned_to
        )
        OR 
        EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager'))
    );

CREATE POLICY "Agents update assigned contacts" ON public.contacts
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM public.team_members WHERE id = contacts.assigned_to
        )
        OR 
        EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager'))
    );

CREATE POLICY "Enable insert for authenticated users" ON public.contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- Conversations/Messages: Inherit access from Contact or simple company-wide for now to avoid complexity
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View conversations" ON public.conversations FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View messages" ON public.messages FOR ALL USING (auth.role() = 'authenticated');

-- Knowledge Base: Read-only for AI (system) and Agents, Write for Admin
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read KB" ON public.knowledge_base FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Write KB" ON public.knowledge_base FOR ALL USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Appointments: Similar to contacts
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View appointments" ON public.appointments FOR ALL USING (auth.role() = 'authenticated');

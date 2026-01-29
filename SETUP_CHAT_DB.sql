-- 1. Create Instances Table (if not exists)
CREATE TABLE IF NOT EXISTS public.instances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    company_id uuid,
    status text DEFAULT 'closed',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Create Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    remote_jid text NOT NULL UNIQUE,
    name text,
    profile_pic_url text,
    phone text,
    company_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid,
    contact_id uuid REFERENCES public.contacts(id) ON DELETE CASCADE,
    instance_id uuid REFERENCES public.instances(id) ON DELETE SET NULL,
    channel text DEFAULT 'whatsapp',
    last_message text,
    last_message_at timestamp with time zone DEFAULT now(),
    unread_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id uuid REFERENCES public.instances(id) ON DELETE SET NULL,
    contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    remote_jid text,
    content text,
    media_url text,
    message_type text DEFAULT 'text',
    direction text,
    sender_type text DEFAULT 'contact', -- 'user' or 'contact'
    status text DEFAULT 'sent',
    created_at timestamp with time zone DEFAULT now()
);

-- 5. Ensure Indexes and Columns (Idempotent checks)
DO $$ 
BEGIN 
    -- Add conversation_id to messages if it was missing (e.g. table existed but old version)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'conversation_id') THEN
        ALTER TABLE public.messages ADD COLUMN conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE;
    END IF;

    -- Add sender_type to messages
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'sender_type') THEN
        ALTER TABLE public.messages ADD COLUMN sender_type text DEFAULT 'contact';
    END IF;
END $$;

-- 6. Enable RLS (Security)
ALTER TABLE public.instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 7. Policies (Drop first to avoid errors if re-running)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.instances;
CREATE POLICY "Enable read access for authenticated users" ON public.instances FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.contacts;
CREATE POLICY "Enable read access for authenticated users" ON public.contacts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.contacts;
CREATE POLICY "Enable insert access for authenticated users" ON public.contacts FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.conversations;
CREATE POLICY "Enable read access for authenticated users" ON public.conversations FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.conversations;
CREATE POLICY "Enable insert access for authenticated users" ON public.conversations FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.conversations;
CREATE POLICY "Enable update access for authenticated users" ON public.conversations FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.messages;
CREATE POLICY "Enable read access for authenticated users" ON public.messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.messages;
CREATE POLICY "Enable insert access for authenticated users" ON public.messages FOR INSERT TO authenticated WITH CHECK (true);

-- 8. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;

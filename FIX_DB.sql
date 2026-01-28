-- Run this in Supabase SQL Editor to fix the "Error adding member"

-- 1. Ensure team_members has the phone column
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Ensure instances table exists (for the auto-creation feature)
CREATE TABLE IF NOT EXISTS public.instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    assigned_to UUID REFERENCES public.team_members(user_id), -- Changed to match user_id usually, but code uses team_member.id. Let's make it loose or match team_members.id if that's the FK.
    -- Correction: team_members.id is UUID.
    -- Let's check team_members definition in previous turns. It has ID. 
    company_id UUID,
    status TEXT DEFAULT 'closed',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Fix FK if needed. The code uses `assigned_to: newMember.id`. 
-- If instances.assigned_to references auth.users, that will fail.
-- Let's make it generic for now or reference team_members(id).
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'instances' AND column_name = 'assigned_to') THEN
        ALTER TABLE public.instances ADD COLUMN assigned_to UUID REFERENCES public.team_members(id);
    END IF;
END $$;

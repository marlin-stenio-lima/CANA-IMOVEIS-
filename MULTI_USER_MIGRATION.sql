-- 1. Create the new link table
CREATE TABLE IF NOT EXISTS public.instance_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES public.instances(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(instance_id, user_id)
);

-- 2. Migrate existing data (preserve current connections)
INSERT INTO public.instance_members (instance_id, user_id)
SELECT id, assigned_to
FROM public.instances
WHERE assigned_to IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. Enable RLS on the new table
ALTER TABLE public.instance_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage instance members" ON public.instance_members FOR ALL USING (true);

-- 4. Remove the old column (Optional but recommended to avoid confusion)
-- We'll keep it nullable for a moment just in case, or drop it if you are confident.
-- Let's drop it to force code updates and prevent mixed usage.
ALTER TABLE public.instances DROP COLUMN IF EXISTS assigned_to;

-- 5. Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';

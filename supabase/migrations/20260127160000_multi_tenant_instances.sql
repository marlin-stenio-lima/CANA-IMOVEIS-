-- ----------------------------
-- 6. Instances (Multi-WhatsApp Support)
-- ----------------------------
CREATE TABLE IF NOT EXISTS public.instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    assigned_to UUID REFERENCES public.team_members(id), -- Owner of this number (Broker)
    name TEXT NOT NULL, -- Evolution Instance Name (e.g., "joao_silva_main")
    phone TEXT, -- Connected Phone Number
    status TEXT DEFAULT 'disconnected', -- disconnected, connecting, open
    settings JSONB DEFAULT '{}', -- Instance specific settings (AI enabled, etc)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(name)
);

-- RLS: Brokers see only their instance, Managers see all
ALTER TABLE public.instances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brokers view own instance" ON public.instances
    FOR SELECT USING (
        auth.uid() IN (SELECT user_id FROM public.team_members WHERE id = instances.assigned_to)
        OR 
        EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager'))
    );

-- ----------------------------
-- 7. Conversations Update (Link to Instance)
-- ----------------------------
-- We accept that conversations might be created before this migration, so nullable first if needed
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS instance_id UUID REFERENCES public.instances(id);

-- ----------------------------
-- 8. Team Members Update (Roleta Logic)
-- ----------------------------
ALTER TABLE public.team_members
ADD COLUMN IF NOT EXISTS last_assigned_at TIMESTAMPTZ; -- To track Round-Robin order

-- ----------------------------
-- 9. Lead Distribution Function (The Roleta)
-- ----------------------------
CREATE OR REPLACE FUNCTION public.distribute_lead(company_id_input UUID)
RETURNS UUID AS $$
DECLARE
    selected_broker_id UUID;
BEGIN
    -- Select the active agent who received a lead longest ago (or never)
    SELECT id INTO selected_broker_id
    FROM public.team_members
    WHERE company_id = company_id_input
      AND active = true
      AND role = 'agent'
      -- Check if they have a connected instance (optional, but good practice)
      AND EXISTS (SELECT 1 FROM public.instances WHERE assigned_to = team_members.id AND status = 'open')
    ORDER BY last_assigned_at ASC NULLS FIRST
    LIMIT 1;

    -- Update their last_assigned_at
    IF selected_broker_id IS NOT NULL THEN
        UPDATE public.team_members 
        SET last_assigned_at = now() 
        WHERE id = selected_broker_id;
    END IF;

    RETURN selected_broker_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

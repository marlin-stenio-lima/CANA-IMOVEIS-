-- Migration: Add AI Agent columns and Follow-up Logs

-- 1. Update contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS active_agent_id INTEGER DEFAULT 1, -- 1=Initial, 2=Scheduling, 3=Qualify, 4=Hybrid
ADD COLUMN IF NOT EXISTS ai_status TEXT DEFAULT 'stopped' CHECK (ai_status IN ('active', 'paused', 'stopped')),
ADD COLUMN IF NOT EXISTS follow_up_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_customer_message_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_ai_message_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS interest_property_id UUID REFERENCES properties(id);

-- Index for cron performance (finding active agents needing follow-up)
CREATE INDEX IF NOT EXISTS idx_contacts_ai_followup ON contacts (ai_status, next_follow_up_at);

-- 2. Create follow_up_logs table
CREATE TABLE IF NOT EXISTS follow_up_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT now(),
    message_content TEXT,
    status TEXT DEFAULT 'sent',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE follow_up_logs ENABLE ROW LEVEL SECURITY;

-- Policy (Simple access for service role/authenticated users)
CREATE POLICY "Enable all access for authenticated users" ON follow_up_logs
    FOR ALL USING (auth.role() = 'authenticated');

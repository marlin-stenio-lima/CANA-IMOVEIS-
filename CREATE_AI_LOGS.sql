-- =========================================================================
-- CREATE AI LOGS TABLE
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.ai_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    broker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    command TEXT,
    response TEXT,
    status TEXT, -- 'success', 'error', 'intercepted'
    error_message TEXT
);

-- Enable RLS
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view logs for their company
CREATE POLICY "View ai logs for company" ON public.ai_logs
FOR SELECT TO authenticated
USING (company_id = public.get_user_company_id());

-- Allow inserting logs from service role (edge functions bypass RLS anyway)
CREATE POLICY "Insert ai logs for authenticated" ON public.ai_logs
FOR INSERT TO authenticated
WITH CHECK (company_id = public.get_user_company_id());

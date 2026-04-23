CREATE TABLE IF NOT EXISTS public.property_update_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    requested_by_name TEXT,
    requested_by_phone TEXT,
    requested_by_email TEXT,
    changes JSONB NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.property_update_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to property_update_requests" ON public.property_update_requests;
CREATE POLICY "Allow public insert to property_update_requests"
ON public.property_update_requests
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated on property_update_requests" ON public.property_update_requests;
CREATE POLICY "Allow all for authenticated on property_update_requests"
ON public.property_update_requests
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

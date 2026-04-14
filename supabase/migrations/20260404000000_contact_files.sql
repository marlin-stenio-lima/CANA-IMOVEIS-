-- Create bucket for contact files
INSERT INTO storage.buckets (id, name, public) VALUES ('contact_files', 'contact_files', true) ON CONFLICT (id) DO NOTHING;

-- RLS for contact_files
CREATE POLICY "Enable all for contact_files" ON storage.objects FOR ALL USING (bucket_id = 'contact_files') WITH CHECK (bucket_id = 'contact_files');

-- Keep track of files in DB
CREATE TABLE IF NOT EXISTS public.contact_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for contact files" ON public.contact_files FOR ALL USING (true) WITH CHECK(true);

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';

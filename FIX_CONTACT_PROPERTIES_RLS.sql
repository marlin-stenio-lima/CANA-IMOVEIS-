-- Run this in the Supabase SQL Editor to fix the linking properties error

ALTER TABLE public.contact_properties ENABLE ROW LEVEL SECURITY;

-- Drop any previous restrictive policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.contact_properties;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.contact_properties;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.contact_properties;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.contact_properties;
DROP POLICY IF EXISTS "Allow All Authenticated - ContactProperties" ON public.contact_properties;

-- Create a permissive policy that allows all logged-in agents to manage linked properties
CREATE POLICY "Allow All Authenticated - ContactProperties" ON public.contact_properties FOR ALL TO authenticated USING (true) WITH CHECK (true);

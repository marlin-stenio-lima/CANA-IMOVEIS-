-- Run this in the Supabase SQL Editor to fix the property images error

ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Drop any previous restrictive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.property_images;
DROP POLICY IF EXISTS "Allow public read access" ON public.property_images;

-- Create a permissive policy that allows anyone (even unauthenticated users visiting the site) to see the property images
CREATE POLICY "Allow public read access" ON public.property_images FOR SELECT USING (true);

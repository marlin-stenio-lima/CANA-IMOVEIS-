-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can create a company during signup" ON public.companies;

-- Create as PERMISSIVE policy (default, but being explicit)
CREATE POLICY "Anyone can create a company during signup"
ON public.companies
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
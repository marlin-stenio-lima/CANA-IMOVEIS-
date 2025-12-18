-- Drop the old policy that doesn't specify roles
DROP POLICY IF EXISTS "Anyone can create a company during signup" ON public.companies;

-- Create new policy with correct roles (anon for signup, authenticated for logged-in users)
CREATE POLICY "Anyone can create a company during signup"
ON public.companies
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
-- Allow creating companies during signup (before user exists)
CREATE POLICY "Anyone can create a company during signup"
ON public.companies
FOR INSERT
WITH CHECK (true);

-- Also need to allow profiles to be inserted by the trigger
-- The trigger runs with SECURITY DEFINER so this should work, but let's ensure it
CREATE POLICY "System can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());
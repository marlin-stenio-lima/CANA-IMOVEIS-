-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function that also creates company
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _company_id UUID;
  _company_name TEXT;
  _company_slug TEXT;
BEGIN
  -- Get company name from metadata, default to email prefix if not provided
  _company_name := COALESCE(
    NEW.raw_user_meta_data ->> 'company_name',
    split_part(NEW.email, '@', 1) || '''s Company'
  );
  
  -- Generate slug
  _company_slug := lower(regexp_replace(_company_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 8);
  
  -- Check if company_id was provided (existing company)
  IF NEW.raw_user_meta_data ->> 'company_id' IS NOT NULL THEN
    _company_id := (NEW.raw_user_meta_data ->> 'company_id')::UUID;
  ELSE
    -- Create new company
    INSERT INTO public.companies (name, slug)
    VALUES (_company_name, _company_slug)
    RETURNING id INTO _company_id;
  END IF;
  
  -- Create profile
  INSERT INTO public.profiles (id, company_id, full_name)
  VALUES (
    NEW.id,
    _company_id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create user role
  INSERT INTO public.user_roles (user_id, company_id, role)
  VALUES (
    NEW.id,
    _company_id,
    CASE 
      WHEN (NEW.raw_user_meta_data ->> 'is_owner')::BOOLEAN = true THEN 'owner'::public.app_role
      ELSE 'viewer'::public.app_role
    END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
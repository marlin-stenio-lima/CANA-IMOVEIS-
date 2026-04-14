-- Drop existing trigger/function to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function that handles new company creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    _company_id UUID;
    _company_name TEXT;
    _company_slug TEXT;
BEGIN
    -- 1. Try to get company_id directly from metadata
    _company_id := (NEW.raw_user_meta_data ->> 'company_id')::UUID;

    -- 2. If no company_id, try to create a NEW one from company_name
    IF _company_id IS NULL THEN
        _company_name := NEW.raw_user_meta_data ->> 'company_name';
        
        -- Default name if missing
        IF _company_name IS NULL THEN
            _company_name := split_part(NEW.email, '@', 1) || '''s Company';
        END IF;

        -- Generate unique slug
        _company_slug := lower(regexp_replace(_company_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);

        -- Insert the new company and get its ID
        INSERT INTO public.companies (name, slug)
        VALUES (_company_name, _company_slug)
        RETURNING id INTO _company_id;
    END IF;

    -- 3. Create the user profile
    INSERT INTO public.profiles (id, company_id, full_name)
    VALUES (
        NEW.id,
        _company_id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;

    -- 4. Create the user role (Owner or Viewer)
    INSERT INTO public.user_roles (user_id, company_id, role)
    VALUES (
        NEW.id,
        _company_id,
        CASE
            WHEN (NEW.raw_user_meta_data ->> 'is_owner')::BOOLEAN = true THEN 'owner'::public.app_role
            ELSE 'viewer'::public.app_role
        END
    )
    ON CONFLICT (user_id, company_id, role) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Re-create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

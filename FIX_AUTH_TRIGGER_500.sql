-- Script: Fix Database error saving new user (500)
-- Propósito: Substituir on_auth_user_created com tratamento de erros
-- para evitar que falhas no trigger impeçam o login/cadastro.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    _company_id UUID;
    _company_name TEXT;
    _company_slug TEXT;
    _role text;
BEGIN
    -- 1. Try to get company_id directly from metadata
    _company_id := (NEW.raw_user_meta_data ->> 'company_id')::UUID;

    -- 2. If no company_id, try to create a NEW one from company_name
    IF _company_id IS NULL THEN
        _company_name := NEW.raw_user_meta_data ->> 'company_name';
        
        IF _company_name IS NULL THEN
            _company_name := split_part(NEW.email, '@', 1) || '''s Company';
        END IF;

        -- Generate unique slug safely
        _company_slug := lower(regexp_replace(_company_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);

        BEGIN
            INSERT INTO public.companies (name, slug)
            VALUES (_company_name, _company_slug)
            RETURNING id INTO _company_id;
        EXCEPTION WHEN others THEN
            RAISE WARNING 'Falha ao criar company para %', NEW.email;
        END;
    END IF;

    -- 3. Create the user profile safely
    IF _company_id IS NOT NULL THEN
        BEGIN
            INSERT INTO public.profiles (id, company_id, full_name, role)
            VALUES (
                NEW.id,
                _company_id,
                COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
                COALESCE(NEW.raw_user_meta_data ->> 'invite_role', 'agent')
            )
            ON CONFLICT (id) DO UPDATE SET 
                company_id = EXCLUDED.company_id,
                full_name = EXCLUDED.full_name;
        EXCEPTION WHEN others THEN
             RAISE WARNING 'Falha ao criar profile para %', NEW.email;
        END;

        -- 4. Create team_members fallback just in case
        BEGIN
            INSERT INTO public.team_members (user_id, company_id, name, email, role)
            VALUES (
                NEW.id,
                _company_id,
                COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
                NEW.email,
                COALESCE(NEW.raw_user_meta_data ->> 'invite_role', 'agent')::public.user_role
            ) ON CONFLICT (user_id) DO NOTHING;
        EXCEPTION WHEN others THEN
            RAISE WARNING 'Falha ao associar team_member para %', NEW.email;
        END;
        
        -- 5. User roles
        BEGIN
            _role := COALESCE(NEW.raw_user_meta_data ->> 'invite_role', 
                      CASE 
                         WHEN (NEW.raw_user_meta_data ->> 'is_owner')::BOOLEAN = true THEN 'owner'
                         ELSE 'viewer'
                      END);
                      
            INSERT INTO public.user_roles (user_id, company_id, role)
            VALUES (NEW.id, _company_id, _role::public.app_role)
            ON CONFLICT (user_id, company_id, role) DO NOTHING;
        EXCEPTION WHEN others THEN
            RAISE WARNING 'Falha ao criar user_role para %', NEW.email;
        END;
    END IF;

    RETURN NEW;
EXCEPTION WHEN others THEN
    -- Fallback final para não travar a criação da conta
    RAISE WARNING 'Erro fatal no handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

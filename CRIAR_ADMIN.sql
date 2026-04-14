DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    target_company_id UUID;
    user_exists UUID;
BEGIN
    -- Verificar se o usuário já existe
    SELECT id INTO user_exists FROM auth.users WHERE email = 'tatiana@canaaluxo.com';
    
    IF user_exists IS NULL THEN
        -- Inserir usuário novo direto como autenticado (sem precisar verificar email)
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
            recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
            created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 'tatiana@canaaluxo.com',
            crypt('Alanh310896', gen_salt('bf')),
            now(), now(), now(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Tatiana"}',
            now(), now(), '', '', '', ''
        );
        
        -- Inserir identidade de autenticação correspondente (corrigido provider_id)
        INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES (gen_random_uuid(), new_user_id::text, new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, 'tatiana@canaaluxo.com')::jsonb, 'email', now(), now(), now());
    ELSE
        -- Se já existir, apenas altera a senha e usa o id atual
        new_user_id := user_exists;
        UPDATE auth.users 
        SET encrypted_password = crypt('Alanh310896', gen_salt('bf')), 
            email_confirmed_at = now() 
        WHERE id = new_user_id;
    END IF;

    -- Pegar o ID da empresa padrão do sistema
    SELECT id INTO target_company_id FROM public.companies LIMIT 1;
    
    -- Criar ou atualizar os privilégios máximos no team_members
    UPDATE public.team_members 
    SET role = 'admin' 
    WHERE user_id = new_user_id AND company_id = target_company_id;
    
    IF NOT FOUND THEN
        INSERT INTO public.team_members (user_id, company_id, role, name)
        VALUES (new_user_id, target_company_id, 'admin', 'Tatiana');
    END IF;

    -- Adicionar como OWNER caso as tabelas de segurança extras existam  (Depende da versão instalada)
    BEGIN
        UPDATE public.user_roles 
        SET role = 'owner' 
        WHERE user_id = new_user_id AND company_id = target_company_id;
        
        IF NOT FOUND THEN
            INSERT INTO public.user_roles (user_id, company_id, role)
            VALUES (new_user_id, target_company_id, 'owner');
        END IF;
    EXCEPTION
        WHEN undefined_table THEN
            -- Se a tabela de roles não existir nessa versão, ignorar sem erros
            NULL;
    END;

    RAISE NOTICE 'Conta Admin criada e vinculada com sucesso!';
END $$;

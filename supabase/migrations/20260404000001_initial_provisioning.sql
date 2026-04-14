-- ---------------------------------------------------------------------------
-- SCRIPT DE PROVIMENTO DE DADOS (RODAR NO SQL EDITOR DO SUPABASE)
-- ---------------------------------------------------------------------------

-- 1. Criar a Empresa Canaã Luxo
INSERT INTO public.companies (id, name, slug)
VALUES ('c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a', 'Canaã Luxo', 'canaa')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Criar o Usuário no Auth (Tatiana)
-- Se este comando falhar no SQL Editor por falta de permissão, pule ele e use o Sign Up do app.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tatiana@canaaluxo.com') THEN
        INSERT INTO auth.users (
            id, 
            instance_id, 
            email, 
            encrypted_password, 
            email_confirmed_at, 
            raw_app_meta_data, 
            raw_user_meta_data, 
            created_at, 
            updated_at, 
            role, 
            confirmation_token, 
            email_change_token_new, 
            recovery_token
        )
        VALUES (
            'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a77', 
            '00000000-0000-0000-0000-000000000000', 
            'tatiana@canaaluxo.com', 
            crypt('Alanh310896', gen_salt('bf')), 
            now(), 
            '{"provider":"email","providers":["email"]}', 
            '{"full_name":"Tatiana","company_id":"c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a"}', 
            now(), 
            now(), 
            'authenticated', 
            '', '', ''
        );
    END IF;
END $$;

-- 3. Criar o Perfil no Public
INSERT INTO public.profiles (id, company_id, full_name, job_title)
VALUES (
    'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a77', 
    'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a', 
    'Tatiana', 
    'Diretora'
)
ON CONFLICT (id) DO UPDATE SET company_id = EXCLUDED.company_id;

-- 4. Criar Pipeline Padrão
INSERT INTO public.pipelines (id, company_id, name, is_default)
VALUES ('f2be1234-f2be-4c2a-8c2a-2c2a6a6a6a6a', 'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a', 'Imóveis', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Criar Estágios do Kanban
INSERT INTO public.pipeline_stages (id, pipeline_id, name, position, color)
VALUES 
('11111111-1111-1111-1111-111111111111', 'f2be1234-f2be-4c2a-8c2a-2c2a6a6a6a6a', 'Lead', 0, '#3B82F6'),
('22222222-2222-2222-2222-222222222222', 'f2be1234-f2be-4c2a-8c2a-2c2a6a6a6a6a', 'Contato', 1, '#8B5CF6'),
('33333333-3333-3333-3333-333333333333', 'f2be1234-f2be-4c2a-8c2a-2c2a6a6a6a6a', 'Visita', 2, '#F59E0B'),
('44444444-4444-4444-4444-444444444444', 'f2be1234-f2be-4c2a-8c2a-2c2a6a6a6a6a', 'Proposta', 3, '#10B981')
ON CONFLICT (id) DO NOTHING;

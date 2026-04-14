-- 1. Matar TODOS os vínculos que apontam para team_members nestas tabelas
DO $$
DECLARE
    r record;
BEGIN
    FOR r IN (
        SELECT conname, relname
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        JOIN pg_namespace n ON t.relnamespace = n.oid
        WHERE n.nspname = 'public'
        AND t.relname IN ('tasks', 'appointments')
        AND c.contype = 'f'
        AND confrelid = (SELECT oid FROM pg_class WHERE relname = 'team_members' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
    ) LOOP
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', r.relname, r.conname);
    END LOOP;
END $$;

-- 2. Recriar os vínculos apontando para PROFILES (onde os usuários realmente estão)
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_assigned_to_profiles_fkey;
ALTER TABLE public.appointments ADD CONSTRAINT appointments_assigned_to_profiles_fkey 
FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_profiles_fkey;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_assigned_to_profiles_fkey 
FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Limpar a aba de conversas (remover duplicatas de conversas que impedem o carregamento)
-- Se o usuário encontrar PGRST116, é melhor manter apenas a conversa mais recente.
DELETE FROM public.conversations a
USING public.conversations b
WHERE a.id < b.id 
AND a.contact_id = b.contact_id 
AND a.instance_id = b.instance_id;

-- 4. Notificar PostgREST
NOTIFY pgrst, 'reload schema';

-- Drop all possible policies on public.tasks
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'tasks'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tasks', pol.policyname);
    END LOOP;
END
$$;

-- Drop all possible policies on public.appointments
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'appointments'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.appointments', pol.policyname);
    END LOOP;
END
$$;


-- AGORA CRIAR APENAS AS POLÍTICAS PERFEITAS

CREATE POLICY "Enable all for tasks" ON public.tasks FOR ALL USING (true) WITH CHECK(true);
CREATE POLICY "Enable all for appointments" ON public.appointments FOR ALL USING (true) WITH CHECK(true);

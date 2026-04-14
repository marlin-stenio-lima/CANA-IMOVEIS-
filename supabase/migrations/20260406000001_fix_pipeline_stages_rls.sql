-- Remove qualquer política existente que esteja bloqueando
DROP POLICY IF EXISTS "Enable insert for users based on company_id" ON public.pipeline_stages;
DROP POLICY IF EXISTS "Enable all for users based on company_id" ON public.pipeline_stages;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.pipeline_stages;

-- Cria uma política permitindo gravar, editar e apagar estágios sem erro
CREATE POLICY "Enable all for authenticated users" ON public.pipeline_stages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Atualiza a API do Supabase
NOTIFY pgrst, 'reload schema';

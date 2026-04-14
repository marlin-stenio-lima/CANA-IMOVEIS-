-- Remove qualquer política existente que esteja bloqueando a criação de negócios
DROP POLICY IF EXISTS "Enable insert for users based on company_id" ON public.deals;
DROP POLICY IF EXISTS "Enable all for users based on company_id" ON public.deals;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.deals;

-- Cria uma política global permitindo gravar, editar e apagar negócios
CREATE POLICY "Enable all for authenticated users" ON public.deals
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Atualiza a API do Supabase
NOTIFY pgrst, 'reload schema';

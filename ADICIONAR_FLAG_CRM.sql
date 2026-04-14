-- 1. Adiciona a coluna para saber se foi criada pelo CRM
ALTER TABLE public.instances 
ADD COLUMN IF NOT EXISTS created_by_crm BOOLEAN DEFAULT false;

-- 2. Diferencia as instâncias (Marque as existentes como true se quiser que elas continuem aparecendo)
-- UPDATE public.instances SET created_by_crm = true; -- Descomente se quiser ver as atuais

-- 3. Garante que as novas políticas continuam funcionando
ALTER TABLE public.instances DISABLE ROW LEVEL SECURITY;

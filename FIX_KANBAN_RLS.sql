-- Script para corrigir permissões no Kanban (Pipelines, Stages e Deals)
-- Isso permite que corretores e administradores consigam ver e arrastar os leads.

ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- PIPELINES
DROP POLICY IF EXISTS "Allow all for authenticated on pipelines" ON public.pipelines;
CREATE POLICY "Allow all for authenticated on pipelines"
ON public.pipelines
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STAGES
DROP POLICY IF EXISTS "Allow all for authenticated on pipeline_stages" ON public.pipeline_stages;
CREATE POLICY "Allow all for authenticated on pipeline_stages"
ON public.pipeline_stages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- DEALS (ARRASTAR LEADS)
DROP POLICY IF EXISTS "Allow all for authenticated on deals" ON public.deals;
CREATE POLICY "Allow all for authenticated on deals"
ON public.deals
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

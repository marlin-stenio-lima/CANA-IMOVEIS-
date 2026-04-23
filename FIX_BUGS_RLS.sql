-- Script para corrigir permissões de banco de dados (Bugs Relatados)

-- 1. Permite atualizar o cargo/permissão da equipe (Profiles)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for authenticated on profiles" ON public.profiles;
CREATE POLICY "Allow all for authenticated on profiles"
ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Permite que outros corretores e admins vejam os pipelines e arrastem leads (Kanban)
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for authenticated on pipelines" ON public.pipelines;
CREATE POLICY "Allow all for authenticated on pipelines"
ON public.pipelines FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for authenticated on pipeline_stages" ON public.pipeline_stages;
CREATE POLICY "Allow all for authenticated on pipeline_stages"
ON public.pipeline_stages FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for authenticated on deals" ON public.deals;
CREATE POLICY "Allow all for authenticated on deals"
ON public.deals FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- CORREÇÃO FINAL DE RLS: SITE_SETTINGS
-- Melhora a robustez usando as funções SECURITY DEFINER (get_user_company_id)
-- ---------------------------------------------------------------------------

-- 1. Remover políticas que podem estar causando loop ou erro
DROP POLICY IF EXISTS "Company isolation for site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public read for published site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Users can view site settings from own company and subsidiaries" ON public.site_settings;
DROP POLICY IF EXISTS "Users can insert site settings for own company" ON public.site_settings;
DROP POLICY IF EXISTS "Users can update site settings for own company" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can view published site settings by slug" ON public.site_settings;

-- 2. Criar novas políticas usando funções de segurança robustas
-- Nota: public.can_view_company_data(id) e public.can_modify_company_data(id) já existem!

-- SELECT: Membros da empresa (e subsidiárias) ou sites publicados
CREATE POLICY "Users can view site settings from own company and subsidiaries" 
ON public.site_settings FOR SELECT 
USING (public.can_view_company_data(company_id) OR is_published = true);

-- INSERT: Apenas se o usuário pertencer àquela empresa
CREATE POLICY "Users can insert site settings for own company" 
ON public.site_settings FOR INSERT 
WITH CHECK (public.can_modify_company_data(company_id));

-- UPDATE: Apenas se o usuário pertencer àquela empresa
CREATE POLICY "Users can update site settings for own company" 
ON public.site_settings FOR UPDATE 
USING (public.can_modify_company_data(company_id))
WITH CHECK (public.can_modify_company_data(company_id));

-- 3. Garantir que RLS está habilitado
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Resumo: Agora o INSERT/UPDATE funcionará corretamente pois as funções
-- auxiliares (can_modify_company_data) ignoram o RLS das tabelas profiles/team_members.

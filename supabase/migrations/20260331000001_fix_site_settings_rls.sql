-- ---------------------------------------------------------------------------
-- CORREÇÃO DE RLS: SITE_SETTINGS
-- Melhora a consistência das permissões para evitar erro ao salvar
-- ---------------------------------------------------------------------------

-- 1. Remover políticas antigas para evitar conflito
DROP POLICY IF EXISTS "Users can view site settings from own company and subsidiaries" ON public.site_settings;
DROP POLICY IF EXISTS "Users can insert site settings for own company" ON public.site_settings;
DROP POLICY IF EXISTS "Users can update site settings for own company" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can view published site settings by slug" ON public.site_settings;

-- 2. Política Unificada: Isolamento por Empresa (Matriz ou Filial)
-- Permite todas as operações para membros da empresa (profiles ou team_members)
CREATE POLICY "Company isolation for site_settings" ON public.site_settings
    FOR ALL TO authenticated
    USING (
        company_id IN (SELECT company_id FROM public.team_members WHERE user_id = auth.uid())
        OR company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    )
    WITH CHECK (
        company_id IN (SELECT company_id FROM public.team_members WHERE user_id = auth.uid())
        OR company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid())
    );

-- 3. Política Pública: Leitura externa apenas para sites publicados
-- Permite que qualquer um (anon ou logado) veja os dados públicos do portal
CREATE POLICY "Public read for published site_settings" ON public.site_settings
    FOR SELECT TO anon, authenticated
    USING (is_published = true);

-- 4. Garantir que RLS esteja ativado
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Configurar Realtime
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
EXCEPTION WHEN others THEN NULL; END $$;

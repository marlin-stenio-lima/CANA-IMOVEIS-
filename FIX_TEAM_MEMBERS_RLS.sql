-- =========================================================================
-- SCRIPT DE CORREÇÃO: INFINITE RECURSION NA TEAM_MEMBERS
-- =========================================================================

-- 1. Remove qualquer política existente que esteja causando o loop infinito
DROP POLICY IF EXISTS "Users can view their own team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view team members in same company" ON public.team_members;
DROP POLICY IF EXISTS "Users can view all team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can insert their own team member" ON public.team_members;
DROP POLICY IF EXISTS "Users can update their own team member" ON public.team_members;
DROP POLICY IF EXISTS "Users can delete their own team member" ON public.team_members;

-- 2. Cria uma função segura (SECURITY DEFINER) para buscar o company_id sem ativar o RLS novamente
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.team_members WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 3. Cria as novas políticas usando a função segura, evitando o loop!

-- Política de Leitura (SELECT): Pode ver todos da mesma empresa ou a si mesmo
CREATE POLICY "Team members select policy" ON public.team_members
  FOR SELECT USING (
    company_id = public.get_user_company_id() OR user_id = auth.uid()
  );

-- Política de Inserção (INSERT): Pode se adicionar ou administradores podem adicionar
CREATE POLICY "Team members insert policy" ON public.team_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

-- Política de Atualização (UPDATE): Pode alterar seus próprios dados
CREATE POLICY "Team members update policy" ON public.team_members
  FOR UPDATE USING (
    user_id = auth.uid()
  );

-- Política de Deleção (DELETE): Pode deletar a si mesmo (ou via ADMIN)
CREATE POLICY "Team members delete policy" ON public.team_members
  FOR DELETE USING (
    user_id = auth.uid()
  );

-- 4. Garante que o RLS está habilitado
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Resumo: O problema foi resolvido usando SECURITY DEFINER!

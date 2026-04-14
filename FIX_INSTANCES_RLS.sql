-- =========================================================================
-- SCRIPT DE CORREÇÃO: RLS NA TABELA INSTANCES
-- =========================================================================

-- 1. Remove políticas antigas que podem estar bloqueando o INSERT
DROP POLICY IF EXISTS "Brokers view own instance" ON public.instances;
DROP POLICY IF EXISTS "Company isolation for instances" ON public.instances;

-- 2. Cria uma nova política robusta
-- Permite que usuários vejam/gerenciem instâncias se:
--   a) Eles forem o dono (assigned_to)
--   b) Eles forem Admin/Manager da empresa daquela instância
CREATE POLICY "Manage instances policy" ON public.instances
  FOR ALL TO authenticated
  USING (
    assigned_to IN (SELECT id FROM public.team_members WHERE user_id = auth.uid())
    OR company_id = public.get_user_company_id()
  )
  WITH CHECK (
    assigned_to IN (SELECT id FROM public.team_members WHERE user_id = auth.uid())
    OR company_id = public.get_user_company_id()
  );

-- nota: a função get_user_company_id() já foi criada no passo anterior de correção da team_members.

-- Resumo: Agora o INSERT não será mais bloqueado se o company_id estiver correto!

-- Fix: infinite recursion on team_members RLS policy
-- Solução: função SECURITY DEFINER que busca company_id sem passar pelo RLS

CREATE OR REPLACE FUNCTION public.get_my_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.team_members WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Remove políticas recursivas
DROP POLICY IF EXISTS "Users can view their own team members" ON public.team_members;
DROP POLICY IF EXISTS "Company isolation for team_members" ON public.team_members;

-- Nova policy sem recursão
CREATE POLICY "team_members_select" ON public.team_members
  FOR SELECT USING (
    company_id = public.get_my_company_id()
  );

CREATE POLICY "team_members_insert" ON public.team_members
  FOR INSERT WITH CHECK (
    company_id = public.get_my_company_id()
  );

CREATE POLICY "team_members_update" ON public.team_members
  FOR UPDATE USING (
    company_id = public.get_my_company_id()
  );

-- Também corrige outras tabelas que usam team_members na policy (mesmo problema)
DROP POLICY IF EXISTS "Company isolation for contacts" ON public.contacts;
CREATE POLICY "Company isolation for contacts" ON public.contacts
  FOR ALL TO authenticated
  USING (company_id = public.get_my_company_id());

DROP POLICY IF EXISTS "Company isolation for conversations" ON public.conversations;
CREATE POLICY "Company isolation for conversations" ON public.conversations
  FOR ALL TO authenticated
  USING (company_id = public.get_my_company_id());

DROP POLICY IF EXISTS "Company isolation for instances" ON public.instances;
CREATE POLICY "Company isolation for instances" ON public.instances
  FOR ALL USING (company_id = public.get_my_company_id());

DROP POLICY IF EXISTS "Company isolation for leads" ON public.leads;
CREATE POLICY "Company isolation for leads" ON public.leads
  FOR ALL USING (company_id = public.get_my_company_id());

DROP POLICY IF EXISTS "Company isolation for appointments" ON public.appointments;
CREATE POLICY "Company isolation for appointments" ON public.appointments
  FOR ALL TO authenticated
  USING (company_id = public.get_my_company_id());

DROP POLICY IF EXISTS "Company isolation for properties" ON public.properties;
CREATE POLICY "Company isolation for properties" ON public.properties
  FOR ALL USING (company_id = public.get_my_company_id());

DROP POLICY IF EXISTS "Company members can read KB" ON public.knowledge_base;
DROP POLICY IF EXISTS "Admins can manage KB" ON public.knowledge_base;
CREATE POLICY "Company isolation for knowledge_base" ON public.knowledge_base
  FOR ALL TO authenticated
  USING (company_id = public.get_my_company_id());

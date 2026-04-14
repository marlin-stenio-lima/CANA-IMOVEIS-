-- ---------------------------------------------------------------------------
-- CORREÇÃO DE RLS: TASKS E APPOINTMENTS
-- ---------------------------------------------------------------------------

-- 1. TASKS
DROP POLICY IF EXISTS "Company isolation for tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view tasks from own company and subsidiaries" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks in own company" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks in own company" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks in own company" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks for own company" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks for own company" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks for own company" ON public.tasks;

CREATE POLICY "Users can view tasks from own company and subsidiaries" 
ON public.tasks FOR SELECT 
USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert tasks for own company" 
ON public.tasks FOR INSERT 
WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update tasks for own company" 
ON public.tasks FOR UPDATE 
USING (public.can_modify_company_data(company_id))
WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete tasks for own company" 
ON public.tasks FOR DELETE 
USING (public.can_modify_company_data(company_id));

-- 2. APPOINTMENTS
DROP POLICY IF EXISTS "Company isolation for appointments" ON public.appointments;
DROP POLICY IF EXISTS "View appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view appointments from own company and subsidiaries" ON public.appointments;
DROP POLICY IF EXISTS "Users can insert appointments for own company" ON public.appointments;
DROP POLICY IF EXISTS "Users can update appointments for own company" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete appointments for own company" ON public.appointments;

CREATE POLICY "Users can view appointments from own company and subsidiaries" 
ON public.appointments FOR SELECT 
USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert appointments for own company" 
ON public.appointments FOR INSERT 
WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update appointments for own company" 
ON public.appointments FOR UPDATE 
USING (public.can_modify_company_data(company_id))
WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete appointments for own company" 
ON public.appointments FOR DELETE 
USING (public.can_modify_company_data(company_id));

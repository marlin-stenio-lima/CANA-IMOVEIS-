-- =============================================
-- MIGRAÇÃO 1: ENUMS E TABELA COMPANIES
-- =============================================

-- 1. Criar Enums
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'manager', 'seller', 'viewer');
CREATE TYPE public.deal_stage AS ENUM ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.contact_status AS ENUM ('active', 'inactive', 'lead', 'customer', 'churned');
CREATE TYPE public.activity_type AS ENUM ('call', 'email', 'meeting', 'note', 'task', 'deal_update');

-- 2. Tabela Companies (com hierarquia matriz/filial)
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  document TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  plan TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_companies_parent ON public.companies(parent_company_id);

-- =============================================
-- MIGRAÇÃO 2: TABELA PROFILES
-- =============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  job_title TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_company ON public.profiles(company_id);

-- =============================================
-- MIGRAÇÃO 3: TABELA USER_ROLES (SEPARADA)
-- =============================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, company_id, role)
);

CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_company ON public.user_roles(company_id);

-- =============================================
-- MIGRAÇÃO 4: TABELAS CRM
-- =============================================

-- Contacts
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT,
  status public.contact_status DEFAULT 'lead',
  source TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Deals (Pipeline)
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(15,2) DEFAULT 0,
  stage public.deal_stage DEFAULT 'lead',
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  closed_at TIMESTAMPTZ
);

-- Tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status DEFAULT 'pending',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  related_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  related_deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Activities (Histórico)
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  type public.activity_type NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_contacts_company ON public.contacts(company_id);
CREATE INDEX idx_deals_company ON public.deals(company_id);
CREATE INDEX idx_deals_stage ON public.deals(company_id, stage);
CREATE INDEX idx_tasks_company ON public.tasks(company_id);
CREATE INDEX idx_tasks_status ON public.tasks(company_id, status);
CREATE INDEX idx_activities_company ON public.activities(company_id);
CREATE INDEX idx_activities_contact ON public.activities(contact_id);

-- =============================================
-- MIGRAÇÃO 5: FUNÇÕES AUXILIARES RLS
-- =============================================

-- 1. Obter company_id do usuário logado
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid()
$$;

-- 2. Verificar se empresa é filial de outra
CREATE OR REPLACE FUNCTION public.is_subsidiary_of(child_company_id UUID, parent_company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.companies
    WHERE id = child_company_id
    AND parent_company_id = is_subsidiary_of.parent_company_id
  )
$$;

-- 3. Pode VISUALIZAR dados de uma empresa? (própria OU filiais se for matriz)
CREATE OR REPLACE FUNCTION public.can_view_company_data(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    target_company_id = public.get_user_company_id()
    OR 
    public.is_subsidiary_of(target_company_id, public.get_user_company_id())
$$;

-- 4. Pode MODIFICAR dados de uma empresa? (APENAS própria empresa)
CREATE OR REPLACE FUNCTION public.can_modify_company_data(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT target_company_id = public.get_user_company_id()
$$;

-- 5. Verificar se usuário tem um papel específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =============================================
-- MIGRAÇÃO 6: HABILITAR RLS E POLÍTICAS
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA COMPANIES
CREATE POLICY "Users can view own company and subsidiaries"
  ON public.companies FOR SELECT TO authenticated
  USING (public.can_view_company_data(id));

CREATE POLICY "Users can update own company"
  ON public.companies FOR UPDATE TO authenticated
  USING (public.can_modify_company_data(id))
  WITH CHECK (public.can_modify_company_data(id));

-- POLÍTICAS PARA PROFILES
CREATE POLICY "Users can view profiles from own company and subsidiaries"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- POLÍTICAS PARA USER_ROLES
CREATE POLICY "Users can view roles from own company"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.can_view_company_data(company_id));

-- POLÍTICAS PARA CONTACTS
CREATE POLICY "Users can view contacts from own company and subsidiaries"
  ON public.contacts FOR SELECT TO authenticated
  USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert contacts in own company"
  ON public.contacts FOR INSERT TO authenticated
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update contacts in own company"
  ON public.contacts FOR UPDATE TO authenticated
  USING (public.can_modify_company_data(company_id))
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete contacts in own company"
  ON public.contacts FOR DELETE TO authenticated
  USING (public.can_modify_company_data(company_id));

-- POLÍTICAS PARA DEALS
CREATE POLICY "Users can view deals from own company and subsidiaries"
  ON public.deals FOR SELECT TO authenticated
  USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert deals in own company"
  ON public.deals FOR INSERT TO authenticated
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update deals in own company"
  ON public.deals FOR UPDATE TO authenticated
  USING (public.can_modify_company_data(company_id))
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete deals in own company"
  ON public.deals FOR DELETE TO authenticated
  USING (public.can_modify_company_data(company_id));

-- POLÍTICAS PARA TASKS
CREATE POLICY "Users can view tasks from own company and subsidiaries"
  ON public.tasks FOR SELECT TO authenticated
  USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert tasks in own company"
  ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update tasks in own company"
  ON public.tasks FOR UPDATE TO authenticated
  USING (public.can_modify_company_data(company_id))
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete tasks in own company"
  ON public.tasks FOR DELETE TO authenticated
  USING (public.can_modify_company_data(company_id));

-- POLÍTICAS PARA ACTIVITIES
CREATE POLICY "Users can view activities from own company and subsidiaries"
  ON public.activities FOR SELECT TO authenticated
  USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert activities in own company"
  ON public.activities FOR INSERT TO authenticated
  WITH CHECK (public.can_modify_company_data(company_id));

-- =============================================
-- MIGRAÇÃO 7: TRIGGERS AUTOMÁTICOS
-- =============================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Trigger para criar perfil e role automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _company_id UUID;
BEGIN
  _company_id := (NEW.raw_user_meta_data ->> 'company_id')::UUID;
  
  -- Criar perfil
  INSERT INTO public.profiles (id, company_id, full_name)
  VALUES (
    NEW.id,
    _company_id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  
  -- Criar role padrão
  INSERT INTO public.user_roles (user_id, company_id, role)
  VALUES (
    NEW.id,
    _company_id,
    CASE 
      WHEN (NEW.raw_user_meta_data ->> 'is_owner')::BOOLEAN = true THEN 'owner'::public.app_role
      ELSE 'viewer'::public.app_role
    END
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- MIGRAÇÃO 8: CONFIGURAR REALTIME
-- =============================================

ALTER TABLE public.contacts REPLICA IDENTITY FULL;
ALTER TABLE public.deals REPLICA IDENTITY FULL;
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.activities REPLICA IDENTITY FULL;
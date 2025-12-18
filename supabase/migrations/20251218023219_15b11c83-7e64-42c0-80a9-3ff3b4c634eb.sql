-- =====================================================
-- FASE 1: Múltiplos Pipelines e Kanban Avançado
-- =====================================================

-- 1. Criar tabela de Pipelines
CREATE TABLE public.pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Criar tabela de Etapas do Pipeline
CREATE TABLE public.pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  position INTEGER DEFAULT 0,
  is_won_stage BOOLEAN DEFAULT false,
  is_lost_stage BOOLEAN DEFAULT false,
  target_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Criar tabela de Motivos de Perda
CREATE TABLE public.loss_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Alterar tabela deals para suportar múltiplos pipelines
ALTER TABLE public.deals 
  ADD COLUMN pipeline_id UUID REFERENCES public.pipelines(id),
  ADD COLUMN stage_id UUID REFERENCES public.pipeline_stages(id),
  ADD COLUMN lost_reason_id UUID REFERENCES public.loss_reasons(id),
  ADD COLUMN lost_at TIMESTAMPTZ,
  ADD COLUMN stage_entered_at TIMESTAMPTZ DEFAULT now();

-- 5. Criar índices para performance (sem idx_deals_stage que já existe)
CREATE INDEX idx_pipelines_company ON public.pipelines(company_id);
CREATE INDEX idx_pipeline_stages_pipeline ON public.pipeline_stages(pipeline_id);
CREATE INDEX idx_pipeline_stages_position ON public.pipeline_stages(pipeline_id, position);
CREATE INDEX idx_loss_reasons_company ON public.loss_reasons(company_id);
CREATE INDEX idx_deals_pipeline ON public.deals(pipeline_id);
CREATE INDEX idx_deals_pipeline_stage ON public.deals(pipeline_id, stage_id);

-- 6. Trigger para atualizar updated_at em pipelines
CREATE TRIGGER update_pipelines_updated_at
  BEFORE UPDATE ON public.pipelines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- RLS Policies
-- =====================================================

-- Pipelines RLS
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pipelines from own company and subsidiaries"
  ON public.pipelines FOR SELECT
  USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert pipelines in own company"
  ON public.pipelines FOR INSERT
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update pipelines in own company"
  ON public.pipelines FOR UPDATE
  USING (public.can_modify_company_data(company_id))
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete pipelines in own company"
  ON public.pipelines FOR DELETE
  USING (public.can_modify_company_data(company_id));

-- Pipeline Stages RLS
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view stages from accessible pipelines"
  ON public.pipeline_stages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p 
    WHERE p.id = pipeline_id 
    AND public.can_view_company_data(p.company_id)
  ));

CREATE POLICY "Users can insert stages in own company pipelines"
  ON public.pipeline_stages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.pipelines p 
    WHERE p.id = pipeline_id 
    AND public.can_modify_company_data(p.company_id)
  ));

CREATE POLICY "Users can update stages in own company pipelines"
  ON public.pipeline_stages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p 
    WHERE p.id = pipeline_id 
    AND public.can_modify_company_data(p.company_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.pipelines p 
    WHERE p.id = pipeline_id 
    AND public.can_modify_company_data(p.company_id)
  ));

CREATE POLICY "Users can delete stages in own company pipelines"
  ON public.pipeline_stages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p 
    WHERE p.id = pipeline_id 
    AND public.can_modify_company_data(p.company_id)
  ));

-- Loss Reasons RLS
ALTER TABLE public.loss_reasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view loss reasons from own company and subsidiaries"
  ON public.loss_reasons FOR SELECT
  USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert loss reasons in own company"
  ON public.loss_reasons FOR INSERT
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update loss reasons in own company"
  ON public.loss_reasons FOR UPDATE
  USING (public.can_modify_company_data(company_id))
  WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete loss reasons in own company"
  ON public.loss_reasons FOR DELETE
  USING (public.can_modify_company_data(company_id));
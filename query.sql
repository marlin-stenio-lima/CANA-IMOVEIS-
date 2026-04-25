SELECT id, created_at, updated_at, lost_at, stage, stage_id, pipeline_id, assigned_to FROM public.deals WHERE pipeline_id IN (SELECT id FROM pipelines WHERE name = 'Aluguel Anual');

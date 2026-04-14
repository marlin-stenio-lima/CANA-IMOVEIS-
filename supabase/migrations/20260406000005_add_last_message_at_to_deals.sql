-- Adiciona a coluna last_message_at na tabela deals para controle de inatividade do Bolsão
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ DEFAULT now();

-- Atualiza o cache do PostgREST
NOTIFY pgrst, 'reload schema';

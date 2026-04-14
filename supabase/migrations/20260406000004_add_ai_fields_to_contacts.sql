-- Adiciona campos de inteligência artificial na tabela de contatos
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS ai_summary text,
ADD COLUMN IF NOT EXISTS ai_sentiment text, -- 'hot', 'warm', 'cold', 'ignored'
ADD COLUMN IF NOT EXISTS last_ai_update timestamp with time zone;

-- Atualiza a API do Supabase
NOTIFY pgrst, 'reload schema';

-- Adiciona a coluna para a API Key da OpenAI na tabela companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS openai_api_key text,
ADD COLUMN IF NOT EXISTS ai_enabled boolean DEFAULT false;

-- Atualiza a API do Supabase
NOTIFY pgrst, 'reload schema';

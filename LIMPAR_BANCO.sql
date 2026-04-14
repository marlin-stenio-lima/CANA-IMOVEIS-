-- ==============================================================================
-- SCRIPT DE LIMPEZA DE BANCO DE DADOS (SUPABASE STORAGE EXCEEDED)
-- ==============================================================================

-- 1. Limpar integralmente a tabela de logs de webhooks 
-- (Geralmente a principal causadora de estouro de HD em integrações de WhatsApp)
TRUNCATE TABLE public.webhook_logs;

-- Caso você também tenha feito dezenas de milhares de mensagens de teste e queira apagar:
-- DELETE FROM public.messages WHERE status = 'delivered' AND sender_type = 'contact';

-- Liberar explicitamente o espaço em disco de volta para o sistema operacional e recalcular:
VACUUM FULL public.webhook_logs;

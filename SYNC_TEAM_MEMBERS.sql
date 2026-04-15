-- Script: Sincronizar perfis antigos com a tabela de equipe
-- Objetivo: Garantir que todos os usuários já cadastrados apareçam na lista de corretores

INSERT INTO public.team_members (user_id, company_id, name, email, role, active)
SELECT 
    p.id, 
    p.company_id, 
    p.full_name, 
    (SELECT email FROM auth.users WHERE id = p.id),
    COALESCE(p.role, 'agent')::public.user_role, 
    true
FROM public.profiles p
LEFT JOIN public.team_members tm ON p.id = tm.user_id
WHERE tm.id IS NULL;

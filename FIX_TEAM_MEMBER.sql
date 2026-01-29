-- CORREÇÃO DE PERMISSÃO (TEAM MEMBER)
-- O registro de membro da equipe existe mas está desconectado do usuário (user_id NULL) e na empresa errada.

UPDATE public.team_members
SET 
    user_id = 'ddff3b1f-1d39-4fa8-98ad-2ffb16b22380', -- ID do Usuário (Auth)
    company_id = '863d1959-fe72-4e1c-b84f-546bfa5e7ca3' -- ID da Empresa Correta
WHERE email = 'marlinstenio0312@gmail.com';

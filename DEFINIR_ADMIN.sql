-- Define o usuário como Admin na tabela team_members
UPDATE public.team_members
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'marlinstenio0312@gmail.com');

-- Define o usuário como Owner na tabela user_roles 
-- (dependendo da versão/migração que o seu banco está utilizando atualmente)
UPDATE public.user_roles
SET role = 'owner' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'marlinstenio0312@gmail.com');

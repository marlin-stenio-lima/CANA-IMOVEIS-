-- Script ATUALIZADO para vincular leads antigos
-- Agora pegando o corretor correto a partir da tabela de membros (instance_members)

UPDATE public.contacts AS c
SET assigned_to = tm.user_id
FROM public.conversations AS conv
JOIN public.instances AS i ON conv.instance_id = i.id
JOIN public.instance_members AS im ON i.id = im.instance_id
JOIN public.team_members AS tm ON im.team_member_id = tm.id
WHERE c.id = conv.contact_id
  AND c.assigned_to IS NULL
  AND tm.user_id IS NOT NULL;

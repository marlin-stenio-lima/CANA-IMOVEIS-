CREATE OR REPLACE FUNCTION delete_user_by_admin(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Segurança: Apenas admins ou owners podem executar esta função
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'owner')
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem excluir usuários.';
  END IF;

  -- Exclui os registros associados primeiro para evitar erros de chave estrangeira
  DELETE FROM public.team_members WHERE user_id = p_user_id;
  DELETE FROM public.profiles WHERE id = p_user_id;
  
  -- Exclui a conta de autenticação (e-mail e senha)
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;

# GUIA: Começando do Zero (Projeto Novo) 🌟

Se você criou um projeto novo no Supabase, o processo fica **muito mais limpo**.

Siga estes passos exatos:

## 1. Linkar o Novo Projeto
No terminal, rode o comando para desconectar o antigo e conectar o novo:

```powershell
# 1. Desconecta o antigo (se houver)
npx supabase unlink

# 2. Conecta o novo (Pegue o ID na URL do seu novo projeto)
npx supabase link --project-ref ID_DO_NOVO_PROJETO
```
*(Ele vai pedir a senha do banco de dados que você definiu na hora de criar o projeto).*

---

## 2. Preparar o Banco (Agora vai dar certo!)
Como o projeto está vazio, o comando de migração vai funcionar liso:

```powershell
npx supabase migration up
```

---

## 3. Subir a Inteligência (Funções)

```powershell
npx supabase functions deploy
```

---

## 4. Configurar as Chaves (Secrets)
**IMPORTANTE:** Como é um projeto novo, ele não tem as chaves.
Vá no Painel do Supabase > **Settings** > **Edge Functions** > **Secrets** e adicione novamente:

*   `OPENAI_API_KEY`
*   `EVOLUTION_API_URL`
*   `EVOLUTION_API_KEY`

---

## 5. Conectar no Frontend
Agora, abra o arquivo `.env` na pasta do seu projeto (no VS Code) e atualize a URL e a KEY do Supabase (estão nas configurações do projeto novo: Settings > API).

```env
VITE_SUPABASE_URL=https://novo-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-nova-key
```

Pronto! Sistema zerado e 100% funcional.

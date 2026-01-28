# MANUAL DE INSTALAÇÃO: Guia Definitivo 📍

## 1. Onde colocar as CHAVES (Senhas) 🔑
**Onde:** No Painel do Supabase (Navegador).
1.  Acesse [Supabase Dashboard](https://supabase.com/dashboard).
2.  Vá em **Settings (Engrenagem)** > **Edge Functions** > **Secrets**.
3.  Adicione (uma por uma):
    *   `OPENAI_API_KEY`
    *   `EVOLUTION_API_URL`
    *   `EVOLUTION_API_KEY`

---

## 2. Configurando o Banco de Dados (PLANO B - INFALÍVEL) �
Se o terminal deu erro de migração, faça isso que resolve na hora:

1.  Abra o arquivo `COMPLETE_SETUP.sql` que criei na pasta do seu projeto.
2.  Copie **todo** o código que está dentro dele.
3.  Vá no **Supabase Dashboard** > **SQL Editor** (ícone quadrado no menu esquerdo).
4.  Clique em "New query", cole o código e aperte **RUN**.
    *(Isso vai criar todas as tabelas: Conversas, Agendas, Instâncias, Roleta, etc)*.

---

## 3. Subindo as Funções (Cérebro) 🧠
**Onde:** No seu Terminal.

Rode este comando exato para subir todas as funções de uma vez:

```powershell
npx supabase functions deploy ai-agent webhook-whatsapp send-outbound evolution-manager property-inquiry
```

*(Se pedir confirmação, digite `y`)*.

---

## 4. Onde conectar o WHATSAPP 📱
**Onde:** Na tela do seu CRM.

1.  Vá em **Configurações > WhatsApp Multi-Contas**.
2.  Clique em **"Conectar WhatsApp"** no nome do corretor.
3.  Escaneie o QR Code.

Pronto!

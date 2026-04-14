# 📂 Handoff do Projeto JARVIS & Voice Sales Agent

**Para o Próximo Agente:**
Este documento contém todo o planejamento, arquitetura e decisões técnicas tomadas para o projeto "JARVIS + Agente de Vendas por Voz".
O objetivo é criar um sistema **SaaS Multi-Agente** que orquestra leads e vendas.

---

## 1. Resumo do Objetivo
Criar um clone funcional do sistema de Multi-Agentes do Thyago Finch, focado em **Vendas Imobiliárias**.
*   **Agente 1 (Hunter):** Monitora leads do Facebook em tempo real (via Webhooks).
*   **Agente 2 (Voice Sales):** Liga para o lead em < 5 segundos usando **Vapi.ai** para qualificar e agendar.
*   **Agente 3 (Midas):** Monitora anúncios e sugere otimizações (Futuro).

---

## 2. Decisões Técnicas Críticas (Já Aprovadas)
1.  **Ingestão de Leads:**
    *   **NÃO** usar Zapier. Usar **Webhooks do Facebook** diretos para latência zero.
    *   **UX do Cliente:** Fluxo **OAuth (Login com Facebook)**. O cliente clica em "Conectar", e o sistema se inscreve automaticamente nos formulários (`subscribed_apps`).
2.  **Orquestração:**
    *   Backend em **Python** (FastAPI/Flask).
    *   Framework de Agentes: **LangGraph** (para controle de estado) ou **CrewAI**.
3.  **Telefonia IA:**
    *   Platforma: **Vapi.ai** ou **Bland AI**.
    *   Latência alvo: < 800ms.
4.  **Aprovação do App Facebook:**
    *   Estratégia: Começar em **Modo de Desenvolvimento**. Adicionar clientes piloto como "Testers" manuais.
    *   Só aplicar para "Live Mode" (App Review) quando for escalar publicamente.

---

## 3. Arquitetura do Sistema
```mermaid
graph TD
    User[Cliente Imobiliária] -->|1. Clica 'Conectar'| Auth[OAuth Facebook]
    Auth -->|2. Token Salvo| DB[(Supabase/Postgres)]
    Lead[Novo Lead no Facebook] -->|3. Webhook (JSON)| API[Nosso Backend Python]
    API -->|4. Busca Regras| DB
    API -->|5. Aciona| Voice[Vapi.ai Phone Call]
    Voice -->|6. Liga| EndUser[Lead Final]
    Voice -->|7. Resultado| CRM[Atualiza CRM/Planilha]
```

---

## 4. Próximos Passos (Para Execução Imediata)
O próximo agente deve começar pela **Fase 1: Infraestrutura de Conexão**.

1.  **Criar App no Meta Developers:**
    *   Acessar `developers.facebook.com`.
    *   Criar App tipo "Negócios".
    *   Configurar "Login do Facebook" e "Webhooks".
    *   **Permissões:** `leads_retrieval`, `pages_manage_metadata`, `pages_show_list`.
2.  **Backend de Autenticação:**
    *   Criar rota `/auth/facebook/callback` para trocar o código pelo `Access Token`.
    *   Criar rota `/webhook/facebook` para receber os leads.

---

## 5. Setup do Ambiente
*   **Linguagem:** Python 3.10+
*   **Dependências:** `fastapi`, `uvicorn`, `requests`, `python-dotenv`.
*   **Variáveis de Ambiente Necessárias:**
    *   `FACEBOOK_APP_ID`
    *   `FACEBOOK_APP_SECRET`
    *   `VAPI_API_KEY`
    *   `OPENAI_API_KEY`

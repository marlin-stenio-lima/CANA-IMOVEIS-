# Guia de Instalação: Evolution API (Hetzner VPS)

Este guia ajuda a colocar o "Gateway WhatsApp" no ar em minutos na sua VPS nova.

## 1. Acesse sua VPS
Abra o terminal (Powershell ou CMD) e conecte via SSH:
```bash
ssh root@<IP_DA_SUA_VPS>
```

## 2. Instale o Docker
Rode este comando para instalar Docker e Docker Compose automaticamente:
```bash
curl -fsSL https://get.docker.com | sh
```

## 3. Suba o Evolution API
1.  Crie uma pasta: `mkdir evolution && cd evolution`
2.  Crie o arquivo `docker-compose.yml`:
    *   Você pode copiar o conteúdo do arquivo `infrastructure/docker-compose.yml` que criei no projeto.
    *   Ou usar `nano docker-compose.yml` e colar o código.
3.  **IMPORTANTE**: Edite a linha `WEBHOOK_GLOBAL_URL`:
    *   Troque `[SEU_PROJETO]` pelo ID do seu projeto Supabase (ex: `abcde123`).
    *   Se ainda não souber o ID, deixe comentado por enquanto e configure na interface depois.
4.  Rode o sistema:
```bash
docker compose up -d
```

## 4. Configuração Final
1.  Acesse `http://<IP_DA_SUA_VPS>:8080/manager` (Se pedir ApiKey, é a que colocou no arquivo, ex: `mudar_essa_senha_global`).
2.  Crie uma instância (ex: `Atendimento01`).
3.  Escaneie o QR Code.
4.  **Verifique o Webhook**:
    *   Vá nas configurações da Instância > Webhook.
    *   Certifique que a URL é a da sua função Supabase (`.../functions/v1/webhook-whatsapp`).
    *   Certifique que `Messages Upsert` está ativado.

Pronto! Seu WhatsApp já está conectado ao CRM.

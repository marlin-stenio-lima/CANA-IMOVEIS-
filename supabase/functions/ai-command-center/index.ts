import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CommandPayload {
  message: string;
  broker_phone: string;
  broker_id: string; // From our validation
  company_id: string; // From our validation
  instance_name: string; // To reply back via Evolution
  log_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let payload: CommandPayload | null = null;
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')!
    const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseKey)
    payload = await req.json()
    console.log(`[AI Command Center] Recebeu comando de ${payload?.broker_phone}:`, payload?.message)

    // Busca a chave da OpenAI nas configurações do CRM (tabela companies)
    let openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey && payload) {
        const { data: companyData } = await supabase.from('companies').select('openai_api_key').eq('id', payload.company_id).maybeSingle();
        if (companyData && companyData.openai_api_key) {
            openAiKey = companyData.openai_api_key;
        }
    }

    if (!openAiKey) {
        return new Response(JSON.stringify({ error: 'OPENAI_API_KEY não configurada no CRM.' }), { status: 400, headers: corsHeaders });
    }

    const openai = new OpenAI({ apiKey: openAiKey })

    // 1. Validar se o corretor existe (Double check por segurança)
    const { data: broker } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', payload!.broker_id)
      .single()

    if (!broker) {
       return new Response(JSON.stringify({ error: 'Broker not found' }), { status: 403, headers: corsHeaders });
    }

    // 2. Definir o Prompt Principal (System Prompt)
    const systemPrompt = `
      Você é a "Central IA", a inteligência artificial operadora do CRM Canaã.
      Seu objetivo ÚNICO é receber comandos do corretor ou gestor e executar ações no banco de dados.
      Você NÃO conversa com clientes (leads). Você APENAS atende ordens internas.

      CONTEXTO ATUAL:
      - Corretor/Usuário que está pedindo: ${broker.full_name}
      - Cargo dele: ${broker.role} (se for 'admin' ou 'owner', ele pode pedir relatórios globais. Se for 'agent', apenas os dele).

      DIRETRIZES:
      1. Se o corretor pedir para agendar visita, mover kanban, ou criar tarefa, e faltar informações importantes (ex: quem é o cliente, qual o horário), VOCÊ DEVE PERGUNTAR DE VOLTA. Exemplo: "Certo, mas para qual cliente é a visita?".
      2. Se ele pedir um relatório e você for admin, analise os dados.
      3. Nunca invente dados. Use as ferramentas (functions) fornecidas.
      4. Suas respostas serão enviadas no WhatsApp do corretor. Use emojis e formatação agradável (negrito, itálico).
    `;

    // 3. Definir as Ferramentas (Functions)
    const tools = [
      {
        type: "function",
        function: {
          name: "get_kanban_summary",
          description: "Gera um relatório rápido com a quantidade de contatos em cada etapa do Kanban.",
          parameters: {
            type: "object",
            properties: {
              scope: { type: "string", enum: ["meus", "todos"], description: "Se o corretor quer ver apenas os dele ou de todos." }
            },
            required: ["scope"]
          }
        }
      },
      // Aqui vamos adicionar as outras ferramentas nos próximos passos:
      // - move_kanban_card
      // - schedule_visit
      // - create_task
    ]

    // 4. Chamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Mais rápido e barato para comandos
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: payload!.message }
      ],
      tools: tools as any,
      tool_choice: 'auto'
    })

    const responseMessage = completion.choices[0].message
    let finalReply = responseMessage.content

    // 5. Executar as Funções (Tool Calling)
    if (responseMessage.tool_calls) {
      for (const toolCall of responseMessage.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments)

        if (toolCall.function.name === 'get_kanban_summary') {
            // Lógica para puxar relatório de funil de vendas
            let query = supabase.from('deals').select('stage, title, value');
            
            if (args.scope === 'meus' || broker.role === 'agent') {
                query = query.eq('assigned_to', broker.id); // Agentes só veem os deles
            }

            const { data: deals } = await query;
            
            // Simular contagem
            const countByStage = (deals || []).reduce((acc: any, deal: any) => {
                acc[deal.stage] = (acc[deal.stage] || 0) + 1;
                return acc;
            }, {});

            finalReply = `📊 *Relatório Rápido de Funil*\n\n`;
            for (const [stage, count] of Object.entries(countByStage)) {
                finalReply += `🔹 *${stage}*: ${count} negócios\n`;
            }
            if (!deals || deals.length === 0) finalReply += "Nenhum negócio encontrado na sua base.";
        }
      }
      
      if (!finalReply) finalReply = "Comando processado com sucesso! ✅"
    }

    // 6. Enviar a resposta de volta para o Corretor via WhatsApp (Evolution)
    if (finalReply) {
      const sendUrl = `${evolutionUrl}/message/sendText/${payload!.instance_name}`
      await fetch(sendUrl, {
        method: 'POST',
        headers: {
          'apikey': evolutionKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: payload!.broker_phone, // Envia de volta para o número que enviou a ordem
          options: { delay: 1000, presence: 'composing' },
          textMessage: { text: finalReply }
        })
      })
    }

    // 7. Atualiza o Log
    if (payload!.log_id) {
        await supabase.from('ai_logs').update({
            response: finalReply,
            status: 'success'
        }).eq('id', payload!.log_id);
    }

    return new Response(JSON.stringify({ success: true, reply: finalReply }), { headers: corsHeaders })

  } catch (error: any) {
    console.error('AI Command Error:', error)
    if (payload?.log_id) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)
        await supabase.from('ai_logs').update({
            status: 'error',
            error_message: error.message
        }).eq('id', payload.log_id);
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AgentPayload {
  mode?: 'chat' | 'follow_up' // Default 'chat'
  message?: string
  contact_id: string
  company_id: string
  conversation_id: string // Need this to reply back
  instance_name: string // Correct instance to reply from
  broker_id: string // Which broker owns this chat?
  active_agent_id?: number // Global override from Mission Control
  conversation_history?: { role: 'user' | 'assistant', content: string }[]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openAiKey = Deno.env.get('OPENAI_API_KEY')

    // For replying
    const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')!
    const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')!

    // if (!openAiKey) throw new Error('OPENAI_API_KEY not set') // Removed this line as per instruction

    const supabase = createClient(supabaseUrl, supabaseKey)
    let openai: OpenAI | null = null; // Initialize as null
    if (openAiKey) {
      openai = new OpenAI({ apiKey: openAiKey })
    }

    const payload: AgentPayload = await req.json()
    console.log(`AI Agent (${payload.mode || 'chat'}) received:`, payload)

    // 1. Fetch Contact & Context
    const { data: contact } = await supabase.from('contacts').select('*').eq('id', payload.contact_id).single()

    // 2. Fetch Knowledge Base
    const { data: kbArticles } = await supabase
      .from('knowledge_base')
      .select('title, content')
      .eq('company_id', payload.company_id)
      .eq('is_active', true)
      .limit(5)

    const kbContext = kbArticles?.map(k => `[${k.title}]: ${k.content}`).join('\n\n') || "No specific knowledge base found."

    // 3. Fetch Property Context (Real Data)
    let propertyData: any = null;
    let propertyImages: any[] = [];

    // Check if contact has specific property interest (Added via migration)
    // We casts as any because types might be outdated in Deno land
    const interestPropertyId = (contact as any)?.interest_property_id;

    if (interestPropertyId) {
      const { data: p } = await supabase.from('properties').select('*').eq('id', interestPropertyId).single();
      if (p) {
        propertyData = p;
        const { data: imgs } = await supabase.from('property_images').select('url').eq('property_id', p.id).limit(3);
        propertyImages = imgs || [];
      }
    }

    // 4. Define Agents Prompts
    // Priority: Payload (Global) > Contact Specific > Default (1)
    const activeAgentId = payload.active_agent_id || (contact as any)?.active_agent_id || 1;
    const followUpStep = (contact as any)?.follow_up_step || 0;
    const mode = payload.mode || 'chat';

    const CHAT_PROMPTS: Record<number, string> = {
      1: `
Você é um assistente de Triagem da imobiliária.
Seu objetivo ÚNICO é: Responder dúvidas básicas do cliente e, assim que possível, TRANSFERIR para um corretor humano.

Contexto do Imóvel: {{imovel_titulo}} em {{imovel_bairro}}.
Dados: {{imovel_quartos}} quartos, Valor: {{imovel_valor}}.

Fluxo:
1. Responda a dúvida do cliente de forma curta e gentil.
2. Não tente vender agressivamente.
3. Finalize dizendo: "Vou pedir para um de nossos corretores especialistas te chamar para dar mais detalhes, ok?"
`,
      2: `
Você é um assistente de Agendamento.
Seu objetivo ÚNICO é: Agendar uma visita ao imóvel.

Contexto do Imóvel: {{imovel_titulo}} em {{imovel_bairro}}.
Horários de Visita: Seg-Sex, 08h-18h. Sáb, 08h-12h.

Fluxo:
1. Responda dúvidas sobre o imóvel.
2. Em toda resposta, tente puxar para o agendamento: "Que tal conhecer pessoalmente?"
3. Se o cliente concordar, pergunte qual o melhor dia e horário.
4. Use a função 'book_appointment' se ele confirmar um horário específico.
`
    };

    const FOLLOW_UP_PROMPTS: Record<number, string> = {
      1: `PASSO 1 (IMEDIATO): Gere uma mensagem de retomada focada no imóvel original. Diga: "Olá! Vi que ficou sem resposta. Vou te mandar algumas fotos da {{imovel_titulo}} para ver os detalhes." (O sistema enviará as fotos).`,
      2: `PASSO 2 (48 HORAS): Gere uma mensagem de insistência leve. Diga: "Ainda não recebi seu retorno sobre a {{imovel_titulo}}. Ficou alguma dúvida sobre o valor ou localização?"`,
      3: `PASSO 3 (7 DIAS): Gere uma sugestão de similares. "Oi! A {{imovel_titulo}} ainda está disponível, mas tenho outras opções nesse perfil no bairro {{imovel_bairro}}. Quer dar uma olhada?"`,
      4: `PASSO 4 (14 DIAS): Gere uma nova sugestão. "Separei 2 imóveis que acabaram de entrar e lembrei de você. Busca algo com {{imovel_quartos}} quartos ainda?"`,
      5: `PASSO 5 (30 DIAS): Última tentativa ativa. Pergunte se o cliente já comprou ou se pausou a busca.`,
      6: `PASSO 6 (45 DIAS): Encerramento. "Como não tivemos mais retorno, vou encerrar seu atendimento por aqui para não incomodar. Se precisar no futuro, estou à disposição!"`
    };

    let basePrompt = "";
    let userMessage = payload.message || "";

    if (mode === 'follow_up') {
      const step = followUpStep + 1; // Assuming we are executing the NEXT step
      basePrompt = `Você é um assistente de Follow-up Imobiliário.
        Seu objetivo agora é executar o passo ${step} da régua de relacionamento.

        INSTRUÇÃO DO PASSO:
        ${FOLLOW_UP_PROMPTS[step] || FOLLOW_UP_PROMPTS[5]}

        Contexto do Imóvel: {{imovel_titulo}} em {{imovel_bairro}}.
        `;
      userMessage = "Execute o follow-up agora."; // Trigger for the AI
    } else {
      basePrompt = CHAT_PROMPTS[activeAgentId] || CHAT_PROMPTS[1];
    }

    // Inject Variables
    const vars: any = {
      '{{imovel_titulo}}': propertyData?.title || 'imóvel de nosso catálogo',
      '{{imovel_bairro}}': propertyData?.address || 'bairro excelente',
      '{{imovel_quartos}}': propertyData?.bedrooms || 'vários',
      '{{imovel_valor}}': propertyData?.price ? `R$ ${propertyData.price}` : 'Sob consulta',
      '{{imovel_fotos}}': propertyImages.map(i => i.url).join(', ')
    };

    for (const [key, val] of Object.entries(vars)) {
      basePrompt = basePrompt.replace(new RegExp(key, 'g'), val as string);
    }

    const systemPrompt = `
      ${basePrompt}

      ATUANDO EM NOME DO CORRETOR ID: ${payload.broker_id}
      CENÁRIO ATUAL:
      Nome Cliente: ${contact?.name || 'Amigo'}

      BASE DE CONHECIMENTO GERAL:
      ${kbContext}

      DIRETRIZES FINAIS:
      - Respostas curtas e naturais para WhatsApp.
      - Não invente dados do imóvel.
    `;

    // 4. Tools (Updated for Broker Context)
    const tools = [
      {
        type: "function",
        function: {
          name: "update_contact_info",
          description: "Salva informações importantes sobre o cliente",
          parameters: {
            type: "object",
            properties: {
              field: { type: "string" },
              value: { type: "string" }
            },
            required: ["field", "value"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "check_availability",
          description: "Verifica horários disponíveis na agenda DO CORRETOR",
          parameters: {
            type: "object",
            properties: {
              date: { type: "string", description: "YYYY-MM-DD" }
            },
            required: ["date"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "book_appointment",
          description: "Agenda uma visita",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string" },
              start_time: { type: "string" },
              end_time: { type: "string" }
            },
            required: ["title", "start_time", "end_time"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "send_property_photos",
          description: "Busca e envia fotos de um imóvel específico. Use palavras-chave como 'casa no centro' ou 'apartamento 2 quartos'.",
          parameters: {
            type: "object",
            properties: {
              keywords: { type: "string", description: "Termos de busca para encontrar o imóvel, ex: 'casa piscina centro'" }
            },
            required: ["keywords"]
          }
        }
      }
    ]

    let responseMessage: any;

    if (!openai) {
      console.warn("⚠️ MOCK MODE: OpenAI Key not found. Generating simulation.");
      const mockText = `[MOCK AI - AGENTE ${activeAgentId}]\n(Modo de Teste sem Custo)\n\nEu responderia como ${mode === 'follow_up' ? 'Follow-up Passo ' + (followUpStep + 1) : 'Agente ' + activeAgentId}.\n\nContexto do Imóvel: ${propertyData?.title || 'Nenhum'}\nPrompt Base: ${basePrompt.substring(0, 50)}...`;

      responseMessage = {
        role: 'assistant',
        content: mockText
      };
    } else {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(payload.conversation_history || []),
        { role: 'user', content: userMessage }
      ]

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages as any,
        tools: tools as any,
        tool_choice: 'auto'
      })
      responseMessage = completion.choices[0].message
    }
    let finalReply = responseMessage.content

    // 5. Handle Tool Calls
    if (responseMessage.tool_calls) {
      for (const toolCall of responseMessage.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments)

        if (toolCall.function.name === 'update_contact_info') {
          const currentFields = contact?.custom_fields || {}
          const newFields = { ...currentFields, [args.field]: args.value }
          await supabase.from('contacts').update({ custom_fields: newFields }).eq('id', payload.contact_id)
          finalReply = `(Info salva) ` + (finalReply || "")
        }

        else if (toolCall.function.name === 'check_availability') {
          // Check ONLY Broker's availability
          const { data: apps } = await supabase
            .from('appointments')
            .select('start_time')
            .eq('assigned_to', payload.broker_id) // Filter by broker!
            .gte('start_time', `${args.date}T00:00:00`)
            .lte('start_time', `${args.date}T23:59:59`)

          finalReply = `(Agenda checada, ocupados: ${apps?.map(a => a.start_time).join(', ') || 'Livre'}). ` + (finalReply || "")
        }

        else if (toolCall.function.name === 'book_appointment') {
          await supabase.from('appointments').insert({
            company_id: payload.company_id,
            contact_id: payload.contact_id,
            assigned_to: payload.broker_id, // Assign to broker!
            title: args.title,
            start_time: args.start_time,
            end_time: args.end_time,
            status: 'scheduled'
          })
          finalReply = "Agendamento confirmado! " + (finalReply || "")
        }

        else if (toolCall.function.name === 'send_property_photos') {
          // Search property
          const { data: props } = await supabase
            .from('properties')
            .select('id, title')
            .eq('company_id', payload.company_id)
            .ilike('title', `%${args.keywords}%`)
            .limit(1)

          if (props && props.length > 0) {
            const property = props[0]
            // Get cover image
            const { data: img } = await supabase
              .from('property_images')
              .select('url')
              .eq('property_id', property.id)
              .order('is_cover', { ascending: false }) // true first
              .limit(1)
              .maybeSingle()

            if (img && img.url) {
              // Send Media via Evolution
              const sendUrl = `${evolutionUrl}/message/sendMedia/${payload.instance_name}`
              await fetch(sendUrl, {
                method: 'POST',
                headers: {
                  'apikey': evolutionKey,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  number: contact.phone,
                  mediatype: 'image',
                  mimetype: 'image/jpeg',
                  media: img.url,
                  caption: `Fotos de: ${property.title}`
                })
              })
              finalReply = `(Foto de ${property.title} enviada) ` + (finalReply || "")
            } else {
              finalReply = `(Encontrei o imóvel ${property.title}, mas ele não tem fotos cadastradas). ` + (finalReply || "")
            }
          } else {
            finalReply = `(Não encontrei imóvel com esses termos: ${args.keywords}). ` + (finalReply || "")
          }
        }
      }

      // Retry content generation if needed
      if (!finalReply) finalReply = "Ok, processado."
    }

    // 6. Send Reply via Evolution (Specific Instance)
    if (finalReply) {
      const sendUrl = `${evolutionUrl}/message/sendText/${payload.instance_name}`
      const evoRes = await fetch(sendUrl, {
        method: 'POST',
        headers: {
          'apikey': evolutionKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: contact.phone,
          options: { delay: 1000, presence: 'composing' },
          textMessage: { text: finalReply }
        })
      })

      const evoData = await evoRes.json()
      // Evolution v2 usually returns { key: { id: "..." } } or just { id: "..." } depending on version/config
      const wamid = evoData?.key?.id || evoData?.id;

      // Log
      await supabase.from('messages').insert({
        conversation_id: payload.conversation_id,
        sender_type: 'ai',
        content: finalReply,
        wamid: wamid // Save WAMID to identify this as AI message later
      })
    }

    return new Response(JSON.stringify({ response: finalReply }), { headers: mapHeaders(corsHeaders) })

  } catch (error) {
    console.error('AI Error:', error)

    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const adminSupabase = createClient(supabaseUrl, supabaseKey)
      await adminSupabase.from('webhook_logs').insert({
        payload: {
          source: 'ai-agent-error',
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      })
    } catch (logErr) {
      console.error("Failed to log error to DB:", logErr)
    }

    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})

function mapHeaders(headers: any) {
  return { ...headers, 'Content-Type': 'application/json' };
}

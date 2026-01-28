import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AgentPayload {
  message: string
  contact_id: string
  company_id: string
  conversation_id: string // Need this to reply back
  instance_name: string // Correct instance to reply from
  broker_id: string // Which broker owns this chat?
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

    if (!openAiKey) throw new Error('OPENAI_API_KEY not set')

    const supabase = createClient(supabaseUrl, supabaseKey)
    const openai = new OpenAI({ apiKey: openAiKey })

    const payload: AgentPayload = await req.json()
    console.log('AI Agent (Multi-Instance) received:', payload)

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

    // 3. Define System Prompt (Broker Aware)
    const systemPrompt = `
      Você é um assistente virtual agindo em nome do corretor (ID: ${payload.broker_id}).
      Seu objetivo é qualificar o lead e agendar uma visita na SUA agenda.
      
      CONTEXTO DO CLIENTE:
      Nome: ${contact?.name || 'Desconhecido'}
      Dados atuais: ${JSON.stringify(contact?.custom_fields || {})}
      
      BASE DE CONHECIMENTO:
      ${kbContext}
      
      DIRETRIZES:
      1. Seja cordial.
      2. Ao agendar, verifique APENAS a agenda deste corretor.
    `

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
      }
    ]

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(payload.conversation_history || []),
      { role: 'user', content: payload.message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      tools: tools as any,
      tool_choice: 'auto'
    })

    const responseMessage = completion.choices[0].message
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
      }

      // Retry content generation if needed
      if (!finalReply) finalReply = "Ok, processado."
    }

    // 6. Send Reply via Evolution (Specific Instance)
    if (finalReply) {
      const sendUrl = `${evolutionUrl}/message/sendText/${payload.instance_name}` // Using correct instance
      await fetch(sendUrl, {
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

      // Log
      await supabase.from('messages').insert({
        conversation_id: payload.conversation_id,
        sender_type: 'ai',
        content: finalReply
      })
    }

    return new Response(JSON.stringify({ response: finalReply }), { headers: mapHeaders(corsHeaders) })

  } catch (error) {
    console.error('AI Error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})

function mapHeaders(headers: any) {
  return { ...headers, 'Content-Type': 'application/json' };
}

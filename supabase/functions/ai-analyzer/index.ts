import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        const reqData = await req.json()
        const contactId = reqData.contactId

        if (!contactId) {
            return new Response(JSON.stringify({ error: 'ID do contato não enviado' }), { status: 400, headers: corsHeaders })
        }

        const { data: company } = await supabase.from('companies').select('*').limit(1).single()
        if (!company?.openai_api_key) {
            return new Response(JSON.stringify({ error: 'Configure a sua chave API nas configurações primeiro.' }), { status: 400, headers: corsHeaders })
        }

        const { data: contact } = await supabase.from('contacts').select('*').eq('id', contactId).single()
        if (!contact) return new Response(JSON.stringify({ error: 'Contato não encontrado' }), { status: 404, headers: corsHeaders })

        const { data: messages } = await supabase
            .from('messages')
            .select('content, sender_type')
            .eq('conversation_id', contact.last_conversation_id || '')
            .order('created_at', { ascending: false })
            .limit(30)

        const conversationText = messages?.reverse().map(m => `${m.sender_type === 'user' ? 'CLIENTE' : 'ATENDENTE'}: ${m.content}`).join('\n') || "Sem conversas recentes."

        const openai = new OpenAI({ apiKey: company.openai_api_key })

        const prompt = `
    Analise profundamente as conversas do lead ${contact.name} e forneça um relatório detalhado.
    
    HISTÓRICO DE CONVERSAS:
    ${conversationText}

    Responda EXATAMENTE no formato JSON abaixo:
    {
      "summary": "Um resumo executivo de 2 linhas",
      "profile": "Perfil do cliente (ex: Investidor, Família, etc)",
      "interests": "O que ele procura (tipo de imóvel, bairro, valor)",
      "objections": "Principais dúvidas ou travas",
      "next_step": "A melhor ação para o corretor tomar agora",
      "sentiment": "hot, warm, cold ou ignored"
    }
    `

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: prompt }],
            response_format: { type: 'json_object' }
        })

        const aiResult = JSON.parse(completion.choices[0].message.content || '{}')

        // Salva o resumo principal no contato (para o Kanban)
        await supabase.from('contacts').update({
            ai_summary: aiResult.summary,
            ai_sentiment: aiResult.sentiment,
            last_ai_update: new Date().toISOString()
        }).eq('id', contactId)

        // Salva o insight detalhado no histórico
        await supabase.from('contact_ai_insights').insert({
            contact_id: contactId,
            company_id: company.id,
            summary: aiResult.summary,
            profile: aiResult.profile,
            interests: aiResult.interests,
            objections: aiResult.objections,
            next_step: aiResult.next_step,
            sentiment: aiResult.sentiment
        })

        return new Response(JSON.stringify({ success: true, analysis: aiResult }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
    }
})

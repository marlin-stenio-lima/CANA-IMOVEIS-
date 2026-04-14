const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function masterCleanup() {
    console.log("=== INICIANDO LIMPEZA MESTRA ===");

    // PHASE 1: MERGE CONVERSATIONS
    console.log("\n[Fase 1] Unificando conversas duplicadas...");
    const { data: convs, error: convError } = await supabase
        .from('conversations')
        .select('id, contact_id, instance_id, created_at')
        .order('created_at', { ascending: true });

    if (convError) {
        console.error("Erro ao buscar conversas:", convError);
        return;
    }

    const uniqueMap = new Map();
    const duplicates = [];

    convs.forEach(c => {
        const key = `${c.contact_id}-${c.instance_id}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, c.id);
        } else {
            duplicates.push({ oldId: c.id, targetId: uniqueMap.get(key) });
        }
    });

    console.log(`Encontradas ${duplicates.length} conversas duplicadas.`);

    for (const dup of duplicates) {
        console.log(`Mesclando ${dup.oldId} -> ${dup.targetId}...`);
        
        // Move messages
        const { error: msgUpdateError } = await supabase
            .from('messages')
            .update({ conversation_id: dup.targetId })
            .eq('conversation_id', dup.oldId);
        
        if (msgUpdateError) console.error(`Erro ao mover mensagens de ${dup.oldId}:`, msgUpdateError);

        // Delete duplicate conversation
        const { error: delError } = await supabase
            .from('conversations')
            .delete()
            .eq('id', dup.oldId);
        
        if (delError) console.error(`Erro ao deletar conversa ${dup.oldId}:`, delError);
    }

    // PHASE 2: SANITIZE MEDIA URLS
    console.log("\n[Fase 2] Sanitizando URLs de mídia e nomes de arquivos...");
    const { data: msgList, error: msgListError } = await supabase
        .from('messages')
        .select('id, media_url, message_type')
        .not('media_url', 'is', null)
        .ilike('media_url', '%;%');

    if (msgListError) {
        console.error("Erro ao buscar mensagens corrompidas:", msgListError);
        return;
    }

    console.log(`Encontradas ${msgList.length} mensagens com URLs corrompidas.`);

    for (const msg of msgList) {
        try {
            const rawUrl = msg.media_url;
            const cleanUrl = rawUrl.split(';')[0].trim();
            
            // Extract bucket path from URL
            // Format: https://.../storage/v1/object/public/chat-media/PATH
            const urlParts = rawUrl.split('/chat-media/');
            if (urlParts.length < 2) continue;
            
            const fullPathWithJunk = decodeURIComponent(urlParts[1]);
            const cleanPath = fullPathWithJunk.split(';')[0].trim();

            if (fullPathWithJunk !== cleanPath) {
                console.log(`Corrigindo arquivo: ${fullPathWithJunk} -> ${cleanPath}`);
                
                // Copy/Move in Storage
                const { error: moveError } = await supabase.storage
                    .from('chat-media')
                    .copy(fullPathWithJunk, cleanPath);

                if (moveError) {
                    console.error(`Erro ao copiar arquivo ${fullPathWithJunk}:`, moveError);
                    // If move fails, still try to update the URL if the clean one exists
                } else {
                    // Delete old corrupted file
                    await supabase.storage.from('chat-media').remove([fullPathWithJunk]);
                }
            }

            // Update DB
            const updates = { media_url: cleanUrl };
            if (msg.message_type === 'audio') {
                updates.mimetype = 'audio/ogg';
            }

            const { error: finalUpdateError } = await supabase
                .from('messages')
                .update(updates)
                .eq('id', msg.id);

            if (finalUpdateError) console.error(`Erro ao atualizar mensagem ${msg.id}:`, finalUpdateError);
            else console.log(`Mensagem ${msg.id} corrigida.`);

        } catch (e) {
            console.error(`Erro ao processar mensagem ${msg.id}:`, e);
        }
    }

    console.log("\n=== LIMPEZA CONCLUÍDA COM SUCESSO ===");
}

masterCleanup();

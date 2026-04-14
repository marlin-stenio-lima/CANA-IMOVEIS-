import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Paperclip, Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
    id: string;
    conversation_id: string;
    sender_type: 'user' | 'contact';
    content: string;
    created_at: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    message_type?: 'text' | 'image' | 'video' | 'audio' | 'document';
    media_url?: string | null;
}

interface ContactChatProps {
    contactId: string;
    contactName: string;
    contactPhone: string | null;
    contactProfilePic?: string;
}

export default function ContactChat({ contactId, contactName, contactPhone, contactProfilePic }: ContactChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [imageSalts, setImageSalts] = useState<Record<string, number>>({});
    const [sending, setSending] = useState(false);

    // Store assigned instance info
    const [instanceName, setInstanceName] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversation();
    }, [contactId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'auto' });
        }
    }, [messages]);

    const fetchConversation = async () => {
        setLoading(true);
        try {
            // 1. Find conversation
            const { data: conv, error } = await supabase
                .from('conversations')
                .select('id, instance_id')
                .eq('contact_id', contactId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error;

            if (conv) {
                setConversationId(conv.id);

                // Fetch instance name for this conversation
                if (conv.instance_id) {
                    const { data: inst } = await supabase.from('instances').select('name').eq('id', conv.instance_id).single();
                    if (inst) setInstanceName(inst.name);
                }

                // 2. Fetch messages
                const { data: msgs, error: msgError } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', conv.id)
                    .order('created_at', { ascending: true });

                if (msgError) throw msgError;
                setMessages(msgs as Message[]);

                // 3. Subscribe to real-time
                const channel = supabase
                    .channel(`chat_modal:${conv.id}`)
                    .on('postgres_changes', {
                        event: '*',
                        schema: 'public',
                        table: 'messages',
                        filter: `conversation_id=eq.${conv.id}`
                    }, (payload) => {
                        const newMessage = payload.new as Message;
                        if (payload.eventType === 'INSERT') {
                            setMessages(prev => {
                                if (newMessage.wamid && prev.some(m => m.wamid === newMessage.wamid)) return prev;
                                return [...prev, newMessage];
                            });
                        } else if (payload.eventType === 'UPDATE') {
                            setMessages(prev => prev.map(m => {
                                if (m.wamid === newMessage.wamid || m.id === newMessage.id) {
                                    const finalMediaUrl = (newMessage.media_url && newMessage.media_url.includes('http')) 
                                        ? newMessage.media_url 
                                        : m.media_url;
                                    return { ...m, ...newMessage, media_url: finalMediaUrl };
                                }
                                return m;
                            }));
                        }
                    })
                    .subscribe();

                return () => { supabase.removeChannel(channel) };
            } else {
                setMessages([]);
                setConversationId(null);

                // Pre-fetch assigned instance for this contact if exists
                const { data: contact } = await supabase.from('contacts').select('assigned_to').eq('id', contactId).single();
                if (contact?.assigned_to) {
                    const { data: inst } = await supabase.from('instances').select('name').eq('assigned_to', contact.assigned_to).maybeSingle();
                    if (inst) setInstanceName(inst.name);
                }
            }
        } catch (err) {
            console.error("Error fetching chat:", err);
            toast.error("Erro ao carregar conversa.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !contactPhone) return;

        setSending(true);
        const optimisticId = Math.random().toString();

        try {
            let currentConvId = conversationId;
            let currentInstanceName = instanceName;

            // Resolve Instance if not yet known
            if (!currentInstanceName) {
                // 1. Try Contact Assigned (again, just in case)
                const { data: contact } = await supabase.from('contacts').select('assigned_to').eq('id', contactId).single();
                if (contact?.assigned_to) {
                    const { data: inst } = await supabase.from('instances').select('id, name').eq('assigned_to', contact.assigned_to).maybeSingle();
                    if (inst) {
                        currentInstanceName = inst.name;
                    }
                }

                // 2. Fallback: Any connected instance (Company default)
                if (!currentInstanceName) {
                    const { data: inst } = await supabase.from('instances').select('id, name').eq('status', 'connected').limit(1).maybeSingle();
                    if (inst) {
                        currentInstanceName = inst.name;
                    }
                }

                if (!currentInstanceName) throw new Error("Nenhum WhatsApp conectado ou disponível para este atendente.");
                setInstanceName(currentInstanceName);
            }

            // Create conversation if needed
            if (!currentConvId) {
                const { data: instObj } = await supabase.from('instances').select('id').eq('name', currentInstanceName).single();
                if (!instObj) throw new Error("Instância não encontrada no banco.");

                const { data: newConv, error: createError } = await supabase
                    .from('conversations')
                    .insert({
                        contact_id: contactId,
                        instance_id: instObj.id,
                        last_message: messageInput,
                        unread_count: 0,
                        channel: 'whatsapp'
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                currentConvId = newConv.id;
                setConversationId(newConv.id);
            }

            // Optimistic Update
            const newMessage: Message = {
                id: optimisticId, // Temporary ID
                conversation_id: currentConvId!,
                sender_type: 'user',
                content: messageInput,
                created_at: new Date().toISOString(),
                status: 'sent', // Initially sent
                message_type: 'text'
            };
            setMessages(prev => [...prev, newMessage]);
            setMessageInput("");

            // Send via Edge Function
            await supabase.functions.invoke('evolution-manager', {
                body: {
                    action: 'send-text',
                    instanceName: currentInstanceName,
                    number: contactPhone,
                    text: newMessage.content
                }
            });
            // We rely on Webhook to replace this message or update status. 
            // Since we use random ID, the webhook insert will have a different ID.
            // But we filter duplicates in the subscription.

        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao enviar: " + err.message);
            // Mark optimistic message as failed
            setMessages(prev => prev.map(m => m.id === optimisticId ? { ...m, status: 'failed' } : m));
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch { return ""; }
    };

    const renderStatusIcon = (status: string) => {
        if (status === 'failed') return <AlertCircle className="h-3 w-3 text-red-500" />;
        if (status === 'read') return <CheckCheck className="h-3 w-3 text-blue-500" />;
        if (status === 'delivered') return <CheckCheck className="h-3 w-3 text-gray-500" />;
        if (status === 'sent') return <Check className="h-3 w-3 text-gray-400" />; // Only one check
        return <Clock className="h-3 w-3 text-gray-300" />; // Default/Pending
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Carregando histórico...</p>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 flex flex-col bg-[#efe7dd]">
            <div className="absolute inset-0 opacity-40 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d93ea9372bd.png')] pointer-events-none" />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 z-10 custom-scrollbar" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <p>Nenhuma mensagem ainda.</p>
                        <p className="text-sm">Envie uma mensagem para iniciar a conversa.</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isUser = msg.sender_type === 'user';
                    return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm text-sm relative ${isUser ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none' : 'bg-white text-[#111b21] rounded-tl-none'
                                    }`}
                            >
                                {msg.message_type === 'image' && msg.media_url && (
                                    <div className="mb-1 rounded-lg overflow-hidden relative min-h-[100px] bg-slate-100">
                                        <img 
                                            src={msg.media_url} 
                                            alt="Media" 
                                            className="max-w-full max-h-60 object-contain cursor-pointer rounded-md" 
                                            onClick={() => window.open(msg.media_url!, '_blank')} 
                                        />
                                    </div>
                                )}
                                {msg.message_type === 'document' && msg.media_url && (
                                    msg.content.match(/\.(jpg|jpeg|png|gif|webp)$/i) || msg.content === 'Imagem' ? (
                                        <div className="mb-1 rounded-lg overflow-hidden relative min-h-[100px] bg-slate-100">
                                            <img 
                                                src={msg.media_url} 
                                                alt="Media" 
                                                className="max-w-full max-h-60 object-contain cursor-pointer rounded-md" 
                                                onClick={() => window.open(msg.media_url!, '_blank')} 
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded mb-1 border border-gray-100 cursor-pointer" onClick={() => window.open(msg.media_url!, '_blank')}>
                                            <Paperclip className="h-4 w-4 text-blue-500" />
                                            <span className="text-xs font-medium truncate max-w-[150px]">{msg.content || 'Documento'}</span>
                                        </div>
                                    )
                                )}
                                {msg.message_type === 'audio' && (
                                    <div className="flex items-center gap-2 mt-1">
                                        {msg.media_url ? (
                                            <audio src={msg.media_url} controls className="h-10 max-w-[240px]" />
                                        ) : (
                                            <div className="flex items-center gap-2 opacity-70">
                                                <Mic className="h-4 w-4" />
                                                <span className="text-sm italic">Processando áudio...</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                <div className="flex justify-end items-center gap-1 mt-1">
                                    <span className="text-[10px] text-gray-500 block">
                                        {formatTime(msg.created_at)}
                                    </span>
                                    {isUser && renderStatusIcon(msg.status)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] p-3 flex items-center gap-2 border-t z-20">
                <Button variant="ghost" size="icon" className="shrink-0 text-gray-500">
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                    className="flex-1 bg-white border-none focus-visible:ring-0"
                    placeholder="Digite uma mensagem"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                {messageInput.trim() ? (
                    <Button onClick={handleSendMessage} disabled={sending} size="icon" className="shrink-0">
                        <Send className="h-5 w-5" />
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" className="shrink-0 text-gray-500">
                        <Mic className="h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}

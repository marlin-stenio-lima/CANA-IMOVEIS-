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

    const [instanceName, setInstanceName] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

                if (conv.instance_id) {
                    const { data: inst } = await supabase.from('instances').select('name').eq('id', conv.instance_id).single();
                    if (inst) setInstanceName(inst.name);
                }

                const { data: msgs, error: msgError } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', conv.id)
                    .order('created_at', { ascending: true });

                if (msgError) throw msgError;
                setMessages(msgs as Message[]);

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
                                
                                if (newMessage.direction === 'outbound' || newMessage.sender_type === 'user') {
                                    const optimisticIndex = prev.findIndex(m => 
                                        !m.wamid && 
                                        m.content === newMessage.content && 
                                        m.message_type === newMessage.message_type
                                    );
                                    if (optimisticIndex !== -1) {
                                        const newArray = [...prev];
                                        newArray[optimisticIndex] = newMessage;
                                        return newArray;
                                    }
                                }

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

            if (!currentInstanceName) {
                const { data: contact } = await supabase.from('contacts').select('assigned_to').eq('id', contactId).single();
                if (contact?.assigned_to) {
                    const { data: memberLink } = await supabase.from('instance_members').select('instance_id').eq('team_member_id', contact.assigned_to).maybeSingle();
                    if (memberLink?.instance_id) {
                        const { data: inst } = await supabase.from('instances').select('id, name').eq('id', memberLink.instance_id).maybeSingle();
                        if (inst) {
                            currentInstanceName = inst.name;
                        }
                    }
                }

                if (!currentInstanceName) {
                    const { data: insts } = await supabase.from('instances')
                        .select('id, name')
                        .eq('status', 'open')
                        .order('is_main', { ascending: false })
                        .limit(1);
                    if (insts && insts.length > 0) {
                        currentInstanceName = insts[0].name;
                    }
                }

                if (!currentInstanceName) throw new Error("Nenhum WhatsApp conectado ou disponível para este atendente.");
                setInstanceName(currentInstanceName);
            }

            if (!currentConvId) {
                const { data: instObj } = await supabase.from('instances').select('id, company_id').eq('name', currentInstanceName).single();
                if (!instObj) throw new Error("Instância não encontrada no banco.");

                const { data: newConv, error: createError } = await supabase
                    .from('conversations')
                    .insert({
                        contact_id: contactId,
                        instance_id: instObj.id,
                        company_id: instObj.company_id,
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

            const newMessage: Message = {
                id: optimisticId,
                conversation_id: currentConvId!,
                sender_type: 'user',
                content: messageInput,
                created_at: new Date().toISOString(),
                status: 'sent',
                message_type: 'text'
            };
            setMessages(prev => [...prev, newMessage]);
            setMessageInput("");

            const { data, error } = await supabase.functions.invoke('evolution-manager', {
                body: {
                    action: 'send-text',
                    instanceName: currentInstanceName,
                    number: contactPhone,
                    text: newMessage.content,
                    contactId: contactId,
                    conversationId: currentConvId
                }
            });
            if (error) throw error;
            if (data?.error) throw new Error(data.error);

        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao enviar: " + err.message);
            setMessages(prev => prev.map(m => m.id === optimisticId ? { ...m, status: 'failed' } : m));
        } finally {
            setSending(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | { target: { files: File[] } }) => {
        const file = (e.target as any).files?.[0];
        if (!file || !contactPhone) return;

        setSending(true);
        const optimisticId = Math.random().toString();
        let currentInstanceName = instanceName;
        let currentConvId = conversationId;

        if (!currentInstanceName) {
            toast.error("Mande um 'Oi' antes de anexar mídias para abrir a conexão.");
            setSending(false);
            return;
        }

        try {
            const localUrl = URL.createObjectURL(file);
            let mediaType = 'document';
            if (file.type.startsWith('image/')) mediaType = 'image';
            if (file.type.startsWith('video/')) mediaType = 'video';
            if (file.type.startsWith('audio/')) mediaType = 'audio';

            const translatedLabel = mediaType === 'image' ? 'Imagem' : mediaType === 'video' ? 'Vídeo' : mediaType === 'audio' ? 'Áudio' : file.name;
            const newMessage: Message = {
                id: optimisticId,
                conversation_id: currentConvId!,
                sender_type: 'user',
                content: translatedLabel,
                created_at: new Date().toISOString(),
                status: 'sent',
                message_type: mediaType as any,
                media_url: localUrl
            };
            setMessages(prev => [...prev, newMessage]);

            let finalMediaUrl = '';
            let base64Fallback = '';

            // Always embed base64 for audio to guarantee Evolution processes it regardless of WebM URL issues
            if (mediaType === 'audio') {
                const reader = new FileReader();
                base64Fallback = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            }

            try {
                const ext = file.name.split('.').pop();
                const safeName = Math.random().toString(36).substring(7);
                const fileName = `outbound/${Date.now()}_${safeName}.${ext}`;
                const { error: uploadError } = await supabase.storage.from('chat-media').upload(fileName, file);
                
                if (!uploadError) {
                    const { data: publicUrlData } = supabase.storage.from('chat-media').getPublicUrl(fileName);
                    finalMediaUrl = publicUrlData.publicUrl;
                } else {
                    throw uploadError;
                }
            } catch (storageErr) {
                console.log("Storage upload failed, falling back to Base64", storageErr);
                const reader = new FileReader();
                base64Fallback = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            }

            const { data, error } = await supabase.functions.invoke('evolution-manager', {
                body: {
                    action: mediaType === 'audio' ? 'send-audio' : 'send-media',
                    instanceName: currentInstanceName,
                    number: contactPhone,
                    mediaType: mediaType,
                    mimetype: file.type,
                    mediaUrl: finalMediaUrl || undefined,
                    mediaBase64: base64Fallback || undefined,
                    caption: '',
                    contactId: contactId,
                    conversationId: currentConvId
                }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data?.error);

            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao enviar mídia: " + err.message);
            setMessages(prev => prev.map(m => m.id === optimisticId ? { ...m, status: 'failed' } : m));
        } finally {
            setSending(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());
                clearInterval(recordingIntervalRef.current!);
                setRecordingTime(0);
                setIsRecording(false);
                
                // Construct a File object from the blob to reuse the file uploading logic
                const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
                
                // Mock an event to utilize existing handleFileChange logic
                const syntheticEvent = { target: { files: [audioFile] } };
                handleFileChange(syntheticEvent as any);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            
        } catch (err) {
            console.error("Microphone access denied or error:", err);
            toast.error("Erro ao acessar o microfone. Verifique as permissões do navegador.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    };

    const formatRecordingTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
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
                                {msg.message_type === 'video' && msg.media_url && (
                                    <div className="mb-1 rounded-lg overflow-hidden relative min-h-[100px] bg-black flex items-center justify-center">
                                        <video 
                                            src={msg.media_url} 
                                            controls 
                                            className="max-w-full max-h-60 object-contain rounded-md" 
                                            preload="metadata"
                                        >
                                            Seu navegador não suporta a visualização desse vídeo.
                                        </video>
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
            <div className="bg-[#f0f2f5] p-3 flex items-center gap-2 border-t z-20 relative">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx"
                />
                <Button variant="ghost" size="icon" className="shrink-0 text-gray-500" onClick={() => fileInputRef.current?.click()} disabled={sending || isRecording}>
                    <Paperclip className="h-5 w-5" />
                </Button>
                
                {isRecording ? (
                    <div className="flex-1 bg-red-50 text-red-600 rounded-md px-4 py-2 flex items-center justify-between border border-red-100 animate-pulse">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                            <span className="text-sm font-medium">Gravando... {formatRecordingTime(recordingTime)}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-100 h-6 px-2" onClick={() => {
                             // Cancel recording silently
                             if (mediaRecorderRef.current) {
                                  mediaRecorderRef.current.onstop = () => {}; // Neutralize send
                                  mediaRecorderRef.current.stop();
                                  mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
                                  clearInterval(recordingIntervalRef.current!);
                                  setIsRecording(false);
                                  setRecordingTime(0);
                             }
                        }}>Cancelar</Button>
                    </div>
                ) : (
                    <Input
                        className="flex-1 bg-white border-none focus-visible:ring-0"
                        placeholder="Digite uma mensagem"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={sending}
                    />
                )}

                {messageInput.trim() ? (
                    <Button onClick={handleSendMessage} disabled={sending || isRecording} size="icon" className="shrink-0">
                        <Send className="h-5 w-5" />
                    </Button>
                ) : isRecording ? (
                    <Button onClick={stopRecording} variant="default" size="icon" className="shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-full">
                        <Send className="h-4 w-4 ml-1" />
                    </Button>
                ) : (
                    <Button onClick={startRecording} variant="ghost" size="icon" className="shrink-0 text-gray-500 hover:text-blue-500 transition-colors">
                        <Mic className="h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}

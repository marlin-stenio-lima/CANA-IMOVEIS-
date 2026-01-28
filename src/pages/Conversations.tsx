import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Star,
  Phone,
  Calendar,
  Pin,
  Mail,
  Trash2,
  Send,
  Smile,
  X,
  MessageCircle,
  Loader2
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  custom_fields: any;
}

interface Conversation {
  id: string;
  contact_id: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  contact: Contact;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'contact' | 'ai';
  content: string;
  created_at: string;
}

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*, contact:contacts(*)')
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        toast.error("Erro ao carregar conversas");
      } else {
        setConversations(data as any);
      }
      setIsLoading(false);
    };

    fetchConversations();

    // Subscribe to new conversations or updates
    const channel = supabase
      .channel('public:conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
        fetchConversations(); // Reload list on change (simple approach)
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, []);

  // Fetch Messages for Selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error("Erro ao carregar mensagens");
      } else {
        setMessages(data as any);
      }
    };

    fetchMessages();

    // Real-time Messages
    const channel = supabase
      .channel(`chat:${selectedConversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        // update last message in conversation list
        setConversations(prev => prev.map(c =>
          c.id === selectedConversation.id
            ? { ...c, last_message: (payload.new as any).content, last_message_at: (payload.new as any).created_at }
            : c
        ));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [selectedConversation]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-outbound', {
        body: {
          conversation_id: selectedConversation.id,
          message: messageInput
        }
      });

      if (error) throw error;

      setMessageInput("");
    } catch (error) {
      console.error('Error sending:', error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background rounded-lg border overflow-hidden">
      {/* Left Column - List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Caixa de Entrada</h2>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-muted/50 border-b ${selectedConversation?.id === conv.id ? "bg-muted" : ""}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(conv.contact?.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{conv.contact?.name || "Desconhecido"}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.last_message}</p>
                </div>
              </div>
            </div>
          ))}
          {conversations.length === 0 && !isLoading && (
            <div className="p-4 text-center text-muted-foreground text-sm">Nenhuma conversa encontrada</div>
          )}
        </ScrollArea>
      </div>

      {/* Center - Chat */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b bg-background flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(selectedConversation.contact?.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedConversation.contact?.name}</h3>
                  <span className="text-xs text-muted-foreground">{selectedConversation.contact?.phone}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDetails(!showDetails)}>
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'contact' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender_type === 'contact'
                      ? 'bg-white border text-foreground'
                      : msg.sender_type === 'ai'
                        ? 'bg-purple-100 border-purple-200 text-purple-900' // Distinct AI color
                        : 'bg-primary text-primary-foreground'
                    }`}>
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-[10px] opacity-70 block mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString()}
                      {msg.sender_type === 'ai' && " (IA)"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-background border-t flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={isSending}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Selecione uma conversa ao lado
          </div>
        )}
      </div>

      {/* Right - Details */}
      {showDetails && selectedConversation && (
        <div className="w-80 border-l bg-background p-4">
          <div className="text-center mb-6">
            <Avatar className="h-20 w-20 mx-auto mb-2">
              <AvatarFallback className="text-xl">{getInitials(selectedConversation.contact?.name)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{selectedConversation.contact?.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedConversation.contact?.email}</p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h4 className="font-medium text-sm">Dados do Lead</h4>
            {selectedConversation.contact?.custom_fields && Object.entries(selectedConversation.contact.custom_fields).map(([key, val]) => (
              <div key={key}>
                <label className="text-xs text-muted-foreground capitalize">{key}</label>
                <p className="text-sm">{String(val)}</p>
              </div>
            ))}
            {!selectedConversation.contact?.custom_fields && <p className="text-sm text-muted-foreground">Sem dados extras</p>}
          </div>
        </div>
      )}
    </div>
  );
}

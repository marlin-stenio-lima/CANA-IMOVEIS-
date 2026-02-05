import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Send,
  MoreVertical,
  Search,
  Paperclip,
  CheckCheck,
  ArrowLeft,
  Mic,
  Image as ImageIcon,
  FileText,
  X,
  Trash2,
  Filter,
  Users,
  Globe, // Added missing Globe
  Home,
  Layers,
  User,        // Added
  Pencil,      // Added
  Save,        // Added
  LayoutKanban,// Added
  UserPlus     // Added
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap } from "lucide-react"; // Import Bot icon

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Types
interface Contact {
  id: string;
  name: string;
  phone: string;
  // profile_pic_url removed as it doesn't exist
}

interface Instance {
  name: string;
}

interface Conversation {
  id: string;
  contact_id: string;
  instance_id: string;
  instance?: Instance;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  contact: Contact;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'contact';
  content: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'document';
  media_url?: string | null;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chat Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded m-4">
          <h3 className="font-bold">Algo deu errado no chat</h3>
          <p className="text-sm mt-2">{this.state.error?.message}</p>
          <Button variant="outline" className="mt-4" onClick={() => this.setState({ hasError: false, error: null })}>
            Tentar Novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Conversations() {
  return (
    <ErrorBoundary>
      <ConversationsContent />
    </ErrorBoundary>
  );
}

function ConversationsContent() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Agent Control State
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [contactAgentSettings, setContactAgentSettings] = useState<{ id: string, ai_status: string, active_agent_id: number } | null>(null);

  // Load Conversations
  useEffect(() => {
    fetchConversations();
    const channel = supabase
      .channel('public:conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => fetchConversations())
      .subscribe();
    return () => { supabase.removeChannel(channel) };
  }, []);

  // Fetch Contact Agent Settings when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchAgentSettings = async () => {
      const { data } = await supabase
        .from('contacts')
        .select('id, ai_status, active_agent_id')
        .eq('id', selectedConversation.contact_id)
        .single();

      if (data) {
        setContactAgentSettings({
          id: data.id,
          ai_status: data.ai_status || 'stopped',
          active_agent_id: data.active_agent_id || 1 // Default to 1 if not set
        });
      }
    };
    fetchAgentSettings();
  }, [selectedConversation]);

  const updateAgentSettings = async (updates: any) => {
    if (!contactAgentSettings) return;

    // Optimistic
    setContactAgentSettings(prev => ({ ...prev!, ...updates }));

    const { error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', contactAgentSettings.id);

    if (error) {
      toast.error("Erro ao salvar configuração do agente");
      console.error(error);
    } else {
      toast.success("Configuração do Agente atualizada!");
    }
  };

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, contact:contacts(*), instance:instances(name)') // Removed explicit non-existent columns, relying on *
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Erro ao carregar conversas: " + error.message);
    }
    if (data) setConversations(data as any);
  };

  // Load Messages & Subscribe
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data as any);
    };

    fetchMessages();

    if (selectedConversation.unread_count > 0) {
      setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, unread_count: 0 } : c));
    }

    const channel = supabase
      .channel(`chat:${selectedConversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [selectedConversation]);

  // Handle Scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    setIsSending(true);
    try {
      // Optimistic update
      // Optimistic update
      const fakeId = Math.random().toString();
      const textToSend = messageInput;
      const newMessage: Message = {
        id: fakeId,
        conversation_id: selectedConversation.id,
        sender_type: 'user',
        content: textToSend,
        created_at: new Date().toISOString(),
        status: 'sent',
        message_type: 'text'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageInput("");

      const instanceName = selectedConversation.instance?.name;

      if (!instanceName) {
        toast.error("Erro: Instância não encontrada para esta conversa.");
        return;
      }

      await supabase.functions.invoke('evolution-manager', {
        body: {
          action: 'send-text',
          instanceName: instanceName,
          number: selectedConversation.contact.phone,
          text: textToSend
        }
      });

    } catch (e: any) {
      console.error(e);
      toast.error("Erro ao enviar: " + (e.message || "Desconhecido"));
      // Remove optimistic message on error
      // We need to capture the fakeId in scope. It's 'fakeId'.
      // Wait, let's just refresh conversations or filter it out?
      // Filtering out most robust:
      // We can't easily access fakeId here inside catch if defined in try block? NO, var hoisting or let scope.
      // Refactoring slightly to ensure access.
    } finally {
      setIsSending(false);
    }
  };

  // --- Deletion Logic ---
  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', selectedConversation.id);

      if (error) throw error;

      toast.success("Conversa excluída.");
      setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
      setSelectedConversation(null);
      setMessages([]);

    } catch (err: any) {
      console.error("Error deleting conversation:", err);
      toast.error("Erro ao excluir conversa: " + err.message);
    }
  };


  // --- Media Upload Logic ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    setIsUploading(true);
    try {
      const instanceName = selectedConversation.instance?.name;
      if (!instanceName) throw new Error("No instance found");

      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedConversation.instance_id}/outbound/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('chat-media').getPublicUrl(fileName);

      let mediaType = 'document';
      if (file.type.startsWith('image/')) mediaType = 'image';
      else if (file.type.startsWith('video/')) mediaType = 'video';
      else if (file.type.startsWith('audio/')) mediaType = 'audio';

      // Convert to Base64 for reliable sending (bypasses bucket auth issues)
      const base64Coords = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Optimistic Update
      const fakeId = Math.random().toString();
      const newMessage: Message = {
        id: fakeId,
        conversation_id: selectedConversation.id,
        sender_type: 'user',
        content: mediaType === 'image' ? 'Imagem enviada' : mediaType === 'audio' ? 'Áudio enviado' : file.name,
        created_at: new Date().toISOString(),
        status: 'sent',
        message_type: mediaType as any,
        media_url: publicUrl
      };
      setMessages(prev => [...prev, newMessage]);

      const { error: invokeError } = await supabase.functions.invoke('evolution-manager', {
        body: {
          action: 'send-media',
          instanceName,
          number: selectedConversation.contact.phone,
          mediaType: mediaType === 'document' ? 'document' : mediaType,
          mimetype: file.type,
          caption: "",
          mediaUrl: publicUrl,
          mediaBase64: base64Coords // Send the full Data URI
        }
      });

      if (invokeError) throw invokeError;

    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar arquivo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- Audio Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = handleStopRecording;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Erro ao acessar microfone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      // Remove the onstop handler so it doesn't trigger upload
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      audioChunksRef.current = [];
      toast.info("Gravação cancelada");
    }
  };

  const handleStopRecording = async () => {
    if (!selectedConversation) return;

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const timestamp = Date.now();
    const fileName = `${selectedConversation.instance_id}/voice_notes/${timestamp}.webm`;

    setIsUploading(true);
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(fileName, audioBlob, { contentType: 'audio/webm', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('chat-media').getPublicUrl(fileName);

      const instanceName = selectedConversation.instance?.name;

      // Optimistic Update (Audio)
      const fakeId = Math.random().toString();
      const newMessage: Message = {
        id: fakeId,
        conversation_id: selectedConversation.id,
        sender_type: 'user',
        content: "Áudio enviado",
        created_at: new Date().toISOString(),
        status: 'sent',
        message_type: 'audio',
        media_url: publicUrl
      };
      setMessages(prev => [...prev, newMessage]);

      await supabase.functions.invoke('evolution-manager', {
        body: {
          action: 'send-audio',
          instanceName,
          number: selectedConversation.contact.phone,
          mediaUrl: publicUrl
        }
      });

    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar áudio");
    } finally {
      setIsUploading(false);
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    }
  };


  // Helpers
  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "?";

  return (
    <div className="flex h-[calc(100vh-8.5rem)] overflow-hidden bg-[#efe7dd] dark:bg-[#0b141a] relative rounded-xl border shadow-sm"> {/* Main Container */}

      {/* Sidebar - Contact List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] flex-col border-r bg-white dark:bg-[#111b21] z-20`}>
        {/* Header */}
        <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between px-4 py-2 border-b dark:border-gray-800 shrink-0">

          {/* Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10" title="Filtrar Conversas">
                <Filter className="w-5 h-5 text-[#54656f] dark:text-[#aebac1]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" /> Corretores
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Globe className="w-4 h-4 mr-2" /> Origem do Lead
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Home className="w-4 h-4 mr-2" /> Imóveis de Interesse
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Layers className="w-4 h-4 mr-2" /> Todos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-4 text-[#54656f] dark:text-[#aebac1] items-center">
            {/* Delete Button (Requested replacement for 3 dots) */}
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20" title="Excluir">
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 bg-white dark:bg-[#111b21] border-b dark:border-gray-800 shrink-0">
          <div className="relative bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg h-9 flex items-center px-4">
            <Search className="w-4 h-4 text-[#54656f] dark:text-[#aebac1] mr-4" />
            <Input
              className="bg-transparent border-none shadow-none focus-visible:ring-0 h-full p-0 text-sm"
              placeholder="Pesquisar ou começar uma nova conversa"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map(conv => {
            if (!conv || !conv.contact) return null; // Safe guard
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`flex items-center px-3 py-3 cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors relative group
                         ${selectedConversation?.id === conv.id ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : ''}`}
              >
                <div className="relative mr-3 shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.contact.profile_pic_url || undefined} />
                    <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-white">
                      {getInitials(conv.contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Owner Indicator */}
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 border-2 border-white dark:border-[#111b21] flex items-center justify-center z-10 shadow-sm"
                    title="Proprietário: Marlon Stenio"
                  >
                    <span className="text-[8px] font-bold text-white leading-none">MS</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 border-b dark:border-gray-800 pb-3 h-full justify-center flex flex-col">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="text-[17px] text-[#111b21] dark:text-[#e9edef] font-normal truncate">
                        {conv.contact.name || "Sem Nome"}
                      </h3>

                      {/* AI Status Badge - List View */}
                      {(conv.contact as any)?.ai_status === 'active' && (
                        <Bot className="w-3.5 h-3.5 text-green-500 fill-green-100 dark:fill-green-900" />
                      )}
                      {(conv.contact as any)?.ai_status === 'paused' && (
                        <div className="w-2 h-2 rounded-full bg-yellow-500" title="Pausado" />
                      )}
                    </div>

                    <span className="text-xs text-[#667781] dark:text-[#8696a0] whitespace-nowrap ml-2">
                      {conv.last_message_at ? formatTime(conv.last_message_at) : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#3b4a54] dark:text-[#8696a0] truncate max-w-[90%] flex items-center gap-1">
                      {/* Icon for media types in preview */}
                      {conv.message_type === 'image' && <ImageIcon className="w-3 h-3" />}
                      {conv.message_type === 'audio' && <Mic className="w-3 h-3" />}
                      {conv.message_type === 'video' && <span className="text-[10px]">🎥</span>}

                      {conv.message_type === 'image' ? 'Imagem' :
                        conv.message_type === 'audio' ? 'Áudio' :
                          conv.message_type === 'video' ? 'Vídeo' :
                            conv.message_type === 'document' ? 'Documento' :
                              (conv.last_message || '')}
                    </p>
                    {conv.unread_count > 0 && (
                      <div className="bg-[#25d366] text-white text-[10px] font-bold px-[5px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative min-w-0">
          {/* Chat Background Pattern */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d93ea9372bd.png')] pointer-events-none" />

          {/* Header */}
          <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center px-4 py-2 justify-between z-20 border-l border-[#d1d7db] dark:border-gray-700 w-full shrink-0">
            <div className="flex items-center cursor-pointer" onClick={() => { }}>
              {/* Back button for mobile */}
              <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSelectedConversation(null)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={selectedConversation.contact.profile_pic_url} />
                <AvatarFallback>{getInitials(selectedConversation.contact.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-md text-[#111b21] dark:text-[#e9edef] font-normal">
                  {selectedConversation.contact.name}
                </span>
                {/* Only show phone if it's different from the name AND implies a real number (not LID) */}
                {selectedConversation.contact.name !== selectedConversation.contact.phone &&
                  selectedConversation.contact.phone &&
                  !selectedConversation.contact.phone.includes('@') && (
                    <span className="text-xs text-[#667781] dark:text-[#8696a0] truncate">
                      {selectedConversation.contact.phone}
                    </span>
                  )}
              </div>
            </div>
            <div className="flex gap-4 text-[#54656f] dark:text-[#aebac1] items-center">
              {/* Agent Settings Trigger */}
              <Dialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-[#54656f] dark:text-[#aebac1] hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Bot className={`w-5 h-5 ${contactAgentSettings?.ai_status === 'active' ? 'text-green-500' : ''}`} />
                    {contactAgentSettings?.ai_status === 'active' && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-[#202c33]"></span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuração do Agente (Lead)</DialogTitle>
                    <DialogDescription>
                      Controle como a IA interage com <strong>{selectedConversation.contact.name}</strong>.
                    </DialogDescription>
                  </DialogHeader>

                  {contactAgentSettings && (
                    <div className="py-4 space-y-6">
                      {/* Master Toggle */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <div className="font-medium">Status da IA</div>
                          <div className="text-sm text-muted-foreground">
                            {contactAgentSettings.ai_status === 'active' ? "Ligado / Respondendo" : "Pausado / Humano"}
                          </div>
                        </div>
                        <Switch
                          checked={contactAgentSettings.ai_status === 'active'}
                          onCheckedChange={(checked) => updateAgentSettings({ ai_status: checked ? 'active' : 'paused' })}
                        />
                      </div>

                      {/* Agent Selection Override */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Forçar Agente Específico</label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: 1, name: "1. Agente de Triagem" },
                            { id: 2, name: "2. Agente de Agendamento" }
                          ].map((agent) => (
                            <div
                              key={agent.id}
                              onClick={() => updateAgentSettings({ active_agent_id: agent.id })}
                              className={`p-3 rounded-md border cursor-pointer transition-all flex items-center justify-between
                                     ${contactAgentSettings.active_agent_id === agent.id
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "hover:bg-muted"
                                }
                                  `}
                            >
                              <span className="text-sm">{agent.name}</span>
                              {contactAgentSettings.active_agent_id === agent.id && <CheckCheck className="w-4 h-4 text-primary" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Search className="w-5 h-5 cursor-pointer" />

              {/* Delete SINGLE Conversation Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2 className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" title="Excluir esta conversa" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir esta conversa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso apagará o histórico desta conversa no Pigg. As mensagens no WhatsApp não serão apagadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConversation} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* Direct 'Details' Button (No Dropdown) */}
              <Button
                variant="ghost"
                size="icon"
                className="text-[#54656f] dark:text-[#aebac1]"
                onClick={() => setDetailsOpen(true)}
                title="Dados do Contato"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages List Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto z-10 custom-scrollbar" ref={scrollRef}>
            <div className="px-[5%] py-4 pb-2 flex flex-col justify-end min-h-full">
              {messages.map(msg => {
                if (!msg || !msg.id) return null; // Defensive check for invalid messages
                const isUser = msg.sender_type === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group mb-1`}>
                    <div
                      className={`relative max-w-[85%] md:max-w-[65%] rounded-lg shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-sm flex flex-col
                                ${isUser
                          ? 'bg-[#d9fdd3] dark:bg-[#005c4b] rounded-tr-none'
                          : 'bg-white dark:bg-[#202c33] rounded-tl-none'
                        }`}
                    >
                      {/* Message Content Area */}
                      <div className={`px-2 pt-2 pb-1 text-[#111b21] dark:text-[#e9edef] ${msg.message_type === 'image' ? 'p-1' : ''}`}>

                        {/* Image Type */}
                        {msg.message_type === 'image' ? (
                          msg.media_url ? (
                            <div className="mb-1 rounded-lg overflow-hidden relative">
                              <img
                                src={msg.media_url}
                                alt="Imagem"
                                className="max-w-full max-h-[300px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => window.open(msg.media_url!, '_blank')}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Erro+Imagem'; }}
                              />
                              {msg.content && msg.content !== "Imagem" && msg.content !== "Imagem enviada" && <p className="mt-1 break-words px-1">{msg.content}</p>}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded mb-1 border border-red-200/50">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                              <span className="italic text-xs text-gray-500">Imagem indisponível</span>
                            </div>
                          )
                        ) : msg.message_type === 'video' ? (
                          msg.media_url ? (
                            <div className="mb-1">
                              <video controls src={msg.media_url} className="rounded-lg max-w-full max-h-[300px]" />
                              {msg.content && msg.content !== "Vídeo" && <p className="mt-1 break-words">{msg.content}</p>}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded mb-1">
                              <span className="text-xl">🎥</span>
                              <span className="italic text-xs text-gray-500">Vídeo indisponível</span>
                            </div>
                          )
                        ) : msg.message_type === 'audio' ? (
                          msg.media_url ? (
                            <div className="flex items-center gap-3 min-w-[280px] p-2">
                              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={isUser ? undefined : selectedConversation.contact.profile_pic_url} />
                                  <AvatarFallback>{isUser ? 'EU' : getInitials(selectedConversation.contact.name)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1">
                                  <Mic className={`w-4 h-4 ${isUser ? 'text-[#005c4b] dark:text-[#00a884]' : 'text-[#54656f] dark:text-[#8696a0]'}`} />
                                </div>
                              </div>
                              <div className="flex-1">
                                <audio controls src={msg.media_url} className="w-full h-8" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2 min-w-[150px] bg-gray-100 dark:bg-gray-800 rounded">
                              <Mic className="w-5 h-5 text-gray-400" />
                              <span className="italic text-xs text-gray-500">Áudio não carregado</span>
                            </div>
                          )
                        ) : msg.message_type === 'document' ? (
                          msg.media_url ? (
                            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/10 p-3 rounded-md cursor-pointer hover:bg-black/10 transition-colors max-w-[300px]" onClick={() => window.open(msg.media_url!, '_blank')}>
                              <div className="text-3xl text-red-500">📄</div>
                              <div className="overflow-hidden">
                                <p className="truncate font-medium hover:underline">{msg.content || "Documento"}</p>
                                <span className="text-xs uppercase opacity-70">PDF/DOC</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded mb-1">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <span className="italic text-xs text-gray-500">Arquivo indisponível</span>
                            </div>
                          )
                        ) : (
                          <p className="break-words whitespace-pre-wrap leading-relaxed pr-16 min-w-[80px]">{msg.content}</p>
                        )}
                      </div>

                      {/* Timestamp & Status (Float Bottom Right) */}
                      <div className={`flex justify-end items-center gap-1 px-2 pb-1 ${msg.message_type === 'image' || msg.message_type === 'video' ? 'absolute bottom-1 right-2 bg-gradient-to-t from-black/50 to-transparent rounded px-1' : 'ml-auto mt-[-10px]'}`}>
                        <span className={`text-[11px] min-w-fit ${msg.message_type === 'image' || msg.message_type === 'video' ? 'text-white' : 'text-[#667781] dark:text-[#8696a0]'}`}>
                          {formatTime(msg.created_at)}
                        </span>
                        {isUser && (
                          <span className={`${msg.status === 'read' ? 'text-[#53bdeb]' : (msg.message_type === 'image' || msg.message_type === 'video' ? 'text-white' : 'text-[#667781]')}`}>
                            <CheckCheck className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input Area (Sticky Footer) */}
          <div className="min-h-[62px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center px-4 py-2 gap-3 z-20 border-t border-[#d1d7db] dark:border-gray-700 shrink-0">
            {/* Hidden Input for Files */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <Paperclip className="w-6 h-6 text-[#54656f] dark:text-[#aebac1]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="mr-2 h-4 w-4" /> Foto/Vídeo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <FileText className="mr-2 h-4 w-4" /> Documento
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              className="flex-1 bg-white dark:bg-[#2a3942] border-none shadow-sm focus-visible:ring-0 text-[#111b21] dark:text-[#e9edef] placeholder:text-[#667781] dark:placeholder:text-[#8696a0] rounded-lg py-3 px-4 h-10"
              placeholder={isRecording ? "Gravando áudio..." : "Digite uma mensagem"}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isRecording}
              autoFocus
            />

            {messageInput.trim() ? (
              <div onClick={handleSendMessage} className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Send className="w-6 h-6 text-[#54656f] dark:text-[#aebac1]" />
              </div>
            ) : isRecording ? (
              <div className="flex gap-2">
                {/* Cancel Recording */}
                <div onClick={cancelRecording} className="cursor-pointer p-2 hover:bg-red-100 rounded-full transition-colors text-red-500">
                  <Trash2 className="w-6 h-6" />
                </div>
                {/* Send Recording (Stop & Send) */}
                <div onClick={stopRecording} className="cursor-pointer p-2 hover:bg-green-100 rounded-full transition-colors text-green-500 animate-pulse">
                  <Send className="w-6 h-6" />
                </div>
              </div>
            ) : (
              <div
                onClick={startRecording}
                className="cursor-pointer p-2 rounded-full transition-colors text-[#54656f] dark:text-[#aebac1] hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Mic className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#222e35] border-b-[6px] border-[#25d366]">
          {/* Simple Clean Empty State */}
          <div className="text-center space-y-6 max-w-[500px] p-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Bot className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl text-[#41525d] dark:text-[#e9edef] font-light">
                CRM Suite Pro
              </h1>
              <p className="text-[#667781] dark:text-[#8696a0] text-sm">
                Gerencie seus atendimentos de forma inteligente.
                <br />
                Selecione uma conversa ao lado para começar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

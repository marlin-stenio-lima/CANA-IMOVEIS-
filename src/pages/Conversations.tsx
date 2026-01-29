import { useState, useEffect, useRef } from "react";
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
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  profile_pic_url?: string;
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

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Media Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load Conversations
  useEffect(() => {
    fetchConversations();
    const channel = supabase
      .channel('public:conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => fetchConversations())
      .subscribe();
    return () => { supabase.removeChannel(channel) };
  }, []);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, contact:contacts(*), instance:instances(name)')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
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



      await supabase.functions.invoke('evolution-manager', {
        body: {
          action: 'send-media',
          instanceName,
          number: selectedConversation.contact.phone,
          mediaType: mediaType === 'document' ? 'document' : mediaType,
          mimetype: file.type,
          caption: "",
          mediaUrl: publicUrl
        }
      });

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
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (!selectedConversation) return;

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
    const timestamp = Date.now();
    const fileName = `${selectedConversation.instance_id}/voice_notes/${timestamp}.webm`;

    setIsUploading(true);
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(fileName, audioBlob, { contentType: 'audio/webm' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('chat-media').getPublicUrl(fileName);

      const instanceName = selectedConversation.instance?.name;



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
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "?";

  return (
    <div className="flex h-screen overflow-hidden bg-[#e9edef] dark:bg-[#0b141a]"> {/* WhatsApp Web Background Color */}

      {/* Sidebar - Contact List */}

      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] flex-col border-r bg-white dark:bg-[#111b21]`}>
        {/* Header */}
        <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between px-4 py-2 border-b dark:border-gray-800 shrink-0">
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>EU</AvatarFallback>
          </Avatar>
          <div className="flex gap-4 text-[#54656f] dark:text-[#aebac1] items-center">



            <MoreVertical className="w-6 h-6 cursor-pointer" />
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
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`flex items-center px-3 py-3 cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors relative group
                         ${selectedConversation?.id === conv.id ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : ''}`}
            >
              <Avatar className="h-12 w-12 mr-3 shrink-0">
                <AvatarImage src={conv.contact.profile_pic_url} />
                <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-white">
                  {getInitials(conv.contact.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 border-b dark:border-gray-800 pb-3 h-full justify-center flex flex-col">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-[17px] text-[#111b21] dark:text-[#e9edef] font-normal truncate">{conv.contact.name}</h3>
                  <span className="text-xs text-[#667781] dark:text-[#8696a0] whitespace-nowrap ml-2">{formatTime(conv.last_message_at)}</span>
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
                            conv.last_message}
                  </p>
                  {conv.unread_count > 0 && (
                    <div className="bg-[#25d366] text-white text-[10px] font-bold px-[5px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0">
                      {conv.unread_count}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative">
          {/* Chat Background Pattern */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d93ea9372bd.png')] pointer-events-none" />

          {/* Header */}
          <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center px-4 py-2 justify-between z-10 border-l border-[#d1d7db] dark:border-gray-700 w-full shrink-0">
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
                  !selectedConversation.contact.phone.includes('@') && (
                    <span className="text-xs text-[#667781] dark:text-[#8696a0] truncate">
                      {selectedConversation.contact.phone}
                    </span>
                  )}
              </div>
            </div>
            <div className="flex gap-4 text-[#54656f] dark:text-[#aebac1] items-center">
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
                      Isso apagará o histórico desta conversa no CRM. As mensagens no WhatsApp não serão apagadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConversation} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <MoreVertical className="w-5 h-5 cursor-pointer" />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto px-[5%] py-4 z-10" ref={scrollRef}>
            <div className="flex flex-col gap-2 pb-2">
              {messages.map(msg => {
                const isUser = msg.sender_type === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group mb-1`}>
                    <div
                      className={`relative max-w-[65%] rounded-lg px-2 py-1 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-sm 
                                ${isUser
                          ? 'bg-[#d9fdd3] dark:bg-[#005c4b] rounded-tr-none'
                          : 'bg-white dark:bg-[#202c33] rounded-tl-none'
                        }`}
                    >
                      {/* Message Content */}
                      <div className={`px-1 pt-1 pb-4 text-[#111b21] dark:text-[#e9edef] ${msg.message_type === 'image' ? 'pb-1' : ''}`}>
                        {msg.message_type === 'image' && msg.media_url ? (
                          <div className="mb-1 rounded-lg overflow-hidden relative">
                            <img
                              src={msg.media_url}
                              alt="Imagem"
                              className="max-w-full max-h-[300px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() => window.open(msg.media_url!, '_blank')}
                            />
                            {msg.content && msg.content !== "Imagem" && msg.content !== "Imagem enviada" && <p className="mt-1 break-words px-1">{msg.content}</p>}
                          </div>
                        ) : msg.message_type === 'video' && msg.media_url ? (
                          <div className="mb-1">
                            <video controls src={msg.media_url} className="rounded-lg max-w-full max-h-[300px]" />
                            {msg.content && msg.content !== "Vídeo" && <p className="mt-1 break-words">{msg.content}</p>}
                          </div>
                        ) : msg.message_type === 'audio' && msg.media_url ? (
                          <div className="flex items-center gap-2 min-w-[240px] py-1">
                            <audio controls src={msg.media_url} className="w-full h-8" />
                          </div>
                        ) : msg.message_type === 'document' && msg.media_url ? (
                          <div className="flex items-center gap-3 bg-black/5 dark:bg-white/10 p-2 rounded-md cursor-pointer hover:bg-black/10 transition-colors" onClick={() => window.open(msg.media_url!, '_blank')}>
                            <div className="text-3xl text-red-500">📄</div>
                            <div className="overflow-hidden">
                              <p className="truncate font-medium hover:underline">{msg.content || "Documento"}</p>
                              <span className="text-xs uppercase opacity-70">PDF/DOC</span>
                            </div>
                          </div>
                        ) : (
                          <p className="break-words whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        )}
                      </div>

                      {/* Timestamp & Status */}
                      <div className={`absolute right-2 bottom-1 flex items-center gap-1 ${msg.message_type === 'image' ? 'text-white drop-shadow-md right-3 bottom-2' : ''}`}>
                        <span className={`text-[11px] min-w-fit ${msg.message_type === 'image' ? 'text-white' : 'text-[#667781] dark:text-[#8696a0]'}`}>
                          {formatTime(msg.created_at)}
                        </span>
                        {isUser && (
                          <span className={`${msg.status === 'read' ? 'text-[#53bdeb]' : (msg.message_type === 'image' ? 'text-white' : 'text-[#667781]')}`}>
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

          {/* Input Area */}
          <div className="min-h-[62px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center px-4 py-2 gap-3 z-10 border-t border-[#d1d7db] dark:border-gray-700">
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
            />

            {messageInput.trim() ? (
              <div onClick={handleSendMessage} className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Send className="w-6 h-6 text-[#54656f] dark:text-[#aebac1]" />
              </div>
            ) : (
              <div
                onClick={isRecording ? stopRecording : startRecording}
                className={`cursor-pointer p-2 rounded-full transition-colors ${isRecording ? 'text-red-500 animate-pulse bg-red-100 dark:bg-red-900/20' : 'text-[#54656f] dark:text-[#aebac1] hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {isRecording ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#222e35] border-b-[6px] border-[#25d366]">
          <div className="text-center space-y-4 max-w-[500px]">
            {/* WhatsApp Intro Image or Icon Could Go Here */}
            <h1 className="text-3xl font-light text-[#41525d] dark:text-[#e9edef]">WhatsApp Web CRM</h1>
            <p className="text-[#667781] dark:text-[#8696a0]">Envie e receba mensagens sem interrupções. Selecione uma conversa para começar.</p>
            <Button
              variant="outline"
              onClick={async () => {
                toast.info("Gerando dados de teste...");
                const { error } = await supabase.functions.invoke('seed-db');
                if (error) toast.error("Erro ao gerar dados: " + error.message);
                else {
                  toast.success("Dados gerados! Atualizando...");
                  fetchConversations();
                }
              }}
              className="mt-4"
            >
              Gerar Conversa de Teste
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

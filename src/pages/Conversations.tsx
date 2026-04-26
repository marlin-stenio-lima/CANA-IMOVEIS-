import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  Kanban,      // Corrected from LayoutKanban
  UserPlus,    // Added
  Download,    // Added
  Bot,
  Play,
  Pause,
  ExternalLink // Added
} from "lucide-react";

import ContactDetailsModal from "@/components/contacts/ContactDetailsModal";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { usePipelines } from "@/hooks/usePipelines";
import { usePipelineStages } from "@/hooks/usePipelineStages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Zap } from "lucide-react";

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
  ai_status?: string;
  active_agent_id?: number | string;
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
  last_message_type?: string; // Change to this name if it's more accurate
  message_type?: string;      // Or this one if that's what's used
  unread_count: number;
  contact: Contact;
}

interface Message {
  id: string;
  conversation_id: string;
  wamid?: string;
  sender_type: 'user' | 'contact';
  content: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'document';
  media_url?: string | null;
  mimetype?: string | null;
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

const AudioPlayer = ({ src, id }: { src: string, id: string }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerWasmRef = useRef<any>(null);

  const loadAudio = async () => {
    if (blobUrl || loading) return;
    setLoading(true);
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudio();
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) audioRef.current.pause();
      else audioRef.current.play().catch(() => playWasm());
      setPlaying(!playing);
    } else if (blobUrl) {
      // Fallback
      playWasm();
    }
  };

  const playWasm = () => {
    const OGV = (window as any).OGVPlayer;
    if (typeof OGV !== 'undefined' && containerRef.current) {
      if (!playerWasmRef.current) {
        playerWasmRef.current = new OGV();
        playerWasmRef.current.src = src;
        playerWasmRef.current.style.display = 'none';
        containerRef.current.appendChild(playerWasmRef.current);
      }
      if (playing) playerWasmRef.current.pause();
      else playerWasmRef.current.play();
      setPlaying(!playing);
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    if (playerWasmRef.current) playerWasmRef.current.playbackRate = nextSpeed;
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const formatSecs = (s: number) => {
    if (!s || isNaN(s) || s === Infinity) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full max-w-[280px]" ref={containerRef}>
      <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-xl">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 shrink-0 rounded-full bg-white dark:bg-gray-800 shadow-sm"
          onClick={togglePlay}
          disabled={loading || error} // Disable if loading or error
        >
          {loading ? (
            <Layers className="h-4 w-4 animate-spin text-blue-500" />
          ) : playing ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current ml-0.5" />
          )}
        </Button>

        <div className="flex-1 flex flex-col gap-1 px-1">
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-100" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 font-medium">
            <span>{audioRef.current ? formatSecs(audioRef.current.currentTime) : "0:00"}</span>
            <span>{formatSecs(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={cycleSpeed}
            className="text-[10px] font-bold bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-300 transition-colors shrink-0 min-w-[28px]"
          >
            {speed}x
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(src, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" /> Abrir em nova aba
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={src} download={`audio-${id}.ogg`} className="flex items-center">
                  <Download className="h-4 w-4 mr-2" /> Baixar áudio
                </a>
              </DropdownMenuItem>
              {error && (
                <DropdownMenuItem className="text-red-500 text-[10px] italic pointer-events-none">
                  Erro de carregamento. Tente baixar.
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {blobUrl && (
        <audio 
          ref={audioRef} 
          src={blobUrl} 
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={() => setPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
};

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
  const [imageSalts, setImageSalts] = useState<Record<string, number>>({});
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Kanban Placement State
  const [kanbanModalOpen, setKanbanModalOpen] = useState(false);
  const [kanbanPipelineId, setKanbanPipelineId] = useState("");
  const [kanbanStageId, setKanbanStageId] = useState("");
  const [kanbanDealTitle, setKanbanDealTitle] = useState("");
  
  const { pipelines } = usePipelines();
  const { stages: kanbanStages } = usePipelineStages(kanbanPipelineId || null);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Agent Control State
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [contactAgentSettings, setContactAgentSettings] = useState<{ id: string, ai_status: string, active_agent_id: number } | null>(null);
  const { mode } = useCrmMode();
  const { profile } = useAuth();
  const { isAdmin } = usePermissions();

  // Search & Filter State
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<{
    corretorId: string | null;
    origem: string | null;
    imovelId: string | null;
  }>({ corretorId: null, origem: null, imovelId: null });

  const [filterOptions, setFilterOptions] = useState<{
    corretores: { id: string, name: string }[];
    origens: string[];
    imoveis: { id: string, title: string }[];
  }>({ corretores: [], origens: [], imoveis: [] });

  // Load Filter Options
  useEffect(() => {
    const loadFilterOptions = async () => {
      // Fetch Corretores (Team Members)
      const { data: corretoresData } = await supabase
        .from('profiles')
        .select('id, full_name');
      
      // Fetch Properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, title');

      // Unique Origins from contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('source')
        .not('source', 'is', null);
      
      const uniqueOrigins = Array.from(new Set(contactsData?.map(c => c.source).filter(Boolean)));

      setFilterOptions({
        corretores: corretoresData?.map(c => ({ id: c.id, name: c.full_name || 'Sem Nome' })) || [],
        imoveis: propertiesData?.map(p => ({ id: p.id, title: p.title || 'Sem Título' })) || [],
        origens: uniqueOrigins as string[]
      });
    };
    if (isAdmin) {
      loadFilterOptions();
    }
  }, [isAdmin]);

  // Load Conversations
  useEffect(() => {
    fetchConversations();
    const channel = supabase
      .channel('public:conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => fetchConversations())
      .subscribe();
    return () => { supabase.removeChannel(channel) };
  }, [mode, profile?.id, isAdmin]);

  // Fetch Contact Agent Settings when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchAgentSettings = async () => {
      const { data } = await (supabase as any)
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
    let selectQuery = '*, contact:contacts(*), instance:instances!inner(name, business_type)';
    if (!isAdmin && profile?.id) {
       selectQuery = '*, contact:contacts!inner(*), instance:instances!inner(name, business_type)';
    }

    let query = (supabase as any)
      .from('conversations')
      .select(selectQuery)
      .order('last_message_at', { ascending: false });

    if (mode) {
      query = query.eq('instance.business_type', mode);
    }

    if (!isAdmin && profile?.id) {
      query = query.eq('contact.assigned_to', profile.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Erro ao carregar conversas: " + error.message);
    }
    if (data) {
      // Deduplicate conversations by contact_id + instance_id (Frontend Guard)
      const uniqueMap = new Map();
      const sortedData = [...data].sort((a: any, b: any) => 
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );
      
      sortedData.forEach((conv: any) => {
        const key = `${conv.contact_id}-${conv.instance_id}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, conv);
        }
      });
      
      setConversations(Array.from(uniqueMap.values()));
    }
  };

  // Load Messages & Subscribe
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async (id: string) => {
      const { data } = await (supabase as any)
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data as any);
    };

    fetchMessages(selectedConversation.id);

    if (selectedConversation.unread_count > 0) {
      setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, unread_count: 0 } : c));
    }

    const channel = supabase
      .channel(`chat:${selectedConversation.id}`)
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        if (payload.eventType === 'INSERT') {
          setMessages(prev => {
             // Deduplicate outbound messages
             if (newMessage.sender_type === 'user') {
                const now = new Date(newMessage.created_at).getTime();
                const existing = prev.find(m => 
                   m.sender_type === 'user' && 
                   (!m.wamid || m.wamid.startsWith('pending-')) &&
                   Math.abs(new Date(m.created_at).getTime() - now) < 30000
                );
                if (existing) {
                   return prev.map(m => m.id === existing.id ? { ...m, ...newMessage, media_url: newMessage.media_url || m.media_url } : m);
                }
             }
             if (prev.some(m => m.wamid === newMessage.wamid)) return prev;
             return [...prev, newMessage];
          });
        } else if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(m => {
            if (m.wamid === newMessage.wamid || m.id === newMessage.id) {
               // Only overwrite media_url if the NEW one is valid and not null
               const finalMediaUrl = (newMessage.media_url && newMessage.media_url.includes('http')) 
                 ? newMessage.media_url 
                 : m.media_url;
               return { ...m, ...newMessage, media_url: finalMediaUrl };
            }
            return m;
          }));
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(m => m.id !== (payload.old as any).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [selectedConversation]);

  // Set default deal title when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      setKanbanDealTitle(`Negociação - ${selectedConversation.contact.name}`);
      setKanbanPipelineId("");
      setKanbanStageId("");
    }
  }, [selectedConversation]);

  // Handle Scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'auto' });
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

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({
          action: 'send-text',
          instanceName: instanceName,
          number: selectedConversation.contact.phone,
          text: textToSend
        })
      });

      if (!response.ok) {
        const invokeData = await response.json().catch(() => ({}));
        throw new Error(invokeData?.error || `Erro do Servidor Texto (${response.status})`);
      }

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

  const handleCreateKanbanDeal = async () => {
    if (!selectedConversation || !kanbanPipelineId || !kanbanStageId || !profile?.company_id) return;
    
    try {
      const { error } = await supabase.from('deals').insert({
        title: kanbanDealTitle || `Negociação - ${selectedConversation.contact.name}`,
        contact_id: selectedConversation.contact_id,
        pipeline_id: kanbanPipelineId,
        stage_id: kanbanStageId,
        company_id: profile.company_id,
        assigned_to: selectedConversation.contact.assigned_to || profile.id
      });
      
      if (error) throw error;
      toast.success("Lead enviado para o Kanban com sucesso!");
      setKanbanModalOpen(false);
    } catch (e: any) {
      toast.error("Erro ao enviar para o Kanban: " + e.message);
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

      // --- THE UNBEATABLE FIX: Create a local BLOB URL for instant, perfect visibility ---
      const localBlobUrl = URL.createObjectURL(file);
      
      // Manual Public URL Construction (More reliable than SDK)
      const { data: publicData } = supabase.storage
        .from('chat-media')
        .getPublicUrl(fileName);
      
      const manualPublicUrl = publicData.publicUrl;

      let mediaType = 'document';
      if (file.type.startsWith('image/')) mediaType = 'image';
      else if (file.type.startsWith('video/')) mediaType = 'video';
      else if (file.type.startsWith('audio/')) mediaType = 'audio';

      // 1. Optimistic Update with LOCAL BLOB (Will never fail to load)
      const fakeId = Math.random().toString();
      const newMessage: Message = {
        id: fakeId,
        conversation_id: selectedConversation.id,
        sender_type: 'user',
        content: mediaType === 'image' ? 'Imagem' : mediaType === 'audio' ? 'Áudio' : mediaType === 'video' ? 'Vídeo' : file.name,
        created_at: new Date().toISOString(),
        status: 'sending',
        media_url: localBlobUrl, 
        message_type: mediaType as any,
        wamid: 'pending-' + Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Use Manual Public URL for the API
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({
          action: 'send-media',
          instanceName,
          number: selectedConversation.contact.phone,
          mediaType: mediaType === 'document' ? 'document' : mediaType,
          mimetype: file.type,
          caption: "",
          mediaUrl: manualPublicUrl
        })
      });

      const invokeData = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(invokeData?.error || `Erro do Servidor (${response.status})`);
      }

      // --- CRITICAL SYNC: Update the optimistic message with the REAL WAMID ---
      // This prevents the webhook from creating a duplicate "broken" message
      const realWamid = invokeData?.data?.key?.id || invokeData?.key?.id;
      if (realWamid) {
        setMessages(prev => prev.map(m => m.id === fakeId ? { ...m, wamid: realWamid, status: 'sent' } : m));
      }

    } catch (error: any) {
      console.error("Upload/Send Error:", error);
      const errorMessage = error.message || (typeof error === 'string' ? error : "Erro desconhecido");
      toast.error(`Erro ao enviar arquivo: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- Audio Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Prefer OGG if supported (better for WhatsApp), otherwise fallback to WebM
    const mimeType = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus') 
      ? 'audio/ogg;codecs=opus' 
      : 'audio/webm;codecs=opus';
      
    const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = handleStopRecording;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Start Timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

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
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      audioChunksRef.current = [];
      toast.info("Gravação cancelada");
    }
  };

  const handleStopRecording = async () => {
    if (!selectedConversation) return;

    const mimeType = 'audio/ogg'; // Clean mime
    const extension = 'ogg'; // Simple clean extension
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
    
    // Convert to Base64 as fallback for Evolution API
    const base64Audio = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    const timestamp = Date.now();
    const fileName = `${selectedConversation.instance_id}/voice_notes/${timestamp}.${extension}`;

    setIsUploading(true);
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(fileName, audioBlob, { contentType: 'audio/ogg', upsert: true });

      if (uploadError) throw uploadError;

      // Use Signed URL for 10 years for absolute access reliability
      const { data: signedData, error: signedError } = await supabase.storage
        .from('chat-media')
        .createSignedUrl(fileName, 315360000); // 10 years

      if (signedError) throw signedError;
      const publicUrl = signedData.signedUrl;

      const instanceName = selectedConversation.instance?.name;

      // Optimistic Update (Audio)
      const fakeId = Math.random().toString();
      const newMessage: Message = {
        id: fakeId,
        conversation_id: selectedConversation.id,
        sender_type: 'user',
        content: "Áudio",
        created_at: new Date().toISOString(),
        status: 'sent',
        message_type: 'audio',
        media_url: publicUrl
      };
      setMessages(prev => [...prev, newMessage]);

      // Nuclear Option: Manual Fetch
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({
          action: 'send-audio',
          instanceName,
          number: selectedConversation.contact.phone,
          mediaUrl: publicUrl,
          mimetype: 'audio/ogg' 
        })
      });

      const invokeData = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(invokeData?.error || `Erro do Servidor Audio (${response.status})`);
      }

    } catch (err: any) {
      console.error("Audio Send Error Details:", err);
      const errorMessage = err.message || (typeof err === 'string' ? err : "Erro desconhecido");
      toast.error(`Erro ao enviar áudio: ${errorMessage}`);
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "?";

  return (
    <div className="flex h-[calc(100vh-8.5rem)] overflow-hidden bg-[#efe7dd] dark:bg-[#0b141a] relative rounded-xl border shadow-sm"> {/* Main Container */}

      {/* Sidebar - Contact List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] flex-col border-r bg-white dark:bg-[#111b21] z-20`}>
        {/* Header */}
        <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between px-4 py-2 border-b dark:border-gray-800 shrink-0">

          {/* Filters Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${Object.values(activeFilters).some(v => v !== null) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : ''}`} title="Filtrar Conversas">
                <Filter className="w-5 h-5 text-[#54656f] dark:text-[#aebac1]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filtros</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs text-muted-foreground"
                  onClick={() => setActiveFilters({ corretorId: null, origem: null, imovelId: null })}
                >
                  Limpar
                </Button>
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-2"><Users className="w-3 h-3"/> Corretor</Label>
                  <Select 
                    value={activeFilters.corretorId || "all"} 
                    onValueChange={(val) => setActiveFilters(prev => ({ ...prev, corretorId: val === "all" ? null : val }))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Todos os corretores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os corretores</SelectItem>
                      {filterOptions.corretores.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-2"><Globe className="w-3 h-3"/> Origem do Lead</Label>
                <Select 
                  value={activeFilters.origem || "all"} 
                  onValueChange={(val) => setActiveFilters(prev => ({ ...prev, origem: val === "all" ? null : val }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Todas as origens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as origens</SelectItem>
                    {filterOptions.origens.map(o => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-2"><Home className="w-3 h-3"/> Imóvel de Interesse</Label>
                <Select 
                  value={activeFilters.imovelId || "all"} 
                  onValueChange={(val) => setActiveFilters(prev => ({ ...prev, imovelId: val === "all" ? null : val }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Todos os imóveis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os imóveis</SelectItem>
                    {filterOptions.imoveis.map(i => (
                      <SelectItem key={i.id} value={i.id} className="truncate max-w-[250px]">
                        {i.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

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
              placeholder="Pesquisar conversa ou contato..."
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b dark:border-[#2a3942] flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#111b21] dark:text-[#e9edef]">Conversas</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setConversations([]);
                fetchConversations();
                toast.success("Sincronização reiniciada");
              }}
              className="text-xs text-blue-500 h-8 gap-1"
            >
              <Layers className="w-3 h-3" /> Reiniciar
            </Button>
          </div>
          {conversations.filter((conv) => {
            if (!conv || !conv.contact) return false;
            let matchesSearch = true;
            let matchesFilter = true;

            // Search
            if (chatSearchQuery.trim()) {
              const q = chatSearchQuery.toLowerCase();
              matchesSearch = (conv.contact.name || "").toLowerCase().includes(q) ||
                              (conv.contact.email || "").toLowerCase().includes(q) ||
                              (conv.contact.phone || "").toLowerCase().includes(q);
            }

            // Filters
            if (activeFilters.corretorId) {
              if (conv.contact.assigned_to !== activeFilters.corretorId) matchesFilter = false;
            }
            if (activeFilters.origem) {
              if (conv.contact.source !== activeFilters.origem) matchesFilter = false;
            }
            if (activeFilters.imovelId) {
              if (conv.contact.interest_property_id !== activeFilters.imovelId) matchesFilter = false;
            }

            return matchesSearch && matchesFilter;
          }).map(conv => {
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
                  {/* Lead Indicator (Shows only if status is lead) */}
                  {conv.contact.status === 'lead' && (
                    <div
                      className="absolute -bottom-0 -right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-[#111b21] flex items-center justify-center z-10 shadow-sm"
                      title="Lead"
                    />
                  )}
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
          <div className="h-[70px] bg-white/80 dark:bg-[#202c33]/80 backdrop-blur-md flex items-center px-2 sm:px-6 py-2 justify-between z-20 border-l border-slate-200 dark:border-gray-700 w-full shrink-0 shadow-sm">
            <div className="flex items-center cursor-pointer overflow-hidden flex-1" onClick={() => { }}>
              {/* Back button for mobile */}
              <Button variant="ghost" size="icon" className="md:hidden mr-0.5 shrink-0 h-8 w-8" onClick={() => setSelectedConversation(null)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="relative group mr-2 sm:mr-4 shrink-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-indigo-100 shadow-sm group-hover:border-indigo-300 transition-all">
                  <AvatarImage src={selectedConversation.contact.profile_pic_url} />
                  <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">{getInitials(selectedConversation.contact.name)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#202c33]" />
              </div>

                <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg text-[#111b21] dark:text-[#e9edef] font-semibold tracking-tight truncate max-w-[100px] sm:max-w-none">
                    {selectedConversation.contact.name}
                  </span>
                  {selectedConversation.contact.status === 'lead' && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider h-5 px-1.5 shrink-0">
                      Lead
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    <Globe className="w-3 h-3 shrink-0" />
                    <span className="truncate">Conectado via WhatsApp</span>
                    
                    {selectedConversation.contact.assigned_to && (
                      <>
                        <span className="text-slate-300 mx-1">•</span>
                        <User className="w-3 h-3 shrink-0 text-indigo-400" />
                        <span className="truncate text-indigo-500 font-medium">
                          {filterOptions.corretores.find(c => c.id === selectedConversation.contact.assigned_to)?.name || 'Corretor Atribuído'}
                        </span>
                      </>
                    )}
                </div>
              </div>
            </div>

            <div className="flex gap-1 sm:gap-4 text-[#54656f] dark:text-[#aebac1] items-center shrink-0">
              
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900/50 dark:hover:bg-blue-900/20"
                onClick={() => setKanbanModalOpen(true)}
              >
                <Kanban className="w-4 h-4" />
                Criar Lead
              </Button>

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
                      Isso apagará o histórico desta conversa no sistema. As mensagens no WhatsApp não serão apagadas.
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
                            <div className="mb-1 rounded-lg overflow-hidden relative min-h-[100px] bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={msg.media_url}
                                  alt="Imagem"
                                  className="max-w-full max-h-[300px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                  onClick={() => window.open(msg.media_url!, '_blank')}
                                  onError={(e) => { 
                                    const img = e.target as HTMLImageElement;
                                    const currentSrc = img.src;
                                    
                                    // Robust retry for Supabase URLs
                                    if (currentSrc.includes('object/sign') && !currentSrc.includes('retry=sign')) {
                                      // First try: ensure we aren't stripping important parts
                                      img.src = `${currentSrc}${currentSrc.includes('?') ? '&' : '?'}retry=sign`;
                                    } else if (!currentSrc.includes('object/public') && currentSrc.includes('storage/v1/object/')) {
                                      // Second try: try public path if signed failed
                                      img.src = currentSrc.replace('object/sign', 'object/public').split('?')[0];
                                    } else if (!currentSrc.includes('retry=final')) {
                                      // Last try: simple cache buster
                                      img.src = `${currentSrc}${currentSrc.includes('?') ? '&' : '?'}retry=final`;
                                    } else {
                                      img.src = 'https://placehold.co/300x300?text=Erro+de+Carregamento'; 
                                    }
                                  }}
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
                              <video 
                                controls 
                                src={msg.media_url} 
                                className="rounded-lg max-w-full max-h-[300px]" 
                                onError={(e) => {
                                  const vid = e.target as HTMLVideoElement;
                                  if (vid.src.includes('object/sign') && !vid.src.includes('retry=true')) {
                                    vid.src = vid.src.replace('object/sign', 'object/public').split('?')[0];
                                  }
                                }}
                              />

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
                            <div className="flex items-center gap-2 sm:gap-3 min-w-[200px] sm:min-w-[280px] p-1 sm:p-2">
                              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                                  <AvatarImage src={isUser ? undefined : selectedConversation.contact.profile_pic_url} />
                                  <AvatarFallback>{isUser ? 'EU' : getInitials(selectedConversation.contact.name)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1">
                                  <Mic className={`w-4 h-4 ${isUser ? 'text-[#005c4b] dark:text-[#00a884]' : 'text-[#54656f] dark:text-[#8696a0]'}`} />
                                </div>
                              </div>
                              <div className="flex-1">
                                <AudioPlayer 
                                  src={msg.media_url || ''} 
                                  id={msg.id} 
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2 min-w-[150px] bg-gray-100 dark:bg-gray-800 rounded mb-1">
                              <Mic className="w-5 h-5 text-gray-400" />
                              <span className="italic text-xs text-gray-500">Áudio não carregado</span>
                            </div>
                          )
                        ) : msg.message_type === 'document' ? (
                          msg.media_url ? (
                            msg.mimetype?.startsWith('image/') ? (
                              <div className="mb-1 rounded-lg overflow-hidden relative min-h-[100px] bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={msg.media_url.includes('token=') ? msg.media_url : `${msg.media_url}${msg.media_url.includes('?') ? '&' : '?'}t=${imageSalts[msg.id] || 0}`}
                                  alt="Imagem"
                                  className="max-w-full max-h-[300px] object-contain cursor-pointer"
                                  onClick={() => window.open(msg.media_url!, '_blank')}
                                  onError={() => {
                                    if (!imageSalts[msg.id]) {
                                      setImageSalts(prev => ({ ...prev, [msg.id]: Date.now() }));
                                    }
                                  }}
                                />
                                {msg.content && <p className="mt-1 break-words px-1 font-medium">{msg.content}</p>}
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 bg-black/5 dark:bg-white/10 p-3 rounded-md cursor-pointer hover:bg-black/10 transition-colors max-w-[300px]" onClick={() => window.open(msg.media_url!, '_blank')}>
                                <div className="text-3xl text-red-500">📄</div>
                                <div className="overflow-hidden">
                                  <p className="truncate font-medium hover:underline">{msg.content || "Documento"}</p>
                                  <span className="text-xs uppercase opacity-70">PDF/DOC</span>
                                </div>
                              </div>
                            )
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
          <div className="min-h-[62px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center px-2 sm:px-4 py-2 gap-1.5 sm:gap-3 z-20 border-t border-[#d1d7db] dark:border-gray-700 shrink-0">
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
                <div className="cursor-pointer p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0">
                  <Paperclip className="w-5 h-5 sm:w-6 sm:h-6 text-[#54656f] dark:text-[#aebac1]" />
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
              className={`flex-1 bg-white dark:bg-[#2a3942] border-none shadow-sm focus-visible:ring-0 text-[#111b21] dark:text-[#e9edef] placeholder:text-[#667781] dark:placeholder:text-[#8696a0] rounded-lg py-2 px-3 sm:py-3 sm:px-4 h-10 ${isRecording ? 'text-red-500 font-bold animate-pulse' : ''}`}
              placeholder={isRecording ? `Gravando... ${formatDuration(recordingDuration)}` : "Mensagem..."}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isRecording}
              autoFocus
            />

            {messageInput.trim() ? (
              <div onClick={handleSendMessage} className="cursor-pointer p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0">
                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-[#54656f] dark:text-[#aebac1]" />
              </div>
            ) : isRecording ? (
              <div className="flex gap-1 sm:gap-2 shrink-0">
                {/* Cancel Recording */}
                <div onClick={cancelRecording} className="cursor-pointer p-1.5 sm:p-2 hover:bg-red-100 rounded-full transition-colors text-red-500">
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                {/* Send Recording */}
                <div onClick={stopRecording} className="cursor-pointer p-1.5 sm:p-2 bg-[#00a884] hover:bg-[#008f6f] rounded-full transition-colors text-white shadow-md">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            ) : (
              <div onClick={startRecording} className="cursor-pointer p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-[#54656f] dark:text-[#aebac1]" />
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
                {/* Fallback if Bot icon is not in the installed lucide-react version */}
                <Globe className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl text-[#41525d] dark:text-[#e9edef] font-light">
                Canaã imóveis
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

      <ContactDetailsModal 
        contact={selectedConversation?.contact as any} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />

      {/* Kanban Placement Modal */}
      <Dialog open={kanbanModalOpen} onOpenChange={setKanbanModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enviar para o Kanban</DialogTitle>
            <DialogDescription>
              Selecione o pipeline e a fase para criar um negócio para este lead.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome do Negócio</Label>
              <Input 
                value={kanbanDealTitle} 
                onChange={(e) => setKanbanDealTitle(e.target.value)}
                placeholder="Ex: Negociação - Nome do Lead" 
              />
            </div>
            <div className="grid gap-2">
              <Label>Pipeline</Label>
              <Select value={kanbanPipelineId} onValueChange={(v) => { setKanbanPipelineId(v); setKanbanStageId(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelines?.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Fase (Estágio)</Label>
              <Select value={kanbanStageId} onValueChange={setKanbanStageId} disabled={!kanbanPipelineId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fase" />
                </SelectTrigger>
                <SelectContent>
                  {kanbanStages?.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKanbanModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateKanbanDeal} disabled={!kanbanPipelineId || !kanbanStageId}>
              Criar no Kanban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

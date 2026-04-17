import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Calendar,
  Play,
  Pause,
  BrainCircuit,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  MessageSquare,
  User,
  Phone,
  Home,
  Bot,
  Loader2,
  Sparkles,
  AlertCircle,
  Clock,
  Handshake
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow, parseISO, differenceInHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Tables } from "@/integrations/supabase/types";
import type { DealWithContact } from "@/hooks/useDeals";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQueryClient } from "@tanstack/react-query";

type PipelineStage = Tables<"pipeline_stages">;

interface KanbanCardProps {
  deal: DealWithContact;
  stages: PipelineStage[];
  currentStage: PipelineStage;
  onViewDetails: () => void;
  onEdit: () => void;
  onMoveToStage: (stageId: string) => void;
  onMarkAsWon: () => void;
  onMarkAsLost: () => void;
  onDelete: () => void;
}

export function KanbanCard({
  deal,
  stages,
  currentStage,
  onViewDetails,
  onEdit,
  onMoveToStage,
  onMarkAsWon,
  onMarkAsLost,
  onDelete,
}: KanbanCardProps) {
  const queryClient = useQueryClient();
  const { session, profile } = useAuth();
  // Safety check: Ensure deal exists for hooks, but don't return yet
  const safeDealId = deal?.id || 'missing-deal';

  // Safe contact access handling potential array
  const rawContact = deal?.contacts as any;
  const initialContact = Array.isArray(rawContact) ? rawContact[0] : rawContact;

  useEffect(() => {
    if (deal?.title === 'vicente bueno' || deal?.title === 'marlon stenio') {
      console.log('DEBUG DEAL:', deal.title, 'CONTACT:', initialContact, 'APPOINTMENTS:', initialContact?.appointments);
    }
  }, [deal]);

  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [localAiStatus, setLocalAiStatus] = useState<string | null>(initialContact?.ai_status || null);
  const [bolsaoStages, setBolsaoStages] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Load Bolsao Config
  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await (supabase.from('companies').select('settings').limit(1).single() as any);
      if ((data?.settings as any)?.bolsao_stages) {
        setBolsaoStages((data.settings as any).bolsao_stages);
      }
    };
    loadConfig();
  }, []);

  // "Live" Logic (Regra das 2 horas)
  const getHoursWaiting = () => {
    if (!initialContact) return 0;
    const referenceDate = deal.updated_at || initialContact?.last_message_at || initialContact?.created_at || deal.created_at;
    if (!referenceDate) return 0;
    try {
      return differenceInHours(new Date(), parseISO(referenceDate));
    } catch (e) { return 0; }
  };

  const hoursWaiting = getHoursWaiting();
  const isWaitingTooLong = hoursWaiting >= 2;
  const isBolsaoStage = bolsaoStages[currentStage.pipeline_id] === currentStage.id;
  const isBolsaoActive = isBolsaoStage && isWaitingTooLong;
  const isChatStage = currentStage.name.toLowerCase().trim() === "em conversa";

  // Sentiment for AI button
  const displaySentiment = initialContact?.ai_sentiment;

  // Sync local state with prop changes
  useEffect(() => {
    const currentRaw = deal?.contacts as any;
    const currentContact = Array.isArray(currentRaw) ? currentRaw[0] : currentRaw;
    setLocalAiStatus(currentContact?.ai_status || null);
  }, [deal?.contacts]);

  // Drag and Drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: safeDealId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const getSourceIcon = (source?: string) => {
    const s = source?.toLowerCase() || "";
    if (s.includes("insta")) return <Instagram className="w-3 h-3 text-pink-600" />;
    if (s.includes("face")) return <Facebook className="w-3 h-3 text-blue-600" />;
    if (s.includes("linkedin")) return <Linkedin className="w-3 h-3 text-sky-700" />;
    if (s.includes("google")) return <Globe className="w-3 h-3 text-green-600" />;
    return <Globe className="w-3 h-3 text-muted-foreground" />;
  };

  if (!deal) return null;

  const handleToggleFollowUp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deal.contact_id) return;

    setIsFollowUpLoading(true);
    const oldStatus = localAiStatus;

    // Logic: 
    // If Active (Full) -> Scheduled (Follow-up Only)
    // If Scheduled (Follow-up Only) -> Paused (Off)
    // If Paused (Off) -> Scheduled (Follow-up Only)
    let newStatus = 'scheduled';
    if (oldStatus === 'scheduled') newStatus = 'paused';

    // Optimistic Update
    setLocalAiStatus(newStatus);

    try {
      const { error } = await supabase
        .from('contacts')
        .update({ ai_status: newStatus } as any)
        .eq('id', deal.contact_id);

      if (error) throw error;

      if (newStatus === 'scheduled') toast.success('Apenas Follow-up ativado (IA desligada)');
      else if (newStatus === 'paused') toast.success('Follow-up pausado');

    } catch (err) {
      // Revert on error
      setLocalAiStatus(oldStatus);
      toast.error("Erro ao alterar follow-up");
      console.error(err);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  const handleToggleAI = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deal.contact_id) return;

    setIsAiLoading(true);

    try {
      toast.info(`Iniciando análise de IA para ${contact?.name || 'este lead'}...`);

      const { data, error } = await supabase.functions.invoke('ai-analyzer', {
        body: { contactId: deal.contact_id }
      });

      if (error) throw error;

      toast.success('Análise concluída!');

      // We could trigger a refetch here if needed, but for now we rely on the parent
      // or the user manually refreshing. However, since the Card is part of a list, 
      // we usually want to update local state if possible.
      if (data?.analysis?.sentiment) {
        // Note: In a real app, you'd probably use a global state or refetch the Kanban data
        // But here we show immediate success feedback.
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Erro: ${err.message || "A análise falhou. Verifique sua chave API."}`);
    } finally {
      setIsAiLoading(false);
    }
  };


  const handleClaim = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!initialContact || !session?.user?.id) return;

    setIsClaiming(true);
    try {
      // Call the trusted database function to bypass any Row Level Security
      const { error } = await supabase.rpc('claim_bolsao_lead', {
        p_deal_id: deal.id,
        p_contact_id: initialContact.id
      });

      if (error) throw error;

      toast.success("Lead assumido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['deals'] });

    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao assumir lead: " + err.message);
    } finally {
      setIsClaiming(false);
    }
  };


  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deal.contact_id) {
      navigate(`/conversations`, { state: { selectedContactId: deal.contact_id } });
    } else {
      toast.error("Este deal não tem contato vinculado");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
  };

  // Safe contact access handling potential array from wildcard query
  const rawContactRender = deal?.contacts as any;
  const contact = Array.isArray(rawContactRender) ? rawContactRender[0] : rawContactRender;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <Card
        className={`group relative hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing border-l-4 
          ${isBolsaoActive
            ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-50/10'
            : 'border-l-transparent hover:border-l-primary'
          }`}
        onClick={onViewDetails}
      >
        <CardContent className="p-3 space-y-3">

          {/* COMPACT LAYOUT: Name, Source, Property, Value */}
          <div className="flex flex-col gap-1.5">

            {/* 1. Lead Name (Title) */}
            <h4 className="font-semibold text-sm text-foreground truncate leading-tight" title={contact?.name || deal.title}>
              {contact?.name || deal.title}
            </h4>

            {/* Owner Name (Clear & Discrete) */}
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground" title="Responsável pelo Lead">
              <User className="w-3 h-3 text-muted-foreground/70" />
              <span>Resp: <span className="font-medium text-foreground/80 lowercase capitalize">
                {isBolsaoActive ? 'Sem Dono (Bolsão)' : (deal.profiles?.full_name?.split(' ')[0] || (deal.assigned_to ? 'Proprietário' : 'Sem Dono'))}
              </span></span>
            </div>

            {/* 2. Source */}
            {contact?.source && (
              <div className="flex items-center gap-1.5 min-w-0" title="Fonte de Origem">
                <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-muted shadow-sm border border-border/50 shrink-0">
                  {getSourceIcon(contact.source)}
                </div>
                <span className="text-xs text-muted-foreground capitalize truncate">{contact.source}</span>
              </div>
            )}

            {/* 3. Property Name */}
            {(contact?.properties?.title || contact?.interest_property_id) && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 w-fit max-w-full" title="Imóvel de Interesse">
                <Home className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate leading-none">
                  {contact.properties?.title || contact.interest_property_id}
                </span>
              </div>
            )}

            {/* 4. Upcoming Appointment Badge (GHL Style) */}
            {initialContact?.appointments && initialContact.appointments.length > 0 && (
              (() => {
                // Filter for future scheduled appointments
                const futureAppts = initialContact.appointments
                  .filter(a => a.status === 'scheduled' && new Date(a.start_time) > new Date())
                  .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

                const nextAppt = futureAppts[0];

                if (nextAppt) {
                  const date = new Date(nextAppt.start_time);
                  const isToday = new Date().toDateString() === date.toDateString();
                  const dateStr = isToday
                    ? `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

                  return (
                    <div className="mt-1 flex items-center gap-1.5 w-fit bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-1.5 py-0.5 rounded text-[10px] font-medium border border-orange-200 dark:border-orange-800" title="Próximo Agendamento">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  );
                }
                return null;
              })()
            )}

            {/* 5. Deal Value (Only if filled) */}
            {deal.value && Number(deal.value) > 0 && (
              <div className="mt-0.5">
                <span className="font-bold text-sm text-foreground/90">
                  {formatCurrency(Number(deal.value))}
                </span>
              </div>
            )}
          </div>

          {/* CONTROLS ROW */}
          <div className="pt-2 mt-1 border-t border-border/50 flex items-center justify-between gap-1">

            {/* BOLSAO OR AI BUTTON */}
            {isBolsaoActive ? (
              <Button
                variant="default"
                size="sm"
                className="h-6 px-1.5 gap-1 text-[10px] flex-1 justify-center bg-red-600 hover:bg-red-700 text-white font-black animate-pulse"
                onClick={handleClaim}
                disabled={isClaiming}
              >
                {isClaiming ? <Loader2 className="w-3 h-3 animate-spin" /> : <Handshake className="w-3 h-3" />}
                BOLSÃO 🤝 ASSUMIR
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 px-1.5 gap-1 text-[10px] flex-1 justify-start ${displaySentiment ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100' : 'text-muted-foreground hover:bg-muted'}`}
                onClick={handleToggleAI}
                disabled={isAiLoading}
                title="Analisar Lead com IA"
              >
                {isAiLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate font-bold text-[10px]">
                      {isAiLoading ? '...' : (displaySentiment === 'hot' ? 'Quente' :
                        displaySentiment === 'warm' ? 'Morno' :
                          displaySentiment === 'cold' ? 'Frio' : 'Analise')}
                    </span>
                  </>
                )}
              </Button>
            )}

            {/* Chat Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-1.5 gap-1 text-[10px] flex-1 justify-center hover:bg-muted ${isWaitingTooLong && isChatStage ? 'text-red-600 font-bold animate-pulse ring-1 ring-red-100' : 'text-muted-foreground opacity-60'}`}
              onClick={handleChat}
              disabled={isBolsaoActive}
              title={isBolsaoActive ? "Assuma o lead primeiro" : "Abrir Conversa"}
            >
              <MessageSquare className={`w-3 h-3 ${(isWaitingTooLong && isChatStage) ? 'animate-bounce fill-red-600/20' : ''}`} />
              Chat {isChatStage && hoursWaiting > 0 ? `${hoursWaiting}h` : ''}
            </Button>

            {/* Follow-up Control */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-1.5 gap-1 text-[10px] flex-1 justify-end ${(localAiStatus === 'active' || localAiStatus === 'scheduled') ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300' : 'text-muted-foreground hover:bg-muted'} ${isBolsaoActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleToggleFollowUp}
              disabled={isFollowUpLoading || isBolsaoActive}
              title={isBolsaoActive ? "Assuma o lead para controlar follow-up" : "Pausar/Retomar Follow-up"}
            >
              {(localAiStatus === 'active' || localAiStatus === 'scheduled') ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="truncate">{contact?.follow_up_step ? `Etapa ${contact.follow_up_step}` : 'Manual'}</span>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks } from "@/hooks/useTasks";
import { useAppointments } from "@/hooks/useAppointments";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isAfter, formatDistanceToNow, differenceInHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Plus, FileText, CheckCircle2, Clock, UploadCloud, Tag, Handshake, Calendar, Trash2, ChevronDown, User, Bot, CircleUser, Target, Sparkles, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContactChat from "./ContactChat";
import CreateTaskModal from "../tasks/CreateTaskModal";
import CreateAppointmentModal from "../appointments/CreateAppointmentModal";
import { ContactCreateDealModal } from "./ContactCreateDealModal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTeam } from "@/hooks/useTeam";

export default function ContactDetailsTabs({ contact }: { contact: any }) {
    const [activeTab, setActiveTab] = useState("historico");
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<any>(null);
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);
    const [isDealModalOpen, setIsDealModalOpen] = useState(false);

    // Data Hooks
    const { tasks, isLoading: isLoadingTasks, updateTask, deleteTask } = useTasks(contact.id);
    const { appointments, isLoading: isLoadingAppts } = useAppointments(contact.id);
    const { profile } = useAuth();
    const { data: teamMembers = [] } = useTeam();

    // Deals and Files
    const [deals, setDeals] = useState<any[]>([]);
    const [dealHistory, setDealHistory] = useState<Record<string, any[]>>({});
    const [aiInsights, setAiInsights] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [isLoadingExtra, setIsLoadingExtra] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        fetchExtraData();
    }, [contact.id]);

    // Live sentiment logic
    const isInitialStage = deals.some(d => ["novo lead", "em conversa"].includes(d.pipeline_stages?.name?.toLowerCase()?.trim() || ""));
    const referenceDate = contact.last_message_at || contact.created_at;
    const hoursWaiting = referenceDate ? differenceInHours(new Date(), parseISO(referenceDate)) : 0;
    const isLivePendente = isInitialStage && hoursWaiting >= 2 && (!aiInsights[0] || aiInsights[0].sentiment !== 'hot');

    const getCurrentSentiment = (storedSentiment: string) => {
        if (isLivePendente) return 'ignored';
        return storedSentiment;
    };

    const fetchExtraData = async () => {
        setIsLoadingExtra(true);
        try {
            // Fetch deals
            const { data: dealsData } = await supabase
                .from("deals")
                .select("*, pipeline_stages(name)")
                .eq("contact_id", contact.id)
                .order("created_at", { ascending: false });

            if (dealsData) {
                setDeals(dealsData);

                // Fetch history for these deals
                if (dealsData.length > 0) {
                    const dealIds = dealsData.map(d => d.id);
                    const { data: histData } = await supabase
                        .from('deal_stage_history')
                        .select('*, from_stage:from_stage_id(name), to_stage:to_stage_id(name)')
                        .in('deal_id', dealIds)
                        .order('changed_at', { ascending: true });

                    if (histData) {
                        const grouped = histData.reduce((acc: any, curr) => {
                            if (!acc[curr.deal_id]) acc[curr.deal_id] = [];
                            acc[curr.deal_id].push(curr);
                            return acc;
                        }, {});
                        setDealHistory(grouped);
                    }
                }
            }

            // Fetch files
            const { data: fData } = await supabase
                .from('contact_files')
                .select('*')
                .eq('contact_id', contact.id)
                .order('created_at', { ascending: false });

            if (fData) setFiles(fData);

            // Fetch AI insights
            const { data: aiData } = await supabase
                .from('contact_ai_insights')
                .select('*')
                .eq('contact_id', contact.id)
                .order('created_at', { ascending: false });

            if (aiData) setAiInsights(aiData);
        } catch (error) {
            console.error("Error fetching extra data", error);
        } finally {
            setIsLoadingExtra(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile?.company_id) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${contact.id}/${Math.random()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('contact_files')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('contact_files').getPublicUrl(fileName);

            const { error: dbError } = await supabase.from('contact_files').insert({
                contact_id: contact.id,
                company_id: profile.company_id,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type || 'unknown',
                file_url: urlData.publicUrl,
                uploaded_by: profile.id
            });

            if (dbError) throw dbError;

            toast.success("Arquivo enviado com sucesso!");
            fetchExtraData(); // refresh
        } catch (err: any) {
            toast.error("Erro ao enviar arquivo: " + err.message);
        } finally {
            setUploading(false);
            e.target.value = ''; // reset input
        }
    };

    const handleDeleteFile = async (id: string, fileName: string) => {
        if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;
        try {
            // we omit deleting from storage for brevity, just delete db record
            await supabase.from("contact_files").delete().eq("id", id);
            setFiles(prev => prev.filter(f => f.id !== id));
            toast.success("Arquivo excluído.");
        } catch (err) {
            console.error(err);
        }
    };

    // Timeline synthesis combining Contact creation, Tasks creation/updates, Deals
    const generateTimeline = () => {
        const events: any[] = [];

        if (contact.created_at) {
            events.push({
                type: 'contact_created',
                title: 'Lead adicionado ao sistema',
                date: new Date(contact.created_at),
                icon: <Tag className="w-4 h-4" />,
                color: 'bg-blue-500'
            });
        }

        tasks.forEach(task => {
            events.push({
                type: 'task',
                title: `Tarefa "${task.title}" criada`,
                date: new Date(task.created_at || new Date()),
                icon: <CheckCircle2 className="w-4 h-4" />,
                color: 'bg-indigo-500'
            });
        });

        deals.forEach(deal => {
            events.push({
                type: 'deal',
                title: `Negócio #${deal.id.substring(0, 6)} criado R$ ${(deal.value || 0).toLocaleString('pt-BR')}`,
                date: new Date(deal.created_at || new Date()),
                icon: <Handshake className="w-4 h-4" />,
                color: 'bg-emerald-500'
            });
        });

        appointments.forEach(app => {
            events.push({
                type: 'appt',
                title: `Agendamento "${app.title}" marcado`,
                date: new Date(app.created_at || new Date()),
                icon: <Calendar className="w-4 h-4" />,
                color: 'bg-amber-500'
            });
        });

        // AI Insights (Registrados)
        aiInsights.forEach(insight => {
            events.push({
                id: `ai-${insight.id}`,
                type: 'ai-insight',
                title: 'Resumo de Inteligência Artificial',
                description: insight.summary,
                date: parseISO(insight.created_at),
                icon: <Bot className="w-4 h-4 text-white" />,
                iconBg: 'bg-indigo-600',
                sentiment: insight.sentiment
            });
        });

        return events.sort((a, b) => b.date.getTime() - a.date.getTime());
    };

    const timeline = generateTimeline();

    return (
        <div className="flex-1 flex flex-col bg-white">
            <Tabs value={activeTab} className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                <div className="px-6 pt-4 border-b border-gray-100 shadow-sm z-10 sticky top-0 bg-white">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-8">
                        {['historico', 'atividades', 'negocios', 'arquivos'].map(tab => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-sm font-semibold text-slate-500 data-[state=active]:text-slate-800 transition-all capitalize"
                            >
                                {tab}
                                {tab === 'atividades' && tasks.filter(t => t.status === 'pending').length > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full font-bold">
                                        {tasks.filter(t => t.status === 'pending').length}
                                    </span>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 scrollbar-thin scrollbar-thumb-gray-200">

                    {/* HISTÓRICO / TIMELINE */}
                    <TabsContent value="historico" className="mt-0 space-y-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Linha do Tempo</h3>
                                <p className="text-xs text-slate-500">Acompanhe a jornada deste contato</p>
                            </div>
                        </div>

                        <div className="relative pl-7 before:absolute before:inset-0 before:left-3 before:-translate-x-px before:h-full before:w-[2px] before:bg-blue-400">
                            {timeline.length === 0 && <p className="text-sm text-slate-500 pl-4 py-8">Nenhum histórico registrado.</p>}
                            <div className="space-y-4">
                                {timeline.map((event, i) => (
                                    <div key={i} className="relative flex items-center w-full group">
                                        <div className={`absolute -left-10 flex items-center justify-center w-7 h-7 rounded-full border-2 border-white ${event.type === 'ai-insight' ? 'bg-indigo-600' : event.color} text-white shadow-sm z-10 top-2`}>
                                            {event.type === 'contact_created' ? <CircleUser className="w-[14px] h-[14px]" /> :
                                                event.type === 'task' ? <CheckCircle2 className="w-[14px] h-[14px]" /> :
                                                    event.type === 'deal' ? <Handshake className="w-[14px] h-[14px]" /> :
                                                        event.type === 'ai-insight' ? <Bot className="w-[14px] h-[14px]" /> : <Calendar className="w-[14px] h-[14px]" />}
                                        </div>
                                        <div className={`w-full flex flex-col p-3 rounded-lg border ${event.type === 'ai-insight' ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-slate-200'} shadow-sm transition-all ml-1`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-[13px] text-slate-700 flex items-center gap-2 font-medium">
                                                    {event.type === 'contact_created' ? <User className="h-[14px] w-[14px] text-slate-500" /> : <Tag className="h-[14px] w-[14px] text-slate-500" />}
                                                    <span>{event.title}</span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium bg-slate-50 border border-slate-100 rounded-md px-2 py-1">
                                                    <Bot className="h-[12px] w-[12px] text-slate-500" />
                                                    <span>Sistema Automático</span>
                                                </div>
                                                <time className="text-[11px] font-medium text-slate-400">
                                                    {format(event.date, "dd/MM/yyyy HH:mm")}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ATIVIDADES */}
                    <TabsContent value="atividades" className="mt-0 max-w-4xl mx-auto space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Atividades</h3>
                                <p className="text-sm text-slate-500">Lista de atividades e tarefas</p>
                            </div>
                            <Button onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 shadow-md w-full sm:w-auto">
                                <Plus className="w-4 h-4 mr-2" /> Nova Tarefa
                            </Button>
                        </div>

                        {isLoadingTasks ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-slate-300" /></div>
                        ) : (
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <div key={task.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {task.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className={`font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                                    {task.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <time className="text-xs text-slate-500">
                                                        {task.due_date ? format(parseISO(task.due_date), "dd/MM/yyyy HH:mm") : 'Sem data'}
                                                    </time>
                                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${task.priority === 'high' ? 'border-red-200 text-red-600 bg-red-50' : task.priority === 'medium' ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
                                                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                                onClick={() => { setTaskToEdit(task); setIsTaskModalOpen(true); }}
                                            >
                                                <Tag className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                onClick={() => deleteTask.mutate(task.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {tasks.length === 0 && <p className="text-center py-8 text-slate-500 bg-white rounded-xl border border-dashed">Nenhuma tarefa para este contato.</p>}
                            </div>
                        )}
                    </TabsContent>

                    {/* NEGÓCIOS */}
                    <TabsContent value="negocios" className="mt-0 max-w-4xl mx-auto space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Negócios</h3>
                                <p className="text-sm text-slate-500">Veja qual a participação do lead em negociações</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isAnalyzing}
                                    className="bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold transition-all shadow-sm h-10 px-4"
                                    onClick={async () => {
                                        try {
                                            setIsAnalyzing(true);
                                            toast.info("A IA está analisando este contato... Aguarde.");
                                            const { data, error } = await supabase.functions.invoke('ai-analyzer', {
                                                body: { contactId: contact.id }
                                            });
                                            if (error) throw error;
                                            toast.success("Análise concluída com sucesso!");
                                            fetchExtraData();
                                        } catch (err: any) {
                                            console.error(err);
                                            toast.error(`Erro: ${err.message || "Verifique se a sua chave API está configurada nas Configurações de IA."}`);
                                        } finally {
                                            setIsAnalyzing(false);
                                        }
                                    }}
                                >
                                    {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
                                    {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
                                </Button>
                                <Button onClick={() => setIsDealModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-md h-10 font-bold">
                                    <Plus className="w-4 h-4 mr-2" /> Criar Negócio
                                </Button>
                            </div>
                        </div>

                        {deals.length > 0 ? (
                            <div className="space-y-4">
                                {deals.map(deal => {
                                    const timeInPipeline = deal.created_at ? formatDistanceToNow(parseISO(deal.created_at), { locale: ptBR }) : 'N/A';
                                    const inactiveTime = deal.updated_at ? formatDistanceToNow(parseISO(deal.updated_at), { locale: ptBR }) :
                                        deal.created_at ? formatDistanceToNow(parseISO(deal.created_at), { locale: ptBR }) : 'N/A';
                                    const owner = teamMembers.find(m => m.id === deal.assigned_to) || teamMembers.find(m => m.user_id === deal.assigned_to);

                                    return (
                                        <div key={deal.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-5">
                                            <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-4 min-w-[200px]">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                                        <Handshake className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-lg leading-tight">{deal.title || 'Sem produto'}</p>
                                                        <p className="text-sm font-bold text-emerald-600 mt-0.5">R$ {(deal.value || 0).toLocaleString('pt-BR')}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 flex-1 lg:justify-end">
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                        <Badge variant="outline" className={`font-bold ${deal.stage === 'lost' ? 'text-red-600 border-red-200 bg-red-50' : deal.stage === 'won' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>
                                                            {deal.stage === 'lost' ? 'Perdido' : deal.stage === 'won' ? 'Ganho' : 'Em aberto'}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-center hidden sm:block">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Responsável</p>
                                                        <div className="flex items-center gap-1.5 justify-center">
                                                            <CircleUser className="w-4 h-4 text-slate-400" />
                                                            <p className="text-sm font-bold text-slate-700">{owner?.full_name || 'Não atribuído'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tempo no Pipeline</p>
                                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {timeInPipeline}</p>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Passou Por (Etapa Atual)</p>
                                                    <p className="text-sm font-bold text-indigo-700 flex items-center gap-1.5"><Target className="w-4 h-4 text-indigo-400" /> {deal.pipeline_stages?.name || 'Inicial'}</p>

                                                    {/* TRILHA DE ETAPAS (NOVO HISTORICO) */}
                                                    {dealHistory[deal.id] && dealHistory[deal.id].length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-1 items-center opacity-70 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-[9px] uppercase font-bold text-slate-400">Trilha:</span>
                                                            {dealHistory[deal.id].map((h, idx) => (
                                                                <span key={idx} className="flex items-center gap-1">
                                                                    <Badge variant="outline" className="text-[9px] px-1 h-4 bg-white font-normal text-slate-500">
                                                                        {h.from_stage?.name || 'Início'}
                                                                    </Badge>
                                                                    <ChevronDown className="w-2 h-2 -rotate-90 text-slate-300" />
                                                                </span>
                                                            ))}
                                                            <Badge variant="outline" className="text-[9px] px-1 h-4 bg-indigo-50 border-indigo-200 font-bold text-indigo-700">
                                                                {deal.pipeline_stages?.name}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Inativo a</p>
                                                    <p className="text-sm font-bold text-red-600 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-red-400" /> {inactiveTime}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Handshake className="w-8 h-8 text-slate-400" />
                                </div>
                                <h4 className="text-slate-900 font-bold">Nenhum negócio ativo</h4>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Este lead ainda não possui negociações vinculadas.</p>
                            </div>
                        )}

                        {/* AI SECCTION INSIDE NEGOCIOS TAB */}
                        {aiInsights.length > 0 && (
                            <div className="mt-12 space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                    <h3 className="text-lg font-bold text-slate-800">Inteligência Estratégica</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {aiInsights.map((insight: any) => (
                                        <div key={insight.id} className="bg-white border-2 border-indigo-50 rounded-2xl p-6 shadow-sm hover:border-indigo-100 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                        <Bot className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Análise da IA</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(insight.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getCurrentSentiment(insight.sentiment) === 'hot' ? 'bg-orange-100 text-orange-600' :
                                                    getCurrentSentiment(insight.sentiment) === 'warm' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {getCurrentSentiment(insight.sentiment) === 'hot' ? '🔥 Quente' :
                                                        getCurrentSentiment(insight.sentiment) === 'warm' ? '💧 Morno' :
                                                            getCurrentSentiment(insight.sentiment) === 'ignored' ? '❄️ Pendente' :
                                                                '🧊 Frio'}
                                                </div>
                                            </div>

                                            <p className="text-base text-slate-700 font-medium mb-6 italic">
                                                "{insight.summary}"
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {insight.profile && (
                                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Perfil do Lead</p>
                                                        <p className="text-sm text-slate-900 font-semibold">{insight.profile}</p>
                                                    </div>
                                                )}
                                                {insight.interests && (
                                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Interesses</p>
                                                        <p className="text-sm text-slate-900 font-semibold">{insight.interests}</p>
                                                    </div>
                                                )}
                                                {insight.objections && (
                                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Objeções</p>
                                                        <p className="text-sm text-slate-900 font-semibold">{insight.objections}</p>
                                                    </div>
                                                )}
                                                {insight.next_step && (
                                                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Próximo Passo</p>
                                                        <p className="text-sm text-indigo-900 font-bold">{insight.next_step}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* ARQUIVOS */}
                    <TabsContent value="arquivos" className="mt-0 max-w-4xl mx-auto space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Documentos e Arquivos</h3>
                                <p className="text-sm text-slate-500">Gerencie arquivos enviados por este lead</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <Input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <Button
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    disabled={uploading}
                                    className="bg-indigo-600 hover:bg-white hover:text-indigo-600 border border-indigo-600 transition-all font-bold group"
                                >
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                    Upload de Arquivo
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(files as any[]).map((file: any) => (
                                <div key={file.id} className="flex items-center justify-between p-2 rounded-lg border border-border bg-white shadow-sm group hover:border-indigo-200 transition-colors">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-medium truncate">{file.file_name}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {new Date(file.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <a
                                            href={file.file_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <button onClick={() => handleDeleteFile(file.id, file.file_name)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {files.length === 0 && (
                                <div className="col-span-full py-16 bg-white rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                                    <UploadCloud className="h-10 w-10 text-slate-200 mb-2" />
                                    <p className="text-slate-400 text-sm font-medium">Nenhum arquivo enviado ainda.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            {/* CREATE MODALS */}
            <CreateTaskModal
                open={isTaskModalOpen}
                onOpenChange={setIsTaskModalOpen}
                contactId={contact.id}
                defaultAssignee={contact.assigned_to}
                taskToEdit={taskToEdit}
            />

            <ContactCreateDealModal
                open={isDealModalOpen}
                onOpenChange={setIsDealModalOpen}
                contact={contact}
                onSuccess={fetchExtraData}
            />
        </div>
    );
}

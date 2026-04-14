import { useState, useEffect } from "react";
import {
    Bot,
    MessageSquare,
    Zap,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Calendar,
    Clock,
    Info,
    LayoutDashboard,
    Handshake,
    Trash2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { supabase } from "@/integrations/supabase/client";

// Mock Stats Data
const STATS = [
    { label: "Conversas Ativas", value: "12", icon: MessageSquare, color: "text-blue-500", trend: "+2" },
    { label: "Taxa de Sucesso", value: "85%", icon: CheckCircle2, color: "text-green-500", trend: "+5%" },
    { label: "Intervenções", value: "3", icon: AlertTriangle, color: "text-orange-500", trend: "-1" },
    { label: "Msg. Geradas", value: "1.2k", icon: Zap, color: "text-purple-500", trend: "+120" },
];

export default function Agents() {
    const { profile } = useAuth();
    const { mode } = useCrmMode();
    const [isFollowUpActive, setIsFollowUpActive] = useState(true);
    const [isConfirmationActive, setIsConfirmationActive] = useState(false);
    const [isReminderActive, setIsReminderActive] = useState(false);
    const [bolsaoStages, setBolsaoStages] = useState<Record<string, string>>({});
    const [pipelines, setPipelines] = useState<any[]>([]);
    const [stages, setStages] = useState<any[]>([]);
    const [instanceId, setInstanceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!profile?.company_id) return;

        const fetchSettings = async () => {
            try {
                setLoading(true);
                const { data, error } = await (supabase
                    .from('instances' as any)
                    .select('id, settings')
                    .eq('company_id' as any, profile.company_id)
                    .limit(1)
                    .maybeSingle() as any);

                if (error) {
                    console.error("Error fetching instance:", error);
                    toast.error("Erro ao carregar configurações.");
                    return;
                }

                if (data) {
                    setInstanceId((data as any).id);
                    const settings = (data as any).settings as any || {};

                    if (settings.is_followup_active !== undefined) setIsFollowUpActive(settings.is_followup_active);
                    if (settings.is_appointment_confirmation_active !== undefined) setIsConfirmationActive(settings.is_appointment_confirmation_active);
                    if (settings.is_appointment_reminder_active !== undefined) setIsReminderActive(settings.is_appointment_reminder_active);
                }

                // Fetch Pipeline Config from Company
                const { data: companyData } = await (supabase.from('companies').select('settings').limit(1).single() as any);
                if (companyData?.settings && typeof companyData.settings === 'object') {
                    setBolsaoStages((companyData.settings as any).bolsao_stages || {});
                }

                // Fetch Pipelines and Stages
                const { data: pipes } = await supabase.from('pipelines').select('id, name, business_type').order('position');
                const { data: stgs } = await supabase.from('pipeline_stages').select('id, name, pipeline_id').order('position');

                if (pipes) setPipelines(pipes);
                if (stgs) setStages(stgs);

            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [profile?.company_id]);

    const saveSettings = async (updates: any) => {
        if (!instanceId) return;

        const { error } = await (supabase
            .from('instances' as any)
            .update({
                settings: {
                    is_followup_active: updates.is_followup_active ?? isFollowUpActive,
                    is_appointment_confirmation_active: updates.is_appointment_confirmation_active ?? isConfirmationActive,
                    is_appointment_reminder_active: updates.is_appointment_reminder_active ?? isReminderActive
                }
            })
            .eq('id' as any, instanceId) as any);

        if (error) {
            toast.error("Falha ao salvar configuração.");
            console.error(error);
        }
    };

    const toggleFollowUp = (checked: boolean) => {
        setIsFollowUpActive(checked);
        saveSettings({ is_followup_active: checked });
        toast(checked ? "Follow-up Automático ATIVADO" : "Follow-up Automático DESATIVADO");
    };

    const toggleConfirmation = (checked: boolean) => {
        setIsConfirmationActive(checked);
        saveSettings({ is_appointment_confirmation_active: checked });
        toast(checked ? "Confirmação Automática ATIVADA" : "Confirmação Automática DESATIVADA");
    };

    const toggleReminder = (checked: boolean) => {
        setIsReminderActive(checked);
        saveSettings({ is_appointment_reminder_active: checked });
        toast(checked ? "Lembretes Automáticos ATIVADOS" : "Lembretes Automáticos DESATIVADOS");
    };

    const saveBolsao = async (pipelineId: string, stageId: string) => {
        const newBolsao = { ...bolsaoStages, [pipelineId]: stageId };
        setBolsaoStages(newBolsao);
        setIsSaving(true);

        try {
            const { data: currentCompany } = await (supabase.from('companies').select('id, settings').limit(1).single() as any);
            if (currentCompany) {
                const settings = { ...((currentCompany as any).settings || {}), bolsao_stages: newBolsao };
                await supabase.from('companies').update({ settings } as any).eq('id', currentCompany.id);
                toast.success("Configuração de Bolsão salva!");
            }
        } catch (e) {
            toast.error("Erro ao salvar bolsão.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredPipelines = pipelines.filter(p => !mode || p.business_type === mode);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" /> Carregando Central de Inteligência...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Bot className="h-8 w-8 text-primary" />
                    Central de Inteligência
                </h1>
                <p className="text-muted-foreground mt-1">
                    Configure o comportamento da sua IA e as réguas de contato.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {STATS.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.trend} em relação a ontem
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-1 gap-8">

                <div className="grid lg:grid-cols-1 gap-8">

                    {/* 1. Follow-up Configuration */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            1. Follow-up (Acompanhamento)
                        </h2>

                        <Card className={`border-l-4 ${isFollowUpActive ? "border-l-green-500" : "border-l-red-500"}`}>
                            <div className="flex items-center justify-between p-6 border-b">
                                <div className="space-y-1">
                                    <h3 className="font-medium text-lg">Follow-up Automático</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Quando ativado, o sistema inicia o ciclo de mensagens após <strong className="text-primary">7 dias de inatividade</strong> (apenas na etapa "Novo Lead").
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant={isFollowUpActive ? "default" : "secondary"}>
                                            {isFollowUpActive ? "ATIVADO (7 DIAS)" : "DESLIGADO"}
                                        </Badge>
                                    </div>
                                </div>
                                <Switch
                                    checked={isFollowUpActive}
                                    onCheckedChange={toggleFollowUp}
                                    className="data-[state=checked]:bg-green-500 scale-125"
                                />
                            </div>

                            <div className="p-6 bg-muted/20">
                                <h4 className="flex items-center gap-2 font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                                    <Info className="w-4 h-4" />
                                    Como funciona o ciclo:
                                </h4>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="bg-card p-4 rounded-lg border text-center space-y-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-sm font-bold">1</div>
                                        <h5 className="font-medium text-sm">Curto Prazo (Dias 1-3)</h5>
                                        <p className="text-xs text-muted-foreground">
                                            Inicia <strong>imediatamente</strong> após ativar. Foco no imóvel de interesse. Tenta novamente em <strong>48h</strong>.
                                        </p>
                                    </div>
                                    <div className="bg-card p-4 rounded-lg border text-center space-y-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-sm font-bold">2</div>
                                        <h5 className="font-medium text-sm">Expansão (Dias 7-14)</h5>
                                        <p className="text-xs text-muted-foreground">
                                            Sem resposta? Em <strong>7 dias</strong> sugere similares. Em <strong>14 dias</strong> envia novas opções.
                                        </p>
                                    </div>
                                    <div className="bg-card p-4 rounded-lg border text-center space-y-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-sm font-bold">3</div>
                                        <h5 className="font-medium text-sm">Encerramento (Dias 30-45)</h5>
                                        <p className="text-xs text-muted-foreground">
                                            Última tentativa aos <strong>30 dias</strong>. Se continuar em silêncio, encerra aos <strong>45 dias</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* 2. Appointment Automation */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-600" />
                            2. Automações de Agenda
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Confirmation Agent */}
                            <Card className={`border-l-4 ${isConfirmationActive ? "border-l-green-500" : "border-l-gray-300"}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            Agente de Confirmação
                                        </CardTitle>
                                        <Switch
                                            checked={isConfirmationActive}
                                            onCheckedChange={toggleConfirmation}
                                        />
                                    </div>
                                    <CardDescription>
                                        Dispara imediatamente após o agendamento.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-2">
                                    <p>• Envia confirmação para o <strong>Cliente</strong>.</p>
                                    <p>• Notifica o <strong>Corretor</strong> ("Novo Agendamento").</p>
                                </CardContent>
                            </Card>

                            {/* Reminder Agent */}
                            <Card className={`border-l-4 ${isReminderActive ? "border-l-green-500" : "border-l-gray-300"}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Agente de Lembretes
                                        </CardTitle>
                                        <Switch
                                            checked={isReminderActive}
                                            onCheckedChange={toggleReminder}
                                        />
                                    </div>
                                    <CardDescription>
                                        Monitora e avisa nos prazos definidos.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-2">
                                    <p>• <strong>Cliente:</strong> 24h antes e 1h antes.</p>
                                    <p>• <strong>Corretor:</strong> No dia (08:00) e 1h antes.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Handshake className="h-5 w-5 text-blue-600" />
                                3. Canais de Bolsão (Repescagem)
                            </h2>
                            <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 font-bold gap-2">
                                <Zap className="w-4 h-4" />
                                Adicionar Automação
                            </Button>
                        </div>

                        <Card className="border-blue-100">
                            <CardHeader className="bg-blue-50/30 rounded-t-xl border-b border-blue-50">
                                <CardTitle className="text-base text-blue-900 font-bold">
                                    Configurar Etapa de Bolsão ({mode === 'barcos' ? 'Barcos' : 'Imóveis'})
                                </CardTitle>
                                <CardDescription className="text-blue-700/70">
                                    Defina qual coluna funcionará como Bolsão. Leads nestas colunas que ficarem mais de 2 horas sem resposta poderão ser pescados por qualquer corretor.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                {filteredPipelines.length === 0 && (
                                    <div className="text-center py-8 text-slate-400 text-sm italic">
                                        Nenhum pipeline encontrado para este modo.
                                    </div>
                                )}
                                {filteredPipelines.map(pipe => (
                                    <div key={pipe.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <LayoutDashboard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{pipe.name}</p>
                                                <p className="text-xs text-slate-500">Pipeline de Vendas</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="min-w-[200px]">
                                                <Select
                                                    value={bolsaoStages[pipe.id] || "none"}
                                                    onValueChange={(val) => saveBolsao(pipe.id, val)}
                                                >
                                                    <SelectTrigger className={`bg-white font-medium ${bolsaoStages[pipe.id] && bolsaoStages[pipe.id] !== 'none' ? 'border-blue-600 text-blue-600 ring-blue-50' : ''}`}>
                                                        <SelectValue placeholder="Selecione um estágio" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none" className="text-slate-400 italic">Desativado</SelectItem>
                                                        {stages.filter(s => s.pipeline_id === pipe.id).map(stage => (
                                                            <SelectItem key={stage.id} value={stage.id}>
                                                                {stage.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`transition-colors ${(!bolsaoStages[pipe.id] || bolsaoStages[pipe.id] === 'none')
                                                    ? 'text-slate-200 cursor-not-allowed'
                                                    : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                                                onClick={() => saveBolsao(pipe.id, "none")}
                                                disabled={!bolsaoStages[pipe.id] || bolsaoStages[pipe.id] === 'none'}
                                                title="Remover Automação"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </section>

                </div>
            </div>
        </div>
    );
}

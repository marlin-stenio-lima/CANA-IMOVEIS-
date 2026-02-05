import { useState, useEffect } from "react";
import {
    Bot,
    MessageSquare,
    Zap,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Calendar,
    Search,
    Clock,
    Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Mock Stats Data
const STATS = [
    { label: "Conversas Ativas", value: "12", icon: MessageSquare, color: "text-blue-500", trend: "+2" },
    { label: "Taxa de Sucesso", value: "85%", icon: CheckCircle2, color: "text-green-500", trend: "+5%" },
    { label: "Intervenções", value: "3", icon: AlertTriangle, color: "text-orange-500", trend: "-1" },
    { label: "Msg. Geradas", value: "1.2k", icon: Zap, color: "text-purple-500", trend: "+120" },
];

const AGENTS = [
    {
        id: 1,
        name: "Agente de Triagem",
        description: "Responde dúvidas básicas e transfere para o corretor assumir o atendimento.",
        icon: Search,
        color: "bg-blue-100 text-blue-600",
        features: ["Respostas Rápidas", "Coleta de Dados", "Transferência para Corretor"]
    },
    {
        id: 2,
        name: "Agente de Agendamento",
        description: "Responde dúvidas e foca totalmente em agendar uma visita com o lead.",
        icon: Calendar,
        color: "bg-green-100 text-green-600",
        features: ["Respostas Rápidas", "Sugestão de Horários", "Conversão em Visita"]
    }
];

export default function Agents() {
    const { profile } = useAuth();
    const [activeAgentId, setActiveAgentId] = useState<number | null>(2);
    const [isMasterActive, setIsMasterActive] = useState(true);
    const [isFollowUpActive, setIsFollowUpActive] = useState(true);
    const [isConfirmationActive, setIsConfirmationActive] = useState(false);
    const [isReminderActive, setIsReminderActive] = useState(false);
    const [instanceId, setInstanceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile?.company_id) return;

        const fetchSettings = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('instances')
                    .select('id, settings')
                    .eq('company_id', profile.company_id)
                    .limit(1)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching instance:", error);
                    toast.error("Erro ao carregar configurações.");
                    return;
                }

                if (data) {
                    setInstanceId(data.id);
                    const settings = data.settings as any || {};

                    if (settings.active_agent_id) setActiveAgentId(settings.active_agent_id);
                    if (settings.is_global_ai_active !== undefined) setIsMasterActive(settings.is_global_ai_active);
                    if (settings.is_global_ai_active !== undefined) setIsMasterActive(settings.is_global_ai_active);
                    if (settings.is_followup_active !== undefined) setIsFollowUpActive(settings.is_followup_active);
                    if (settings.is_appointment_confirmation_active !== undefined) setIsConfirmationActive(settings.is_appointment_confirmation_active);
                    if (settings.is_appointment_reminder_active !== undefined) setIsReminderActive(settings.is_appointment_reminder_active);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [profile?.company_id]);

    const saveSettings = async (updates: any) => {
        if (!instanceId) return;

        // Optimistic Update
        const { error } = await supabase
            .from('instances')
            .update({
                settings: {
                    active_agent_id: updates.active_agent_id ?? activeAgentId,
                    is_global_ai_active: updates.is_global_ai_active ?? isMasterActive,
                    active_agent_id: updates.active_agent_id ?? activeAgentId,
                    is_global_ai_active: updates.is_global_ai_active ?? isMasterActive,
                    is_followup_active: updates.is_followup_active ?? isFollowUpActive,
                    is_appointment_confirmation_active: updates.is_appointment_confirmation_active ?? isConfirmationActive,
                    is_appointment_reminder_active: updates.is_appointment_reminder_active ?? isReminderActive
                }
            })
            .eq('id', instanceId);

        if (error) {
            toast.error("Falha ao salvar configuração.");
            console.error(error);
        }
    };

    const handleActivateAgent = (id: number) => {
        if (activeAgentId === id) return;
        setActiveAgentId(id);
        saveSettings({ active_agent_id: id });
        toast.success(`Agente atualizado!`, {
            description: `${AGENTS.find(a => a.id === id)?.name} agora está ativo.`
        });
    };

    const toggleMasterSwitch = (checked: boolean) => {
        setIsMasterActive(checked);
        saveSettings({ is_global_ai_active: checked });
        toast(checked ? "IA LIGADA" : "IA DESLIGADA", {
            description: checked ? "O sistema voltará a responder automaticamente." : "O sistema está pausado."
        });
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

                {/* 1. Master Controls Section (Top of Page) */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        1. Ativação Geral (IA de Atendimento)
                    </h2>
                    <Card className={`border-l-4 ${isMasterActive ? "border-l-green-500" : "border-l-red-500"}`}>
                        <div className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <h3 className="font-medium text-lg">Status da Inteligência Artificial</h3>
                                <p className="text-sm text-muted-foreground">
                                    Quando desativado, a IA é totalmente pausada: não responde novos contatos e interrompe todos os follow-ups automáticos.
                                </p>
                                <div className="mt-2">
                                    <Badge variant={isMasterActive ? "default" : "destructive"}>
                                        {isMasterActive ? "IA LIGADA" : "IA DESLIGADA"}
                                    </Badge>
                                </div>
                            </div>
                            <Switch
                                checked={isMasterActive}
                                onCheckedChange={toggleMasterSwitch}
                                className="data-[state=checked]:bg-green-500 scale-125"
                            />
                        </div>
                    </Card>
                </section>

                <div className="grid lg:grid-cols-1 gap-8">

                    {/* 2. Agent Selection */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            2. Escolha o Perfil do Agente
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {AGENTS.map((agent) => {
                                const isSelected = activeAgentId === agent.id;
                                return (
                                    <Card
                                        key={agent.id}
                                        className={`relative transition-all duration-300 cursor-pointer overflow-hidden border-2
                    ${isSelected ? "border-primary shadow-lg scale-[1.01]" : "border-transparent hover:border-muted-foreground/20 text-muted-foreground opacity-80 hover:opacity-100"}
                  `}
                                        onClick={() => handleActivateAgent(agent.id)}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                                                ATIVO
                                            </div>
                                        )}
                                        <CardHeader>
                                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${agent.color}`}>
                                                <agent.icon className="h-6 w-6" />
                                            </div>
                                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                                            <CardDescription className="h-10 mt-2">
                                                {agent.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {agent.features.map((feature, idx) => (
                                                    <li key={idx} className="text-xs flex items-center gap-2 text-muted-foreground">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* 3. Follow-up Configuration */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            3. Follow-up (Acompanhamento)
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

                    {/* 4. Appointment Automation */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-600" />
                            4. Automações de Agenda
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

                </div>
            </div>
        </div>
    );
}

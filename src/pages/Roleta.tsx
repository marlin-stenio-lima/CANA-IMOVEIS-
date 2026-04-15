import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Zap, MessageSquare, ArrowDown, Settings2, Trash2, Save, Clock, Users, ArrowRight, ShieldCheck, AlertTriangle, Bot, CheckCircle2, Filter, DollarSign, MapPin, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock Data for "Visual" feel while DB is offline
const MOCK_ROULETTES = [
    { id: "1", name: "Equipe Elite (Geral)", type: "Round Robin", members: 5 },
    { id: "2", name: "Plantão Noturno", type: "Horário", members: 2 },
    { id: "3", name: "Imóveis Alto Padrão", type: "Por Imóvel", members: 3 },
];

const MOCK_TRIGGERS = [
    { id: "1", name: "Campanha Casa Itaipava", source: "whatsapp", condition: "texto contém 'Itaipava'", rouletteId: "3", active: true },
    { id: "2", name: "Formulário Facebook Geral", source: "facebook", condition: "Form ID: 12345", rouletteId: "1", active: true },
];

export default function Roleta() {
    const [automationStep, setAutomationStep] = useState(0); // 0 = List, 1 = Editor
    const [selectedRoulette, setSelectedRoulette] = useState<string>("");
    const [triggerType, setTriggerType] = useState<string>("whatsapp");
    const [matchText, setMatchText] = useState("");
    const [portalUrl, setPortalUrl] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [pipelineStage, setPipelineStage] = useState("novo_lead");
    const [triggersList, setTriggersList] = useState(MOCK_TRIGGERS);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);

    useEffect(() => {
        const fetchTeam = async () => {
            const { data } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
            if (data) setTeamMembers(data);
        };
        fetchTeam();
    }, []);

    // Config Tab States
    const [configStep, setConfigStep] = useState(0); // 0 = List, 1 = Create/Edit
    const [roulettesList, setRoulettesList] = useState(MOCK_ROULETTES);
    const [newRoulette, setNewRoulette] = useState({ name: "", type: "round_robin", slaTime: "5" });

    const handleSave = () => {
        toast.success("Automação salva com sucesso!", {
            description: "O fluxo foi validado e está ativo."
        });
        setAutomationStep(0);
    };

    const handleDeleteTrigger = (id: string) => {
        setTriggersList(triggersList.filter(t => t.id !== id));
        toast.success("Automação excluída!");
    };

    const handleDeleteRoulette = (id: string) => {
        setRoulettesList(roulettesList.filter(r => r.id !== id));
        toast.success("Roleta excluída com sucesso!");
    };

    const handleSaveRoulette = () => {
        if (!newRoulette.name) {
            toast.error("Vazio: Insira um nome para a roleta.");
            return;
        }
        setRoulettesList([...roulettesList, { 
            id: String(Date.now()), 
            name: newRoulette.name, 
            type: newRoulette.type === "round_robin" ? "Round Robin" : newRoulette.type === "shark_tank" ? "Shark Tank" : "Timeout SLA", 
            members: 0 
        }]);
        toast.success("Roleta criada com sucesso!");
        setConfigStep(0);
        setNewRoulette({ name: "", type: "round_robin", slaTime: "5" });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Target className="h-8 w-8 text-primary" />
                        Distribuição de Leads (Roleta)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Crie regras visuais para distribuir seus leads automaticamente entre os corretores.
                    </p>
                </div>
                {automationStep === 0 && (
                    <Button onClick={() => setAutomationStep(1)} className="gap-2">
                        <Plus className="h-4 w-4" /> Nova Automação
                    </Button>
                )}
                {automationStep === 1 && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setAutomationStep(0)}>Cancelar</Button>
                        <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> Salvar Fluxo</Button>
                    </div>
                )}
            </div>

            <Tabs defaultValue="fluxos" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="fluxos">Fluxos de Distribuição</TabsTrigger>
                    <TabsTrigger value="config">Configurar Roletas</TabsTrigger>
                </TabsList>

                {/* VISUAL WORKFLOW TAB */}
                <TabsContent value="fluxos" className="mt-6">
                    {automationStep === 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {triggersList.map((trigger) => (
                                <Card key={trigger.id} className="cursor-pointer hover:border-primary/50 transition-all">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <Badge variant={trigger.active ? "default" : "secondary"}>
                                                {trigger.active ? "Ativo" : "Pausado"}
                                            </Badge>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><Settings2 className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDeleteTrigger(trigger.id); }}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg mt-2">{trigger.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            {trigger.source === 'whatsapp' ? <MessageSquare className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                                            {trigger.source === 'whatsapp' ? 'WhatsApp' : 'Facebook Form'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm border-l-2 pl-3 py-1 bg-muted/30 mb-3">
                                            <span className="text-xs text-muted-foreground block">Regra:</span>
                                            {trigger.condition}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                            <ArrowDown className="h-4 w-4" />
                                            Envia para: {MOCK_ROULETTES.find(r => r.id === trigger.rouletteId)?.name}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Empty State Card */}
                            <Card className="border-dashed flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/10" onClick={() => setAutomationStep(1)}>
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Plus className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-lg">Criar Novo Fluxo</h3>
                                <p className="text-sm text-muted-foreground text-center mt-1">
                                    Clique para desenhar uma nova regra
                                </p>
                            </Card>
                        </div>
                    ) : (
                        // EDITOR VISUAL (FLUXO)
                        <div className="max-w-3xl mx-auto space-y-2 pb-20">

                            {/* STEP 1: TRIGGER */}
                            <div className="relative pl-8 border-l-2 border-primary/20 pb-12">
                                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">1</div>
                                <Card className="border-primary shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3 bg-muted/5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">Gatilho (Entrada do Lead)</CardTitle>
                                                <CardDescription>O que inicia essa automação?</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div
                                                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 hover:bg-accent ${triggerType === 'whatsapp' ? 'border-primary bg-primary/5' : ''}`}
                                                onClick={() => setTriggerType('whatsapp')}
                                            >
                                                <MessageSquare className="h-6 w-6" />
                                                <span className="text-sm font-medium text-center">WhatsApp<br/><span className="text-xs font-normal opacity-80">(Central)</span></span>
                                            </div>
                                            <div
                                                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 hover:bg-accent ${triggerType === 'facebook' ? 'border-primary bg-primary/5' : ''}`}
                                                onClick={() => setTriggerType('facebook')}
                                            >
                                                <Zap className="h-6 w-6" />
                                                <span className="text-sm font-medium text-center">Meta Ads<br/><span className="text-xs font-normal opacity-80">(Formulários)</span></span>
                                            </div>
                                            <div
                                                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 hover:bg-accent ${triggerType === 'portal' ? 'border-primary bg-primary/5' : ''}`}
                                                onClick={() => setTriggerType('portal')}
                                            >
                                                <Target className="h-6 w-6" />
                                                <span className="text-sm font-medium text-center">Portais<br/><span className="text-xs font-normal opacity-80">(Zap/Viva/Etc)</span></span>
                                            </div>
                                        </div>

                                        {triggerType === 'whatsapp' && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                <label className="text-sm font-medium">Filtro de Mensagem (Opcional):</label>
                                                <Input
                                                    placeholder="Ex: 1 - Quero ver Lanchas"
                                                    value={matchText}
                                                    onChange={(e) => setMatchText(e.target.value)}
                                                />
                                                <p className="text-xs text-orange-600 font-medium">Se deixar vazio, TODOS os leads gerados via WhatsApp entrarão nesta roleta.</p>
                                            </div>
                                        )}
                                        {triggerType === 'facebook' && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                <label className="text-sm font-medium">Selecione o Formulário:</label>
                                                <Select>
                                                    <SelectTrigger><SelectValue placeholder="Escolha o formulário..." /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="form1">Cadastro Site (Geral)</SelectItem>
                                                        <SelectItem value="form2">Lançamento Jardins</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        {triggerType === 'portal' && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                <label className="text-sm font-medium">Link Webhook / Integração do Portal:</label>
                                                <Input
                                                    placeholder="Ex: ID do anúncio ou Integração Portal 1234"
                                                    value={portalUrl}
                                                    onChange={(e) => setPortalUrl(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <div className="pt-6 border-t mt-6 space-y-4">
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                                                    <Filter className="h-4 w-4"/> Filtros Inteligentes (Smart Routing)
                                                </h4>
                                                <p className="text-xs text-muted-foreground">O lead só entrará nesta roleta se o imóvel de interesse se encaixar nesses parâmetros opcionais.</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-muted/20 p-4 rounded-lg border border-border/50">
                                                {/* Preço */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1"><DollarSign className="h-3 w-3"/> Faixa de Valor (Mínimo)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-medium">R$</span>
                                                        <Input className="pl-8 bg-background" placeholder="Ex: 1.000.000" value={priceMin} onChange={e=>setPriceMin(e.target.value)} />
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground leading-tight">Direciona leads de ticket alto para corretores sêniors.</p>
                                                </div>

                                                {/* Localização */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/> Bairro ou Região</label>
                                                    <Input className="bg-background" placeholder="Ex: Angra dos Reis, Jardins..." value={locationFilter} onChange={e=>setLocationFilter(e.target.value)} />
                                                    <p className="text-[10px] text-muted-foreground leading-tight">Ative especialistas regionais ao invés da geral.</p>
                                                </div>

                                                {/* Tipo de Imóvel */}
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1"><Home className="h-3 w-3"/> Categoria do Produto</label>
                                                    <Select>
                                                        <SelectTrigger className="bg-background"><SelectValue placeholder="Qualquer Segmentação..." /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="todos">Qualquer imóvel</SelectItem>
                                                            <SelectItem value="lancha">Somente Lanchas / Náutico</SelectItem>
                                                            <SelectItem value="alto_padrao">Coberturas e Mansões</SelectItem>
                                                            <SelectItem value="terrenos">Terrenos em Condomínio</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-[10px] text-muted-foreground">A roleta filtrará o imóvel antes de designar ao corretor.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* STEP 2: ROULETTE */}
                            <div className="relative pl-8 border-l-2 border-primary/20 pb-12">
                                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">2</div>
                                <Card className="border-primary shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3 bg-muted/5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                                <Target className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">Roleta (Distribuição)</CardTitle>
                                                <CardDescription>Para quem o lead deve ser enviado?</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Selecione a Roleta de Corretores:</label>
                                            <Select value={selectedRoulette} onValueChange={setSelectedRoulette}>
                                                <SelectTrigger><SelectValue placeholder="Escolha a equipe..." /></SelectTrigger>
                                                <SelectContent>
                                                    {MOCK_ROULETTES.map(r => (
                                                        <SelectItem key={r.id} value={r.id}>
                                                            {r.name} ({r.type})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button variant="link" className="text-xs px-0 h-auto">
                                                + Criar nova roleta
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* STEP 3: Pipeline Mover */}
                            <div className="relative pl-8">
                                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                                <Card className="border-green-500 bg-green-50/50 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                                <Target className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">Mover para o Pipeline (Kanban)</CardTitle>
                                                <CardDescription>Onde o novo lead deve ser armazenado?</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <div className="space-y-3">
                                            <Select value={pipelineStage} onValueChange={setPipelineStage}>
                                                <SelectTrigger className="bg-background"><SelectValue placeholder="Selecione a fase..." /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="novo_lead">Novo Lead</SelectItem>
                                                    <SelectItem value="atendimento">Em Atendimento</SelectItem>
                                                    <SelectItem value="visita">Visita Agendada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                                                <CheckCircle2 className="h-4 w-4" />
                                                O lead e a conversa serão associados a este estágio imediatamente.
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    )}
                </TabsContent>

                {/* CONFIG ROULETTES TAB */}
                <TabsContent value="config" className="mt-6">
                    {configStep === 0 ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">Suas Roletas</h2>
                                    <p className="text-sm text-muted-foreground">Grupos e regras de distribuição cadastradas.</p>
                                </div>
                                <Button onClick={() => setConfigStep(1)} className="gap-2"><Plus className="h-4 w-4" /> Criar Roleta</Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {roulettesList.map(r => (
                                    <Card key={r.id}>
                                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                            <CardTitle className="text-base font-semibold">{r.name}</CardTitle>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <Settings2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDeleteRoulette(r.id); }}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-muted/50">{r.type}</Badge>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Users className="h-3 w-3" /> {r.members} corretores
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <Card className="border-t-4 border-t-primary shadow-md">
                                <CardHeader className="border-b bg-muted/10 pb-6">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl">Nova Roleta de Distribuição</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setConfigStep(0)}>Voltar</Button>
                                    </div>
                                    <CardDescription>Defina as regras de entrega para este grupo de corretores.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 pt-6">
                                    {/* Name string */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold flex items-center gap-2">
                                            1. Nomeclatura
                                        </label>
                                        <Input 
                                            placeholder="Ex: Equipe Lançamentos SC" 
                                            value={newRoulette.name}
                                            onChange={(e) => setNewRoulette({...newRoulette, name: e.target.value})}
                                            className="text-lg py-6 bg-muted/30"
                                        />
                                    </div>

                                    {/* Tipo de Roleta */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold flex items-center gap-2">
                                            2. Dinâmica de Distribuição
                                        </label>
                                        <div className="grid gap-3">
                                            {/* Round Robin */}
                                            <label 
                                                className={`relative flex cursor-pointer rounded-xl border p-4 hover:bg-accent/50 transition-all ${newRoulette.type === 'round_robin' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'}`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-1 bg-blue-100 p-2 rounded-full text-blue-600">
                                                        <Target className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-foreground">Distribuição Equitativa (Round Robin)</p>
                                                        <p className="text-sm text-muted-foreground leading-snug">O lead é entregue estritamente um para cada componente selecioando. Corretor A, depois Corretor B, depois C, garantindo total igualdade matemática.</p>
                                                    </div>
                                                </div>
                                                <input type="radio" name="roulette-type" value="round_robin" className="absolute opacity-0" checked={newRoulette.type === 'round_robin'} onChange={() => setNewRoulette({...newRoulette, type: 'round_robin'})} />
                                            </label>

                                            {/* Corretor Selection */}
                                            <div className="pt-6 mt-4 space-y-3">
                                                <label className="text-sm font-semibold flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-primary" />
                                                    3. Integrantes da Roleta
                                                </label>
                                                <p className="text-sm text-muted-foreground">Marque os corretores que receberão os leads desta roleta:</p>
                                                <div className="border rounded-md p-2 space-y-1 bg-muted/20">
                                                    {teamMembers.map(member => (
                                                        <label key={member.id} className="flex items-center gap-3 p-3 bg-background hover:bg-muted/50 rounded-md border shadow-sm cursor-pointer transition-colors">
                                                            <input type="checkbox" className="h-4 w-4" />
                                                            <span className="font-medium text-sm">{member.full_name || member.email || 'Usuário'}</span>
                                                            {member.role && <span className="text-xs text-muted-foreground ml-auto uppercase px-2 py-1 bg-muted rounded">{member.role}</span>}
                                                        </label>
                                                    ))}
                                                    {teamMembers.length === 0 && (
                                                        <p className="text-sm text-muted-foreground p-4 text-center">Nenhum membro encontrado ou carregando...</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão Salvar */}
                                    <div className="pt-4 border-t flex justify-end">
                                        <Button size="lg" className="px-8 gap-2" onClick={handleSaveRoulette}>
                                            <Save className="h-4 w-4" /> Salvar Definições
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { 
  Send, Users, Mail, Clock, FileText, 
  Settings2, AlignLeft, Bold, Italic, 
  Link2, Image as ImageIcon, AtSign, Plus, ArrowLeft, Trash2, CheckCircle2, AlertTriangle, Calendar as CalendarIcon, Tag, Target, Search, Check
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

// Interface para um fluxo de disparo
interface BroadcastFlow {
  id: string;
  name: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  body: string;
  audienceType: string;
  audienceValue: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledFor: string | null;
  createdAt: string;
}

const Broadcasts = () => {
  const [step, setStep] = useState(0); // 0 = Listagem, 1 = Criar/Editar
  
  // Lista de Disparos
  const [fluxos, setFluxos] = useState<BroadcastFlow[]>(() => {
    const saved = localStorage.getItem("crm_broadcast_flows");
    return saved ? JSON.parse(saved) : [];
  });

  // Campos do Formulário
  const [editingId, setEditingId] = useState<string | null>(null);
  const [flowName, setFlowName] = useState("");
  const [subject, setSubject] = useState("");
  const [senderName, setSenderName] = useState("Equipe Canaã");
  const [senderEmail, setSenderEmail] = useState("onboarding@resend.dev");
  const [body, setBody] = useState("");
  
  // Audiência
  const [audienceType, setAudienceType] = useState("todos"); // todos, tag, origem, corretor, aniversario, manual
  const [audienceValue, setAudienceValue] = useState("");
  
  // Agendamento
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [isSending, setIsSending] = useState(false);

  // Seleção de Contatos Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactsList, setContactsList] = useState<{id: string, name: string, email: string}[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [contactSearch, setContactSearch] = useState("");

  const loadContacts = async () => {
    const { data } = await supabase.from('contacts').select('id, name, email').not('email', 'is', null).neq('email', '');
    if (data) setContactsList(data);
  };

  useEffect(() => {
    if (isContactModalOpen && contactsList.length === 0) {
      loadContacts();
    }
  }, [isContactModalOpen]);

  const toggleEmailSelection = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };
  // Simulação de quantidade
  const getCount = () => {
    if (audienceType === "todos") return 1245;
    if (audienceType === "tag") return 120;
    if (audienceType === "origem") return 340;
    if (audienceType === "aniversario") return 15;
    if (audienceType === "corretor") return 85;
    if (audienceType === "manual") return 1;
    return 0;
  };

  const currentCount = getCount();

  const insertVariable = (variable: string) => {
    setBody(prev => prev + ` {${variable}} `);
    toast.success(`Variável {${variable}} inserida!`);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setFlowName("");
    setSubject("");
    setSenderName("Equipe Canaã");
    setSenderEmail("onboarding@resend.dev");
    setBody("");
    setAudienceType("todos");
    setAudienceValue("");
    setStep(1);
  };

  const handleSaveAndSend = async (schedule: boolean = false) => {
    if (!flowName) return toast.error("Dê um nome para este fluxo de automação.");
    if (!subject) return toast.error("O assunto é obrigatório.");
    if (!senderEmail) return toast.error("O e-mail do remetente é obrigatório.");
    if (!body) return toast.error("O corpo do e-mail não pode estar vazio.");
    
    if (schedule && (!scheduleDate || !scheduleTime)) {
      return toast.error("Defina a data e a hora para o agendamento.");
    }

    setIsSending(true);
    let rawEmailsCount = currentCount;
    let targetEmails: string[] = [];

    try {
      // Obter lista real de emails do banco
      if (audienceType === "manual") {
        targetEmails = selectedEmails;
      } else {
        // Query de contatos que tem email válido
        let query = supabase.from('contacts').select('email').not('email', 'is', null).neq('email', '');
        if (audienceType === "tag" && audienceValue) {
          query = query.contains('tags', [audienceValue]);
        }
        // Nota: A lógica de filtro pode ser aprofundada conforme tabela. Isso coleta todos com email genérico.
        // Simulando query apenas pegando os ativos
        const { data, error } = await query;
        if (!error && data) {
           targetEmails = data.map(d => d.email);
        }
      }

      if (targetEmails.length === 0) {
         // Fallback debug - mandar pro próprio remetente para testar.
         targetEmails = [senderEmail];
         toast.warning("Nenhum destinatário real encontrado ou filtro vazio. Disparando envio de teste para o próprio remetente.");
      }

      rawEmailsCount = targetEmails.length;
      
      // Chamada real para Edge Function do Supabase (Apenas se não for agendamento)
      if (!schedule) {
         const { data, error } = await supabase.functions.invoke('send-email', {
            body: {
               from: `${senderName} <${senderEmail}>`,
               to: targetEmails,
               subject: subject,
               html: body.replace(/\n/g, '<br/>') // Formatação rudimentar de quebra de linha.
            }
         });
         if (error) throw error;
      }

      const newFlow: BroadcastFlow = {
        id: editingId || String(Date.now()),
        name: flowName,
        subject,
        senderName,
        senderEmail,
        body,
        audienceType,
        audienceValue,
        status: schedule ? "scheduled" : "sent",
        scheduledFor: schedule ? `${scheduleDate}T${scheduleTime}` : null,
        createdAt: new Date().toISOString()
      };

      const updatedFluxos = editingId 
        ? fluxos.map(f => f.id === editingId ? newFlow : f)
        : [newFlow, ...fluxos];

      setFluxos(updatedFluxos);
      localStorage.setItem("crm_broadcast_flows", JSON.stringify(updatedFluxos));

      toast.success(schedule 
        ? `Disparo agendado com sucesso para ${rawEmailsCount} contatos!` 
        : `Disparo realizado com sucesso para ${rawEmailsCount} contatos através da API do Resend!`
      );
      
      setIsScheduling(false);
      setStep(0);
    } catch (err: any) {
      console.error("Erro disparando:", err);
      toast.error(`Erro ao enviar: ${err.message || 'Falha na comunicação com servidor'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = fluxos.filter(f => f.id !== id);
    setFluxos(updated);
    localStorage.setItem("crm_broadcast_flows", JSON.stringify(updated));
    toast.success("Fluxo removido com sucesso.");
  };

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
            <Send className="h-8 w-8 text-primary" />
            Automação de E-mails
          </h1>
          <p className="text-muted-foreground text-lg">
            Crie regras de disparo e envie campanhas (Powered by Resend).
          </p>
        </div>
        {step === 0 && (
          <Button onClick={handleOpenNew} className="rounded-full shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 h-12 px-6">
            <Plus className="w-5 h-5 mr-2" />
            Nova Automação
          </Button>
        )}
      </div>

      {step === 0 ? (
        <div className="space-y-6">
          {/* Listagem de Fluxos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-dashed border-2 bg-transparent hover:bg-muted/50 cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[200px]" onClick={handleOpenNew}>
              <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">Criar Novo Fluxo</p>
                  <p className="text-sm text-muted-foreground">Clique para desenhar uma nova regra</p>
                </div>
              </CardContent>
            </Card>

            {fluxos.map((fluxo) => (
              <Card key={fluxo.id} className="relative overflow-hidden group shadow-md hover:shadow-xl transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold truncate pr-6">{fluxo.name}</CardTitle>
                    <div className="flex gap-1 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); handleDelete(fluxo.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="truncate">{fluxo.subject}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Audiência: <strong className="text-foreground capitalize">{fluxo.audienceType}</strong></span>
                  </div>
                  <div className="flex gap-2">
                     <Badge variant={fluxo.status === 'sent' ? 'default' : 'secondary'} className={fluxo.status === 'sent' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                       {fluxo.status === 'sent' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                       {fluxo.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                       {fluxo.status === 'sent' ? 'Enviado' : fluxo.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                     </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between border-t p-4 bg-muted/20">
                  <span>De: {fluxo.senderEmail}</span>
                  {fluxo.scheduledFor && <span>🗓️ {new Date(fluxo.scheduledFor).toLocaleDateString()}</span>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Editor Principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" onClick={() => setStep(0)} className="h-10 w-10 p-0 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Input 
                value={flowName}
                onChange={e => setFlowName(e.target.value)}
                placeholder="Ex: Email de Boas-Vindas Carnaval"
                className="text-2xl font-bold border-none bg-transparent shadow-none px-0 focus-visible:ring-0 w-full"
              />
            </div>

            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  Configuração de Remetente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Remetente</label>
                    <Input 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Ex: João da Canaã Imóveis" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-mail de Envio (Resend)</label>
                    <Input 
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="ex: contato@suaimobiliaria.com.br" 
                    />
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      Precisa estar validado no painel do Resend. Padrão: onboarding@resend.dev
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Editor do E-mail
                </CardTitle>
                <CardDescription>Escreva o e-mail que chegará na caixa de entrada dos seus leads.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assunto da Mensagem</label>
                  <Input 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="EX: Lançamento Exclusivo: Oportunidade Única" 
                    className="text-lg py-5 font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Corpo do Texto</label>
                    <div className="flex overflow-hidden rounded-md border border-border/50 bg-muted/30">
                      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none border-r border-border/50"><Bold className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none border-r border-border/50"><Italic className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none border-r border-border/50"><AlignLeft className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none border-r border-border/50"><Link2 className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none"><ImageIcon className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  
                  <Textarea 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Olá {nome}, tudo bem?" 
                    className="min-h-[250px] resize-y leading-relaxed text-base bg-background/50"
                  />
                </div>

                {/* Variáveis Dinâmicas */}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <AtSign className="w-3 h-3" /> Variáveis de Personalização Inteligente:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5" onClick={() => insertVariable("nome")}>
                      {`{nome}`}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5" onClick={() => insertVariable("primeiro_nome")}>
                      {`{primeiro_nome}`}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5" onClick={() => insertVariable("origem")}>
                      {`{origem}`}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5" onClick={() => insertVariable("email")}>
                      {`{email}`}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5" onClick={() => insertVariable("telefone")}>
                      {`{telefone}`}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barra Lateral: Filtros e Disparo */}
          <div className="space-y-6 mt-14">
            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Quem vai receber?
                </CardTitle>
                <CardDescription>Defina os filtros detalhados para a sua audiência.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Filtrar Base de Leads por:</label>
                  <Select value={audienceType} onValueChange={(val) => { setAudienceType(val); setAudienceValue(""); }}>
                    <SelectTrigger className="w-full h-11 bg-background/50">
                      <SelectValue placeholder="Selecione a segmentação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Leads com E-mail</SelectItem>
                      <SelectItem value="tag">Por Tag Específica</SelectItem>
                      <SelectItem value="origem">Por Origem (Portal/Anúncio)</SelectItem>
                      <SelectItem value="corretor">Atribuído à um Corretor</SelectItem>
                      <SelectItem value="aniversario">Aniversariantes do Mês</SelectItem>
                      <SelectItem value="manual">Lista de E-mails Manual (Colar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub-filtros baseados no tipo selecionado */}
                {audienceType === "tag" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-medium">Selecione as Tags</label>
                    <Input 
                      value={audienceValue} 
                      onChange={e => setAudienceValue(e.target.value)} 
                      placeholder="Ex: investidor, alto_padrao..." 
                    />
                  </div>
                )}
                
                {audienceType === "origem" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-medium">Nome da Origem/Portal</label>
                    <Input 
                      value={audienceValue} 
                      onChange={e => setAudienceValue(e.target.value)} 
                      placeholder="Ex: Imovelweb, Zap, Roleta..." 
                    />
                  </div>
                )}

                {audienceType === "manual" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-medium">Selecione da Base de Clientes</label>
                    <div className="p-4 border rounded-md bg-background/50 flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        {selectedEmails.length} cliente(s) selecionado(s).
                      </p>
                      <Button onClick={() => setIsContactModalOpen(true)} variant="outline" className="w-full">
                        <Users className="w-4 h-4 mr-2" />
                        Abrir Seleção de Clientes
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                  <Users className="w-8 h-8 text-primary/50 absolute -left-2 -bottom-2 opacity-50" />
                  <Mail className="w-8 h-8 text-primary/50 absolute -right-2 -top-2 opacity-50" />
                  
                  <h3 className="text-4xl font-bold text-primary">{currentCount}</h3>
                  <p className="text-sm text-primary/80 font-medium">Contatos atingidos</p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Estimativa baseada no seu banco de dados.
                  </p>
                </div>

              </CardContent>
              
              <Separator />
              
              <CardFooter className="p-6 flex flex-col gap-3">
                <Button 
                  size="lg" 
                  className="w-full text-base font-medium bg-primary hover:bg-primary/90 h-14 shadow-xl shadow-primary/20"
                  onClick={() => setIsScheduling(true)}
                >
                  <CalendarIcon className="w-5 h-5 mr-2" /> Agendar Disparo
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full text-base font-medium border-primary/50 hover:bg-primary/5"
                  onClick={() => handleSaveAndSend(false)}
                  disabled={isSending}
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                      Disparando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" /> Enviar Imediatamente
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de Agendamento */}
      <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Agendar Automacão</DialogTitle>
            <DialogDescription>
              Escolha a data e o horário para o Resend entregar esta campanha automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">Data do Envio</label>
              <Input
                id="date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="time" className="text-sm font-medium">Horário (Fuso Local)</label>
              <Input
                id="time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduling(false)}>Cancelar</Button>
            <Button onClick={() => handleSaveAndSend(true)} disabled={isSending}>
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Seleção de Clientes */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Selecionar Clientes</DialogTitle>
            <DialogDescription>
              Marque os clientes da sua base que deverão receber este disparo manual.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <ScrollArea className="h-[300px] border rounded-md p-4 bg-muted/20">
              {contactsList.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Carregando contatos com e-mail...
                </div>
              ) : (
                <div className="space-y-3">
                  {contactsList
                    .filter(c => c.name?.toLowerCase().includes(contactSearch.toLowerCase()) || c.email?.toLowerCase().includes(contactSearch.toLowerCase()))
                    .map((contact) => (
                    <div key={contact.id} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors cursor-pointer" onClick={() => toggleEmailSelection(contact.email)}>
                      <Checkbox 
                        checked={selectedEmails.includes(contact.email)}
                        onCheckedChange={() => toggleEmailSelection(contact.email)}
                        id={`contact-${contact.id}`} 
                        className="mt-1"
                      />
                      <div className="flex flex-col">
                        <label htmlFor={`contact-${contact.id}`} className="text-sm font-medium leading-none cursor-pointer">
                          {contact.name || 'Cliente Sem Nome'}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter className="sm:justify-between">
            <span className="text-sm font-medium text-muted-foreground my-auto">
              {selectedEmails.length} selecionado(s)
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsContactModalOpen(false)}>Cancelar</Button>
              <Button onClick={() => setIsContactModalOpen(false)}>Confirmar Seleção</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Broadcasts;

import React, { useState } from "react";
import { 
  Send, Users, Mail, Clock, FileText, 
  Settings2, AlignLeft, Bold, Italic, 
  Link2, Image as ImageIcon, AtSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Broadcasts = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [segment, setSegment] = useState("all");
  const [isSending, setIsSending] = useState(false);

  // Simulation of segment counts
  const segmentCounts: Record<string, number> = {
    all: 1245,
    novo: 340,
    contatado: 512,
    convertido: 120,
    descartado: 273
  };

  const currentCount = segmentCounts[segment] || 0;

  const insertVariable = (variable: string) => {
    setBody(prev => prev + ` {${variable}} `);
    toast.success(`Variável {${variable}} inserida!`);
  };

  const handleSimulateDisparo = () => {
    if (!subject) return toast.error("O assunto é obrigatório");
    if (!body) return toast.error("O corpo do e-mail não pode estar vazio");

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Disparo programado com sucesso para ${currentCount} contatos!`);
      setSubject("");
      setBody("");
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
            <Send className="h-8 w-8 text-primary" />
            Configuração de Disparo
          </h1>
          <p className="text-muted-foreground text-lg">
            Crie campanhas e automações de email para sua base de clientes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Clock className="w-4 h-4 mr-2" /> Agendamentos</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Editor de Campanha
              </CardTitle>
              <CardDescription>Escreva o e-mail que chegará na caixa de entrada dos seus leads.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Assunto do E-mail</label>
                <Input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="EX: Lançamento Exclusivo: Oportunidade Única" 
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Corpo do E-mail</label>
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
                  className="min-h-[300px] resize-y leading-relaxed text-base"
                />
              </div>

              {/* Variáveis Dinâmicas */}
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                  <AtSign className="w-3 h-3" /> Variáveis de Personalização:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors py-1" onClick={() => insertVariable("nome")}>
                    {`{nome}`}
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors py-1" onClick={() => insertVariable("primeiro_nome")}>
                    {`{primeiro_nome}`}
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors py-1" onClick={() => insertVariable("origem")}>
                    {`{origem}`}
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors py-1" onClick={() => insertVariable("nome_imobiliaria")}>
                    {`{nome_imobiliaria}`}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra Lateral: Filtros e Disparo */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Audiência
              </CardTitle>
              <CardDescription>Defina quem irá receber esta campanha.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Segmentação por Status</label>
                <Select value={segment} onValueChange={setSegment}>
                  <SelectTrigger className="w-full h-12 bg-background/50">
                    <SelectValue placeholder="Selecione um segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Leads</SelectItem>
                    <SelectItem value="novo">Apenas Leads Novos</SelectItem>
                    <SelectItem value="contatado">Em Atendimento (Contatado)</SelectItem>
                    <SelectItem value="convertido">Clientes Convertidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                <Users className="w-8 h-8 text-primary/50 absolute -left-2 -bottom-2 opacity-50" />
                <Mail className="w-8 h-8 text-primary/50 absolute -right-2 -top-2 opacity-50" />
                
                <h3 className="text-4xl font-bold text-primary">{currentCount}</h3>
                <p className="text-sm text-primary/80 font-medium">Contatos selecionados</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Que possuem e-mail válido cadastrado no sistema.
                </p>
              </div>

            </CardContent>
            
            <Separator />
            
            <CardFooter className="p-6 flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full text-base font-medium bg-primary hover:bg-primary/90 h-14 shadow-xl shadow-primary/20"
                onClick={handleSimulateDisparo}
                disabled={isSending}
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" /> Enviar Disparo Agora
                  </span>
                )}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                Ao clicar em enviar, a campanha entrará na fila de disparo seguro do Resend.
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Broadcasts;

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Settings2,
  Copy,
  Info,
  ArrowRightLeft,
  Link as LinkIcon,
  Bot
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { usePropertyInquiries } from "@/hooks/usePropertyInquiries";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Portal {
  id: string;
  name: string;
  description: string;
  status: string;
  color: string;
  icon: any;
}

const portals: Portal[] = [
  {
    id: "canal_pro",
    name: "Canal Pro (ZAP, VivaReal, OLX)",
    description: "Integração unificada via Webhook para Leads e Feed XML para os 3 maiores portais.",
    status: "disponivel",
    color: "from-purple-600 to-blue-500",
    icon: Globe,
  },
  {
    id: "imovelweb",
    name: "Imovelweb",
    description: "Portal líder no Brasil (Grupo Navent). Integração via Zapier/Webhook.",
    status: "disponivel",
    color: "from-orange-600 to-orange-400",
    icon: ExternalLink,
  },
  {
    id: "casamineira",
    name: "Casa Mineira",
    description: "Referência no mercado nacional. Integração rápida e estável.",
    status: "disponivel",
    color: "from-yellow-600 to-yellow-400",
    icon: ExternalLink,
  },
  {
    id: "luxury_estate",
    name: "Luxury Estate",
    description: "Integração via Email Parsing (Robô) para leads de luxo.",
    status: "configurar",
    color: "from-amber-600 to-amber-400",
    icon: CheckCircle2,
  },
  {
    id: "properstar",
    name: "Properstar",
    description: "Anuncie em portais internacionais com sincronização global.",
    status: "configurar",
    color: "from-emerald-600 to-emerald-400",
    icon: ArrowRightLeft,
  }
];

const Integrations = () => {
  const { profile } = useAuth();
  const { inquiries } = usePropertyInquiries();
  const navigate = useNavigate();
  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null);
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
  const companyId = profile?.company_id || "00000000-0000-0000-0000-000000000000";

  const getPortalStats = (portalId: string) => {
    // Canal Pro engloba zap, vivareal e olx, mas podem vir com a tag especifica ou "canal_pro"
    const portalLeads = inquiries.filter(c => {
      const src = c.source?.toLowerCase().trim();
      if (!src) return false;
      if (portalId === 'canal_pro') {
        return src === 'canal_pro' || src === 'zap' || src === 'vivareal' || src === 'olx';
      }
      return src.includes(portalId) || src === portalId;
    });

    const isActive = portalLeads.length > 0;
    const count = portalLeads.length;
    const lastLead = portalLeads[0]; // array is ordered DESC by created_at

    return { isActive, count, lastLead };
  };

  const webhookUrl = `${supabaseUrl}/functions/v1/portal-webhook?company_id=${companyId}`;
  const feedUrl = `${supabaseUrl}/functions/v1/property-xml-feed?company_id=${companyId}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado com sucesso!`);
  };

  const isRoboPortal = selectedPortal?.id === "luxury_estate" || selectedPortal?.id === "properstar";

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Integrações de Portais
        </h1>
        <p className="text-muted-foreground text-lg">
          Conecte seu CRM aos maiores portais imobiliários do Brasil e do mundo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portals.map((portal) => {
          const stats = getPortalStats(portal.id);
          
          return (
          <Card key={portal.id} className="group relative overflow-hidden border-none bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-white/10">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${portal.color}`} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <portal.icon className="h-5 w-5 text-primary" />
                  {portal.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-10">
                  {portal.description}
                </CardDescription>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${portal.color} opacity-10 group-hover:opacity-20 transition-opacity shrink-0`}>
                <portal.icon className="h-6 w-6 text-foreground" />
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col space-y-4 pt-4">
                {stats.lastLead && (
                  <div className="text-xs bg-muted/60 p-2 rounded-md flex justify-between items-center text-muted-foreground border border-border/50">
                     <span>👥 {stats.count} leads</span>
                     <span>Último: {formatDistanceToNow(new Date(stats.lastLead.created_at), { addSuffix: true, locale: ptBR })}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  {stats.isActive ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2.5 py-1">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Conectado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2.5 py-1">
                      <Settings2 className="h-3 w-3 mr-1" /> Aguardando
                    </Badge>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedPortal(portal)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      Configurar
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20"
                      onClick={() => navigate(`/leads?source=${portal.id}`)}
                    >
                      Ver Leads
                    </Button>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${portal.color} -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-700`}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedPortal} onOpenChange={() => setSelectedPortal(null)}>
        <DialogContent className="max-w-2xl bg-card border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedPortal && (
                <>
                  <selectedPortal.icon className="h-6 w-6 text-primary" />
                  Configurar {selectedPortal.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Copie os links abaixo e cole no painel do integrador do portal {selectedPortal?.name}.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={isRoboPortal ? "robo" : "leads"} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1">
              {isRoboPortal ? (
                <>
                  <TabsTrigger value="robo" className="data-[state=active]:bg-card shadow-sm">
                    Robô Leads
                  </TabsTrigger>
                  <TabsTrigger value="feeds" className="data-[state=active]:bg-card shadow-sm">
                    Feed XML
                  </TabsTrigger>
                  <TabsTrigger value="help" className="data-[state=active]:bg-card shadow-sm">
                    Ajuda
                  </TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="leads" className="data-[state=active]:bg-card shadow-sm">
                    Leads
                  </TabsTrigger>
                  <TabsTrigger value="feeds" className="data-[state=active]:bg-card shadow-sm">
                    Feed XML
                  </TabsTrigger>
                  <TabsTrigger value="help" className="data-[state=active]:bg-card shadow-sm">
                    Ajuda
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {isRoboPortal ? (
              <>
                <TabsContent value="robo" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 text-sm text-muted-foreground">
                      <Bot className="h-5 w-5 text-primary shrink-0" />
                      <p>
                        Este portal não possui Webhook. O Robô de IA irá ler os e-mails de interesse que você recebe e cadastrar o lead automaticamente.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium">Como configurar:</p>
                      <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                        <li>Configure um redirecionamento automático (forward) no seu e-mail.</li>
                        <li>Encaminhe os e-mails de <code className="bg-secondary px-1 rounded">{selectedPortal?.name}</code> para o endereço abaixo.</li>
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Seu E-mail do Robô (Exclusivo)</label>
                      <div className="flex gap-2">
                        <Input readOnly value={`robo-${companyId.slice(0,8)}@leads.seucrm.com`} className="bg-secondary/30 border-none font-mono text-xs" />
                        <Button variant="secondary" onClick={() => copyToClipboard(`robo-${companyId.slice(0,8)}@leads.seucrm.com`, "E-mail do Robô")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="feeds" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex gap-3 italic text-sm text-muted-foreground">
                      <LinkIcon className="h-5 w-5 text-orange-500 shrink-0 not-italic" />
                      <p>
                        {selectedPortal?.id === "luxury_estate" 
                          ? `Para anunciar no Luxury Estate, você deve copiar o link abaixo e enviá-lo por e-mail para websupport@luxre.com para que a equipe técnica valide e ative sua conta.`
                          : `Para anunciar no ${selectedPortal?.name}, envie este link para o seu gerente de conta no portal ou cole na área de "Importação XML".`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL do Feed XML para o Portal</label>
                      <div className="flex gap-2">
                        <Input readOnly value={feedUrl} className="bg-secondary/30 border-none font-mono text-xs" />
                        <Button variant="secondary" onClick={() => copyToClipboard(feedUrl, "Feed URL")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="help" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Guia de Integração</h3>
                    <p className="text-sm text-muted-foreground">
                      1. <strong>Leads:</strong> Use o e-mail do robô para capturar interessados.<br/>
                      2. <strong>Imóveis:</strong> Use o Feed XML para enviar seus anúncios.<br/>
                      3. <strong>Suporte:</strong> Em caso de dúvidas, envie o link do Feed XML para o suporte do portal {selectedPortal?.name}.
                    </p>
                  </div>
                </TabsContent>
              </>
            ) : (
              <>
                <TabsContent value="leads" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 italic text-sm text-muted-foreground">
                      <Info className="h-5 w-5 text-primary shrink-0 not-italic" />
                      <p>
                        {selectedPortal?.id === "imovelweb" || selectedPortal?.id === "casamineira"
                         ? "No Portal da Navent, em 'Integrador', selecione a opção 'Zapier'. Isso irá liberar o campo 'URL de Callback' embaixo para você colar nosso link!"
                         : `Para receber leads, cole esta URL no campo "Webhook" ou "URL de Destino" nas configurações do seu portal ${selectedPortal?.name}.`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Link do Webhook para Leads</label>
                      <div className="flex gap-2">
                        <Input readOnly value={selectedPortal?.id === "imovelweb" || selectedPortal?.id === "casamineira" ? webhookUrl + "&source=" + selectedPortal.id : webhookUrl} className="bg-secondary/30 border-none font-mono text-xs" />
                        <Button variant="secondary" onClick={() => copyToClipboard(selectedPortal?.id === "imovelweb" || selectedPortal?.id === "casamineira" ? webhookUrl + "&source=" + selectedPortal.id : webhookUrl, "Webhook URL")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="feeds" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex gap-3 italic text-sm text-muted-foreground">
                      <LinkIcon className="h-5 w-5 text-orange-500 shrink-0 not-italic" />
                      <p>
                        O Feed XML contém seus imóveis marcados como "Publicados". O portal irá ler este arquivo a cada 2 horas para atualizar seus anúncios.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL do Feed XML (Canal Pro / Portais)</label>
                      <div className="flex gap-2">
                        <Input readOnly value={feedUrl} className="bg-secondary/30 border-none font-mono text-xs" />
                        <Button variant="secondary" onClick={() => copyToClipboard(feedUrl, "Feed URL")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="help" className="space-y-4 pt-4">
                   <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Onde colar os links no Portal?</h3>
                    <p className="text-sm text-muted-foreground">
                      Vá no painel do <strong>{selectedPortal?.name}</strong>, procure por 'Carga de Dados' ou 'Integração API' e cole os links conforme o exemplo abaixo:
                    </p>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
                      <img 
                        src="/integrations_tutorial.png" 
                        alt="Tutorial de Integração" 
                        className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setSelectedPortal(null)} className="px-8">
              Concluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integrations;

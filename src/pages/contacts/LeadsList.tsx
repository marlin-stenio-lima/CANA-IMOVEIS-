import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stages = [
  { id: "novo", name: "Novo", color: "bg-primary" },
  { id: "contato", name: "Contato", color: "bg-blue-500" },
  { id: "agendamento", name: "Agendamento", color: "bg-yellow-500" },
  { id: "consulta", name: "Consulta", color: "bg-purple-500" },
  { id: "fechado", name: "Fechado", color: "bg-green-500" },
];

const initialLeads = [
  { id: 1, name: "João Silva", phone: "(11) 99999-0001", source: "WhatsApp", stage: "novo", value: 1500 },
  { id: 2, name: "Maria Santos", phone: "(11) 99999-0002", source: "Instagram", stage: "contato", value: 2500 },
  { id: 3, name: "Pedro Oliveira", phone: "(11) 99999-0003", source: "Site", stage: "agendamento", value: 3000 },
  { id: 4, name: "Ana Costa", phone: "(11) 99999-0004", source: "Indicação", stage: "consulta", value: 4500 },
  { id: 5, name: "Carlos Lima", phone: "(11) 99999-0005", source: "WhatsApp", stage: "fechado", value: 2000 },
];

const sourceColors: Record<string, string> = {
  "WhatsApp": "bg-green-100 text-green-700 border-green-200",
  "Instagram": "bg-pink-100 text-pink-700 border-pink-200",
  "Site": "bg-blue-100 text-blue-700 border-blue-200",
  "Indicação": "bg-orange-100 text-orange-700 border-orange-200",
};

export default function LeadsList() {
  const [leads] = useState(initialLeads);

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getLeadsByStage(stageId).reduce((acc, lead) => acc + lead.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = getLeadsByStage(stage.id);
        const stageTotal = getStageTotal(stage.id);
        const conversionRate = leads.length > 0 ? Math.round((stageLeads.length / leads.length) * 100) : 0;
        
        return (
          <div key={stage.id} className="flex-shrink-0 w-[280px] space-y-3">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <span className="font-medium text-sm">{stage.name}</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 min-w-[20px] justify-center">
                  {stageLeads.length}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Stage Metrics */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Estimado</span>
                <span className="font-medium text-foreground">{formatCurrency(stageTotal)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Conversão</span>
                <span className="font-medium text-foreground">{conversionRate}%</span>
              </div>
            </div>
            
            {/* Cards Container */}
            <div className="space-y-2 min-h-[400px]">
              {stageLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] bg-muted/30 rounded-lg text-muted-foreground">
                  <Users className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-xs">Nenhum lead</p>
                </div>
              ) : (
                stageLeads.map((lead) => (
                  <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-all border bg-card">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm text-foreground">{lead.name}</p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 -mt-1 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Mover</DropdownMenuItem>
                            <DropdownMenuItem>Converter para Cliente</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{lead.phone}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 font-normal mb-2 ${sourceColors[lead.source] || ''}`}
                      >
                        {lead.source}
                      </Badge>
                      <div className="text-sm font-semibold text-primary">
                        {formatCurrency(lead.value)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

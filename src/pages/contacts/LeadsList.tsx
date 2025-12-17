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
    <div className="space-y-6">
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);
          
          return (
            <div key={stage.id} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-medium text-sm">{stage.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {stageLeads.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Stage Metrics */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Estimado</span>
                  <span>{formatCurrency(stageTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversão</span>
                  <span>{stageLeads.length > 0 ? Math.round((stageLeads.length / leads.length) * 100) : 0}%</span>
                </div>
              </div>
              
              {/* Cards Container */}
              <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-2">
                {stageLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground">
                    <Users className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs">Nenhum lead</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.phone}</p>
                            <Badge variant="outline" className="text-xs">
                              {lead.source}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-3 w-3" />
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
                        <div className="mt-2 text-sm font-medium text-primary">
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
    </div>
  );
}

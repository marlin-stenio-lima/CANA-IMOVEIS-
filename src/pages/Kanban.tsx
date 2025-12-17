import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stages = [
  { id: "lead", name: "Lead", color: "bg-slate-500" },
  { id: "qualified", name: "Qualificado", color: "bg-blue-500" },
  { id: "proposal", name: "Proposta", color: "bg-yellow-500" },
  { id: "negotiation", name: "Negociação", color: "bg-purple-500" },
  { id: "closed", name: "Fechado", color: "bg-green-500" },
];

const initialDeals = [
  { id: 1, name: "Projeto Alpha", company: "Tech Corp", value: 45000, stage: "proposal" },
  { id: 2, name: "Consultoria Beta", company: "Inovação SA", value: 28000, stage: "negotiation" },
  { id: 3, name: "Sistema Gamma", company: "Digital Ltd", value: 72000, stage: "closed" },
  { id: 4, name: "Plataforma Delta", company: "Startup.io", value: 95000, stage: "lead" },
  { id: 5, name: "App Epsilon", company: "Enterprise Co", value: 38000, stage: "qualified" },
  { id: 6, name: "Portal Zeta", company: "Tech Corp", value: 55000, stage: "proposal" },
];

export default function Deals() {
  const [deals] = useState(initialDeals);

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getDealsByStage(stageId).reduce((acc, deal) => acc + deal.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kanban</h1>
          <p className="text-muted-foreground">Acompanhe seus negócios em cada etapa</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-medium">{stage.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {getDealsByStage(stage.id).length}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(getStageTotal(stage.id))}
            </p>
            
            <div className="space-y-2 min-h-[200px]">
              {getDealsByStage(stage.id).map((deal) => (
                <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{deal.name}</p>
                        <p className="text-xs text-muted-foreground">{deal.company}</p>
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
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-primary">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-sm font-medium">{formatCurrency(deal.value)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

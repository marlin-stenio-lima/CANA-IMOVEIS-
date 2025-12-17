import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone } from "lucide-react";

const stages = [
  { id: "novo", name: "Novo", color: "bg-primary" },
  { id: "contato", name: "Contato", color: "bg-blue-500" },
  { id: "agendamento", name: "Agendamento", color: "bg-yellow-500" },
  { id: "consulta", name: "Consulta", color: "bg-purple-500" },
  { id: "fechado", name: "Fechado", color: "bg-green-500" },
];

const initialItems = [
  { id: 1, name: "Ana Carolina", phone: "(11) 99999-0001", source: "WhatsApp", value: 5500, stage: "novo" },
  { id: 2, name: "Bruno Santos", phone: "(11) 99999-0002", source: "Instagram", value: 3200, stage: "novo" },
  { id: 3, name: "Carla Mendes", phone: "(11) 99999-0003", source: "Site", value: 8000, stage: "contato" },
  { id: 4, name: "Diego Oliveira", phone: "(11) 99999-0004", source: "Indicação", value: 12000, stage: "contato" },
  { id: 5, name: "Elena Ferreira", phone: "(11) 99999-0005", source: "WhatsApp", value: 4500, stage: "agendamento" },
  { id: 6, name: "Felipe Costa", phone: "(11) 99999-0006", source: "Instagram", value: 7800, stage: "consulta" },
  { id: 7, name: "Gabriela Lima", phone: "(11) 99999-0007", source: "Site", value: 15000, stage: "fechado" },
  { id: 8, name: "Henrique Alves", phone: "(11) 99999-0008", source: "Indicação", value: 9500, stage: "fechado" },
];

const sourceColors: Record<string, string> = {
  WhatsApp: "bg-green-100 text-green-700",
  Instagram: "bg-pink-100 text-pink-700",
  Site: "bg-blue-100 text-blue-700",
  Indicação: "bg-orange-100 text-orange-700",
};

export default function Kanban() {
  const [items] = useState(initialItems);

  const getItemsByStage = (stageId: string) => {
    return items.filter(item => item.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getItemsByStage(stageId).reduce((acc, item) => acc + item.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getConversionRate = (stageId: string) => {
    const stageIndex = stages.findIndex(s => s.id === stageId);
    const baseRate = 100 - (stageIndex * 15);
    return Math.max(baseRate, 25);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => (
        <div key={stage.id} className="flex-shrink-0 w-[280px] space-y-3">
          {/* Column Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-medium text-sm">{stage.name}</h3>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {getItemsByStage(stage.id).length}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Estimado {formatCurrency(getStageTotal(stage.id))}</span>
              <span>Conversão {getConversionRate(stage.id)}%</span>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-2 min-h-[400px]">
            {getItemsByStage(stage.id).map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3 space-y-2">
                  <p className="font-medium text-sm">{item.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{item.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${sourceColors[item.source]}`}>
                      {item.source}
                    </Badge>
                    <span className="text-sm font-medium text-primary">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

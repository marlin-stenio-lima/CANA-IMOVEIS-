import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, AlertTriangle } from "lucide-react";
import { DealQuickActions } from "./DealQuickActions";
import type { Tables } from "@/integrations/supabase/types";
import type { DealWithContact } from "@/hooks/useDeals";

type PipelineStage = Tables<"pipeline_stages">;

interface KanbanCardProps {
  deal: DealWithContact;
  stages: PipelineStage[];
  currentStage: PipelineStage;
  onViewDetails: () => void;
  onEdit: () => void;
  onMoveToStage: (stageId: string) => void;
  onMarkAsWon: () => void;
  onMarkAsLost: () => void;
  onDelete: () => void;
}

const sourceColors: Record<string, string> = {
  WhatsApp: "bg-green-100 text-green-700",
  Instagram: "bg-pink-100 text-pink-700",
  Site: "bg-blue-100 text-blue-700",
  Indicação: "bg-orange-100 text-orange-700",
  Facebook: "bg-blue-100 text-blue-700",
  Google: "bg-red-100 text-red-700",
  Telefone: "bg-gray-100 text-gray-700",
};

export function KanbanCard({
  deal,
  stages,
  currentStage,
  onViewDetails,
  onEdit,
  onMoveToStage,
  onMarkAsWon,
  onMarkAsLost,
  onDelete,
}: KanbanCardProps) {
  const contact = deal.contacts;
  const displayName = deal.title || contact?.name || "Sem nome";
  const phone = contact?.phone;
  const source = contact?.source;

  // Check if deal is overdue
  const isOverdue = (() => {
    if (!deal.stage_entered_at || !currentStage.target_days) return false;
    const enteredAt = new Date(deal.stage_entered_at);
    const now = new Date();
    const daysInStage = Math.floor((now.getTime() - enteredAt.getTime()) / (1000 * 60 * 60 * 24));
    return daysInStage > currentStage.target_days;
  })();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCall = () => {
    if (phone) {
      window.open(`tel:${phone}`, "_blank");
    }
  };

  const handleMessage = () => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/55${cleanPhone}`, "_blank");
    }
  };

  return (
    <Card className={`cursor-pointer hover:shadow-md transition-shadow ${isOverdue ? "border-destructive/50" : ""}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{displayName}</p>
            {isOverdue && (
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
            )}
          </div>
          <DealQuickActions
            dealId={deal.id}
            stages={stages}
            currentStageId={deal.stage_id}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onCall={handleCall}
            onMessage={handleMessage}
            onMoveToStage={onMoveToStage}
            onMarkAsWon={onMarkAsWon}
            onMarkAsLost={onMarkAsLost}
            onDelete={onDelete}
          />
        </div>

        {phone && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{phone}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {source && (
            <Badge className={`text-xs ${sourceColors[source] || "bg-gray-100 text-gray-700"}`}>
              {source}
            </Badge>
          )}
          {!source && <span />}
          <span className="text-sm font-medium text-primary">
            {formatCurrency(Number(deal.value) || 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

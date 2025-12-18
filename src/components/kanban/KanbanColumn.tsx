import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { ColumnMetrics } from "./ColumnMetrics";
import { KanbanCard } from "./KanbanCard";
import type { Tables } from "@/integrations/supabase/types";
import type { DealWithContact } from "@/hooks/useDeals";

type PipelineStage = Tables<"pipeline_stages">;

interface KanbanColumnProps {
  stage: PipelineStage;
  deals: DealWithContact[];
  allStages: PipelineStage[];
  onAddDeal: () => void;
  onViewDeal: (dealId: string) => void;
  onEditDeal: (dealId: string) => void;
  onMoveDeal: (dealId: string, stageId: string) => void;
  onMarkAsWon: (dealId: string) => void;
  onMarkAsLost: (dealId: string) => void;
  onDeleteDeal: (dealId: string) => void;
}

export function KanbanColumn({
  stage,
  deals,
  allStages,
  onAddDeal,
  onViewDeal,
  onEditDeal,
  onMoveDeal,
  onMarkAsWon,
  onMarkAsLost,
  onDeleteDeal,
}: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-[280px] space-y-3">
      {/* Column Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color || "#3B82F6" }}
            />
            <h3 className="font-medium text-sm">{stage.name}</h3>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              {deals.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddDeal}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ColumnMetrics stage={stage} deals={deals} />
      </div>

      {/* Cards */}
      <div className="space-y-2 min-h-[400px]">
        {deals.map((deal) => (
          <KanbanCard
            key={deal.id}
            deal={deal}
            stages={allStages}
            currentStage={stage}
            onViewDetails={() => onViewDeal(deal.id)}
            onEdit={() => onEditDeal(deal.id)}
            onMoveToStage={(stageId) => onMoveDeal(deal.id, stageId)}
            onMarkAsWon={() => onMarkAsWon(deal.id)}
            onMarkAsLost={() => onMarkAsLost(deal.id)}
            onDelete={() => onDeleteDeal(deal.id)}
          />
        ))}
      </div>
    </div>
  );
}

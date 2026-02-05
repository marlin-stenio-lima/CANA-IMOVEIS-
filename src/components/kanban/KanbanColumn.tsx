import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { ColumnMetrics } from "./ColumnMetrics";
import { KanbanCard } from "./KanbanCard";
import type { Tables } from "@/integrations/supabase/types";
import type { DealWithContact } from "@/hooks/useDeals";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

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
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  // Calculate total value
  const totalValue = deals.reduce((sum, deal) => sum + (Number(deal.value) || 0), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-[300px] flex flex-col bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/50 h-full max-h-[calc(100vh-180px)]">
      {/* Column Header */}
      <div className="p-3 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-background"
              style={{ backgroundColor: stage.color || "#3B82F6" }}
            />
            <h3 className="font-semibold text-sm text-foreground/90">{stage.name}</h3>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-background font-normal text-muted-foreground border-border/50">
              {deals.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background/80" onClick={onAddDeal}>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Financial Summary */}
        {['aprovado', 'ganho', 'venda'].some(term => stage.name.toLowerCase().includes(term)) && (
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</span>
            <span className="text-sm font-bold text-foreground/80">{formatCurrency(totalValue)}</span>
          </div>
        )}

        {/* <ColumnMetrics stage={stage} deals={deals} />  -- Optional: Keep or remove if redundant */}
      </div>

      {/* Cards Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 custom-scrollbar">
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
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
        </SortableContext>
      </div>
    </div>
  );
}

import type { Tables } from "@/integrations/supabase/types";
import type { DealWithContact } from "@/hooks/useDeals";

type PipelineStage = Tables<"pipeline_stages">;

interface ColumnMetricsProps {
  stage: PipelineStage;
  deals: DealWithContact[];
}

export function ColumnMetrics({ stage, deals }: ColumnMetricsProps) {
  const totalValue = deals.reduce((acc, deal) => acc + (Number(deal.value) || 0), 0);
  
  // Calculate average time in stage (in days)
  const avgTimeInStage = deals.length > 0
    ? deals.reduce((acc, deal) => {
        if (!deal.stage_entered_at) return acc;
        const enteredAt = new Date(deal.stage_entered_at);
        const now = new Date();
        const days = Math.floor((now.getTime() - enteredAt.getTime()) / (1000 * 60 * 60 * 24));
        return acc + days;
      }, 0) / deals.length
    : 0;

  const targetDays = stage.target_days || 7;
  const isOverdue = avgTimeInStage > targetDays;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span title="Valor total estimado">
        💰 {formatCurrency(totalValue)}
      </span>
      <span 
        className={isOverdue ? "text-destructive" : ""}
        title={`Tempo médio: ${avgTimeInStage.toFixed(1)} dias (meta: ${targetDays} dias)`}
      >
        ⏱️ {avgTimeInStage.toFixed(0)}d / {targetDays}d
        {isOverdue && " 🔴"}
      </span>
    </div>
  );
}

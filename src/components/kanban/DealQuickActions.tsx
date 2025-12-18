import { MoreHorizontal, Eye, Pencil, Phone, MessageSquare, ArrowRight, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tables } from "@/integrations/supabase/types";

type PipelineStage = Tables<"pipeline_stages">;

interface DealQuickActionsProps {
  dealId: string;
  stages: PipelineStage[];
  currentStageId: string | null;
  onViewDetails: () => void;
  onEdit: () => void;
  onCall: () => void;
  onMessage: () => void;
  onMoveToStage: (stageId: string) => void;
  onMarkAsWon: () => void;
  onMarkAsLost: () => void;
  onDelete: () => void;
}

export function DealQuickActions({
  dealId,
  stages,
  currentStageId,
  onViewDetails,
  onEdit,
  onCall,
  onMessage,
  onMoveToStage,
  onMarkAsWon,
  onMarkAsLost,
  onDelete,
}: DealQuickActionsProps) {
  const otherStages = stages.filter(s => s.id !== currentStageId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="h-4 w-4 mr-2" />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar deal
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onCall}>
          <Phone className="h-4 w-4 mr-2" />
          Ligar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMessage}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Enviar mensagem
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {otherStages.length > 0 && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ArrowRight className="h-4 w-4 mr-2" />
              Mover para
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {otherStages.map((stage) => (
                <DropdownMenuItem
                  key={stage.id}
                  onClick={() => onMoveToStage(stage.id)}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: stage.color || "#3B82F6" }}
                  />
                  {stage.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        
        <DropdownMenuItem onClick={onMarkAsWon} className="text-green-600">
          <CheckCircle className="h-4 w-4 mr-2" />
          Marcar como Ganho
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMarkAsLost} className="text-orange-600">
          <XCircle className="h-4 w-4 mr-2" />
          Marcar como Perdido
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir deal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

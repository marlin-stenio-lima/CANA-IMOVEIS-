import { Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tables } from "@/integrations/supabase/types";

type Pipeline = Tables<"pipelines">;

interface PipelineSelectorProps {
  pipelines: Pipeline[];
  selectedPipeline: Pipeline | undefined;
  onSelect: (pipelineId: string) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

export function PipelineSelector({
  pipelines,
  selectedPipeline,
  onSelect,
  onCreateNew,
  isLoading,
}: PipelineSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[200px] justify-between" disabled={isLoading}>
          <span>{selectedPipeline?.name || "Selecionar Pipeline"}</span>
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {pipelines.map((pipeline) => (
          <DropdownMenuItem
            key={pipeline.id}
            onClick={() => onSelect(pipeline.id)}
            className="flex items-center justify-between"
          >
            <span>{pipeline.name}</span>
            {selectedPipeline?.id === pipeline.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        {pipelines.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem onClick={onCreateNew} className="text-primary">
          <Plus className="h-4 w-4 mr-2" />
          Criar novo pipeline
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type PipelineStage = Tables<"pipeline_stages">;
type PipelineStageInsert = TablesInsert<"pipeline_stages">;
type PipelineStageUpdate = TablesUpdate<"pipeline_stages">;

export function usePipelineStages(pipelineId: string | null) {
  const queryClient = useQueryClient();

  const { data: stages = [], isLoading } = useQuery({
    queryKey: ["pipeline_stages", pipelineId],
    queryFn: async () => {
      if (!pipelineId) return [];

      const { data, error } = await supabase
        .from("pipeline_stages")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("position", { ascending: true });

      if (error) throw error;
      return data as PipelineStage[];
    },
    enabled: !!pipelineId,
  });

  const createStage = useMutation({
    mutationFn: async (stage: Omit<PipelineStageInsert, "pipeline_id"> & { pipeline_id?: string }) => {
      const { data, error } = await supabase
        .from("pipeline_stages")
        .insert({ ...stage, pipeline_id: stage.pipeline_id || pipelineId! })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline_stages", pipelineId] });
      toast.success("Estágio criado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao criar estágio: " + error.message);
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, ...updates }: PipelineStageUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("pipeline_stages")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline_stages", pipelineId] });
      toast.success("Estágio atualizado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar estágio: " + error.message);
    },
  });

  const deleteStage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pipeline_stages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline_stages", pipelineId] });
      toast.success("Estágio excluído com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao excluir estágio: " + error.message);
    },
  });

  const reorderStages = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((id, index) => ({
        id,
        position: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("pipeline_stages")
          .update({ position: update.position })
          .eq("id", update.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline_stages", pipelineId] });
    },
    onError: (error) => {
      toast.error("Erro ao reordenar estágios: " + error.message);
    },
  });

  return {
    stages,
    isLoading,
    createStage,
    updateStage,
    deleteStage,
    reorderStages,
  };
}

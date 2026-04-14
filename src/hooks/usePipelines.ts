import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmMode } from "@/contexts/CrmModeContext";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Pipeline = Tables<"pipelines">;
type PipelineInsert = TablesInsert<"pipelines">;
type PipelineUpdate = TablesUpdate<"pipelines">;

export function usePipelines() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { mode } = useCrmMode();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);

  const { data: pipelines = [], isLoading } = useQuery({
    queryKey: ["pipelines", profile?.company_id, mode],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      let query = supabase
        .from("pipelines")
        .select("*")
        .eq("company_id", profile.company_id)
        .order("position", { ascending: true });

      if (mode) {
        query = query.eq("business_type" as any, mode);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Pipeline[];
    },
    enabled: !!profile?.company_id,
  });

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId) || pipelines.find(p => p.is_default) || pipelines[0];

  const createPipeline = useMutation({
    mutationFn: async (pipeline: Omit<PipelineInsert, "company_id" | "business_type">) => {
      if (!profile?.company_id) throw new Error("Company not found");

      const { data, error } = await supabase
        .from("pipelines")
        .insert({ 
          ...pipeline, 
          company_id: profile.company_id,
          business_type: mode as any
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
      toast.success("Pipeline criado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar pipeline: " + error.message);
    },
  });

  const updatePipeline = useMutation({
    mutationFn: async ({ id, ...updates }: PipelineUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("pipelines")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
      toast.success("Pipeline atualizado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar pipeline: " + error.message);
    },
  });

  const deletePipeline = useMutation({
    mutationFn: async (id: string) => {
      // 1. Delete all deals associated with this pipeline
      const { error: dealsError } = await supabase
        .from("deals")
        .delete()
        .eq("pipeline_id", id);

      if (dealsError) throw dealsError;

      // 2. Delete all stages associated with this pipeline
      const { error: stagesError } = await supabase
        .from("pipeline_stages")
        .delete()
        .eq("pipeline_id", id);

      if (stagesError) throw stagesError;

      // 3. Finally delete the pipeline
      const { error } = await supabase
        .from("pipelines")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
      toast.success("Pipeline excluído com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir pipeline: " + error.message);
    },
  });

  return {
    pipelines,
    isLoading,
    selectedPipeline,
    setSelectedPipelineId,
    createPipeline,
    updatePipeline,
    deletePipeline,
  };
}

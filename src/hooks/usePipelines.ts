import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Pipeline = Tables<"pipelines">;
type PipelineInsert = TablesInsert<"pipelines">;
type PipelineUpdate = TablesUpdate<"pipelines">;

export function usePipelines() {
  const queryClient = useQueryClient();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);

  const { data: pipelines = [], isLoading } = useQuery({
    queryKey: ["pipelines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pipelines")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data as Pipeline[];
    },
  });

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId) || pipelines.find(p => p.is_default) || pipelines[0];

  const createPipeline = useMutation({
    mutationFn: async (pipeline: Omit<PipelineInsert, "company_id">) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .single();

      if (!profile?.company_id) throw new Error("Company not found");

      const { data, error } = await supabase
        .from("pipelines")
        .insert({ ...pipeline, company_id: profile.company_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
      toast.success("Pipeline criado com sucesso");
    },
    onError: (error) => {
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
    onError: (error) => {
      toast.error("Erro ao atualizar pipeline: " + error.message);
    },
  });

  const deletePipeline = useMutation({
    mutationFn: async (id: string) => {
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
    onError: (error) => {
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

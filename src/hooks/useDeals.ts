import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Deal = Tables<"deals">;
type DealInsert = TablesInsert<"deals">;
type DealUpdate = TablesUpdate<"deals">;

export interface DealWithContact extends Deal {
  contacts?: {
    name: string;
    phone: string | null;
    source: string | null;
  } | null;
}

export function useDeals(pipelineId: string | null) {
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals", pipelineId],
    queryFn: async () => {
      if (!pipelineId) return [];

      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          contacts (
            name,
            phone,
            source
          )
        `)
        .eq("pipeline_id", pipelineId)
        .is("closed_at", null)
        .is("lost_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DealWithContact[];
    },
    enabled: !!pipelineId,
  });

  const createDeal = useMutation({
    mutationFn: async (deal: Omit<DealInsert, "company_id">) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .single();

      if (!profile?.company_id) throw new Error("Company not found");

      const { data, error } = await supabase
        .from("deals")
        .insert({ ...deal, company_id: profile.company_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
      toast.success("Deal criado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao criar deal: " + error.message);
    },
  });

  const updateDeal = useMutation({
    mutationFn: async ({ id, ...updates }: DealUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("deals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
      toast.success("Deal atualizado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar deal: " + error.message);
    },
  });

  const moveDealToStage = useMutation({
    mutationFn: async ({ dealId, stageId }: { dealId: string; stageId: string }) => {
      const { data, error } = await supabase
        .from("deals")
        .update({ 
          stage_id: stageId,
          stage_entered_at: new Date().toISOString()
        })
        .eq("id", dealId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
      toast.success("Deal movido com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao mover deal: " + error.message);
    },
  });

  const markAsWon = useMutation({
    mutationFn: async (dealId: string) => {
      const { data, error } = await supabase
        .from("deals")
        .update({ 
          closed_at: new Date().toISOString(),
          stage: "won"
        })
        .eq("id", dealId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
      toast.success("Deal marcado como ganho!");
    },
    onError: (error) => {
      toast.error("Erro ao marcar deal: " + error.message);
    },
  });

  const markAsLost = useMutation({
    mutationFn: async ({ dealId, lossReasonId }: { dealId: string; lossReasonId: string }) => {
      const { data, error } = await supabase
        .from("deals")
        .update({ 
          lost_at: new Date().toISOString(),
          lost_reason_id: lossReasonId,
          stage: "lost"
        })
        .eq("id", dealId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
      toast.success("Deal marcado como perdido");
    },
    onError: (error) => {
      toast.error("Erro ao marcar deal: " + error.message);
    },
  });

  const deleteDeal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
      toast.success("Deal excluído com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao excluir deal: " + error.message);
    },
  });

  return {
    deals,
    isLoading,
    createDeal,
    updateDeal,
    moveDealToStage,
    markAsWon,
    markAsLost,
    deleteDeal,
  };
}

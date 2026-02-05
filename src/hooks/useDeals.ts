import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Deal = Tables<"deals">;
type DealInsert = TablesInsert<"deals">;
type DealUpdate = TablesUpdate<"deals">;

export interface DealWithContact extends Deal {
  contacts?: {
    id: string; // Needed for update
    name: string;
    phone: string | null;
    source: string | null;
    ai_status?: string;
    follow_up_step?: number;
    interest_property_id?: string | null;
    assigned_to?: string | null;
    details?: any;
    email?: string;
    document?: string | null;
    tags?: string[] | null;
    notes?: string | null;
    status?: string | null;
    custom_fields?: any;
    job_title?: string | null;
    properties?: {
      title: string;
      code?: string;
    } | null;
    appointments?: {
      id: string;
      start_time: string;
      status: string;
    }[] | null;
  } | null;
  profiles?: {
    full_name: string | null;
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
            *,
            properties:interest_property_id (*),
            appointments (
              id,
              start_time,
              status
            )
          ),
          profiles:assigned_to (
            full_name
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
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
    },
    onError: (error) => {
      console.error("Erro ao criar deal:", error);
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
    },
    onError: (error) => {
      console.error("Erro ao atualizar deal:", error);
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
    },
    onError: (error) => {
      console.error("Erro ao mover deal:", error);
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
    },
    onError: (error) => {
      console.error("Erro ao marcar deal:", error);
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
    },
    onError: (error) => {
      console.error("Erro ao marcar deal:", error);
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
    },
    onError: (error) => {
      console.error("Erro ao excluir deal:", error);
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

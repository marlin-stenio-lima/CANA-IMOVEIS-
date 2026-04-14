import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { differenceInHours, parseISO } from "date-fns";
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
    created_at?: string;
    last_message_at?: string;
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
  const { profile } = useAuth();
  const { isAdmin } = usePermissions();

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals", pipelineId, profile?.id, isAdmin],
    queryFn: async () => {
      if (!pipelineId) return [];

      // 1. Get Company Settings for Bolsao Stages
      const { data: companyData } = await (supabase.from('companies').select('settings').limit(1).single() as any);
      const bolsaoStages = (companyData?.settings as any)?.bolsao_stages || {};
      const activeBolsaoStageId = bolsaoStages[pipelineId];

      // 2. Fetch Deals
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

      const userId = profile?.id;
      const allDeals = (data as unknown) as DealWithContact[];

      // 3. Client-side Filtering for Bolsao and Ownership
      const filteredDeals = allDeals.filter(deal => {
        // Admins see everything
        if (isAdmin) return true;

        // If it's mine, I see it
        if (deal.assigned_to === userId) return true;

        // If it's in the Bolsao stage for this pipeline
        if (deal.stage_id === activeBolsaoStageId) {
          // Check if it's abandoned (more than 2 hours)
          const contact = deal.contacts;
          const referenceDate = deal.updated_at || contact?.last_message_at || contact?.created_at || deal.created_at;
          let isAbandoned = false;

          if (referenceDate) {
            try {
              const hours = differenceInHours(new Date(), parseISO(referenceDate));
              if (hours >= 2) isAbandoned = true;
            } catch (e) { }
          }

          // If it's abandoned, everyone sees it (to claim).
          if (isAbandoned) return true;
        }

        // Otherwise, completely hide it from other brokers
        return false;
      });

      return filteredDeals;
    },
    enabled: !!pipelineId,
  });

  const createDeal = useMutation({
    mutationFn: async (deal: Omit<DealInsert, "company_id">) => {
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
    onError: (error: any) => {
      console.error("Erro ao criar deal:", error);
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
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar deal:", error);
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
    },
    onError: (error: any) => {
      console.error("Erro ao mover deal:", error);
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
    },
    onError: (error: any) => {
      console.error("Erro ao marcar deal:", error);
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
    },
    onError: (error: any) => {
      console.error("Erro ao marcar deal:", error);
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
    },
    onError: (error: any) => {
      console.error("Erro ao excluir deal:", error);
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

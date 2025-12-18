import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type LossReason = Tables<"loss_reasons">;
type LossReasonInsert = TablesInsert<"loss_reasons">;

export function useLossReasons() {
  const queryClient = useQueryClient();

  const { data: lossReasons = [], isLoading } = useQuery({
    queryKey: ["loss_reasons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loss_reasons")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as LossReason[];
    },
  });

  const createLossReason = useMutation({
    mutationFn: async (name: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .single();

      if (!profile?.company_id) throw new Error("Company not found");

      const { data, error } = await supabase
        .from("loss_reasons")
        .insert({ name, company_id: profile.company_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loss_reasons"] });
      toast.success("Motivo de perda criado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao criar motivo: " + error.message);
    },
  });

  return {
    lossReasons,
    isLoading,
    createLossReason,
  };
}

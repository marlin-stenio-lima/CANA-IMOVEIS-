import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useCrmMode } from "@/contexts/CrmModeContext";

export type Task = Tables<"tasks"> & {
    profiles?: {
        full_name: string | null;
    } | null;
};

export function useTasks(contactId?: string) {
    const queryClient = useQueryClient();
    const { profile } = useAuth();
    const { isAdmin } = usePermissions();
    const { mode } = useCrmMode();

    const { data: tasks = [], isLoading, error: fetchError, refetch } = useQuery({
        queryKey: ["tasks", contactId, mode, profile?.id, isAdmin],
        queryFn: async () => {
            try {
                let query = supabase
                    .from("tasks")
                    .select(`
                        *,
                        profiles!tasks_assigned_to_fkey (
                            full_name
                        )
                    `)
                    .order("due_date", { ascending: true });

                if (contactId) {
                    query = query.eq("related_contact_id", contactId);
                }

                if (!isAdmin && profile?.id) {
                    query = query.eq("assigned_to", profile.id);
                }

                query = query.eq("business_type" as any, mode);

                const { data, error } = await query;
                if (error) {
                  console.error("Supabase error fetching tasks:", error);
                  throw error;
                }
                return data as Task[];
            } catch (err: any) {
                console.error("Critical error in useTasks:", err);
                toast.error("Erro de conexão com o banco de dados. Verifique sua rede.");
                throw err;
            }
        },
        enabled: !!profile?.company_id,
        retry: 1
    });

    const createTask = useMutation({
        mutationFn: async (task: TablesInsert<"tasks">) => {
            if (!profile?.company_id) throw new Error("Company not found");

            const { data, error } = await supabase
                .from("tasks")
                .insert({
                    ...task,
                    company_id: profile.company_id,
                    created_by: profile.id
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Tarefa criada com sucesso!");
        },
        onError: (error: any) => {
            console.error("Erro ao criar tarefa:", error);
            toast.error("Erro ao criar tarefa: " + error.message);
        },
    });

    const updateTask = useMutation({
        mutationFn: async ({ id, ...updates }: TablesUpdate<"tasks"> & { id: string }) => {
            const { data, error } = await supabase
                .from("tasks")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error: any) => {
            console.error("Erro ao atualizar tarefa:", error);
            toast.error("Erro ao atualizar tarefa: " + error.message);
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("tasks")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Tarefa excluída.");
        },
    });

    return {
        tasks,
        isLoading,
        fetchError,
        refetch,
        createTask,
        updateTask,
        deleteTask,
    };
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useCrmMode } from "@/contexts/CrmModeContext";

export interface Appointment {
    id: string;
    created_at: string;
    company_id: string;
    assigned_to: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    status: "scheduled" | "completed" | "cancelled";
    contact_id: string | null;
    contact?: {
        name: string;
        phone: string | null;
    };
}

export function useAppointments(contactId?: string) {
    const queryClient = useQueryClient();
    const { profile } = useAuth();
    const { isAdmin } = usePermissions();
    const { mode } = useCrmMode();

    const { data: appointments = [], isLoading, error: fetchError, refetch } = useQuery({
        queryKey: ["appointments", contactId, mode, profile?.id, isAdmin],
        queryFn: async () => {
            try {
                let query = supabase
                    .from("appointments")
                    .select(`
                        *,
                        contact:contacts(name, phone)
                    `)
                    .order("start_time", { ascending: true });

                if (contactId) {
                    query = query.eq("contact_id", contactId);
                }

                if (!isAdmin && profile?.id) {
                    query = query.eq("assigned_to", profile.id);
                }
                
                query = query.eq("business_type" as any, mode);

                const { data, error } = await query;
                if (error) {
                    console.error("Supabase error fetching appointments:", error);
                    throw error;
                }
                return data as Appointment[];
            } catch (err: any) {
                console.error("Critical error in useAppointments:", err);
                toast.error("Erro ao carregar agendamentos.");
                throw err;
            }
        },
        enabled: !!profile?.company_id,
        retry: 1
    });

    return {
        appointments,
        isLoading,
        fetchError,
        refetch
    };
}

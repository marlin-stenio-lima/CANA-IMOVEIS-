import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import mockProperties from "@/data/mockProperties.json";

type Contact = Tables<"contacts">;
type ContactInsert = TablesInsert<"contacts">;
type ContactUpdate = TablesUpdate<"contacts">;

interface ContactsFilter {
    searchTerm?: string;
    source?: string;
    ownerId?: string;
    propertyId?: string;
    tags?: string[];
    dateRange?: string; // 'today', 'last-7', 'last-30', 'custom'
    businessType?: string;
    startDate?: Date;
    endDate?: Date;
}

export function useContacts(filters?: ContactsFilter) {
    const queryClient = useQueryClient();
    const { profile } = useAuth();
    const { isAdmin } = usePermissions();

    const { data: contacts = [], isLoading, error: queryError } = useQuery({
        queryKey: ["contacts", filters, profile?.id, isAdmin],
        queryFn: async () => {
            let query = supabase
                .from("contacts")
                .select(`
          *,
          profiles:assigned_to (
            full_name,
            job_title
          ),
          properties:interest_property_id (
            title
          )
        `);

            // Apply RBAC
            if (!isAdmin && profile?.id) {
                query = query.eq("assigned_to", profile.id);
            }

            // Apply Filters
            if (filters?.businessType) {
                query = query.eq("business_type" as any, filters.businessType);
            }

            if (filters?.searchTerm) {
                const search = `%${filters.searchTerm}%`;
                query = query.or(`name.ilike.${search},email.ilike.${search},phone.ilike.${search}`);
            }

            if (filters?.source && filters.source !== "all") {
                query = query.eq("source", filters.source);
            }

            if (filters?.ownerId && filters.ownerId !== "all") {
                query = query.eq("assigned_to", filters.ownerId);
            }

            if (filters?.propertyId && filters.propertyId !== "all") {
                query = query.eq("interest_property_id", filters.propertyId);
            }

            if (filters?.tags && filters.tags.length > 0) {
                query = query.contains("tags", filters.tags);
            }

            if (filters?.dateRange && filters.dateRange !== "all") {
                const now = new Date();
                let startDate = new Date();

                if (filters.dateRange === "today") {
                    startDate.setHours(0, 0, 0, 0);
                } else if (filters.dateRange === "last-7") {
                    startDate.setDate(now.getDate() - 7);
                } else if (filters.dateRange === "last-30") {
                    startDate.setDate(now.getDate() - 30);
                } else if (filters.dateRange === "custom" && filters.startDate) {
                    startDate = filters.startDate;
                }

                query = query.gte("created_at", startDate.toISOString());

                if (filters.dateRange === "custom" && filters.endDate) {
                    query = query.lte("created_at", filters.endDate.toISOString());
                }
            }

            query = query.order("created_at", { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching contacts:", error);
                throw error;
            }
            return data as Contact[];
        },
    });

    const createContact = useMutation({
        mutationFn: async (contact: ContactInsert & { business_type?: string }) => {
            // 1. Deduplication
            const conditions: string[] = [];
            if (contact.email) conditions.push(`email.eq.${contact.email}`);
            if (contact.phone) conditions.push(`phone.eq.${contact.phone}`);

            if (conditions.length > 0) {
                try {
                    const { data: existing } = await supabase
                        .from("contacts")
                        .select("id, business_type" as any)
                        .or(conditions.join(','))
                        .maybeSingle();

                    if (existing) {
                        const existingContact = existing as any;
                        if (existingContact.business_type === contact.business_type) {
                            throw new Error("Já existe um contato com este email ou telefone neste setor.");
                        }
                    }
                } catch (e) {
                    // Silently ignore dedup errors to let insert handle it
                }
            }

            // --- PROVISIONING ATTEMPT (NON-BLOCKING) ---
            try {
                if (contact.company_id) {
                    await supabase.from('companies').upsert({ id: contact.company_id, name: "Canaã Luxo", slug: "canaa" }, { onConflict: 'id' });
                }
                if (contact.interest_property_id && contact.interest_property_id.startsWith('0000')) {
                    const suffix = contact.interest_property_id.split('-').pop()?.replace(/^0+/, '');
                    const match = (mockProperties as any[]).find(p => p.id === `mock-${suffix}`);
                    if (match) {
                        await supabase.from('properties').upsert({ ...match, id: contact.interest_property_id, company_id: contact.company_id }, { onConflict: 'id' });
                    }
                }
            } catch (e) { console.warn("Provisioning warning:", e); }

            // --- INSERT WITH AUTO-RECOVERY ---
            try {
                const { data, error } = await supabase
                    .from("contacts")
                    .insert(contact as any)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (err: any) {
                console.error("Primary insert failed:", err);
                
                // RECOVERY: If FK error on property or profile, strip and retry
                const msg = err.message || "";
                if (msg.includes('interest_property_id_fkey') || msg.includes('assigned_to_fkey')) {
                    const recovery = { ...contact };
                    if (msg.includes('interest_property_id_fkey')) {
                        console.warn("Recovering from property FK error...");
                        recovery.notes = (recovery.notes || "") + `\n[Imóvel: ${recovery.interest_property_id}]`;
                        recovery.interest_property_id = null;
                    }
                    if (msg.includes('assigned_to_fkey')) {
                         console.warn("Recovering from profile FK error...");
                         recovery.assigned_to = null;
                    }

                    const { data: recovered, error: retryError } = await supabase
                        .from("contacts")
                        .insert(recovery as any)
                        .select()
                        .single();

                    if (retryError) throw retryError;
                    
                    toast.warning("Nota: O contato foi salvo com sucesso, mas o vínculo técnico com o imóvel foi preservado nas Observações para evitar erros do banco.");
                    return recovered;
                }
                
                throw err;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success("Contato criado com sucesso!");
        },
        onError: (error: any) => {
            console.error("Mutation Error:", error);
            toast.error(error.message || "Erro ao criar contato.");
        },
    });

    const updateContact = useMutation({
        mutationFn: async ({ id, ...updates }: ContactUpdate & { id: string }) => {
            try {
                // 1. First ensure provisioning for properties if using mock IDs
                if (updates.interest_property_id && (updates.interest_property_id as string).startsWith('0000')) {
                    const suffix = (updates.interest_property_id as string).split('-').pop()?.replace(/^0+/, '');
                    const match = (mockProperties as any[]).find(p => p.id === `mock-${suffix}`);
                    if (match) {
                        await supabase.from('properties').upsert({ ...match, id: updates.interest_property_id, company_id: (updates as any).company_id }, { onConflict: 'id' });
                    }
                }

                // 2. Original Update Attempt
                const { data, error } = await supabase
                    .from("contacts")
                    .update(updates as any)
                    .eq("id", id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (err: any) {
                console.error("Primary update failed:", err);
                
                const msg = err.message || "";
                if (msg.includes('interest_property_id_fkey') || msg.includes('assigned_to_fkey')) {
                    const recovery = { ...updates };
                    if (msg.includes('interest_property_id_fkey')) {
                        console.warn("Recovering from property FK error during update...");
                        recovery.notes = ((updates.notes as string) || "") + `\n[Imóvel Atualizado: ${updates.interest_property_id}]`;
                        recovery.interest_property_id = null;
                    }
                    if (msg.includes('assigned_to_fkey')) {
                        console.warn("Recovering from profile FK error during update...");
                        recovery.assigned_to = null;
                    }

                    const { data: recovered, error: retryError } = await supabase
                        .from("contacts")
                        .update(recovery as any)
                        .eq("id", id)
                        .select()
                        .single();

                    if (retryError) throw retryError;
                    
                    toast.warning("Nota: Contato atualizado, mas informações técnicas de vínculo foram preservadas nas Observações para evitar erro do banco.");
                    return recovered;
                }
                
                throw err;
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success("Contato atualizado com sucesso!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao atualizar contato.");
        },
    });

    const deleteContact = useMutation({
        mutationFn: async (ids: string[]) => {
            const { error } = await supabase
                .from("contacts")
                .delete()
                .in("id", ids);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success("Contato(s) excluído(s) com sucesso!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao excluir contato.");
        },
    });

    return {
        contacts,
        isLoading,
        error: queryError,
        createContact,
        updateContact,
        deleteContact
    };
}

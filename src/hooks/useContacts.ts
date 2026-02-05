import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

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
    startDate?: Date;
    endDate?: Date;
}

export function useContacts(filters?: ContactsFilter) {
    const queryClient = useQueryClient();

    const { data: contacts = [], isLoading, error } = useQuery({
        queryKey: ["contacts", filters],
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
        `)
                .order("created_at", { ascending: false });

            // Apply Filters
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

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching contacts:", error);
                throw error;
            }
            return data;
        },
    });

    const createContact = useMutation({
        mutationFn: async (contact: ContactInsert) => {
            // Deduplication Check (Phone/Email)
            const conditions: string[] = [];
            if (contact.email) conditions.push(`email.eq.${contact.email}`);
            if (contact.phone) conditions.push(`phone.eq.${contact.phone}`);

            if (conditions.length > 0) {
                const { data: existing } = await supabase
                    .from("contacts")
                    .select("id")
                    .or(conditions.join(','))
                    .maybeSingle();

                if (existing) {
                    throw new Error("Já existe um contato com este email ou telefone.");
                }
            }

            const { data, error } = await supabase
                .from("contacts")
                .insert(contact)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
        onError: (error) => {
            console.error("Erro ao criar contato:", error);
        },
    });

    const updateContact = useMutation({
        mutationFn: async ({ id, ...updates }: ContactUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from("contacts")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
        onError: (error) => {
            console.error("Erro ao atualizar contato:", error);
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
        },
        onError: (error) => {
            console.error("Erro ao excluir contatos:", error);
        },
    });

    return {
        contacts,
        isLoading,
        error: error as any, // expose error
        createContact,
        updateContact,
        deleteContact
    };
}

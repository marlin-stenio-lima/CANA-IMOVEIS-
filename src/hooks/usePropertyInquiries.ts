import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PropertyInquiry {
  id: string;
  property_id: string;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  contact_id: string | null;
  deal_id: string | null;
  status: 'novo' | 'contatado' | 'convertido' | 'descartado';
  created_at: string;
  property?: {
    id: string;
    title: string;
    price: number;
  };
}

export function usePropertyInquiries() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const inquiriesQuery = useQuery({
    queryKey: ['property-inquiries', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];
      
      const { data, error } = await supabase
        .from('property_inquiries')
        .select(`
          *,
          property:properties(id, title, price)
        `)
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PropertyInquiry[];
    },
    enabled: !!profile?.company_id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PropertyInquiry['status'] }) => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-inquiries'] });
      toast.success('Status atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status: ' + error.message);
    },
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('property_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-inquiries'] });
      toast.success('Lead excluído!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir lead: ' + error.message);
    },
  });

  return {
    inquiries: inquiriesQuery.data || [],
    isLoading: inquiriesQuery.isLoading,
    error: inquiriesQuery.error,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteInquiry: deleteInquiryMutation.mutateAsync,
  };
}

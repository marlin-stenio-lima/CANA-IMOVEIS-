import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Property } from './useProperties';

export function usePublicProperties(companyId: string | undefined) {
  return useQuery({
    queryKey: ['public-properties', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .eq('company_id', companyId)
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Property[];
    },
    enabled: !!companyId,
  });
}

export function usePublicProperty(id: string | undefined) {
  return useQuery({
    queryKey: ['public-property', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      return data as Property;
    },
    enabled: !!id,
  });
}

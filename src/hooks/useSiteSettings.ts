import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SiteSettings {
  id: string;
  company_id: string;
  site_name: string | null;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  about_text: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsFormData {
  site_name?: string;
  slug: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  about_text?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  is_published?: boolean;
}

export function useSiteSettings() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['site-settings', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return null;
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('company_id', profile.company_id)
        .maybeSingle();

      if (error) throw error;
      return data as SiteSettings | null;
    },
    enabled: !!profile?.company_id,
  });

  const upsertSettingsMutation = useMutation({
    mutationFn: async (data: SiteSettingsFormData) => {
      if (!profile?.company_id) throw new Error('Company ID not found');

      // Check if settings exist
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('company_id', profile.company_id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data: settings, error } = await supabase
          .from('site_settings')
          .update(data)
          .eq('company_id', profile.company_id)
          .select()
          .single();

        if (error) throw error;
        return settings;
      } else {
        // Create new
        const { data: settings, error } = await supabase
          .from('site_settings')
          .insert({
            ...data,
            company_id: profile.company_id,
          })
          .select()
          .single();

        if (error) throw error;
        return settings;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Configurações salvas com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao salvar configurações: ' + error.message);
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    saveSettings: upsertSettingsMutation.mutateAsync,
    isSaving: upsertSettingsMutation.isPending,
  };
}

export function usePublicSiteSettings(slug: string | undefined) {
  return useQuery({
    queryKey: ['public-site-settings', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      return data as SiteSettings | null;
    },
    enabled: !!slug,
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCrmMode } from '@/contexts/CrmModeContext';
import { toast } from 'sonner';
import mockData from '@/data/mockProperties.json';

const USE_MOCK = false;

/**
 * Helper to convert mock IDs (like 'mock-3074') into valid UUID format
 */
const toUuid = (id: string) => {
    if (!id.startsWith('mock-')) return id;
    const numericPart = id.replace('mock-', '').slice(0, 12).padStart(12, '0');
    return `00000000-0000-0000-0000-${numericPart}`;
};

/**
 * Helper to map mock property data for consistent use across the app
 */
const mapMockProperty = (p: any) => ({
    ...p,
    company_id: '00000000-0000-0000-0000-000000000000', // Master ID found in DB
    id: toUuid(p.id)
});

export interface Property {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  property_type: 'apartamento' | 'casa' | 'comercial' | 'terreno' | 'rural' | 'cobertura' | 'kitnet' | 'sala_comercial' | 'galpao' | 'fazenda';
  transaction_type: 'venda' | 'aluguel' | 'temporada';
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spots: number | null;
  area_total: number | null;
  area_built: number | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  features: string[];
  status: 'disponivel' | 'vendido' | 'alugado' | 'reservado' | 'inativo';
  is_featured: boolean;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  export_to_portals?: boolean;
  condo_fee: number | null;
  iptu: number | null;
  year_built: number | null;
  internal_id: string | null;
  portal_config: any;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  position: number;
  is_cover: boolean;
  created_at: string;
}

export interface PropertyFormData {
  title: string;
  description?: string;
  property_type: Property['property_type'];
  transaction_type: Property['transaction_type'];
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  parking_spots?: number;
  area_total?: number;
  area_built?: number;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  features?: string[];
  status?: Property['status'];
  is_featured?: boolean;
  is_published?: boolean;
  export_to_portals?: boolean;
  condo_fee?: number;
  iptu?: number;
  year_built?: number;
  internal_id?: string;
  portal_config?: any;
}

export function useProperties() {
  const { profile } = useAuth();
  const { mode } = useCrmMode();
  const queryClient = useQueryClient();

  const propertiesQuery = useQuery({
    queryKey: ['properties', profile?.company_id, mode],
    queryFn: async () => {
      if (USE_MOCK) {
        if (mode === 'barcos') return [] as Property[];
        return (mockData as any[]).map(mapMockProperty) as Property[];
      }
      
      if (!profile?.company_id) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Property[];
    },
    enabled: !!profile?.company_id,
  });

  const entityLabel = mode === 'barcos' ? 'Embarcação' : 'Imóvel';

  const createPropertyMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      if (!profile?.company_id) throw new Error('Company ID not found');

      const { data: property, error } = await supabase
        .from('properties')
        .insert({
          ...data,
          company_id: profile.company_id,
          created_by: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return property;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(`${entityLabel} cadastrado com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar ${entityLabel.toLowerCase()}: ` + error.message);
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyFormData> }) => {
      const { data: property, error } = await supabase
        .from('properties')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return property;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(`${entityLabel} atualizado com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar ${entityLabel.toLowerCase()}: ` + error.message);
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(`${entityLabel} excluído com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir ${entityLabel.toLowerCase()}: ` + error.message);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ propertyId, file, isCover = false }: { propertyId: string; file: File; isCover?: boolean }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${propertyId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      const { data: existingImages } = await supabase
        .from('property_images')
        .select('position')
        .eq('property_id', propertyId)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = existingImages && existingImages.length > 0 
        ? existingImages[0].position + 1 
        : 0;

      const { data: imageRecord, error: insertError } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: urlData.publicUrl,
          position: nextPosition,
          is_cover: isCover,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return imageRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Imagem adicionada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar imagem: ' + error.message);
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Imagem removida com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover imagem: ' + error.message);
    },
  });

  return {
    properties: propertiesQuery.data || [],
    isLoading: propertiesQuery.isLoading,
    error: propertiesQuery.error,
    createProperty: createPropertyMutation.mutateAsync,
    updateProperty: updatePropertyMutation.mutateAsync,
    deleteProperty: deletePropertyMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
    deleteImage: deleteImageMutation.mutateAsync,
    isCreating: createPropertyMutation.isPending,
    isUpdating: updatePropertyMutation.isPending,
  };
}

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return null;
      
      if (USE_MOCK) {
        const mappedData = (mockData as any[]).map(mapMockProperty);
        return mappedData.find(p => p.id === id) || null;
      }
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Property;
    },
    enabled: !!id,
  });
}

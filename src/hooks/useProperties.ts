import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
}

export function useProperties() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const propertiesQuery = useQuery({
    queryKey: ['properties', profile?.company_id],
    queryFn: async () => {
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
      toast.success('Imóvel cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar imóvel: ' + error.message);
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
      toast.success('Imóvel atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar imóvel: ' + error.message);
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
      toast.success('Imóvel excluído com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir imóvel: ' + error.message);
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

      // Get current max position
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

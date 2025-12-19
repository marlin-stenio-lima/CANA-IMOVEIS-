import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property, PropertyFormData } from '@/hooks/useProperties';
import { ImagePlus, X, Loader2 } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  property_type: z.enum(['apartamento', 'casa', 'comercial', 'terreno', 'rural', 'cobertura', 'kitnet', 'sala_comercial', 'galpao', 'fazenda']),
  transaction_type: z.enum(['venda', 'aluguel', 'temporada']),
  price: z.coerce.number().min(0, 'Preço deve ser positivo'),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  parking_spots: z.coerce.number().min(0).optional(),
  area_total: z.coerce.number().min(0).optional(),
  area_built: z.coerce.number().min(0).optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  features: z.array(z.string()).optional(),
  status: z.enum(['disponivel', 'vendido', 'alugado', 'reservado', 'inativo']).optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
});

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  onUploadImage?: (file: File, isCover: boolean) => Promise<void>;
  onDeleteImage?: (imageId: string) => Promise<void>;
  isSubmitting?: boolean;
}

const propertyTypeLabels = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  comercial: 'Comercial',
  terreno: 'Terreno',
  rural: 'Rural',
  cobertura: 'Cobertura',
  kitnet: 'Kitnet',
  sala_comercial: 'Sala Comercial',
  galpao: 'Galpão',
  fazenda: 'Fazenda',
};

const transactionTypeLabels = {
  venda: 'Venda',
  aluguel: 'Aluguel',
  temporada: 'Temporada',
};

const statusLabels = {
  disponivel: 'Disponível',
  vendido: 'Vendido',
  alugado: 'Alugado',
  reservado: 'Reservado',
  inativo: 'Inativo',
};

const availableFeatures = [
  'Piscina',
  'Churrasqueira',
  'Academia',
  'Salão de Festas',
  'Playground',
  'Portaria 24h',
  'Elevador',
  'Varanda',
  'Ar Condicionado',
  'Aquecimento',
  'Lareira',
  'Jardim',
  'Quintal',
  'Mobiliado',
  'Semi-mobiliado',
];

export function PropertyForm({ 
  property, 
  onSubmit, 
  onCancel, 
  onUploadImage, 
  onDeleteImage,
  isSubmitting 
}: PropertyFormProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || '',
      description: property?.description || '',
      property_type: property?.property_type || 'apartamento',
      transaction_type: property?.transaction_type || 'venda',
      price: property?.price || 0,
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      parking_spots: property?.parking_spots || 0,
      area_total: property?.area_total || 0,
      area_built: property?.area_built || 0,
      address: property?.address || '',
      neighborhood: property?.neighborhood || '',
      city: property?.city || '',
      state: property?.state || '',
      zip_code: property?.zip_code || '',
      features: property?.features || [],
      status: property?.status || 'disponivel',
      is_featured: property?.is_featured || false,
      is_published: property?.is_published || false,
    },
  });

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
    const files = e.target.files;
    if (!files || !onUploadImage) return;

    setUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        await onUploadImage(file, isCover);
      }
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  }, [onUploadImage]);

  const handleSubmit = async (data: PropertyFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="details">Características</TabsTrigger>
            <TabsTrigger value="location">Localização</TabsTrigger>
            <TabsTrigger value="images">Fotos</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Imóvel *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Apartamento 3 quartos no Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Imóvel *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(propertyTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transaction_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Transação *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(transactionTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$) *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o imóvel em detalhes..."
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Destaque</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Publicado no site</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parking_spots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Total (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_built"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Construída (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Características</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFeatures.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Checkbox
                          id={feature}
                          checked={field.value?.includes(feature)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, feature]);
                            } else {
                              field.onChange(current.filter((f) => f !== feature));
                            }
                          }}
                        />
                        <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="location" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-4">
            {property?.id ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fotos do Imóvel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.images?.map((image) => (
                      <div key={image.id} className="relative group aspect-video rounded-lg overflow-hidden border">
                        <img 
                          src={image.url} 
                          alt="Foto do imóvel" 
                          className="w-full h-full object-cover"
                        />
                        {image.is_cover && (
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                            Capa
                          </div>
                        )}
                        {onDeleteImage && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                            onClick={() => onDeleteImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <label className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      {uploadingImage ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Adicionar foto</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, false)}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Salve o imóvel primeiro para adicionar fotos.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {property ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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
import { usePermissions } from '@/hooks/usePermissions';
import { useCrmMode } from '@/contexts/CrmModeContext';
import { ImagePlus, X, Loader2, AlertCircle, User } from 'lucide-react';

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
  condo_fee: z.coerce.number().min(0).optional(),
  iptu: z.coerce.number().min(0).optional(),
  year_built: z.coerce.number().min(1800).max(2100).optional(),
  internal_id: z.string().optional(),
  portal_config: z.any().optional(),
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

const boatTypeLabels = {
  apartamento: 'Lancha',
  casa: 'Iate',
  comercial: 'Veleiro',
  terreno: 'Jet Ski',
  rural: 'Catamarã',
  cobertura: 'Bote',
  kitnet: 'Pesca',
  sala_comercial: 'Esportivo',
  galpao: 'Offshore',
  fazenda: 'Outros',
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
  'Piscina', 'Churrasqueira', 'Academia', 'Salão de Festas', 'Playground',
  'Portaria 24h', 'Elevador', 'Varanda', 'Ar Condicionado', 'Aquecimento',
  'Lareira', 'Jardim', 'Quintal', 'Mobiliado', 'Semi-mobiliado'
];

const boatPortalLabels: Record<string, string> = {
  mercado_livre: 'Mercado Livre',
  olx: 'OLX',
  barcos_nautica: 'Barcos Náutica',
  nautica: 'Náutica',
  boat_trader: 'Boat Trader',
  instagram: 'Instagram',
};

const boatFeatures = [
  'GPS', 'Sonda', 'Radar', 'Piloto Automático', 'Rádio VHF',
  'Ar Condicionado', 'Gerador', 'Guincho Elétrico', 'Toldo',
  'Churrasqueira', 'Som', 'TV', 'Geladeira', 'Micro-ondas', 'Flaps'
];

export function PropertyForm({ 
  property, 
  onSubmit, 
  onCancel, 
  onUploadImage, 
  onDeleteImage,
  isSubmitting 
}: PropertyFormProps) {
  const { mode } = useCrmMode();
  const { canAccessMenu } = usePermissions();
  const canViewOwner = canAccessMenu('view_owner_info');
  const isBoat = mode === 'barcos';
  const currentTypes = isBoat ? boatTypeLabels : propertyTypeLabels;
  const currentFeatures = isBoat ? boatFeatures : availableFeatures;

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
      condo_fee: property?.condo_fee || 0,
      iptu: property?.iptu || 0,
      year_built: property?.year_built || new Date().getFullYear(),
      internal_id: property?.internal_id || '',
      portal_config: property?.portal_config || { zap: true, vivareal: true, imovelweb: true, luxury_estate: true, properstar: true },
      owner_name: property?.owner_name || '',
      owner_phone: property?.owner_phone || '',
      owner_email: property?.owner_email || '',
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
          <TabsList className={`grid w-full ${canViewOwner ? 'grid-cols-6' : 'grid-cols-5'} overflow-x-auto`}>
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="details">Características</TabsTrigger>
            <TabsTrigger value="location">Localização</TabsTrigger>
            <TabsTrigger value="portals">Portais</TabsTrigger>
            <TabsTrigger value="images">Fotos</TabsTrigger>
            {canViewOwner && (
              <TabsTrigger value="owner" className="flex items-center gap-1 font-bold text-indigo-700">
                 <User className="w-4 h-4 hidden sm:block" /> Proprietário
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isBoat ? 'Nome da Embarcação *' : 'Título do Imóvel *'}</FormLabel>
                  <FormControl>
                    <Input placeholder={isBoat ? 'Ex: Lancha Focker 280' : 'Ex: Apartamento 3 quartos'} {...field} />
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
                    <FormLabel>{isBoat ? 'Tipo de Embarcação *' : 'Tipo de Imóvel *'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(currentTypes).map(([value, label]) => (
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
                      placeholder={isBoat ? 'Descreva a embarcação em detalhes...' : 'Descreva o imóvel em detalhes...'}
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
                    <FormLabel>{isBoat ? 'Cabines' : 'Quartos'}</FormLabel>
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
                    <FormLabel>{isBoat ? 'Motores' : 'Vagas'}</FormLabel>
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
                    <FormLabel>{isBoat ? 'Tamanho (Pés)' : 'Área Total (m²)'}</FormLabel>
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
                    <FormLabel>{isBoat ? 'Boca (m)' : 'Área Construída (m²)'}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condo_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isBoat ? 'Marina (R$)' : 'Condomínio (R$)'}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iptu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isBoat ? 'Seguro (R$)' : 'IPTU (R$)'}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year_built"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isBoat ? 'Ano do Casco' : 'Ano de Construção'}</FormLabel>
                    <FormControl>
                      <Input type="number" min="1800" {...field} />
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
                    {currentFeatures.map((feature) => (
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
                  <FormLabel>{isBoat ? 'Marina / Berço' : 'Endereço'}</FormLabel>
                  <FormControl>
                    <Input placeholder={isBoat ? 'Ex: Marina da Glória, Berço 42' : 'Rua, número'} {...field} />
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
                    <FormLabel>{isBoat ? 'Porto / Bairro' : 'Bairro'}</FormLabel>
                    <FormControl>
                      <Input placeholder={isBoat ? 'Ex: Porto de Santos' : ''} {...field} />
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

          <TabsContent value="portals" className="space-y-6 mt-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="internal_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Referência (REF)</FormLabel>
                    <FormControl>
                      <Input placeholder={isBoat ? 'Ex: EMB001' : 'Ex: AP001'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border bg-secondary/20">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-primary" /> {isBoat ? 'Visibilidade nos Portais Náuticos' : 'Visibilidade nos Portais'}
                  </h4>
                  <div className="space-y-3">
                    {isBoat
                      ? ['mercado_livre', 'olx', 'barcos_nautica', 'nautica', 'boat_trader', 'instagram'].map((portal) => (
                          <FormField
                            key={portal}
                            control={form.control}
                            name="portal_config"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between space-x-2 border-b border-white/5 pb-2">
                                <FormLabel>{boatPortalLabels[portal] ?? portal}</FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value?.[portal]}
                                    onCheckedChange={(checked) => {
                                      field.onChange({ ...field.value, [portal]: checked });
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))
                      : ['zap', 'vivareal', 'imovelweb', 'luxury_estate', 'properstar', 'olx'].map((portal) => (
                          <FormField
                            key={portal}
                            control={form.control}
                            name="portal_config"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between space-x-2 border-b border-white/5 pb-2">
                                <FormLabel className="capitalize">{portal.replace('_', ' ')}</FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value?.[portal]}
                                    onCheckedChange={(checked) => {
                                      field.onChange({ ...field.value, [portal]: checked });
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 text-xs text-muted-foreground space-y-2">
                  <p className="font-semibold text-primary">Dica:</p>
                  <p>Marque os portais onde este anúncio deve aparecer. Certifique-se de que {isBoat ? 'a embarcação' : 'o imóvel'} também está marcado como "Publicado no site" na aba básica.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-4">
            {property?.id ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{isBoat ? 'Fotos da Embarcação' : 'Fotos do Imóvel'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.images?.map((image) => (
                      <div key={image.id} className="relative group aspect-video rounded-lg overflow-hidden border">
                        <img 
                          src={image.url} 
                          alt={isBoat ? 'Foto da embarcação' : 'Foto do imóvel'} 
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
                Salve {isBoat ? 'o rascunho da embarcação' : 'o imóvel'} primeiro para adicionar fotos.
              </div>
            )}
          </TabsContent>

          {canViewOwner && (
            <TabsContent value="owner" className="space-y-6 mt-4">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start gap-4">
                 <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                 <div className="text-sm text-indigo-900">
                   <p className="font-bold mb-1">Informações Sigilosas</p>
                   <p>Os dados abaixo não aparecerão no portal público. Eles são exclusivos para uso interno do CRM e para gerar links de edição para o proprietário.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo do Proprietário</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Roberto Carlos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="owner_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 5511999999999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="owner_email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>E-mail do Proprietário</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Ex: roberto@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {property ? 'Salvar Alterações' : (isBoat ? 'Cadastrar Embarcação' : 'Cadastrar Imóvel')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

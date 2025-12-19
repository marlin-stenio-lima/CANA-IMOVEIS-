import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublicProperty } from '@/hooks/usePublicProperties';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Loader2, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Home,
  Ruler
} from 'lucide-react';

const propertyTypeLabels: Record<string, string> = {
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

const transactionTypeLabels: Record<string, string> = {
  venda: 'Venda',
  aluguel: 'Aluguel',
  temporada: 'Temporada',
};

export default function PublicProperty() {
  const { slug, propertyId } = useParams<{ slug: string; propertyId: string }>();
  const { data: property, isLoading } = usePublicProperty(propertyId);
  const { data: settings } = usePublicSiteSettings(slug);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('property-inquiry', {
        body: { property_id: property.id, ...formData }
      });
      
      if (error) throw error;
      setSubmitted(true);
      toast.success('Mensagem enviada com sucesso!');
    } catch (err) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-12 w-48" /></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center"><p>Imóvel não encontrado</p></div>;

  const images = property.images || [];
  const cover = images.find(i => i.is_cover) || images[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to={`/site/${slug}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-xl font-bold" style={{ color: settings?.primary_color }}>{settings?.site_name}</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="space-y-2">
              <div 
                className="aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer relative group"
                onClick={() => images.length > 0 && openGallery(0)}
              >
                {cover ? (
                  <>
                    <img src={cover.url} alt={property.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        Clique para ampliar
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, i) => (
                    <div 
                      key={img.id} 
                      className="aspect-video rounded overflow-hidden cursor-pointer relative group"
                      onClick={() => openGallery(i)}
                    >
                      <img src={img.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 3 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold">+{images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                <Home className="h-3 w-3 mr-1" />
                {propertyTypeLabels[property.property_type] || property.property_type}
              </Badge>
              <Badge style={{ backgroundColor: settings?.primary_color }} className="text-white text-sm">
                {transactionTypeLabels[property.transaction_type] || property.transaction_type}
              </Badge>
            </div>

            {/* Details */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{property.title}</h1>
                  {property.neighborhood && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {property.address ? `${property.address}, ` : ''}{property.neighborhood}, {property.city} - {property.state}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold" style={{ color: settings?.primary_color }}>{formatPrice(property.price)}</p>
                  {property.transaction_type === 'aluguel' && <p className="text-sm text-muted-foreground">por mês</p>}
                </div>
              </div>

              <div className="flex flex-wrap gap-6 py-4 border-y">
                {property.bedrooms! > 0 && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{property.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Quartos</p>
                    </div>
                  </div>
                )}
                {property.bathrooms! > 0 && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{property.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Banheiros</p>
                    </div>
                  </div>
                )}
                {property.parking_spots! > 0 && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{property.parking_spots}</p>
                      <p className="text-xs text-muted-foreground">Vagas</p>
                    </div>
                  </div>
                )}
                {property.area_total! > 0 && (
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{property.area_total}m²</p>
                      <p className="text-xs text-muted-foreground">Área Total</p>
                    </div>
                  </div>
                )}
                {property.area_built! > 0 && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{property.area_built}m²</p>
                      <p className="text-xs text-muted-foreground">Área Construída</p>
                    </div>
                  </div>
                )}
              </div>

              {property.description && (
                <div className="py-4">
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {property.features && property.features.length > 0 && (
                <div className="py-4">
                  <h3 className="font-semibold mb-2">Características</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map(f => <Badge key={f} variant="secondary">{f}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Tenho interesse!</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="font-semibold">Mensagem enviada!</p>
                    <p className="text-sm text-muted-foreground mt-1">Entraremos em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Seu nome *" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
                    <Input type="email" placeholder="Seu email *" required value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} />
                    <Input placeholder="Seu telefone *" required value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                    <Textarea placeholder="Mensagem (opcional)" value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} />
                    <Button type="submit" className="w-full" disabled={submitting} style={{ backgroundColor: settings?.primary_color }}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar Mensagem'}
                    </Button>
                  </form>
                )}

                {settings?.whatsapp && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a href={`https://wa.me/${settings.whatsapp}?text=Olá! Tenho interesse no imóvel: ${property.title}`} target="_blank">
                      <MessageCircle className="h-4 w-4 mr-2" />Chamar no WhatsApp
                    </a>
                  </Button>
                )}
                {settings?.phone && (
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <a href={`tel:${settings.phone}`}><Phone className="h-4 w-4 mr-2" />Ligar: {settings.phone}</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setGalleryOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/20 z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/20 z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <img 
              src={images[currentImageIndex]?.url} 
              alt={`Foto ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} de {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

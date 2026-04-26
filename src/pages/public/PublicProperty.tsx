import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublicProperty, usePublicProperties } from '@/hooks/usePublicProperties';
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
  const { data: allProperties } = usePublicProperties(settings?.company_id);
  
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

  const similarProperties = allProperties
    ?.filter(p => p.id !== property.id && p.property_type === property.property_type)
    .slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background theme-canaa">
      <header className="border-b sticky top-0 bg-background z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to={`/${slug}`} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar para {settings?.site_name}
          </Link>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block" style={{ color: '#7a1212' }}>{settings?.site_name}</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="space-y-2">
              <div 
                className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer relative group"
                onClick={() => images.length > 0 && openGallery(0)}
              >
                {cover ? (
                  <>
                    <img src={cover.url} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                        <Maximize2 className="inline-block w-4 h-4 mr-2" /> Ampliar Galeria
                      </span>
                    </div>
                  </>
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Imóvel sem foto" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                    loading="lazy"
                  />
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

            {/* Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#7a1212] leading-tight mb-2">{property.title}</h1>
                <p className="text-sm text-gray-500 font-medium">
                  {property.address ? `${property.address}, ` : ''}{property.neighborhood}, {property.city} - {property.state}
                </p>
              </div>

              <div className="flex flex-wrap gap-12 mb-8">
                {property.transaction_type === 'venda' || property.transaction_type === 'venda_aluguel' || property.price > 0 ? (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Comprar</p>
                    <p className="text-2xl font-black text-gray-900">{formatPrice(property.price)}</p>
                  </div>
                ) : null}
                {property.transaction_type === 'aluguel' || property.transaction_type === 'venda_aluguel' || property.rent_price ? (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Alugar / Temporada</p>
                    <p className="text-2xl font-black text-gray-900">{formatPrice(property.rent_price || property.price)}<span className="text-sm font-normal text-gray-500">/{property.transaction_type === 'temporada' ? 'dia' : 'mês'}</span></p>
                  </div>
                ) : null}
              </div>

              {/* Property Specs Card */}
              <div className="border border-gray-200 rounded-xl p-6 flex flex-wrap justify-between items-center bg-white shadow-sm mb-10 gap-4">
                {property.area_total! > 0 && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <Maximize2 className="h-6 w-6 text-[#7a1212] mb-2" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Área total</span>
                    <span className="font-bold text-sm text-gray-800">{property.area_total} m²</span>
                  </div>
                )}
                {property.area_built! > 0 && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <Home className="h-6 w-6 text-[#7a1212] mb-2" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Área útil</span>
                    <span className="font-bold text-sm text-gray-800">{property.area_built} m²</span>
                  </div>
                )}
                {property.bedrooms! > 0 && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <Bed className="h-6 w-6 text-[#7a1212] mb-2" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Quartos</span>
                    <span className="font-bold text-sm text-gray-800">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms! > 0 && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <Bath className="h-6 w-6 text-[#7a1212] mb-2" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Banheiros</span>
                    <span className="font-bold text-sm text-gray-800">{property.bathrooms}</span>
                  </div>
                )}
                {property.parking_spots! > 0 && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <Car className="h-6 w-6 text-[#7a1212] mb-2" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Vagas</span>
                    <span className="font-bold text-sm text-gray-800">{property.parking_spots}</span>
                  </div>
                )}
              </div>

              {(() => {
                const cleanDesc = property.description?.replace(/Ref:.*?Proprietário:.*?Telefone:[^\n]*(\n|$)/gi, '')?.trim();
                if (!cleanDesc) return null;
                return (
                  <div className="py-6 border-b border-gray-100">
                    <h3 className="font-bold mb-4 text-lg text-gray-900">Descrição</h3>
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">{cleanDesc}</p>
                  </div>
                );
              })()}

              {property.features && property.features.length > 0 && (
                <div className="py-8 border-b border-gray-100">
                  <h3 className="font-bold mb-6 text-lg text-gray-900">Comodidades do imóvel</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                    {property.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-[#7a1212]" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube Video Section */}
              {(property as any).custom_fields?.video_url && (
                <div className="py-6 border-t">
                  <h3 className="font-semibold mb-4 text-lg">Vídeo do Imóvel</h3>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                    <iframe
                      width="100%"
                      height="100%"
                      src={(() => {
                        const url = (property as any).custom_fields?.video_url;
                        const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                        const videoId = match && match[2].length === 11 ? match[2] : null;
                        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                      })()}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Location Map Section */}
              {property.city && property.state && (
                <div className="py-6 border-t">
                  <h3 className="font-semibold mb-4 text-lg">Localização</h3>
                  <div className="aspect-[21/9] md:aspect-[21/7] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${encodeURIComponent([property.address, property.neighborhood, property.city, property.state].filter(Boolean).join(', '))}&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                  {property.neighborhood && (
                    <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {property.address ? `${property.address}, ` : ''}{property.neighborhood}, {property.city} - {property.state}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="sticky top-24 border border-gray-200 shadow-xl rounded-xl p-2 bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-700 text-sm mb-4">Entrar em contato</h3>
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="font-semibold text-gray-800">Mensagem enviada!</p>
                    <p className="text-sm text-gray-500 mt-1">Entraremos em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Nome*</label>
                        <Input placeholder="Digite seu nome" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="bg-white border-gray-300 shadow-none text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Telefone*</label>
                        <Input placeholder="Seu telefone" required value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} className="bg-white border-gray-300 shadow-none text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">E-mail*</label>
                      <Input type="email" placeholder="Digite seu e-mail" required value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-white border-gray-300 shadow-none text-sm" />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Mensagem</label>
                      <Textarea 
                        value={formData.message || `Olá, vi o anúncio do imóvel ${property.title} no site ${settings?.site_name || 'Canaã Imóveis'} e gostaria de mais informações. Aguardo seu contato.`} 
                        onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} 
                        className="bg-gray-50/50 border-gray-300 shadow-none text-xs min-h-[100px] resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-lg font-bold text-sm bg-[#7a1212] hover:bg-[#5a0d0d] text-white transition-colors" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar'}
                    </Button>
                  </form>
                )}

                {settings?.whatsapp && (
                  <Button variant="outline" className="w-full h-12 mt-3 rounded-lg font-bold text-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white border-none transition-colors shadow-sm flex items-center justify-center gap-2" asChild>
                    <a href={`https://wa.me/${settings.whatsapp}?text=Olá! Tenho interesse no imóvel: ${property.title}`} target="_blank">
                      <MessageCircle className="h-5 w-5" />Whatsapp
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Imóveis Semelhantes */}
        {similarProperties.length > 0 && (
          <div className="mt-20 pt-16 border-t">
            <h3 className="text-3xl font-bold tracking-tight mb-8">Imóveis Semelhantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map(p => (
                <Link to={`/${slug}/imovel/${p.id}`} key={p.id} className="group block">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-4 relative shadow-sm">
                    {p.images?.find(i => i.is_cover)?.url || p.images?.[0]?.url ? (
                      <img 
                        src={p.images?.find(i => i.is_cover)?.url || p.images?.[0]?.url} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        alt={p.title}
                        loading="lazy"
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Imóvel sem foto" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 ease-out" 
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      <Badge variant="secondary" className="bg-white/90 text-black border-none shadow-sm text-[10px] px-2 py-0.5">
                        {propertyTypeLabels[p.property_type] || p.property_type}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-1">{p.title}</h4>
                  {p.neighborhood && (
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {p.neighborhood}, {p.city}
                    </p>
                  )}
                  <p className="font-bold text-lg" style={{ color: '#7a1212' }}>{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
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

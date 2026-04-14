import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { usePublicProperties } from '@/hooks/usePublicProperties';
import { Property } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Bed, Bath, Car, Maximize2, MapPin, Search, Phone, Mail, Facebook, Instagram, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

export default function PublicSite() {
  const { slug } = useParams<{ slug: string }>();
  const { data: settings, isLoading: loadingSettings } = usePublicSiteSettings(slug);
  const { data: properties, isLoading: loadingProperties } = usePublicProperties(settings?.company_id);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselImages = [
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', title: 'Exclusividade e Sofisticação.', sub: 'Os melhores imóveis de luxo da região.' },
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', title: 'O seu novo estilo de vida.', sub: 'Conforto e segurança em cada detalhe.' },
    { url: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', title: 'Sua Nova História Começa Aqui.', sub: 'Atendimento personalizado para sua conquista.' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredProperties = properties?.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.property_type === typeFilter;
    const matchesTransaction = transactionFilter === 'all' || p.transaction_type === transactionFilter;
    return matchesSearch && matchesType && matchesTransaction;
  }) || [];

  const featuredProperties = filteredProperties.filter(p => p.is_featured);
  const regularProperties = filteredProperties.filter(p => !p.is_featured);

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(price);

  if (loadingSettings) {
    return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-12 w-48" /></div>;
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Site não encontrado</h1>
          <p className="text-muted-foreground">Este portal imobiliário não existe ou não está publicado.</p>
        </div>
      </div>
    );
  }

  const transactionLabels: Record<string, string> = {
    venda: 'Venda',
    aluguel: 'Aluguel',
    temporada: 'Temporada',
  };

  const typeLabels: Record<string, string> = {
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

  const PropertyCard = ({ property }: { property: Property }) => {
    const cover = property.images?.find(i => i.is_cover) || property.images?.[0];
    return (
      <Link to={`/${slug}/imovel/${property.id}`}>
        <Card className="overflow-hidden border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group rounded-2xl bg-white dark:bg-gray-900">
          <div className="aspect-[4/3] relative overflow-hidden">
            {cover ? (
              <img 
                src={cover.url} 
                alt={property.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground italic">Sem imagem</div>
            )}
            
            {/* Status Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {property.is_featured && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm font-bold text-[10px] px-2 py-0.5">
                  DESTAQUE
                </Badge>
              )}
              <Badge variant="secondary" className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-black dark:text-white border-none text-[10px] px-2 py-0.5">
                {typeLabels[property.property_type] || property.property_type}
              </Badge>
            </div>

            <div 
              className="absolute top-3 right-3 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10" 
              style={{ backgroundColor: settings.primary_color }}
            >
              {transactionLabels[property.transaction_type]}
            </div>

            {/* Bottom Gradient for readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          <CardContent className="p-5 space-y-3">
            <div>
              <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              {property.neighborhood && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5 font-medium">
                  <MapPin className="h-3 w-3 text-primary/60" />
                  {property.neighborhood}, {property.city}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800 text-xs text-muted-foreground font-medium">
              {property.bedrooms! > 0 && <span className="flex items-center gap-1.5"><Bed className="h-4 w-4 opacity-70" />{property.bedrooms}</span>}
              {property.bathrooms! > 0 && <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 opacity-70" />{property.bathrooms}</span>}
              {property.area_total! > 0 && <span className="flex items-center gap-1.5"><Maximize2 className="h-4 w-4 opacity-70" />{property.area_total}m²</span>}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tighter" style={{ color: settings.primary_color }}>
                {formatPrice(property.price)}
              </span>
              {property.transaction_type === 'aluguel' && (
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">/ mês</span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary">C</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: settings.primary_color }}>{settings.site_name}</h1>
          </div>
          <div className="flex gap-6 items-center">
            <nav className="hidden lg:flex gap-6">
              {['Comprar', 'Alugar', 'Lançamentos', 'Institucional', 'Contato'].map(item => (
                <button key={item} className="text-sm font-medium hover:text-primary transition-colors">{item}</button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {settings.phone && <a href={`tel:${settings.phone}`} className="text-sm hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"><Phone className="h-4 w-4" />{settings.phone}</a>}
              {settings.whatsapp && (
                <Button size="sm" className="rounded-full px-5 shadow-lg shadow-primary/20 hover:scale-105 transition-transform" style={{ backgroundColor: settings.primary_color }} asChild>
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank">WhatsApp</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero & Search (Carousel Version) */}
      <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          {carouselImages.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img src={img.url} className="w-full h-full object-cover animate-ken-burns" alt="Banner" />
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="container mx-auto px-4 relative z-20 text-center text-white mb-20 lg:mb-32">
          <div className="space-y-4 max-w-4xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg">
              {carouselImages[activeIndex].title}
            </h2>
            <p className="text-lg lg:text-xl font-light opacity-90 drop-shadow-md">
              {carouselImages[activeIndex].sub}
            </p>
          </div>
        </div>

        {/* Floating Search Bar (Jet Imob Style) */}
        <div className="absolute bottom-12 lg:bottom-16 left-0 right-0 z-30 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl p-4 lg:p-6 rounded-[2rem] shadow-2xl border border-white/20 flex flex-col lg:flex-row gap-4 items-end">
              
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Pretensão</label>
                  <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                    <SelectTrigger className="bg-white/50 dark:bg-black/50 border-none h-12 rounded-xl focus:ring-1 focus:ring-primary">
                      <SelectValue placeholder="Comprar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="venda">Comprar</SelectItem>
                      <SelectItem value="aluguel">Alugar</SelectItem>
                      <SelectItem value="temporada">Temporada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Tipo de Imóvel</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-white/50 dark:bg-black/50 border-none h-12 rounded-xl focus:ring-1 focus:ring-primary">
                      <SelectValue placeholder="Todos os imóveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Localização</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Cidade, bairro ou condomínios" 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)} 
                      className="pl-10 bg-white/50 dark:bg-black/50 border-none h-12 rounded-xl focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <Button 
                className="w-full lg:w-16 h-12 rounded-xl shadow-xl shadow-primary/30 shrink-0" 
                style={{ backgroundColor: settings.primary_color }}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-center text-white/70 text-xs mt-4 drop-shadow">
              Busque por código do imóvel
            </p>
          </div>
        </div>

        {/* Carousel Controls */}
        <button 
          onClick={() => setActiveIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full border border-white/20 bg-black/10 hover:bg-black/20 text-white backdrop-blur-sm transition-all hidden lg:block"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveIndex((prev) => (prev + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full border border-white/20 bg-black/10 hover:bg-black/20 text-white backdrop-blur-sm transition-all hidden lg:block"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {carouselImages.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === activeIndex ? 'bg-white w-6' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      {settings.about_text && (
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Sobre Nós</h3>
              <p className="text-muted-foreground whitespace-pre-line">{settings.about_text}</p>
            </div>
          </div>
        </section>
      )}

      {/* Properties */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80" />)}</div>
          ) : filteredProperties.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Nenhum imóvel encontrado.</p>
          ) : (
            <>
              {featuredProperties.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Destaques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{featuredProperties.map(p => <PropertyCard key={p.id} property={p} />)}</div>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold mb-4">{filteredProperties.length} imóveis encontrados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{regularProperties.map(p => <PropertyCard key={p.id} property={p} />)}</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h4 className="text-white text-xl font-bold">{settings.site_name}</h4>
              <p className="text-sm leading-relaxed opacity-70">
                Líder em negociações imobiliárias de alto padrão, oferecendo exclusividade e transparência em cada etapa da sua conquista.
              </p>
              <div className="flex gap-4 pt-2">
                {settings.facebook_url && <a href={settings.facebook_url} target="_blank" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>}
                {settings.instagram_url && <a href={settings.instagram_url} target="_blank" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>}
                {settings.youtube_url && <a href={settings.youtube_url} target="_blank" className="hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Imóveis</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white transition-colors">Comprar</button></li>
                <li><button className="hover:text-white transition-colors">Alugar</button></li>
                <li><button className="hover:text-white transition-colors">Temporada</button></li>
                <li><button className="hover:text-white transition-colors">Lançamentos</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">A Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white transition-colors">Institucional</button></li>
                <li><button className="hover:text-white transition-colors">Trabalhe Conosco</button></li>
                <li><button className="hover:text-white transition-colors">Política de Privacidade</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Contato</h4>
              <ul className="space-y-3 text-sm">
                {settings.address && <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" /> {settings.address}</li>}
                {settings.phone && <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-primary" /> {settings.phone}</li>}
                {settings.email && <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-primary" /> {settings.email}</li>}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
            <p>&copy; {new Date().getFullYear()} {settings.site_name}. Todos os direitos reservados.</p>
            <p>Desenvolvido com tecnologia Antigravity</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

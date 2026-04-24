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
      {/* Header - Transparent overlay */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3 border border-white/30 rounded-full pl-2 pr-6 py-1.5 backdrop-blur-md bg-black/10">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/50">
              <span className="text-lg font-bold">C</span>
            </div>
            <h1 className="text-lg tracking-widest font-light">{settings.site_name.toUpperCase()}</h1>
          </div>
          <div className="flex gap-6 items-center">
            <nav className="hidden lg:flex gap-8">
              {['Comprar', 'Alugar', 'Lançamentos', 'Institucional', 'Contato'].map(item => (
                <button key={item} className="text-sm font-medium opacity-90 hover:opacity-100 hover:text-white transition-opacity">{item}</button>
              ))}
            </nav>
            <div className="flex items-center gap-3 border-l border-white/20 pl-6 ml-2">
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" className="text-sm font-semibold hover:opacity-80 transition-opacity">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          {carouselImages.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Gradient overlays for text readability */}
              <div className="absolute inset-0 bg-black/30 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
              <img src={img.url} className="w-full h-full object-cover animate-ken-burns" alt="Banner" />
            </div>
          ))}
        </div>

        {/* Center Content */}
        <div className="container mx-auto px-4 relative z-20 text-center text-white mt-16">
          <div className="space-y-8 max-w-5xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight drop-shadow-xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              Explore as residências mais exclusivas do mundo
            </h2>
            
            {/* Pill Search Bar */}
            <div className="mt-12 bg-white rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl mx-auto max-w-4xl text-black">
              
              <div className="flex-1 flex items-center w-full px-4 border-r border-gray-200">
                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="border-none shadow-none focus:ring-0 text-base font-medium bg-transparent h-14 w-full">
                    <SelectValue placeholder="Comprar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">À venda e Aluguel</SelectItem>
                    <SelectItem value="venda">À venda</SelectItem>
                    <SelectItem value="aluguel">Para alugar</SelectItem>
                    <SelectItem value="temporada">Temporada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 flex items-center w-full px-4 border-r border-gray-200">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-none shadow-none focus:ring-0 text-base bg-transparent h-14 w-full text-muted-foreground">
                    <SelectValue placeholder="Qualquer tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer tipo</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="cobertura">Cobertura</SelectItem>
                    <SelectItem value="fazenda">Fazenda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-[1.5] flex items-center w-full px-4">
                <Input 
                  placeholder="Localização, código..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="border-none shadow-none focus-visible:ring-0 h-14 bg-transparent text-base"
                />
              </div>

              <Button 
                className="w-full md:w-auto h-14 px-10 rounded-full bg-slate-900 hover:bg-black text-white text-base font-medium shrink-0 shadow-md ml-2"
                onClick={() => {
                  document.getElementById('imoveis-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Left Property Info */}
        <div className="absolute bottom-10 left-4 md:left-12 z-30 text-white animate-fade-in-up">
          <h3 className="text-3xl font-bold drop-shadow-md">{typeLabels[typeFilter] || 'Residência'} - Venda</h3>
          <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mt-1 mb-2">Exclusiva</h2>
          <p className="text-sm font-medium opacity-90 max-w-md drop-shadow">{carouselImages[activeIndex].title}</p>
          
          <div className="flex gap-2 mt-4">
            <div className="h-0.5 w-8 bg-white" />
            <div className="h-0.5 w-8 bg-white/40" />
            <div className="h-0.5 w-8 bg-white/40" />
            <div className="h-0.5 w-8 bg-white/40" />
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

      {/* Categorias / Estilo de Vida */}
      <section className="py-20 bg-slate-50 dark:bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">Encontre sua propriedade ideal</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore nossa seleção exclusiva através do estilo de vida que você procura. De coberturas urbanas a retiros no campo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'casa', title: 'Casas & Mansões', subtitle: 'Conforto e privacidade', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'cobertura', title: 'Coberturas', subtitle: 'Vistas espetaculares', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'apartamento', title: 'Apartamentos', subtitle: 'Luxo urbano', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'fazenda', title: 'Fazendas & Haras', subtitle: 'Refúgios na natureza', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            ].map((cat) => (
              <div 
                key={cat.id}
                onClick={() => {
                  setTypeFilter(cat.id);
                  document.getElementById('imoveis-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500 z-10" />
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
                  <h4 className="text-2xl font-bold mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.title}</h4>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{cat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      {settings.about_text && (
        <section className="py-20 border-b bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h3 className="text-3xl font-bold tracking-tight">Sobre Nós</h3>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">{settings.about_text}</p>
            </div>
          </div>
        </section>
      )}

      {/* Properties */}
      <section id="imoveis-list" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-96 rounded-2xl" />)}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed">
              <h4 className="text-2xl font-bold mb-2">Nenhum imóvel encontrado</h4>
              <p className="text-muted-foreground mb-6">Tente ajustar os filtros de busca para encontrar o que procura.</p>
              <Button onClick={() => { setSearch(''); setTypeFilter('all'); setTransactionFilter('all'); }} variant="outline">Limpar Filtros</Button>
            </div>
          ) : (
            <>
              {featuredProperties.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-extrabold tracking-tight mb-2">Imóveis em Destaque</h3>
                      <p className="text-muted-foreground">As propriedades mais exclusivas do nosso portfólio.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{featuredProperties.map(p => <PropertyCard key={p.id} property={p} />)}</div>
                </div>
              )}
              <div>
                <div className="flex items-end justify-between mb-8 pb-4 border-b">
                  <h3 className="text-2xl font-bold tracking-tight">{filteredProperties.length} imóveis encontrados</h3>
                  {typeFilter !== 'all' && (
                    <Badge variant="outline" className="text-sm px-3 py-1 cursor-pointer hover:bg-muted" onClick={() => setTypeFilter('all')}>
                      Filtro: {typeLabels[typeFilter]} ✕
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{regularProperties.map(p => <PropertyCard key={p.id} property={p} />)}</div>
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

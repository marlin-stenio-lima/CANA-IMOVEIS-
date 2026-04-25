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
import { Bed, Bath, Car, Maximize2, MapPin, Search, Phone, Mail, Facebook, Instagram, Youtube, ChevronLeft, ChevronRight, Home } from 'lucide-react';
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
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-300">
                <Home className="w-12 h-12 mb-2 opacity-20" />
                <span className="text-xs font-semibold uppercase tracking-widest opacity-40">Sem foto</span>
              </div>
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
              style={{ backgroundColor: '#7a1212' }}
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
              <span className="text-2xl font-black tracking-tighter" style={{ color: '#7a1212' }}>
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
      <section className="relative h-[95vh] min-h-[700px] flex flex-col items-center justify-center mb-32">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
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

        {/* Center Content */}
        <div className="container mx-auto px-4 relative z-20 text-center text-white mt-[-10vh]">
          <div className="space-y-4 max-w-5xl mx-auto animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              Encontre o seu imóvel perfeito.
            </h2>
            <p className="text-xl md:text-2xl font-medium drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Buscou, encontrou, se mudou. Sem burocracias.
            </p>
            
            {/* Pill Search Bar */}
            <div className="mt-10 bg-white/95 backdrop-blur-md rounded-xl md:rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl mx-auto max-w-5xl text-black">
              
              <div className="flex-1 flex flex-col w-full px-4 border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left pl-3 mb-1">Pretensão</span>
                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="border-none shadow-none focus:ring-0 text-base font-bold bg-transparent h-10 w-full p-0 px-3">
                    <SelectValue placeholder="Comprar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Comprar e Alugar</SelectItem>
                    <SelectItem value="venda">Comprar</SelectItem>
                    <SelectItem value="aluguel">Alugar</SelectItem>
                    <SelectItem value="temporada">Temporada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 flex flex-col w-full px-4 border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left pl-3 mb-1">Tipo de imóvel</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-none shadow-none focus:ring-0 text-base font-bold bg-transparent h-10 w-full text-muted-foreground p-0 px-3">
                    <SelectValue placeholder="Todos os imóveis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os imóveis</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa de Condomínio</SelectItem>
                    <SelectItem value="cobertura">Cobertura</SelectItem>
                    <SelectItem value="fazenda">Fazenda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-[1.5] flex flex-col w-full px-4 py-2 md:py-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left pl-3 mb-1">Localização</span>
                <Input 
                  placeholder="Digite ruas, bairros, cidades ou condomínios" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="border-none shadow-none focus-visible:ring-0 h-10 bg-transparent text-base font-medium p-0 px-3"
                />
              </div>

              <Button 
                className="w-full md:w-auto h-16 w-16 md:px-8 md:rounded-full rounded-xl bg-[#7a1212] hover:bg-[#5c0d0d] text-white shrink-0 shadow-md md:ml-2 mt-4 md:mt-0 flex items-center justify-center"
                onClick={() => {
                  document.getElementById('imoveis-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <Search className="h-6 w-6" />
              </Button>
            </div>
            <div className="pt-4 text-sm font-medium hover:underline cursor-pointer">
              Buscar por código
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button 
          onClick={() => setActiveIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full border border-white/20 bg-black/10 hover:bg-black/30 text-white backdrop-blur-sm transition-all hidden lg:block"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={() => setActiveIndex((prev) => (prev + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full border border-white/20 bg-black/10 hover:bg-black/30 text-white backdrop-blur-sm transition-all hidden lg:block"
        >
          <ChevronRight className="w-8 h-8" />
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10 animate-fade-in-up">
            <h3 className="text-3xl font-bold mb-2 tracking-tight text-[#222]">Encontre sua propriedade ideal</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Explore nossa seleção exclusiva através do estilo de vida que você procura.<br/>De coberturas urbanas a retiros no campo.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center items-center">
            {[
              { id: 'casa', title: 'Casas & Mansões', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'cobertura', title: 'Coberturas', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'apartamento', title: 'Apartamentos', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'fazenda', title: 'Fazendas & Haras', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            ].map((cat) => (
              <div 
                key={cat.id}
                onClick={() => {
                  setTypeFilter(cat.id);
                  document.getElementById('imoveis-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group relative h-48 md:h-56 rounded-xl overflow-hidden cursor-pointer shadow-sm mx-auto w-full max-w-[260px]"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500 z-10" />
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 z-20 p-4 flex flex-col justify-end text-white text-center">
                  <h4 className="text-lg font-bold drop-shadow-md">{cat.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Sections */}
      <section id="imoveis-list" className="py-12 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{[1,2,3,4].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
              <h4 className="text-xl font-bold mb-2">Nenhum imóvel encontrado</h4>
              <p className="text-muted-foreground mb-6">Tente ajustar os filtros de busca para encontrar o que procura.</p>
              <Button onClick={() => { setSearch(''); setTypeFilter('all'); setTransactionFilter('all'); }} variant="outline">Limpar Filtros</Button>
            </div>
          ) : search !== '' || typeFilter !== 'all' || transactionFilter !== 'all' ? (
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-[#7a1212]">
                  {filteredProperties.length} Imóveis encontrados
                </h3>
                <Button onClick={() => { setSearch(''); setTypeFilter('all'); setTransactionFilter('all'); }} variant="outline" className="text-xs font-medium bg-white" size="sm">Limpar Filtros</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProperties.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              
              {/* Properties for Sale */}
              {filteredProperties.some(p => p.transaction_type === 'venda' || p.transaction_type === 'venda_aluguel') && (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-[#7a1212]">Imóveis para comprar</h3>
                    <Button onClick={() => { setTransactionFilter('venda'); document.getElementById('imoveis-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} variant="outline" className="text-xs font-medium bg-white" size="sm">Ver todos</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProperties.filter(p => p.transaction_type === 'venda' || p.transaction_type === 'venda_aluguel').slice(0, 4).map(p => <PropertyCard key={p.id} property={p} />)}
                  </div>
                </div>
              )}

              {/* Properties for Rent */}
              {filteredProperties.some(p => p.transaction_type === 'aluguel' || p.transaction_type === 'venda_aluguel') && (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-[#7a1212]">Imóveis para alugar</h3>
                    <Button onClick={() => { setTransactionFilter('aluguel'); document.getElementById('imoveis-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} variant="outline" className="text-xs font-medium bg-white" size="sm">Ver todos</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProperties.filter(p => p.transaction_type === 'aluguel' || p.transaction_type === 'venda_aluguel').slice(0, 4).map(p => <PropertyCard key={p.id} property={p} />)}
                  </div>
                </div>
              )}

              {/* Properties for Vacation (Temporada) */}
              {filteredProperties.some(p => p.transaction_type === 'temporada') && (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-[#7a1212]">Imóveis para temporada</h3>
                    <Button onClick={() => { setTransactionFilter('temporada'); document.getElementById('imoveis-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} variant="outline" className="text-xs font-medium bg-white" size="sm">Ver todos</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProperties.filter(p => p.transaction_type === 'temporada').slice(0, 4).map(p => <PropertyCard key={p.id} property={p} />)}
                  </div>
                </div>
              )}
              
            </div>
          )}
        </div>
      </section>

      {/* Map Location Section */}
      <section className="relative h-[400px] w-full bg-slate-200 overflow-hidden flex items-center justify-center border-t border-[#7a1212] border-b-4">
        <div className="absolute inset-0 bg-slate-300 mix-blend-multiply"></div>
        <div className="absolute inset-0">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent('Angra dos Reis - RJ')}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="opacity-70"
          ></iframe>
        </div>
        <div className="relative z-10 bg-white shadow-2xl rounded-lg p-8 max-w-sm text-center">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#7a1212] rounded-full flex items-center justify-center border-4 border-white">
            <MapPin className="text-white w-5 h-5" />
          </div>
          <h4 className="text-[#7a1212] font-bold text-lg mt-2 mb-1">{settings?.site_name || 'Canaã Imóveis de Luxo'}</h4>
          <p className="text-sm text-gray-600 mb-4 px-4">
            {settings?.address || 'da Conceição, 226, Centro\nSala 201\nAngra dos Reis - Rio de Janeiro'}
          </p>
          <div className="border-t pt-4 text-xs text-gray-500 font-medium space-y-1">
            <p className="flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> {settings?.phone || '(24) 99993-9995'}</p>
            <p className="flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> (24) 99995-9992</p>
            <p className="flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> (24) 99994-9992</p>
          </div>
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

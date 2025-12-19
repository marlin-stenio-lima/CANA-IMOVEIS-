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
import { Bed, Bath, Car, Maximize2, MapPin, Search, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

export default function PublicSite() {
  const { slug } = useParams<{ slug: string }>();
  const { data: settings, isLoading: loadingSettings } = usePublicSiteSettings(slug);
  const { data: properties, isLoading: loadingProperties } = usePublicProperties(settings?.company_id);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [transactionFilter, setTransactionFilter] = useState('all');

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

  const PropertyCard = ({ property }: { property: Property }) => {
    const cover = property.images?.find(i => i.is_cover) || property.images?.[0];
    return (
      <Link to={`/site/${slug}/imovel/${property.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative overflow-hidden">
            {cover ? <img src={cover.url} alt={property.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">Sem imagem</div>}
            {property.is_featured && <Badge className="absolute top-2 left-2 bg-yellow-500">Destaque</Badge>}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold line-clamp-1">{property.title}</h3>
            {property.neighborhood && <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{property.neighborhood}, {property.city}</p>}
            <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
              {property.bedrooms! > 0 && <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{property.bedrooms}</span>}
              {property.bathrooms! > 0 && <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.bathrooms}</span>}
              {property.parking_spots! > 0 && <span className="flex items-center gap-1"><Car className="h-4 w-4" />{property.parking_spots}</span>}
              {property.area_total! > 0 && <span className="flex items-center gap-1"><Maximize2 className="h-4 w-4" />{property.area_total}m²</span>}
            </div>
            <p className="text-xl font-bold mt-3" style={{ color: settings.primary_color }}>{formatPrice(property.price)}{property.transaction_type === 'aluguel' && <span className="text-sm font-normal">/mês</span>}</p>
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
          <h1 className="text-xl font-bold" style={{ color: settings.primary_color }}>{settings.site_name}</h1>
          <div className="flex gap-4 items-center">
            {settings.phone && <a href={`tel:${settings.phone}`} className="text-sm hidden sm:flex items-center gap-1"><Phone className="h-4 w-4" />{settings.phone}</a>}
            {settings.whatsapp && <Button size="sm" style={{ backgroundColor: settings.primary_color }} asChild><a href={`https://wa.me/${settings.whatsapp}`} target="_blank">WhatsApp</a></Button>}
          </div>
        </div>
      </header>

      {/* Hero & Search */}
      <section className="py-12" style={{ backgroundColor: settings.primary_color + '10' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Encontre seu imóvel ideal</h2>
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por título, bairro ou cidade..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
              </SelectContent>
            </Select>
            <Select value={transactionFilter} onValueChange={setTransactionFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Transação" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
                <SelectItem value="aluguel">Aluguel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

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
      <footer className="border-t py-8" style={{ backgroundColor: settings.secondary_color + '10' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="font-semibold">{settings.site_name}</p>
          {settings.address && <p className="text-sm text-muted-foreground mt-1">{settings.address}</p>}
          <div className="flex justify-center gap-4 mt-4">
            {settings.facebook_url && <a href={settings.facebook_url} target="_blank"><Facebook className="h-5 w-5" /></a>}
            {settings.instagram_url && <a href={settings.instagram_url} target="_blank"><Instagram className="h-5 w-5" /></a>}
            {settings.youtube_url && <a href={settings.youtube_url} target="_blank"><Youtube className="h-5 w-5" /></a>}
          </div>
          {settings.email && <p className="text-sm text-muted-foreground mt-4"><Mail className="h-4 w-4 inline mr-1" />{settings.email}</p>}
        </div>
      </footer>
    </div>
  );
}

import { Property } from '@/hooks/useProperties';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useCrmMode } from '@/contexts/CrmModeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bed, 
  Bath, 
  Car, 
  MapPin,
  Maximize2,
  Eye,
  Pencil,
  Trash2,
  Star,
  Anchor,
  Navigation,
  Key,
  Rss,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface PropertyCardProps {
  property: Property;
  isSelected?: boolean;
  onToggleSelect?: (property: Property, checked: boolean) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  onView?: (property: Property) => void;
}

const statusColors: Record<Property['status'], string> = {
  disponivel: 'bg-green-500/10 text-green-600 border-green-500/20',
  vendido: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  alugado: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  reservado: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  inativo: 'bg-muted text-muted-foreground border-muted',
};

const statusLabels: Record<Property['status'], string> = {
  disponivel: 'Disponível',
  vendido: 'Vendido',
  alugado: 'Alugado',
  reservado: 'Reservado',
  inativo: 'Inativo',
};

const transactionLabels: Record<Property['transaction_type'], string> = {
  venda: 'Venda',
  aluguel: 'Aluguel',
  temporada: 'Temporada',
};

export function PropertyCard({ property, isSelected, onToggleSelect, onEdit, onDelete, onView }: PropertyCardProps) {
  const { settings } = useSiteSettings();
  const { mode } = useCrmMode();
  const isBoat = mode === 'barcos';
  const coverImage = property.images?.find(img => img.is_cover) || property.images?.[0];
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const portalUrl = settings?.slug && property.is_published
    ? `${window.location.origin}/${settings.slug}/${isBoat ? 'barco' : 'imovel'}/${property.id}`
    : null;
  return (
    <Card 
      className={cn(
        "overflow-hidden group hover:shadow-lg transition-all duration-300 relative",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        {onToggleSelect && (
          <div className="absolute top-2 left-2 z-20">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={(checked) => onToggleSelect(property, checked as boolean)}
              className="bg-white/90 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>
        )}
        
        {coverImage ? (
          <img 
            src={coverImage.url} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Sem imagem</span>
          </div>
        )}
        
        <div className="absolute top-2 left-10 flex gap-2 z-10">
          <Badge className={cn('border', statusColors[property.status])}>
            {statusLabels[property.status]}
          </Badge>
          <Badge variant="secondary">
            {transactionLabels[property.transaction_type]}
          </Badge>
        </div>
        
        <div className="absolute bottom-2 left-2 flex gap-2 z-10 flex-col items-start">
          {!property.is_published && (
            <Badge variant="destructive">Não publicado</Badge>
          )}
          {property.export_to_portals && property.is_published && property.status === 'disponivel' && (
            <Badge className="bg-blue-500 hover:bg-blue-600 border-none text-white shadow-sm flex items-center gap-1 text-[10px] py-0">
              <Rss className="h-3 w-3" />
              Nos Portais
            </Badge>
          )}
        </div>
        
        {property.is_featured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-yellow-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Destaque
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
          {property.neighborhood && property.city && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {property.neighborhood}, {property.city}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms !== null && property.bedrooms > 0 && (
            <span className="flex items-center gap-1" title={isBoat ? "Cabines" : "Quartos"}>
              {isBoat ? <Anchor className="h-4 w-4" /> : <Bed className="h-4 w-4" />}
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms !== null && property.bathrooms > 0 && (
            <span className="flex items-center gap-1" title="Banheiros">
              <Bath className="h-4 w-4" />
              {property.bathrooms}
            </span>
          )}
          {property.parking_spots !== null && property.parking_spots > 0 && (
            <span className="flex items-center gap-1" title={isBoat ? "Motores" : "Vagas"}>
              {isBoat ? <Key className="h-4 w-4" /> : <Car className="h-4 w-4" />}
              {property.parking_spots}
            </span>
          )}
          {property.area_total !== null && property.area_total > 0 && (
            <span className="flex items-center gap-1" title={isBoat ? "Pés" : "Área Total"}>
              {isBoat ? <Navigation className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {property.area_total}{isBoat ? ' pés' : 'm²'}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xl font-bold text-primary">
            {formatPrice(property.price)}
            {property.transaction_type === 'aluguel' && <span className="text-sm font-normal">/mês</span>}
          </span>

          <div className="flex gap-1">
            {portalUrl && (
              <Button variant="ghost" size="icon" asChild title="Ver no Portal">
                <a href={portalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {onView && (
              <Button variant="ghost" size="icon" onClick={() => onView(property)}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(property)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(property)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

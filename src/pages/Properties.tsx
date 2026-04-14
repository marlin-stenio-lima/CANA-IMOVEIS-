import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties, Property, PropertyFormData } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Loader2, Building2, Rss, Trash2, X, CheckSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Properties() {
  const navigate = useNavigate();
  const { 
    properties, 
    isLoading, 
    createProperty, 
    updateProperty, 
    deleteProperty,
    uploadImage,
    deleteImage,
    isCreating,
    isUpdating
  } = useProperties();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProperties.length && filteredProperties.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProperties.map(p => p.id)));
    }
  };

  const handleToggleSelect = (property: Property, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(property.id);
    } else {
      newSelected.delete(property.id);
    }
    setSelectedIds(newSelected);
  };

  const handleMassExportToPortals = async (exportStatus: boolean) => {
    const promises = Array.from(selectedIds).map(id => updateProperty({ id, data: { export_to_portals: exportStatus } }));
    await Promise.all(promises);
    setSelectedIds(new Set());
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.property_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateProperty = async (data: PropertyFormData) => {
    const newProperty = await createProperty(data);
    setIsFormOpen(false);
    if (newProperty) {
      setEditingProperty(newProperty as Property);
    }
  };

  const handleUpdateProperty = async (data: PropertyFormData) => {
    if (!editingProperty) return;
    await updateProperty({ id: editingProperty.id, data });
  };

  const handleDeleteProperty = async () => {
    if (!deletingProperty) return;
    await deleteProperty(deletingProperty.id);
    setDeletingProperty(null);
  };

  const handleUploadImage = async (file: File, isCover: boolean) => {
    if (!editingProperty) return;
    await uploadImage({ propertyId: editingProperty.id, file, isCover });
  };

  const handleDeleteImage = async (imageId: string) => {
    await deleteImage(imageId);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Imóveis
          </h1>
          <p className="text-muted-foreground">
            {properties.length} imóveis cadastrados
          </p>
        </div>
        
        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-2 bg-primary/10 p-2 border border-primary/20 rounded-lg animate-fade-in">
            <span className="text-sm font-semibold text-primary px-2">
              {selectedIds.size} selecionados
            </span>
            <Button size="sm" variant="default" onClick={() => handleMassExportToPortals(true)} className="gap-2">
              <Rss className="h-4 w-4" /> Enviar p/ Portais
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleMassExportToPortals(false)} className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
              <X className="h-4 w-4" /> Tirar de Portais
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 ml-1" onClick={() => setSelectedIds(new Set())}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleSelectAll} title="Selecionar Todos">
              <CheckSquare className="h-4 w-4 mr-2" />
              Selecionar
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Imóvel
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar imóveis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="disponivel">Disponível</SelectItem>
            <SelectItem value="vendido">Vendido</SelectItem>
            <SelectItem value="alugado">Alugado</SelectItem>
            <SelectItem value="reservado">Reservado</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="apartamento">Apartamento</SelectItem>
            <SelectItem value="casa">Casa</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
            <SelectItem value="terreno">Terreno</SelectItem>
            <SelectItem value="rural">Rural</SelectItem>
            <SelectItem value="cobertura">Cobertura</SelectItem>
            <SelectItem value="kitnet">Kitnet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Nenhum imóvel encontrado</h3>
          <p className="text-muted-foreground">
            {properties.length === 0
              ? 'Cadastre seu primeiro imóvel para começar'
              : 'Tente ajustar os filtros de busca'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedIds.has(property.id)}
              onToggleSelect={handleToggleSelect}
              onEdit={(p) => setEditingProperty(p)}
              onDelete={(p) => setDeletingProperty(p)}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Imóvel</DialogTitle>
          </DialogHeader>
          <PropertyForm
            onSubmit={handleCreateProperty}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingProperty} onOpenChange={(open) => !open && setEditingProperty(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Imóvel</DialogTitle>
          </DialogHeader>
          {editingProperty && (
            <PropertyForm
              property={editingProperty}
              onSubmit={handleUpdateProperty}
              onCancel={() => setEditingProperty(null)}
              onUploadImage={handleUploadImage}
              onDeleteImage={handleDeleteImage}
              isSubmitting={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProperty} onOpenChange={(open) => !open && setDeletingProperty(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Imóvel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deletingProperty?.title}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProperty} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

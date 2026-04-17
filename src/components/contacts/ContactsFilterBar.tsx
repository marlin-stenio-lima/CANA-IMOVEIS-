import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Search, Columns3, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface ContactsFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  sources: string[];
  owners: any[];
  properties: any[];
}

export default function ContactsFilterBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filters,
  onFilterChange,
  sources,
  owners,
  properties,
}: ContactsFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 800);
    return () => clearTimeout(timer);
  }, [localSearch]);
  
  return (
    <div className="flex flex-col gap-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar Contatos (Nome, Email, Telefone)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filters.source} onValueChange={(v) => onFilterChange("source", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Origens</SelectItem>
            {sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.ownerId} onValueChange={(v) => onFilterChange("ownerId", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {owners.map(o => (
              <SelectItem key={o.id} value={o.id}>{o.full_name || "Usuário"}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.propertyId} onValueChange={(v) => onFilterChange("propertyId", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Imóvel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {properties.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Mais Recentes</SelectItem>
              <SelectItem value="created_asc">Mais Antigos</SelectItem>
              <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Nome</DropdownMenuItem>
            <DropdownMenuItem>Telefone</DropdownMenuItem>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Origem</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

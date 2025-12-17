import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Columns3 } from "lucide-react";

interface ContactsFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function ContactsFilterBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: ContactsFilterBarProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Button variant="outline" className="gap-2">
        <Filter className="h-4 w-4" />
        Filtros avançados
      </Button>
      
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Ordem" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Nome A-Z</SelectItem>
          <SelectItem value="name-desc">Nome Z-A</SelectItem>
          <SelectItem value="created-desc">Mais recentes</SelectItem>
          <SelectItem value="created-asc">Mais antigos</SelectItem>
          <SelectItem value="activity-desc">Última atividade</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar Contatos"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex-1" />
      
      <Button variant="outline" className="gap-2">
        <Columns3 className="h-4 w-4" />
        Gerir colunas
      </Button>
    </div>
  );
}

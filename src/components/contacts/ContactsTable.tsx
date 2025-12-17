import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  lastActivity: string | null;
  tags: string[];
  source: string;
}

interface ContactsTableProps {
  contacts: Contact[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

const tagColors: Record<string, string> = {
  "meta": "bg-orange-100 text-orange-700 border-orange-200",
  "liderar ativo": "bg-green-100 text-green-700 border-green-200",
  "comercial": "bg-blue-100 text-blue-700 border-blue-200",
  "suporte": "bg-purple-100 text-purple-700 border-purple-200",
  "vip": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "novo": "bg-primary/10 text-primary border-primary/20",
};

const sourceColors: Record<string, string> = {
  "Facebook": "bg-blue-100 text-blue-700",
  "Instagram": "bg-pink-100 text-pink-700",
  "WhatsApp": "bg-green-100 text-green-700",
  "Site": "bg-slate-100 text-slate-700",
  "Indicação": "bg-orange-100 text-orange-700",
};

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactsTable({ contacts, selectedIds, onSelectionChange }: ContactsTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(contacts.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(i => i !== id));
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1" />
    );
  };

  const isAllSelected = contacts.length > 0 && selectedIds.length === contacts.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < contacts.length;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[40px]">
              <Checkbox
                checked={isAllSelected}
                // @ts-ignore - indeterminate is valid
                indeterminate={isIndeterminate}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Nome de contato
                <SortIcon column="name" />
              </div>
            </TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center">
                Criado
                <SortIcon column="createdAt" />
              </div>
            </TableHead>
            <TableHead>Última Atividade</TableHead>
            <TableHead>Etiquetas</TableHead>
            <TableHead>ORIGEM</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-muted/30">
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(contact.id)}
                  onCheckedChange={(checked) => handleSelectOne(contact.id, !!checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAvatarColor(contact.name)}`}>
                    {getInitials(contact.name)}
                  </div>
                  <span className="font-medium">{contact.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {contact.phone}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {contact.email}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTime(contact.createdAt)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTime(contact.lastActivity)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 flex-wrap">
                  {contact.tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`text-xs px-2 py-0.5 font-normal ${tagColors[tag.toLowerCase()] || "bg-muted text-muted-foreground"}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      +{contact.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded ${sourceColors[contact.source] || "bg-muted text-muted-foreground"}`}>
                  {contact.source}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Ver histórico</DropdownMenuItem>
                    <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

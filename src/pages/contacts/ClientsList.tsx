import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, MoreHorizontal, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const clients = [
  { id: 1, name: "João Silva", email: "joao@techcorp.com", phone: "(11) 99999-0001", totalPurchases: 15000, lastPurchase: "2024-01-15", status: "Ativo" },
  { id: 2, name: "Maria Santos", email: "maria@inovacao.com", phone: "(11) 99999-0002", totalPurchases: 28000, lastPurchase: "2024-01-10", status: "Ativo" },
  { id: 3, name: "Pedro Oliveira", email: "pedro@digital.com", phone: "(11) 99999-0003", totalPurchases: 5000, lastPurchase: "2023-12-20", status: "Inativo" },
  { id: 4, name: "Ana Costa", email: "ana@startup.io", phone: "(11) 99999-0004", totalPurchases: 42000, lastPurchase: "2024-01-18", status: "VIP" },
  { id: 5, name: "Carlos Lima", email: "carlos@enterprise.com", phone: "(11) 99999-0005", totalPurchases: 8500, lastPurchase: "2024-01-12", status: "Ativo" },
];

export default function ClientsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "VIP": return "default";
      case "Ativo": return "secondary";
      case "Inativo": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Total Compras</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {client.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {client.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(client.totalPurchases)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(client.lastPurchase).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
        </CardContent>
      </Card>
    </div>
  );
}

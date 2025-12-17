import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, ListPlus } from "lucide-react";
import ContactsTable from "@/components/contacts/ContactsTable";
import ContactsFilterBar from "@/components/contacts/ContactsFilterBar";
import ContactsPagination from "@/components/contacts/ContactsPagination";

// Mock data
const allContacts = [
  { id: 1, name: "Teixeira", phone: "(85) 99793-1778", email: "ekim_tex@hotmail.com", createdAt: "2025-12-16T21:32:00", lastActivity: null, tags: ["meta", "liderar ativo"], source: "Facebook" },
  { id: 2, name: "Guilherme", phone: "(85) 98888-9999", email: "gui.souza@gmail.com", createdAt: "2025-12-16T21:30:00", lastActivity: "2025-12-16T22:00:00", tags: ["comercial"], source: "Instagram" },
  { id: 3, name: "Talisson Lima", phone: "(85) 98705-6969", email: "talisson@email.com", createdAt: "2025-12-16T21:22:00", lastActivity: null, tags: ["meta", "vip"], source: "WhatsApp" },
  { id: 4, name: "Rafaela Castro", phone: "(11) 99999-0001", email: "rafaela@empresa.com", createdAt: "2025-12-16T18:45:00", lastActivity: "2025-12-17T10:30:00", tags: ["suporte", "vip"], source: "Site" },
  { id: 5, name: "João Silva", phone: "(11) 99999-0002", email: "joao.silva@gmail.com", createdAt: "2025-12-15T14:30:00", lastActivity: "2025-12-16T16:20:00", tags: ["comercial", "meta", "novo"], source: "Facebook" },
  { id: 6, name: "Maria Santos", phone: "(21) 98765-4321", email: "maria.santos@outlook.com", createdAt: "2025-12-15T10:00:00", lastActivity: null, tags: ["liderar ativo"], source: "Instagram" },
  { id: 7, name: "Pedro Oliveira", phone: "(31) 99876-5432", email: "pedro.oliveira@empresa.com.br", createdAt: "2025-12-14T09:15:00", lastActivity: "2025-12-15T11:45:00", tags: ["vip"], source: "Indicação" },
  { id: 8, name: "Ana Costa", phone: "(41) 98765-1234", email: "ana.costa@gmail.com", createdAt: "2025-12-14T08:00:00", lastActivity: "2025-12-16T14:00:00", tags: ["comercial", "suporte"], source: "WhatsApp" },
  { id: 9, name: "Carlos Lima", phone: "(51) 99999-8888", email: "carlos.lima@hotmail.com", createdAt: "2025-12-13T16:30:00", lastActivity: null, tags: ["meta"], source: "Site" },
  { id: 10, name: "Fernanda Souza", phone: "(61) 98888-7777", email: "fernanda.souza@gmail.com", createdAt: "2025-12-13T14:20:00", lastActivity: "2025-12-14T09:00:00", tags: ["liderar ativo", "novo"], source: "Facebook" },
  { id: 11, name: "Lucas Mendes", phone: "(71) 97777-6666", email: "lucas.mendes@empresa.com", createdAt: "2025-12-12T11:00:00", lastActivity: "2025-12-13T17:30:00", tags: ["vip", "comercial"], source: "Instagram" },
  { id: 12, name: "Juliana Alves", phone: "(81) 96666-5555", email: "juliana.alves@outlook.com", createdAt: "2025-12-12T09:45:00", lastActivity: null, tags: ["suporte"], source: "WhatsApp" },
];

type TabType = "todos" | "lista";

export default function Contacts() {
  const [activeTab, setActiveTab] = useState<TabType>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created-desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredContacts = useMemo(() => {
    let result = allContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
    );

    // Sort
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "created-asc":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "created-desc":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "activity-desc":
        result.sort((a, b) => {
          if (!a.lastActivity) return 1;
          if (!b.lastActivity) return -1;
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        });
        break;
    }

    return result;
  }, [searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Contatos</h1>
          <span className="text-muted-foreground">· {filteredContacts.length} Contatos</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Importar
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Contato
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b">
        <button
          onClick={() => setActiveTab("todos")}
          className={`flex items-center gap-2 px-1 py-2 border-b-2 transition-colors text-sm ${
            activeTab === "todos"
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveTab("lista")}
          className={`flex items-center gap-2 px-1 py-2 border-b-2 transition-colors text-sm ${
            activeTab === "lista"
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListPlus className="h-4 w-4" />
          lista inteligente
        </button>
      </div>

      {/* Filter Bar */}
      <ContactsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Table */}
      <ContactsTable
        contacts={paginatedContacts}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Pagination */}
      <ContactsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

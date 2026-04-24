import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, ListPlus, Trash2 } from "lucide-react";
import ContactsTable from "@/components/contacts/ContactsTable";
import ContactsFilterBar from "@/components/contacts/ContactsFilterBar";
import ContactsPagination from "@/components/contacts/ContactsPagination";
import CreateContactSheet from "@/components/contacts/CreateContactSheet";
import ImportContactsWizard from "@/components/contacts/ImportContactsWizard";
import ContactDetailsModal from "@/components/contacts/ContactDetailsModal";
import { useContacts } from "@/hooks/useContacts";
import { useTeam } from "@/hooks/useTeam";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

type TabType = "todos" | "lista";


export default function Contacts() {
  const [activeTab, setActiveTab] = useState<TabType>("todos");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created-desc");
  const [source, setSource] = useState("all");
  const [ownerId, setOwnerId] = useState("all");
  const [propertyId, setPropertyId] = useState("all");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Data Fetching
  const { mode } = useCrmMode();
  const { contacts, isLoading, error, createContact, deleteContact } = useContacts({
    searchTerm,
    source,
    ownerId,
    propertyId,
    businessType: mode,
  });

  const { profile } = useAuth();
  const { data: members } = useTeam();
  const { properties } = useProperties();

  // Debug Raw Count
  const [rawCount, setRawCount] = useState<number | null>(null);
  const [rawError, setRawError] = useState<any>(null);

  // Selected Contact for Detail View
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const selectedContact = contacts.find(c => c.id === selectedContactId) || null;

  useEffect(() => {
    const checkCount = async () => {
      // Try to fetch just ID to check visibility
      const { count, error } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
      setRawCount(count);
      setRawError(error);
    };
    checkCount();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-bold mb-2">Erro ao carregar contatos</h3>
        <p>{(error as any).message || "Verifique sua conexão ou permissões."}</p>
        {rawError && (
          <p className="text-xs mt-4 text-gray-500 font-mono">
            Detalhe Técnico (Supabase): {JSON.stringify(rawError)}
          </p>
        )}
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>Carregando contatos...</p>
        </div>
      </div>
    );
  }

  // Derived Data
  const filteredContacts = contacts; // Filtering is done in hook now

  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleDelete = async (ids: string[]) => {
    if (confirm(`Tem certeza que deseja excluir ${ids.length} contatos?`)) {
      await deleteContact.mutateAsync(ids);
      setSelectedIds([]);
    }
  };

  const handleExport = () => {
    const selectedIdsToExport = selectedIds.length > 0 ? selectedIds : [];

    const dataToExport =
      selectedIds.length > 0
        ? contacts.filter((c) => selectedIds.includes(c.id))
        : contacts;

    if (dataToExport.length === 0) {
      toast.error("Nenhum contato encontrado para exportação.");
      return;
    }

    const headers = ["Nome", "Telefone", "Email", "Origem", "Criado em", "Etiquetas", "Observações"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((c) =>
        [
          `"${c.name}"`,
          `"${c.phone || ""}"`,
          `"${c.email || ""}"`,
          `"${c.source || ""}"`,
          `"${c.created_at || ""}"`,
          `"${c.tags ? c.tags.join("; ") : ""}"`,
          `"${c.notes ? c.notes.replace(/"/g, '""') : ""}"`, // Escape quotes
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "contatos.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast.success(`${dataToExport.length} contatos exportados com sucesso!`);
  };



  // Extract unique sources for filter dropdown
  const sources = Array.from(new Set(contacts.map(c => c.source).filter(Boolean))) as string[];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Contatos</h1>
          <span className="text-muted-foreground">· {contacts.length} Contatos</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedIds)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir ({selectedIds.length})
            </Button>
          )}

          <Button variant="outline" className="gap-2" onClick={() => setIsImportOpen(true)}>
            <Download className="h-4 w-4 rotate-180" />
            Importar
          </Button>

          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>

          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b">
        <button
          onClick={() => setActiveTab("todos")}
          className={`flex items-center gap-2 px-1 py-2 border-b-2 transition-colors text-sm ${activeTab === "todos"
            ? "border-primary text-primary font-medium"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveTab("lista")}
          className={`flex items-center gap-2 px-1 py-2 border-b-2 transition-colors text-sm ${activeTab === "lista"
            ? "border-primary text-primary font-medium"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          <ListPlus className="h-4 w-4" />
          lista inteligente
        </button>
      </div>

      {/* Selection Banner */}
      {selectedIds.length > 0 && selectedIds.length < contacts.length &&
        paginatedContacts.every(c => selectedIds.includes(c.id)) && (
          <div className="bg-muted/50 p-2 text-center text-sm text-foreground border rounded-md">
            {selectedIds.length} contatos nesta página selecionados.{" "}
            <button
              className="text-primary font-medium hover:underline"
              onClick={() => setSelectedIds(contacts.map(c => c.id))}
            >
              Selecionar todos os {contacts.length} contatos
            </button>
          </div>
        )}

      {/* Show when ALL are selected */}
      {selectedIds.length === contacts.length && contacts.length > pageSize && (
        <div className="bg-muted/50 p-2 text-center text-sm text-foreground border rounded-md">
          Todos os {contacts.length} contatos selecionados.{" "}
          <button
            className="text-primary font-medium hover:underline"
            onClick={() => setSelectedIds([])}
          >
            Limpar seleção
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <ContactsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}

        filters={{ source, ownerId, propertyId }}
        onFilterChange={(key, value) => {
          if (key === "source") setSource(value);
          if (key === "ownerId") setOwnerId(value);
          if (key === "propertyId") setPropertyId(value);
        }}

        sources={sources}
        owners={members || []}
        properties={properties || []}
      />

      {/* Table */}
      <ContactsTable
        contacts={paginatedContacts}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onDelete={handleDelete}
        onRowClick={(contact) => setSelectedContactId(contact.id)}
      />

      {/* Pagination */}
      <ContactsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <CreateContactSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <ImportContactsWizard open={isImportOpen} onOpenChange={setIsImportOpen} />

      {/* Detail Modal */}
      <ContactDetailsModal
        contact={selectedContact}
        open={!!selectedContactId}
        onOpenChange={(open) => !open && setSelectedContactId(null)}
      />
    </div>
  );
}

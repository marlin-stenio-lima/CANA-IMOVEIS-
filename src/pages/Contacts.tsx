import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, UserCheck } from "lucide-react";
import LeadsList from "./contacts/LeadsList";
import ClientsList from "./contacts/ClientsList";

type TabType = "leads" | "clients";

export default function Contacts() {
  const [activeTab, setActiveTab] = useState<TabType>("leads");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contatos</h1>
          <p className="text-muted-foreground">Gerencie seus leads e clientes</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {activeTab === "leads" ? "Novo Lead" : "Novo Cliente"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "leads"
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Leads
        </button>
        <button
          onClick={() => setActiveTab("clients")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "clients"
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Clientes
        </button>
      </div>

      {/* Content */}
      {activeTab === "leads" ? <LeadsList /> : <ClientsList />}
    </div>
  );
}

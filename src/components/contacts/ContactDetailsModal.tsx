import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Activity, CheckSquare, Calendar, ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ContactChat from "./ContactChat";
import ContactInfo from "./ContactInfo";

interface Contact {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    source: string | null;
    tags: string[] | null;
    created_at?: string;
    assigned_to?: string;
    followers?: string[];
}

interface ContactDetailsModalProps {
    contact: Contact | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ContactDetailsModal({ contact, open, onOpenChange }: ContactDetailsModalProps) {
    const [activeTab, setActiveTab] = useState("activity");
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

    if (!contact) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] h-[95vh] p-0 gap-0 overflow-hidden bg-[#f3f4f6]" showCloseButton={false}>
                {/* Header */}
                <div className="bg-white border-b px-6 py-3 flex items-center justify-between shrink-0 h-16">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">{contact.name}</h2>
                        <div className="flex gap-2 text-sm text-gray-500">
                            {contact.phone && <span>{contact.phone}</span>}
                            {contact.email && <span className="border-l pl-2">{contact.email}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                            title={isRightPanelOpen ? "Recolher painel lateral" : "Expandir painel lateral"}
                        >
                            {isRightPanelOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-12 h-[calc(95vh-64px)]">
                    {/* Left Column: Contact Info (25%) */}
                    <div className="col-span-3 bg-white border-r overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
                        <ContactInfo contact={contact} />
                    </div>

                    {/* Center Column: Chat (Dynamic) */}
                    <div className={`${isRightPanelOpen ? 'col-span-6' : 'col-span-9'} bg-[#efe7dd] flex flex-col border-r relative overflow-hidden transition-all duration-300`}>
                        <ContactChat
                            contactId={contact.id}
                            contactName={contact.name}
                            contactPhone={contact.phone}
                            contactProfilePic={undefined}
                        />
                    </div>

                    {/* Right Column: Activity/Tasks (Dynamic) */}
                    {isRightPanelOpen && (
                        <div className="col-span-3 bg-white overflow-hidden flex flex-col border-l">
                            <Tabs defaultValue="activity" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                                <div className="px-4 pt-4 border-b bg-white">
                                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6">
                                        <TabsTrigger
                                            value="activity"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 text-gray-500 data-[state=active]:text-primary"
                                        >
                                            Atividade
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="tasks"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 text-gray-500 data-[state=active]:text-primary"
                                        >
                                            Tarefas
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="appointments"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-2 text-gray-500 data-[state=active]:text-primary"
                                        >
                                            Agenda
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 scrollbar-thin scrollbar-thumb-gray-200">
                                    <TabsContent value="activity" className="mt-0 space-y-4">
                                        <div className="flex gap-3">
                                            <div className="mt-1 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                <Activity className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Contato Criado</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {contact.created_at ? format(new Date(contact.created_at), "dd 'de' MMM, HH:mm", { locale: ptBR }) : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="tasks" className="mt-0">
                                        <div className="flex flex-col gap-4">
                                            <Button className="w-full justify-center gap-2" variant="outline" onClick={() => console.log("Nova Tarefa")}>
                                                <Plus className="h-4 w-4" /> Nova Tarefa
                                            </Button>
                                            <div className="text-center py-8 text-muted-foreground text-sm">
                                                <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                Nenhuma tarefa pendente
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="appointments" className="mt-0 space-y-4">
                                        <Button className="w-full justify-center gap-2" variant="outline">
                                            <Plus className="h-4 w-4" /> Novo Agendamento
                                        </Button>
                                        <div className="text-center py-8 text-muted-foreground text-sm">
                                            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            Nenhum agendamento futuro
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

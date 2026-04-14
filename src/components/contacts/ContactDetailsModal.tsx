import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Activity, CheckSquare, Calendar, ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import { format, isAfter, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import ContactChat from "./ContactChat";
import ContactInfo from "./ContactInfo";
import ContactDetailsTabs from "./ContactDetailsTabs";
import { Loader2, CheckCircle2, Clock } from "lucide-react";

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
    const [viewMode, setViewMode] = useState<'details' | 'chat'>('details');

    if (!contact) return null;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Alta": return "bg-red-100 text-red-700 border-red-200";
            case "Média": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Baixa": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] h-[95vh] p-0 gap-0 overflow-hidden bg-[#f3f4f6]" showCloseButton={false}>
                <div className="bg-white/80 dark:bg-[#202c33]/80 backdrop-blur-md border-b px-8 py-4 flex items-center justify-between shrink-0 h-20 shadow-sm z-30">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{contact.name}</h2>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest h-6 px-3">
                                    Lead
                                </Badge>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Ativo</span>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Informações do Cliente</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg border">
                            <Button
                                variant={viewMode === 'details' ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode('details')}
                                className={viewMode === 'details' ? "bg-white shadow-sm text-indigo-600 font-bold" : "text-slate-500"}
                            >
                                Informações
                            </Button>
                            <Button
                                variant={viewMode === 'chat' ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode('chat')}
                                className={viewMode === 'chat' ? "bg-white shadow-sm text-emerald-600 font-bold" : "text-slate-500"}
                            >
                                WhatsApp Central
                            </Button>
                        </div>
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

                    {/* Right Column: Dynamic Panel (75%) */}
                    <div className="col-span-9 bg-white overflow-hidden flex flex-col border-l relative shadow-inner">
                        {viewMode === 'details' ? (
                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-100 p-0">
                                <ContactDetailsTabs contact={contact} />
                            </div>
                        ) : (
                            <div className="flex-1 bg-[#efe7dd] flex flex-col relative overflow-hidden">
                                <ContactChat
                                    contactId={contact.id}
                                    contactName={contact.name}
                                    contactPhone={contact.phone}
                                    contactProfilePic={undefined}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


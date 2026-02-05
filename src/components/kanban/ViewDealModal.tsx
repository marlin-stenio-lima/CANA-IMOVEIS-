import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DealWithContact } from "@/hooks/useDeals";
import { Calendar, User, Phone, Mail, Building2, Tag, FileText, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useQueryClient } from "@tanstack/react-query";

interface ViewDealModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deal: DealWithContact | null;
    onEdit: () => void;
}

export function ViewDealModal({ open, onOpenChange, deal, onEdit }: ViewDealModalProps) {
    const queryClient = useQueryClient();
    if (!deal) return null;

    const formatDate = (date: string | null) => {
        if (!date) return "-";
        return format(new Date(date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
    };

    const formatCurrency = (value: number | null) => {
        if (!value) return "R$ 0,00";
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex justify-between items-start pr-8">
                        <div>
                            <DialogTitle className="text-xl">{deal.title}</DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{deal.stage_id ? "Em andamento" : "Sem estágio"}</Badge>
                                {/* Ideally fetch stage name from props or store */}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">



                    {/* Left Column: Deal Details */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Detalhes do Negócio
                            </h3>
                            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-sm text-muted-foreground">Valor</span>
                                    <span className="font-bold text-lg text-primary">{formatCurrency(deal.value)}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm text-muted-foreground">Criado em</span>
                                    <span className="text-sm font-medium">{formatDate(deal.created_at)}</span>
                                </div>
                                {deal.closed_at && (
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-sm text-muted-foreground">Fechado em</span>
                                        <span className="text-sm font-medium">{formatDate(deal.closed_at)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm text-muted-foreground">Pipeline/Estágio</span>
                                    {/* Ideally showing pipeline name too */}
                                    <Badge variant="secondary" className="text-xs">
                                        {deal.stage_id ? "Em andamento" : "Sem estágio"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Descrição
                            </h3>
                            <div className="bg-muted/30 p-4 rounded-lg border min-h-[100px] text-sm whitespace-pre-wrap text-foreground/90">
                                {deal.description || <span className="text-muted-foreground italic">Nenhuma descrição informada.</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact & Metadata */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" /> Contato Principal
                            </h3>
                            <div className="bg-card border p-4 rounded-lg space-y-4 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                                        {deal.contacts?.name?.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg leading-tight">{deal.contacts?.name || "Sem nome"}</p>
                                        <p className="text-xs text-muted-foreground font-mono mt-1">ID: {deal.contacts?.id?.slice(0, 8)}</p>
                                        {deal.contacts?.status && (
                                            <Badge variant={deal.contacts.status === 'active' ? "default" : "secondary"} className="mt-1 h-5 text-[10px]">
                                                {deal.contacts.status.toUpperCase()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-3 border-t">
                                    <div className="flex items-center gap-3 text-sm group">
                                        <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-medium">{deal.contacts?.phone || "-"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm group">
                                        <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-medium truncate">{deal.contacts?.email || "-"}</span>
                                    </div>
                                    {deal.contacts?.document && (
                                        <div className="flex items-center gap-3 text-sm group">
                                            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="font-medium">{deal.contacts.document}</span>
                                        </div>
                                    )}
                                    {deal.contacts?.source && (
                                        <div className="flex items-center gap-3 text-sm group">
                                            <Building2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="capitalize">{deal.contacts.source}</span>
                                        </div>
                                    )}
                                </div>

                                {deal.contacts?.tags && deal.contacts.tags.length > 0 && (
                                    <div className="pt-3 border-t">
                                        <p className="text-xs text-muted-foreground mb-2">Tags</p>
                                        <div className="flex flex-wrap gap-1">
                                            {deal.contacts.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {deal.contacts?.notes && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Notas do Contato
                                </h3>
                                <div className="bg-muted/30 p-3 rounded-lg border text-xs text-muted-foreground italic">
                                    {deal.contacts.notes}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full shadow-sm gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Agendar Reunião
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader className="pb-4 border-b">
                                        <DialogTitle className="flex items-center gap-2 text-xl">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Calendar className="w-5 h-5 text-primary" />
                                            </div>
                                            Novo Agendamento
                                        </DialogTitle>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            Preencha os dados abaixo para agendar um compromisso.
                                        </div>
                                    </DialogHeader>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        const title = formData.get('title') as string;
                                        const date = formData.get('date') as string;
                                        const time = formData.get('time') as string;

                                        if (!title || !date || !time) return;

                                        try {
                                            const startDateTime = `${date}T${time}:00`;
                                            const endDate = new Date(new Date(startDateTime).getTime() + 60 * 60000); // 1 hour default

                                            const { error } = await supabase.from('appointments').insert({
                                                company_id: deal.company_id,
                                                contact_id: deal.contact_id,
                                                title: title,
                                                start_time: startDateTime,
                                                end_time: endDate.toISOString(),
                                                status: 'scheduled'
                                            });

                                            if (error) throw error;
                                            toast.success("Agendamento criado com sucesso!");

                                            // Invalidate deals query to update the card immediately
                                            queryClient.invalidateQueries({ queryKey: ['deals'] });

                                            // Close dialog (optional, but good UX)
                                            // setIsDialogOpen(false); // We'd need state for this, but for now just refresh is enough
                                        } catch (error: any) {
                                            toast.error("Erro ao criar agendamento: " + error.message);
                                        }
                                    }} className="space-y-6 py-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="appt-title" className="text-sm font-medium text-muted-foreground">O que será discutido?</Label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="appt-title" name="title" className="pl-9 h-11" placeholder="Ex: Reunião de Apresentação" required />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="appt-date" className="text-sm font-medium text-muted-foreground">Data</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input id="appt-date" name="date" type="date" required className="pl-9 h-11 block w-full" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="appt-time" className="text-sm font-medium text-muted-foreground">Horário</Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input id="appt-time" name="time" type="time" required className="pl-9 h-11 block w-full" />
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter className="pt-2">
                                            <Button type="submit" className="w-full h-11 text-base shadow-md font-semibold">
                                                Confirmar Agendamento
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Button onClick={onEdit} className="w-full shadow-sm">
                                Editar Negócio
                            </Button>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

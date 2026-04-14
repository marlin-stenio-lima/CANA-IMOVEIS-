import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from "@/integrations/supabase/types";
import { useTeam } from "@/hooks/useTeam";
import { useProperties } from "@/hooks/useProperties";
import { User, Phone, Mail, Building2, Wallet, Target, Trash2 } from "lucide-react";
import { DealWithContact } from "@/hooks/useDeals";
import { supabase } from "@/integrations/supabase/client";
import { PropertySelect } from "@/components/common/PropertySelect";
import { toast } from "sonner";


type PipelineStage = Tables<"pipeline_stages">;

interface EditDealModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deal: DealWithContact | null;
    stages: PipelineStage[];
    onSave: (dealId: string, data: any) => Promise<void>;
    onDelete: (dealId: string) => Promise<void>;
    isLoading?: boolean;
}

export function EditDealModal({
    open,
    onOpenChange,
    deal,
    stages,
    onSave,
    onDelete,
    isLoading,
}: EditDealModalProps) {
    // Form State
    const [dealTitle, setDealTitle] = useState("");
    const [value, setValue] = useState("");
    const [stageId, setStageId] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [propertyId, setPropertyId] = useState("");
    const [description, setDescription] = useState("");

    // Contact State
    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");

    const { data: teamMembers = [] } = useTeam();
    const { properties = [] } = useProperties();

    useEffect(() => {
        if (deal && open) {
            setDealTitle(deal.title || "");
            setValue(deal.value?.toString() || "");
            setStageId(deal.stage_id || "");
            setOwnerId(deal.assigned_to || "");
            setPropertyId(deal.contacts?.interest_property_id || "none");
            setDescription(deal.description || "");

            // Initialize Contact Data
            setContactName(deal.contacts?.name || "");
            setContactPhone(deal.contacts?.phone || "");
            setContactEmail(deal.contacts?.email || "");
        }
    }, [deal, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deal) return;

        try {
            // 1. Update Contact Information if changed
            if (deal.contact_id) {
                const { error: contactError } = await supabase
                    .from('contacts')
                    .update({
                        name: contactName,
                        phone: contactPhone,
                        email: contactEmail || null
                    })
                    .eq('id', deal.contact_id);

                if (contactError) {
                    console.error("Erro ao atualizar contato:", contactError);
                    toast.error(`Erro ao atualizar contato: ${contactError.message}`);
                    throw contactError; // Stop execution
                }
            }

            // 2. Prepare Deal Updates
            const updates = {
                title: dealTitle,
                value: value ? parseFloat(value) : null,
                stage_id: stageId,
                assigned_to: ownerId || null,
                description: description,
            };

            // 3. Save Deal
            await onSave(deal.id, updates);
            toast.success("Negócio e contato atualizados!");
            onOpenChange(false);
        } catch (error: any) {
            console.error("Erro geral ao salvar:", error);
            // If the error wasn't already toasted (e.g. from onSave)
            if (!error?.message?.includes("contato")) {
                toast.error(`Erro ao salvar: ${error.message || "Erro desconhecido"}`);
            }
        }
    };

    if (!deal) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Negócio</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Contact Info Editing Section */}
                    <div className="space-y-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" /> Informações do Lead
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactName">Nome do Lead</Label>
                                <Input
                                    id="contactName"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    placeholder="Nome do cliente"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">Telefone / WhatsApp</Label>
                                <div className="relative">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="contactPhone"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        className="pl-9"
                                        placeholder="(99) 99999-9999"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="contactEmail">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="contactEmail"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        className="pl-9"
                                        placeholder="email@exemplo.com"
                                        type="email"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="h-4 w-4" /> Detalhes da Oportunidade
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">Título do Negócio</Label>
                                <Input
                                    id="title"
                                    value={dealTitle}
                                    onChange={(e) => setDealTitle(e.target.value)}
                                    placeholder="Ex: Compra do Apartamento X"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stage">Estágio</Label>
                                <Select value={stageId} onValueChange={setStageId}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stages.map((stage) => (
                                            <SelectItem key={stage.id} value={stage.id}>
                                                {stage.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="value">Valor (R$)</Label>
                                <div className="relative">
                                    <Wallet className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="value"
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="pl-9"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="owner">Responsável</Label>
                                <Select value={ownerId} onValueChange={setOwnerId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teamMembers.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.full_name || "Membro da Equipe"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="property">Imóvel de Interesse</Label>
                                <PropertySelect 
                                    value={propertyId} 
                                    onValueChange={setPropertyId} 
                                    placeholder="Selecione o imóvel..."
                                />
                            </div>


                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Descrição / Notas</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                />
                            </div>

                        </div>
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between w-full">
                        <Button
                            type="button"
                            variant="destructive"
                            className="gap-2"
                            onClick={() => {
                                if (confirm("Tem certeza que deseja excluir este negócio do pipeline? O contato permanecerá salvo.")) {
                                    onDelete(deal.id);
                                    onOpenChange(false);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            Excluir do Pipeline
                        </Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                Salvar Alterações
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

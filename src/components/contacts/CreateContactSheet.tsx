
import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useContacts } from "@/hooks/useContacts";
import { useTeam } from "@/hooks/useTeam";
import { useProperties } from "@/hooks/useProperties";
import { TagInput } from "@/components/ui/tag-input";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { PropertySelect } from "@/components/common/PropertySelect";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

interface CreateContactSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const initialFormData = {
    name: "",
    phone: "",
    email: "",
    document: "",
    birth_date: "",
    source: "",
    ownerId: "",
    propertyId: "none",
    tags: [] as string[],
    notes: "",
    // Address fields for custom_fields
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    postal_code: "",
};


export default function CreateContactSheet({
    open,
    onOpenChange,
}: CreateContactSheetProps) {
    const { createContact, contacts } = useContacts({});
    const { data: teamMembers = [] } = useTeam();
    const { properties = [] } = useProperties();
    const { mode } = useCrmMode();

    // Deduce available tags
    const availableTags = Array.from(new Set(contacts?.flatMap(c => c.tags || []) || [])).sort();
    const { profile } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [ddi, setDdi] = useState("55");

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Reset form when opening
    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
            setDdi("55"); // Reset DDI when opening
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Nome é obrigatório"); // Updated error message
            return;
        }

        if (!profile?.company_id) {
            toast.error("Erro: Identificação da empresa não encontrada. Recarregue a página.");
            return;
        }

        // Normalize phone: combine DDI + number
        let finalPhone = null;
        if (formData.phone) {
            const rawPhone = formData.phone.replace(/\D/g, "");
            if (rawPhone) {
                finalPhone = ddi + rawPhone;
            }
        }

        setIsLoading(true);
        try {
            // Find the responsible name
            const selectedOwner = teamMembers.find(m => m.id === formData.ownerId);
            const ownerName = selectedOwner ? (selectedOwner.full_name || selectedOwner.email) : (formData.ownerId === "00000000-0000-0000-0000-000000000000" ? "Tatiana" : null);

            await createContact.mutateAsync({
                name: formData.name,
                phone: finalPhone,
                email: formData.email || null,
                document: formData.document || null,
                source: formData.source || null,
                assigned_to: formData.ownerId === "unassigned" ? null : formData.ownerId || null,
                interest_property_id: formData.propertyId === "none" ? null : formData.propertyId || null,
                tags: formData.tags.length > 0 ? formData.tags : null,
                notes: formData.notes + (ownerName ? `\n[Responsável: ${ownerName}]` : ""),
                company_id: profile.company_id,
                business_type: mode,
                custom_fields: {
                    birth_date: formData.birth_date || null,
                    address: {
                        street: formData.street || null,
                        number: formData.number || null,
                        neighborhood: formData.neighborhood || null,
                        city: formData.city || null,
                        state: formData.state || null,
                        postal_code: formData.postal_code || null,
                    }
                }
            });


            toast.success("Contato criado com sucesso!");
            onOpenChange(false); // Keep existing onOpenChange
            // The form reset is handled by the useEffect when onOpenChange(false) closes the sheet and then it reopens.
            // No need for explicit setFormData and setDdi here.
        } catch (error: any) { // Added type for error
            console.error(error);
            toast.error(error.message || "Erro ao criar contato. Verifique se já existe."); // Updated error message
        } finally {
            setIsLoading(false);
        }
    };

    const sources = [
        "Indicação",
        "Instagram",
        "Facebook",
        "Google",
        "Portal Imobiliário",
        "Site",
        "Outro",
    ];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md w-full">
                <SheetHeader>
                    <SheetTitle>Novo Contato</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: João Silva"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                        <div className="flex gap-2">
                            <Select value={ddi} onValueChange={setDdi}>
                                <SelectTrigger className="w-[110px]">
                                    <SelectValue placeholder="+55" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="55">🇧🇷 +55</SelectItem>
                                    <SelectItem value="1">🇺🇸 +1</SelectItem>
                                    <SelectItem value="351">🇵🇹 +351</SelectItem>
                                    <SelectItem value="54">🇦🇷 +54</SelectItem>
                                    <SelectItem value="598">🇺🇾 +598</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                placeholder="DD + Número (ex: 11999990000)"
                                className="flex-1"
                                type="tel"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="joao@email.com"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="document">CPF / CNPJ</Label>
                            <Input
                                id="document"
                                placeholder="000.000.000-00"
                                value={formData.document}
                                onChange={(e) => handleChange("document", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birth_date">Data de Nascimento</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => handleChange("birth_date", e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="space-y-2 pt-2 border-t mt-4">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Endereço</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2 space-y-1">
                                <Label htmlFor="street" className="text-xs">Rua</Label>
                                <Input id="street" value={formData.street} onChange={(e) => handleChange("street", e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="number" className="text-xs">Nº</Label>
                                <Input id="number" value={formData.number} onChange={(e) => handleChange("number", e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="neighborhood" className="text-xs">Bairro</Label>
                                <Input id="neighborhood" value={formData.neighborhood} onChange={(e) => handleChange("neighborhood", e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="city" className="text-xs">Cidade</Label>
                                <Input id="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                            </div>
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="source">Origem</Label>
                        <Select
                            value={formData.source}
                            onValueChange={(val) => handleChange("source", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a origem" />
                            </SelectTrigger>
                            <SelectContent>
                                {sources.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="owner">Responsável</Label>
                        <Select
                            value={formData.ownerId}
                            onValueChange={(val) => handleChange("ownerId", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o responsável" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Sem responsável</SelectItem>
                                {teamMembers?.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.full_name || m.email || "Membro"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="property">Imóvel de Interesse</Label>
                        <PropertySelect 
                            value={formData.propertyId}
                            onValueChange={(val) => handleChange("propertyId", val)}
                            placeholder="Selecione o imóvel (opcional)"
                        />
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <TagInput
                            value={formData.tags}
                            onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                            suggestions={availableTags}
                            placeholder="Ex: Cliente VIP, Investidor"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                            id="notes"
                            placeholder="Alguma observação importante..."
                            value={formData.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                        />
                    </div>

                    <SheetFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Contato
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}

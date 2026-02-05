
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
    source: "",
    ownerId: "",
    propertyId: "none",
    tags: [] as string[],
    notes: "",
};

export default function CreateContactSheet({
    open,
    onOpenChange,
}: CreateContactSheetProps) {
    const { createContact, contacts } = useContacts({});
    const { data: teamMembers = [] } = useTeam();
    const { properties = [] } = useProperties();

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
            await createContact.mutateAsync({
                name: formData.name,
                phone: finalPhone,
                email: formData.email || null,
                source: formData.source || null,
                assigned_to: formData.ownerId === "unassigned" ? null : formData.ownerId || null,
                interest_property_id: formData.propertyId === "none" ? null : formData.propertyId || null,
                tags: formData.tags.length > 0 ? formData.tags : null,
                notes: formData.notes || null,
                company_id: profile.company_id,
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
                        <Select
                            value={formData.propertyId}
                            onValueChange={(val) => handleChange("propertyId", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o imóvel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Nenhum</SelectItem>
                                {properties.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.code} - {p.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useContacts } from "@/hooks/useContacts";
import { useTeam } from "@/hooks/useTeam";
import { toast } from "sonner";
import { Pencil, Save, X } from "lucide-react";
import { CreateDealModal, LinkDealData } from "../kanban/CreateDealModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Contact {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    source: string | null;
    tags: string[] | null;
    created_at?: string;
    // Add other potential fields
    company_id?: string;
    assigned_to?: string;
    interest_property_id?: string;
}

interface ContactInfoProps {
    contact: Contact;
}

export default function ContactInfo({ contact }: ContactInfoProps) {
    const { updateContact } = useContacts();
    const { data: teamMembers = [] } = useTeam();
    const { profile } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [isDealModalOpen, setIsDealModalOpen] = useState(false);

    // Initial DDI Extraction
    const initialPhone = contact.phone || "";
    let initialDdi = "55";
    let initialNum = initialPhone;

    if (initialPhone.startsWith("55") && initialPhone.length > 10) {
        initialDdi = "55";
        initialNum = initialPhone.substring(2);
    } else if (initialPhone.startsWith("1")) {
        initialDdi = "1";
        initialNum = initialPhone.substring(1);
    }
    // Add logic for other DDIs if needed, or simple length heuristics

    const [ddi, setDdi] = useState(initialDdi);
    const [formData, setFormData] = useState({
        name: contact.name,
        phone: initialNum,
        email: contact.email || "",
        source: contact.source || "",
        assigned_to: contact.assigned_to || "",
    });

    // Fetch Stages
    const { data: stages = [] } = useQuery({
        queryKey: ['pipeline-stages'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('pipeline_stages')
                .select('*')
                .order('position');
            if (error) throw error;
            return data;
        }
    });

    // Create Deal Mutation
    const createDeal = useMutation({
        mutationFn: async (data: LinkDealData) => {
            console.log("Attempting to create deal with data:", data);
            console.log("Contact ID:", contact.id);

            // Find pipeline_id from stage
            const selectedStage = stages.find(s => s.id === data.stage_id);
            const pipelineId = selectedStage?.pipeline_id;

            const payload = {
                title: data.title,
                value: data.value,
                contact_id: contact.id,
                stage_id: data.stage_id,
                pipeline_id: pipelineId,
                assigned_to: data.ownerId,
                notes: data.description,
                company_id: profile?.company_id || contact.company_id
            };
            console.log("Payload:", payload);

            const { data: newDeal, error } = await supabase
                .from('deals')
                .insert(payload)
                .select()
                .single();

            if (error) throw error;

            return newDeal;
        },
        onSuccess: () => {
            toast.success("Negócio criado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            setIsDealModalOpen(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Erro ao criar negócio.");
        }
    });

    const handleCreateDealSubmit = (data: LinkDealData) => {
        createDeal.mutate(data);
    };

    const handleSave = async () => {
        try {
            let finalPhone = null;
            if (formData.phone) {
                const rawPhone = formData.phone.replace(/\D/g, "");
                if (rawPhone) {
                    finalPhone = ddi + rawPhone;
                }
            }

            await updateContact.mutateAsync({
                id: contact.id,
                name: formData.name,
                phone: finalPhone,
                email: formData.email || null,
                source: formData.source || null,
                assigned_to: formData.assigned_to || null,
            });
            setIsEditing(false);
            toast.success("Contato atualizado!");
        } catch (error) {
            toast.error("Erro ao atualizar contato.");
            console.error(error);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isEditing) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarFallback className="text-2xl">{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave} className="gap-2">
                            <Save className="h-4 w-4" /> Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Telefone</Label>
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
                            <Input value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="flex-1" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Origem</Label>
                        <Select value={formData.source} onValueChange={val => handleChange('source', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                <SelectItem value="Site">Site</SelectItem>
                                <SelectItem value="Indicação">Indicação</SelectItem>
                                <SelectItem value="Importação">Importação</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Responsável</Label>
                        <Select
                            value={formData.assigned_to || "unassigned"}
                            onValueChange={(val) => handleChange("assigned_to", val === "unassigned" ? "" : val)}
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
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center mb-6 relative group">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-2xl">{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">{contact.name}</h3>
                <p className="text-sm text-muted-foreground">Lead</p>

                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsEditing(true)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setIsDealModalOpen(true)}
                >
                    Criar Negócio
                </Button>
                {/* Placeholder for other actions */}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Dados Gerais</h4>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Nome</label>
                    <div className="p-2 bg-gray-50 rounded border text-sm min-h-[38px]">{contact.name}</div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Telefone</label>
                    <div className="p-2 bg-gray-50 rounded border text-sm min-h-[38px]">{contact.phone || "-"}</div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <div className="p-2 bg-gray-50 rounded border text-sm min-h-[38px]">{contact.email || "-"}</div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Origem</label>
                    <div className="p-2 bg-gray-50 rounded border text-sm min-h-[38px]">{contact.source || "-"}</div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Responsável</label>
                    <div className="p-2 bg-gray-50 rounded border text-sm min-h-[38px]">
                        {teamMembers?.find(m => m.id === contact.assigned_to)?.full_name || contact.assigned_to || "-"}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Etiquetas</label>
                    <div className="flex flex-wrap gap-1">
                        {contact.tags?.map(tag => (
                            <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">{tag}</span>
                        ))}
                        {!contact.tags?.length && <span className="text-xs text-muted-foreground">-</span>}
                    </div>
                </div>
            </div>

            <CreateDealModal
                open={isDealModalOpen}
                onOpenChange={setIsDealModalOpen}
                stages={stages}
                onSubmit={handleCreateDealSubmit}
                isLoading={createDeal.isPending}
                defaultContact={contact}
            />
        </div>
    );
}

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from "@/integrations/supabase/types";
import { useTeam } from "@/hooks/useTeam";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/contexts/AuthContext";
import { PropertySelect } from "@/components/common/PropertySelect";
import { User, Phone, Mail, Building2, Wallet, Users, Target } from "lucide-react";


type PipelineStage = Tables<"pipeline_stages">;

export interface LinkDealData {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  source: string;
  ownerId?: string;
  propertyId?: string;
  title: string;
  description?: string;
  value?: number;
  stage_id?: string;
}

interface DefaultContact {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  source?: string | null;
  assigned_to?: string | null;
}

interface CreateDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stages: PipelineStage[];
  initialStageId?: string;
  onSubmit: (data: LinkDealData) => void;
  isLoading?: boolean;
  defaultContact?: DefaultContact;
}

// Common sources
const SOURCES = [
  "Google",
  "Facebook",
  "Instagram",
  "Portal Imobiliário",
  "Indicação",
  "WhatsApp",
  "Outros"
];

export function CreateDealModal({
  open,
  onOpenChange,
  stages,
  initialStageId,
  onSubmit,
  isLoading,
  defaultContact,
}: CreateDealModalProps) {
  // Contact Info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ddi, setDdi] = useState("55");
  const [email, setEmail] = useState("");

  // Deal Info
  const [source, setSource] = useState("");
  const { session } = useAuth();
  const [ownerId, setOwnerId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [value, setValue] = useState("");
  const [stageId, setStageId] = useState(initialStageId || "");
  const [description, setDescription] = useState("");

  const { data: teamMembers = [] } = useTeam();
  const { properties = [] } = useProperties();

  // Initialize with defaultContact if provided
  useEffect(() => {
    if (open && defaultContact) {
      setName(defaultContact.name || "");

      if (defaultContact.phone) {
        // Try to parse DDI
        let initialDdi = "55";
        let initialNum = defaultContact.phone;

        if (defaultContact.phone.startsWith("55") && defaultContact.phone.length > 10) {
          initialDdi = "55";
          initialNum = defaultContact.phone.substring(2);
        } else if (defaultContact.phone.startsWith("1")) {
          initialDdi = "1";
          initialNum = defaultContact.phone.substring(1);
        }

        setDdi(initialDdi);
        setPhone(initialNum);
      } else {
        setPhone("");
      }

      setEmail(defaultContact.email || "");
      setSource(defaultContact.source || "");

      if (defaultContact.assigned_to) {
        setOwnerId(defaultContact.assigned_to);
      }
    } else if (open && !defaultContact) {
      // Reset if no default contact (clean state for new lead)
      // Only if we want to clear when opening "fresh"
      // Logic below handles cleanup on submit, but we might want it on open too
    }
  }, [open, defaultContact]);

  // Set initial stage when stages load or modal opens
  useEffect(() => {
    if (open && stages.length > 0 && !stageId) {
      setStageId(initialStageId || stages[0].id);
    }
  }, [open, stages, initialStageId]);

  // Set default owner to current user IF not already set by defaultContact
  useEffect(() => {
    if (open && session?.user?.id && !ownerId && !defaultContact?.assigned_to) {
      // We need to find the team member that matches the current user
      const currentMember = teamMembers.find(m => m.user_id === session.user.id);
      if (currentMember) {
        setOwnerId(currentMember.id);
      }
    }
  }, [open, session, teamMembers, ownerId, defaultContact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Combine DDI
    let finalPhone = "";
    if (phone.trim()) {
      const raw = phone.replace(/\D/g, "");
      if (raw) finalPhone = ddi + raw;
    }

    onSubmit({
      contactName: name.trim(),
      contactPhone: finalPhone,
      contactEmail: email.trim(),
      source,
      ownerId: ownerId || undefined,
      propertyId: propertyId || undefined,
      title: name.trim(), // Use contact name as deal title
      description: description.trim() || undefined,
      value: value ? parseFloat(value) : undefined,
      stage_id: stageId || undefined,
    });

    // Reset form logic is fine, but maybe we don't need to full reset if we are in "Edit" mode? 
    // For "Create Deal" it usually closes afterwards.

    // Reset form
    if (!defaultContact) {
      setName("");
      setPhone("");
      setEmail("");
      setSource("");
      setOwnerId("");
      setDdi("55");
    }
    setPropertyId("");
    setDescription("");
    setValue("");
    setStageId(initialStageId || stages[0]?.id || "");

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2 text-primary">
              <User className="w-4 h-4" />
              Dados do Contato
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do cliente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
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
                  <div className="relative flex-1">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="pl-9"
                      type="tel"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    className="pl-9"
                    type="email"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Deal Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2 text-primary">
              <Target className="w-4 h-4" />
              Dados da Oportunidade
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Origem do Lead</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Proprietário (Responsável)</Label>
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          {/* Avatar could go here */}
                          {member.full_name || member.job_title || "Usuário"}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Estágio do Funil</Label>
                <Select value={stageId} onValueChange={setStageId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stage.color || "#3B82F6" }}
                          />
                          {stage.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor Estimado (R$)</Label>
                <div className="relative">
                  <Wallet className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="property">Imóvel de Interesse</Label>
                <PropertySelect 
                  value={propertyId} 
                  onValueChange={setPropertyId}
                  placeholder="Selecione um imóvel (opcional)"
                />
              </div>


              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Observações</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Interesses, necessidades e detalhes importantes..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim() || isLoading}>
              Criar Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

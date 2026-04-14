import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calendar } from "lucide-react";
import { addMinutes } from "date-fns";

interface CreateAppointmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contactId?: string;
    contactName?: string;
}

export default function CreateAppointmentModal({ open, onOpenChange, contactId, contactName }: CreateAppointmentModalProps) {
    const { profile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        date: new Date().toISOString().split('T')[0],
        time: "09:00",
        duration: 60, // minutes
    });

    const handleSave = async () => {
        if (!formData.title || !formData.date || !formData.time) {
            toast.error("Preencha título, data e horário");
            return;
        }

        if (!profile?.company_id) {
            toast.error("Empresa não encontrada.");
            return;
        }

        setIsLoading(true);
        try {
            const startDateTime = `${formData.date}T${formData.time}:00`;
            const startDate = new Date(startDateTime);
            const endDate = addMinutes(startDate, formData.duration);

            const { error } = await supabase.from('appointments').insert({
                company_id: profile.company_id,
                assigned_to: profile.id,
                title: formData.title,
                status: 'scheduled',
                start_time: startDateTime,
                end_time: endDate.toISOString(),
                contact_id: contactId,
            });

            if (error) throw error;
            toast.success("Compromisso agendado!");
            onOpenChange(false);
            setFormData({ title: "", date: new Date().toISOString().split('T')[0], time: "09:00", duration: 60 });
        } catch (error) {
            console.error(error);
            toast.error("Erro ao agendar: " + (error as any).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Novo Agendamento
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-2">
                        <p className="text-xs font-semibold text-indigo-700 uppercase">Cliente Selecionado</p>
                        <p className="text-sm font-bold text-slate-800">{contactName || "Contato Externo"}</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Título / Assunto</Label>
                        <Input
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Visita ao Imóvel"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Hora</Label>
                            <Input
                                type="time"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Duração (Minutos)</Label>
                        <Select
                            value={formData.duration.toString()}
                            onValueChange={(val: any) => setFormData({ ...formData, duration: parseInt(val) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Duração" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30 minutos</SelectItem>
                                <SelectItem value="60">1 hora</SelectItem>
                                <SelectItem value="90">1 hora e meia</SelectItem>
                                <SelectItem value="120">2 horas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar Agenda
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

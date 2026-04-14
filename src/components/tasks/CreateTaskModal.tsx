import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks } from "@/hooks/useTasks";
import { useTeam } from "@/hooks/useTeam";
import { useContacts } from "@/hooks/useContacts";
import { toast } from "sonner";
import { Loader2, Search, User as UserIcon, Check, ChevronsUpDown } from "lucide-react";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface CreateTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contactId?: string;
    defaultAssignee?: string;
    taskToEdit?: any;
}

export default function CreateTaskModal({ open, onOpenChange, contactId, defaultAssignee, taskToEdit }: CreateTaskModalProps) {
    const { createTask, updateTask } = useTasks();
    const { mode } = useCrmMode();
    const { data: teamMembers = [] } = useTeam();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        due_date: new Date().toISOString().split('T')[0],
        priority: "medium" as "low" | "medium" | "high",
        assigned_to: defaultAssignee || "",
        related_contact_id: contactId || "",
        send_whatsapp_reminder: false,
        due_time: "09:00",
        reminder_minutes: 30,
    });

    const [openContactSearch, setOpenContactSearch] = useState(false);
    const { contacts = [] } = useContacts();

    useEffect(() => {
        if (open) {
            if (taskToEdit) {
                setFormData({
                    title: taskToEdit.title || "",
                    description: taskToEdit.description || "",
                    due_date: taskToEdit.due_date ? taskToEdit.due_date.split('T')[0] : new Date().toISOString().split('T')[0],
                    priority: taskToEdit.priority || "medium",
                    assigned_to: taskToEdit.assigned_to || defaultAssignee || "",
                    related_contact_id: taskToEdit.related_contact_id || contactId || "",
                    send_whatsapp_reminder: taskToEdit.send_whatsapp_reminder || false,
                    due_time: taskToEdit.due_time || "09:00",
                    reminder_minutes: taskToEdit.reminder_minutes || 30,
                });
            } else {
                setFormData({
                    title: "",
                    description: "",
                    due_date: new Date().toISOString().split('T')[0],
                    priority: "medium",
                    assigned_to: defaultAssignee || "",
                    related_contact_id: contactId || "",
                    send_whatsapp_reminder: false,
                    due_time: "09:00",
                    reminder_minutes: 30,
                });
            }
        }
    }, [open, taskToEdit, defaultAssignee, contactId]);

    const handleSave = async () => {
        if (!formData.title) {
            toast.error("O título é obrigatório");
            return;
        }

        setIsLoading(true);
        try {
            if (taskToEdit) {
                await updateTask.mutateAsync({
                    ...taskToEdit,
                    id: taskToEdit.id,
                    title: formData.title,
                    description: formData.description,
                    due_date: formData.due_date,
                    priority: formData.priority,
                    assigned_to: formData.assigned_to || null,
                    related_contact_id: formData.related_contact_id || null,
                    send_whatsapp_reminder: formData.send_whatsapp_reminder,
                    due_time: formData.due_time,
                    reminder_minutes: formData.reminder_minutes,
                    business_type: mode as any,
                });
                toast.success("Tarefa atualizada com sucesso");
            } else {
                await createTask.mutateAsync({
                    title: formData.title,
                    description: formData.description,
                    due_date: formData.due_date,
                    priority: formData.priority,
                    assigned_to: formData.assigned_to || null,
                    related_contact_id: formData.related_contact_id || null,
                    send_whatsapp_reminder: formData.send_whatsapp_reminder,
                    due_time: formData.due_time,
                    reminder_minutes: formData.reminder_minutes,
                    status: 'pending',
                    company_id: "", // Will be overwritten in hook
                    business_type: mode as any,
                });
                toast.success("Tarefa criada com sucesso");
            }

            onOpenChange(false);
            setFormData({
                title: "",
                description: "",
                due_date: new Date().toISOString().split('T')[0],
                priority: "medium",
                assigned_to: defaultAssignee || "",
                related_contact_id: contactId || "",
                send_whatsapp_reminder: false,
                due_time: "09:00",
                reminder_minutes: 30,
            });
        } catch (error) {

            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto scrollbar-thin">
                <DialogHeader>
                    <DialogTitle>{taskToEdit ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 flex-1 overflow-y-auto pr-2">
                    <div className="space-y-2">
                        <Label>Assunto (O que precisa ser feito?)</Label>
                        <Input
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Ligar para confirmar visita"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Detalhes</Label>
                        <Textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalhes sobre a tarefa..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Prazo</Label>
                            <Input
                                type="date"
                                value={formData.due_date}
                                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                             <Label>Horário</Label>
                             <Input
                                type="time"
                                value={formData.due_time}
                                onChange={e => setFormData({ ...formData, due_time: e.target.value })}
                             />
                        </div>
                        <div className="space-y-2">
                            <Label>Prioridade</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(val: any) => setFormData({ ...formData, priority: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Prioridade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baixa</SelectItem>
                                    <SelectItem value="medium">Média</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Responsável</Label>
                        <Select
                            value={formData.assigned_to || "unassigned"}
                            onValueChange={(val) => setFormData({ ...formData, assigned_to: val === "unassigned" ? "" : val })}
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
                                {/* Tatiana Bypass */}
                                <SelectItem value="00000000-0000-0000-0000-000000000000">Tatiana (IA)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-muted-foreground" />
                            Vincular a um Lead (Opcional)
                        </Label>
                        <Popover open={openContactSearch} onOpenChange={setOpenContactSearch}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openContactSearch}
                                    className="w-full justify-between font-normal bg-white"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <UserIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                        {formData.related_contact_id
                                            ? contacts.find((c) => c.id === formData.related_contact_id)?.name || "Contato sem nome"
                                            : "Nenhum vínculo"}
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[425px] p-0" align="start">
                                <Command className="w-full">
                                    <CommandInput placeholder="Procurar lead pelo nome..." className="h-9" />
                                    <CommandList className="max-h-[300px]">
                                        <CommandEmpty>Nenhum lead encontrado.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value="none"
                                                onSelect={() => {
                                                    setFormData({ ...formData, related_contact_id: "" });
                                                    setOpenContactSearch(false);
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="w-4 h-4" />
                                                Nenhum vínculo
                                            </CommandItem>
                                            {contacts.map((c) => (
                                                <CommandItem
                                                    key={c.id}
                                                    value={`${c.name || ""} ${c.phone || ""} ${c.email || ""}`.toLowerCase().trim()}
                                                    onSelect={() => {
                                                        setFormData({ ...formData, related_contact_id: c.id });
                                                        setOpenContactSearch(false);
                                                    }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Check
                                                        className={cn(
                                                            "h-4 w-4",
                                                            formData.related_contact_id === c.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{c.name || "Contato sem nome"}</span>
                                                        {c.phone && <span className="text-[10px] text-muted-foreground">{c.phone}</span>}
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">Lembrete no WhatsApp</Label>
                            <p className="text-xs text-muted-foreground">
                                Receber notificação no WhatsApp principal do corretor.
                            </p>
                        </div>
                        <Switch
                            checked={formData.send_whatsapp_reminder}
                            onCheckedChange={(checked) => setFormData({ ...formData, send_whatsapp_reminder: checked })}
                        />
                    </div>

                    {formData.send_whatsapp_reminder && (
                         <div className="flex items-center justify-between p-3 border rounded-lg bg-indigo-50/30">
                            <Label className="text-xs font-semibold text-indigo-700">Lembrar quanto tempo antes?</Label>
                            <Select 
                                value={formData.reminder_minutes.toString()}
                                onValueChange={(val) => setFormData({ ...formData, reminder_minutes: parseInt(val) })}
                            >
                                <SelectTrigger className="w-32 h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 minutos</SelectItem>
                                    <SelectItem value="30">30 minutos</SelectItem>
                                    <SelectItem value="60">1 hora</SelectItem>
                                    <SelectItem value="1440">1 dia</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : taskToEdit ? "Salvar Alterações" : "Criar Tarefa"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

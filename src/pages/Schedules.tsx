import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Pencil,
  Bell,
  Trash2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
  isToday,
  eachDayOfInterval,
  addWeeks,
  subWeeks
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { ContactSelect } from "@/components/appointments/ContactSelect";
import { useAppointments } from "@/hooks/useAppointments";
import { useCrmMode } from "@/contexts/CrmModeContext";

type ViewType = "day" | "week" | "month";

interface Appointment {
  id: string;
  title: string;
  contact_id: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  contact?: { name: string; phone: string };
  assigned_to?: string;
}

export default function Schedules() {
  const { profile } = useAuth(); // Get current user profile
  const { mode } = useCrmMode();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");
  const [searchTerm, setSearchTerm] = useState("");
  const { appointments, isLoading } = useAppointments();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [newAppt, setNewAppt] = useState({ 
    title: "", 
    date: format(new Date(), "yyyy-MM-dd"), 
    startTime: "09:00", 
    endTime: "10:00", 
    contactId: "",
    notes: "",
    send_whatsapp_reminder: false
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (editingAppt) {
      const start = parseISO(editingAppt.start_time);
      const end = parseISO(editingAppt.end_time);
      setNewAppt({
        title: editingAppt.title,
        date: format(start, "yyyy-MM-dd"),
        startTime: format(start, "HH:mm"),
        endTime: format(end, "HH:mm"),
        contactId: editingAppt.contact_id,
        notes: editingAppt.notes || "",
        send_whatsapp_reminder: false // Default to false or fetch from DB if column exists
      });
      setIsDialogOpen(true);
    }
  }, [editingAppt]);

  const resetForm = () => {
    setNewAppt({ 
      title: "", 
      date: format(new Date(), "yyyy-MM-dd"), 
      startTime: "09:00", 
      endTime: "10:00", 
      contactId: "",
      notes: "",
      send_whatsapp_reminder: false
    });
    setEditingAppt(null);
  };

  // Calendar Logic (Restored)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const filteredAppointments = useMemo(() => {
    return (appointments || []).filter(apt => {
      const clientName = apt.contact?.name || "";
      const clientPhone = apt.contact?.phone || "";
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          clientName.toLowerCase().includes(search) ||
          clientPhone.includes(search) ||
          apt.title.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [searchTerm, appointments]);

  const navigateDate = (direction: number) => {
    if (view === 'week') {
      setCurrentDate(prev => direction > 0 ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addDays(prev, direction));
    }
  };

  const getAppointmentsForSlot = (day: Date, hour: number) => {
    return (appointments || []).filter(apt => {
      // Use parseISO to properly handle UTC/Local variations from DB
      const aptDate = parseISO(apt.start_time);
      const isSame = isSameDay(aptDate, day);
      const aptHour = aptDate.getHours();
      return isSame && aptHour === hour;
    });
  };

  const handleCreateAppointment = async () => {
    if (!newAppt.title) {
      toast.error("Por favor, insira um assunto");
      return;
    }
    if (!newAppt.contactId) {
      toast.error("Por favor, selecione um cliente");
      return;
    }
    if (!newAppt.date) {
      toast.error("Por favor, selecione uma data");
      return;
    }

    if (!profile?.company_id) {
      toast.error("Erro: Empresa não identificada.");
      return;
    }

    setIsCreating(true);
    try {
      // Create local date objects for start and end
      const [year, month, day] = newAppt.date.split('-').map(Number);
      const [startH, startM] = newAppt.startTime.split(':').map(Number);
      const [endH, endM] = newAppt.endTime.split(':').map(Number);
      
      const startDate = new Date(year, month - 1, day, startH, startM);
      const endDate = new Date(year, month - 1, day, endH, endM);

      if (endDate <= startDate) {
        toast.error("O horário de término deve ser após o início");
        setIsCreating(false);
        return;
      }

      if (editingAppt) {
        const { error } = await supabase.from('appointments').update({
          title: newAppt.title,
          notes: newAppt.notes,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          contact_id: newAppt.contactId,
          business_type: mode as any,
        }).eq('id', editingAppt.id);
        if (error) throw error;
        toast.success("Agendamento atualizado!");
      } else {
        const { error } = await supabase.from('appointments').insert({
          company_id: profile.company_id,
          assigned_to: profile.id,
          title: newAppt.title,
          notes: newAppt.notes,
          status: 'scheduled',
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          contact_id: newAppt.contactId,
          business_type: mode as any,
          // Note: added reminder flag logic would go here if column exists in DB
        });
        if (error) throw error;
        toast.success("Agendamento criado!");
      }

      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar agendamento: " + (error as any).message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;
    
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      
      toast.success("Agendamento excluído!");
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir agendamento.");
    }
  };




  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 to 20:00

  const statusColors = {
    scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col gap-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-muted rounded-lg p-0.5 border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background rounded-md"
              onClick={() => navigateDate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="h-8 px-4 font-semibold text-sm hover:bg-background rounded-md"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background rounded-md"
              onClick={() => navigateDate(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 capitalize leading-none">
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {view === 'week' ? `Semana de ${format(weekStart, "dd")} a ${format(weekEnd, "dd 'de' MMM", { locale: ptBR })}` : format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar agendamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm" onClick={() => resetForm()}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingAppt ? "Editar Compromisso" : "Novo Compromisso"}</DialogTitle>
              </DialogHeader>              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Título do Evento</Label>
                  <Input
                    value={newAppt.title}
                    onChange={e => setNewAppt({ ...newAppt, title: e.target.value })}
                    placeholder="Ex: Visita ao Imóvel X"
                    className="text-lg font-semibold"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <ContactSelect
                    value={newAppt.contactId}
                    onChange={(val) => setNewAppt({ ...newAppt, contactId: val })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5" /> Data
                    </Label>
                    <Input
                      type="date"
                      value={newAppt.date}
                      onChange={e => setNewAppt({ ...newAppt, date: e.target.value })}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" /> Início
                    </Label>
                    <Input
                      type="time"
                      value={newAppt.startTime}
                      onChange={e => setNewAppt({ ...newAppt, startTime: e.target.value })}
                    />
                  </div>
                  <div className="mt-8 text-slate-400">—</div>
                  <div className="flex-1 space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" /> Término
                    </Label>
                    <Input
                      type="time"
                      value={newAppt.endTime}
                      onChange={e => setNewAppt({ ...newAppt, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição / Notas</Label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-slate-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Adicione detalhes, observações ou o endereço..."
                    value={newAppt.notes}
                    onChange={e => setNewAppt({ ...newAppt, notes: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-indigo-500" />
                      Lembrete WhatsApp
                    </Label>
                    <p className="text-[10px] text-slate-500">Enviar aviso para lead/corretor</p>
                  </div>
                  <Switch 
                    checked={newAppt.send_whatsapp_reminder}
                    onCheckedChange={(checked) => setNewAppt({ ...newAppt, send_whatsapp_reminder: checked })}
                  />
                </div>
              </div>
              <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
                {editingAppt ? (
                  <Button 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold"
                    onClick={() => handleDeleteAppointment(editingAppt.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                ) : <div />}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateAppointment} disabled={isCreating}>
                    {isCreating ? "Salvando..." : (editingAppt ? "Atualizar" : "Agendar")}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar View */}
      <Card className="flex-1 overflow-hidden border shadow-sm">
        <div className="flex h-full flex-col">
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b bg-muted/30">
            <div className="w-16 border-r p-2 text-center text-xs font-medium text-muted-foreground sticky left-0 bg-muted/30 z-10">
              GMT-3
            </div>
            {weekDays.map((day, i) => {
              const active = isToday(day);
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center p-2 text-center border-r last:border-r-0 transition-colors ${active ? "bg-indigo-50/50" : ""}`}
                >
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${active ? "text-indigo-600" : "text-slate-400"}`}>
                    {format(day, "EEEE", { locale: ptBR }).split('-')[0]}
                  </span>
                  <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" : "text-slate-700 hover:bg-slate-100"}`}>
                    {format(day, "dd")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-8 relative min-w-[800px]">
              {/* Background Lines */}
              <div className="col-span-8 absolute inset-0 z-0 pointer-events-none">
                {hours.map((_, i) => (
                  <div key={i} className="h-20 border-b w-full" />
                ))}
              </div>

              {/* Time Column */}
              <div className="w-16 border-r bg-background sticky left-0 z-10">
                {hours.map((hour) => (
                  <div key={hour} className="h-20 border-b text-xs text-muted-foreground p-2 text-right">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="relative border-r last:border-r-0 min-h-[50px]">
                  {hours.map((hour) => {
                    const slots = getAppointmentsForSlot(day, hour);
                    return (
                      <div key={hour} className="h-20 relative group">
                        {/* Hover effect for adding (future feature) */}
                        <div className="absolute inset-0 hover:bg-muted/10 transition-colors pointer-events-none" />

                        {slots.map((apt, aptIndex) => {
                          const start = parseISO(apt.start_time);
                          const end = parseISO(apt.end_time);
                          const minutesFromStart = start.getMinutes();
                          const topOffset = (minutesFromStart / 60) * 100;
                          
                          // Calculate duration in minutes
                          const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
                          // 20rem (80px) is 60 mins, so height is (duration / 60) * 100%
                          const heightFactor = (durationInMinutes / 60) * 100;
                          
                          return (
                            <div
                              key={apt.id}
                              className={`absolute inset-x-1 p-2 rounded-lg border text-[11px] shadow-sm cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all z-10 overflow-hidden ${statusColors[apt.status] || "bg-slate-100"}`}
                              style={{
                                top: `${topOffset}%`,
                                height: `${Math.max(heightFactor, 25)}%`, // At least 25% of the slot
                                width: slots.length > 1 ? `${95 / slots.length}%` : "95%",
                                left: `${(aptIndex * 95) / slots.length}%`,
                                zIndex: 10 + aptIndex,
                                borderLeftWidth: '4px'
                              }}
                            >
                              <div className="font-bold text-slate-900 truncate flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className={apt.status === 'scheduled' ? 'text-indigo-600' : 'text-emerald-600'}>●</span>
                                  {apt.title}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingAppt(apt);
                                  }}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                              {apt.contact && (
                                <div className="flex items-center gap-1 mt-1 text-slate-600 font-medium truncate">
                                  <User className="h-3 w-3 opacity-70" />
                                  {apt.contact.name}
                                </div>
                              )}
                              <div className="flex items-center gap-1 mt-1 text-slate-500 font-bold truncate bg-white/40 w-fit px-1.5 rounded">
                                <Clock className="h-3 w-3" />
                                {format(parseISO(apt.start_time), "HH:mm")} - {format(parseISO(apt.end_time), "HH:mm")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

import { useState, useMemo, useEffect } from "react";
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
  Phone
} from "lucide-react";
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
import { ContactSelect } from "@/components/appointments/ContactSelect"; // Import at top (correct)

type ViewType = "day" | "week" | "month";

interface Appointment {
  id: string;
  title: string;
  contact_id: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "completed" | "cancelled";
  description?: string;
  contact?: { name: string; phone: string };
}

export default function Schedules() {
  const { profile } = useAuth(); // Get current user profile
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Appointment State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ title: "", date: "", time: "09:00", duration: 60, contactName: "" });
  const [isCreating, setIsCreating] = useState(false);

  // Calendar Logic
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start for fuller view, or 1 for Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Fetch Appointments
  const fetchAppointments = async () => {
    setIsLoading(true);
    // Fetch range based on current view window (optimization for later)
    const { data, error } = await supabase
      .from('appointments')
      .select('*, contact:contacts(name, phone)')
      .order('start_time', { ascending: true });

    if (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Erro ao carregar agenda");
    } else {
      setAppointments(data as any);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel('public:appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchAppointments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
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
    return filteredAppointments.filter(apt => {
      const aptDate = parseISO(apt.start_time);
      const aptHour = aptDate.getHours();
      return isSameDay(aptDate, day) && aptHour === hour;
    });
  };

  const handleCreateAppointment = async () => {
    if (!newAppt.title || !newAppt.date || !newAppt.contactId) {
      toast.error("Preencha título, data e selecione um cliente");
      return;
    }

    if (!profile?.company_id) {
      toast.error("Erro: Empresa não identificada.");
      return;
    }

    setIsCreating(true);
    try {
      const startDateTime = `${newAppt.date}T${newAppt.time}:00`;
      const startDate = new Date(startDateTime);
      const endDate = new Date(startDate.getTime() + newAppt.duration * 60000);

      const { error } = await supabase.from('appointments').insert({
        company_id: profile.company_id,
        user_id: profile.id,
        title: newAppt.title,
        status: 'scheduled',
        start_time: startDateTime,
        end_time: endDate.toISOString(),
        contact_id: newAppt.contactId,
      });

      if (error) throw error;
      toast.success("Agendamento criado!");
      setIsDialogOpen(false);
      setNewAppt({ title: "", date: "", time: "09:00", duration: 60, contactId: "" });
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar agendamento: " + (error as any).message);
    } finally {
      setIsCreating(false);
    }
  };




  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 to 20:00

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
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
            <h2 className="text-xl font-bold text-foreground capitalize">
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <p className="text-xs text-muted-foreground capitalize">
              {view === 'week' ? `Semana de ${format(weekStart, "dd")} a ${format(weekEnd, "dd MMM")}` : format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Compromisso</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Assunto</Label>
                  <Input
                    value={newAppt.title}
                    onChange={e => setNewAppt({ ...newAppt, title: e.target.value })}
                    placeholder="Ex: Visita ao Imóvel X"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cliente (Obrigatório)</Label>
                  <ContactSelect
                    value={newAppt.contactId}
                    onChange={(val) => setNewAppt({ ...newAppt, contactId: val })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={newAppt.date}
                      onChange={e => setNewAppt({ ...newAppt, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora Início</Label>
                    <Input
                      type="time"
                      value={newAppt.time}
                      onChange={e => setNewAppt({ ...newAppt, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateAppointment} disabled={isCreating}>
                  {isCreating ? "Salvando..." : "Agendar"}
                </Button>
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
                  className={`flex flex-col items-center justify-center p-2 text-center border-r last:border-r-0 transition-colors ${active ? "bg-primary/5" : ""}`}
                >
                  <span className={`text-xs uppercase font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {format(day, "EEE", { locale: ptBR })}
                  </span>
                  <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground"}`}>
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

                        {slots.map((apt, aptIndex) => (
                          <div
                            key={apt.id}
                            className={`absolute inset-x-1 p-2 rounded-md border text-xs shadow-sm cursor-pointer hover:shadow-md transition-all z-10 ${statusColors[apt.status] || "bg-gray-100"}`}
                            style={{
                              top: "2px",
                              height: "calc(100% - 4px)",
                              left: `${aptIndex * 4}px`, // Simple Stacking
                              zIndex: 10 + aptIndex
                            }}
                          >
                            <div className="font-semibold truncate flex items-center gap-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${apt.status === 'confirmed' ? 'bg-green-500' : 'bg-blue-500'}`} />
                              {apt.title}
                            </div>
                            {apt.contact && (
                              <div className="flex items-center gap-1 mt-1 text-muted-foreground truncate">
                                <User className="h-3 w-3" />
                                {apt.contact.name}
                              </div>
                            )}
                            <div className="flex items-center gap-1 mt-0.5 text-muted-foreground truncate font-mono">
                              <Clock className="h-3 w-3" />
                              {format(parseISO(apt.start_time), "HH:mm")} - {format(parseISO(apt.end_time), "HH:mm")}
                            </div>
                          </div>
                        ))}
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

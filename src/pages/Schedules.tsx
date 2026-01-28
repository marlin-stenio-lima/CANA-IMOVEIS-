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
  Filter,
  Save,
  Bookmark,
  Users,
  Briefcase,
  Info,
  Loader2
} from "lucide-react";
import { addDays, format, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type ViewType = "day" | "week";

interface Appointment {
  id: string;
  title: string;
  contact_id: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "completed" | "cancelled";
  contact?: { name: string };
}

export default function Schedules() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Appointment State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ title: "", date: "", time: "09:00", duration: 60 });
  const [isCreating, setIsCreating] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Fetch Appointments
  const fetchAppointments = async () => {
    setIsLoading(true);
    // Naive fetch all for MVP (should filter by date range)
    const { data, error } = await supabase
      .from('appointments')
      .select('*, contact:contacts(name)')
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
      const clientName = apt.contact?.name || "Desconhecido";
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !clientName.toLowerCase().includes(search) &&
          !apt.title.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, appointments]);

  const appointmentCount = filteredAppointments.filter(apt =>
    weekDays.some(day => isSameDay(day, parseISO(apt.start_time)))
  ).length;

  const navigateWeek = (direction: number) => {
    setCurrentDate(prev => addDays(prev, direction * 7));
  };

  const getAppointmentsForSlot = (day: Date, hourString: string) => {
    // hourString is "09:00"
    return filteredAppointments.filter(apt => {
      const aptDate = parseISO(apt.start_time);
      const aptHour = format(aptDate, "HH:00");
      return isSameDay(aptDate, day) && aptHour === hourString;
    });
  };

  const handleCreateAppointment = async () => {
    if (!newAppt.title || !newAppt.date) {
      toast.error("Preencha título e data");
      return;
    }

    setIsCreating(true);
    try {
      const startDateTime = `${newAppt.date}T${newAppt.time}:00`;
      // Simple end time calc
      const startDate = new Date(startDateTime);
      const endDate = new Date(startDate.getTime() + newAppt.duration * 60000);

      // Needs a company_id - hardcoded fallback or fetch context
      // This is a UI simplified creation
      const { error } = await supabase.from('appointments').insert({
        company_id: '00000000-0000-0000-0000-000000000000', // Warning: Needs real ID or trigger
        // In real app, we get from Auth context
        title: newAppt.title,
        start_time: startDateTime,
        end_time: endDate.toISOString(),
        status: 'scheduled'
      });

      if (error) throw error;
      toast.success("Agendamento criado!");
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar agendamento (verifique company_id)");
    } finally {
      setIsCreating(false);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
  const statusConfig = {
    scheduled: { label: "Agendado", color: "bg-blue-500" },
    completed: { label: "Realizado", color: "bg-green-500" },
    cancelled: { label: "Cancelado", color: "bg-orange-500" },
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-medium">Agenda</CardTitle>
                <p className="text-xs text-muted-foreground">Gerencie seus compromissos</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Compromisso</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label>Título</Label>
                    <Input
                      value={newAppt.title}
                      onChange={e => setNewAppt({ ...newAppt, title: e.target.value })}
                      placeholder="Ex: Reunião inicial"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={newAppt.date}
                        onChange={e => setNewAppt({ ...newAppt, date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Hora</Label>
                      <Input
                        type="time"
                        value={newAppt.time}
                        onChange={e => setNewAppt({ ...newAppt, time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateAppointment} disabled={isCreating}>
                    {isCreating ? "Salvando..." : "Agendar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden bg-background">
            {/* Header */}
            <div className="grid grid-cols-8 bg-muted/30 border-b">
              <div className="p-3 text-center border-r"><span className="text-xs">Horário</span></div>
              {weekDays.map((day, index) => (
                <div key={index} className="p-3 text-center border-r last:border-r-0">
                  <p className="font-medium text-sm">{format(day, "EEE", { locale: ptBR })}</p>
                  <p className="text-xs text-muted-foreground">{format(day, "dd/MM")}</p>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="max-h-[500px] overflow-y-auto">
              {hours.slice(6, 20).map((hour) => ( // Showing 06:00 to 20:00 for compactness
                <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 min-h-[50px]">
                  <div className="p-2 text-center border-r bg-muted/10 text-xs text-muted-foreground flex items-center justify-center">
                    {hour}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const slots = getAppointmentsForSlot(day, hour);
                    return (
                      <div key={dayIndex} className="p-1 border-r last:border-r-0 relative group hover:bg-muted/5">
                        {slots.map(apt => (
                          <div key={apt.id} className={`p-1 rounded text-[10px] text-white overflow-hidden mb-1 ${statusConfig[apt.status]?.color || 'bg-gray-500'}`}>
                            <p className="font-bold truncate">{apt.title}</p>
                            <p className="truncate">{apt.contact?.name}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

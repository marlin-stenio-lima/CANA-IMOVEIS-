import { useState, useMemo } from "react";
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
} from "lucide-react";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

type ViewType = "day" | "week";

interface Appointment {
  id: number;
  title: string;
  client: string;
  collaborator: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
}

const statusConfig = {
  scheduled: { label: "Agendado", color: "bg-blue-500" },
  completed: { label: "Realizado", color: "bg-green-500" },
  cancelled: { label: "Cancelado", color: "bg-orange-500" },
};

const mockAppointments: Appointment[] = [
  {
    id: 1,
    title: "Consulta inicial",
    client: "João Silva",
    collaborator: "Dr. Carlos",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    status: "scheduled",
  },
  {
    id: 2,
    title: "Retorno",
    client: "Maria Santos",
    collaborator: "Dra. Ana",
    date: addDays(new Date(), 1),
    startTime: "14:00",
    endTime: "15:00",
    status: "completed",
  },
];

const hours = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, "0")}:00`
);

export default function Schedules() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollaborator, setSelectedCollaborator] = useState("all");

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(apt => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !apt.client.toLowerCase().includes(search) &&
          !apt.collaborator.toLowerCase().includes(search) &&
          !apt.title.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm]);

  const appointmentCount = filteredAppointments.filter(apt => 
    weekDays.some(day => isSameDay(day, apt.date))
  ).length;

  const navigateWeek = (direction: number) => {
    setCurrentDate(prev => addDays(prev, direction * 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToThisWeek = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForSlot = (day: Date, hour: string) => {
    return filteredAppointments.filter(apt => 
      isSameDay(apt.date, day) && apt.startTime === hour
    );
  };

  const formatWeekRange = () => {
    const start = format(weekDays[0], "dd/MM");
    const end = format(weekDays[6], "dd/MM");
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-4">
        {/* Search and Filters Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-medium">Busca e Filtros</CardTitle>
                <p className="text-xs text-muted-foreground">Encontre agendamentos rapidamente</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, colaborador ou observações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Visões salvas
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Salvar visão
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros Avançados
              </Button>
              <Button size="sm" className="gap-2 ml-auto">
                <Plus className="h-4 w-4" />
                Novo Agendamento
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={goToToday}
              >
                Hoje
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={goToThisWeek}
              >
                Esta semana
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="flex-1">
          <CardContent className="p-4 space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateWeek(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateWeek(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium ml-2">
                  📅 {formatWeekRange()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {appointmentCount} agenda
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={view === "day" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setView("day")}
                  >
                    Dia
                  </Button>
                  <Button
                    variant={view === "week" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setView("week")}
                  >
                    Semana
                  </Button>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Agendamento
                </Button>
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-6 text-sm">
              {Object.entries(statusConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  <span className="text-muted-foreground">{config.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Clique para criar compromisso</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-8 bg-muted/30 border-b">
                <div className="p-3 text-center border-r">
                  <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    🕐 Horário
                  </span>
                </div>
                {weekDays.map((day, index) => (
                  <div key={index} className="p-3 text-center border-r last:border-r-0">
                    <p className="font-medium text-sm">
                      {format(day, "EEE", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(day, "dd/MM")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="max-h-[500px] overflow-y-auto">
                {hours.slice(0, 12).map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                    <div className="p-2 text-center border-r bg-muted/10">
                      <span className="text-xs text-muted-foreground">{hour}</span>
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const appointments = getAppointmentsForSlot(day, hour);
                      const isToday = isSameDay(day, new Date());
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`p-1 border-r last:border-r-0 min-h-[60px] cursor-pointer hover:bg-muted/20 transition-colors ${
                            isToday ? "bg-primary/5" : ""
                          }`}
                        >
                          {appointments.map((apt) => (
                            <div
                              key={apt.id}
                              className={`p-1.5 rounded text-xs text-white ${statusConfig[apt.status].color}`}
                            >
                              <p className="font-medium truncate">{apt.title}</p>
                              <p className="truncate opacity-90">{apt.client}</p>
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

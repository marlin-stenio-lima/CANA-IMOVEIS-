import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Calendar, MoreHorizontal, Loader2, CheckSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/hooks/useTasks";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";

export default function Tasks() {
  const queryClient = useQueryClient();
  const { tasks, isLoading, updateTask, deleteTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  const filteredTasks = (tasks || []).filter(task => {
    if (!task) return false;
    
    // Safety check for search
    const titleMatch = (task.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (task.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    
    // Status filter
    if (filter === "pending") return matchesSearch && (task.status === "pending" || !task.status);
    if (filter === "completed") return matchesSearch && task.status === "completed";
    
    return matchesSearch;
  });

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "Alta": return "destructive";
      case "Média": return "default";
      case "Baixa": return "secondary";
      default: return "secondary";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = parseISO(dateStr);
    return format(date, "dd 'de' MMM", { locale: ptBR });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie suas atividades do dia a dia</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["tasks"] })} className="hidden sm:flex border-indigo-200 text-indigo-600 hover:bg-indigo-50">
             Atualizar Lista
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg border">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-white shadow-sm" : ""}
              >
                Todas
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("pending")}
                className={filter === "pending" ? "bg-white shadow-sm" : ""}
              >
                Pendentes
                {(tasks || []).filter(t => t?.status === 'pending').length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full font-bold">
                    {(tasks || []).filter(t => t?.status === 'pending').length}
                  </span>
                )}
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("completed")}
                className={filter === "completed" ? "bg-white shadow-sm" : ""}
              >
                Concluídas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
               <p className="text-muted-foreground animate-pulse">Carregando suas tarefas...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
               <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
               <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
               <p className="text-sm">Tudo em dia! Relaxe ou crie uma nova tarefa.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    task.status === "completed" ? "bg-slate-50/50 opacity-70" : "bg-white hover:border-indigo-200 hover:shadow-md"
                  }`}
                >
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => updateTask.mutate({ id: task.id, status: task.status === 'completed' ? 'pending' : 'completed' })}
                    className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className={`font-bold text-slate-800 ${task.status === "completed" ? "line-through text-slate-400" : ""}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setTaskToEdit(task);
                            setIsModalOpen(true);
                          }}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'completed' })}>Concluir</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive font-bold" onClick={() => deleteTask.mutate(task.id)}>Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${task.status === 'pending' && task.due_date && new Date(task.due_date) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(task.due_date)}
                        {task.status === 'pending' && task.due_date && new Date(task.due_date) < new Date() && " (ATRASADA)"}
                      </div>
                      <Badge className={`text-[10px] uppercase font-black tracking-widest ${
                        task.priority === 'Alta' ? 'bg-red-50 text-red-600' :
                        task.priority === 'Média' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {task.priority || 'Média'}
                      </Badge>
                      {task.profiles?.full_name && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 h-6 px-2 rounded-full">
                          <span className="font-bold opacity-50 font-mono">@</span>
                          {task.profiles.full_name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTaskModal 
        open={isModalOpen} 
        onOpenChange={(open) => {
           setIsModalOpen(open);
           if (!open) setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}


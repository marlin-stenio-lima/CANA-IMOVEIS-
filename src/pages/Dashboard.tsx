import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, HandshakeIcon, CheckSquare, TrendingUp, TrendingDown, DollarSign, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const stats = [
  { 
    title: "Total de Contatos", 
    value: "248", 
    icon: Users, 
    change: "+12%", 
    trend: "up",
    color: "primary" 
  },
  { 
    title: "Empresas", 
    value: "45", 
    icon: Building2, 
    change: "+5%", 
    trend: "up",
    color: "success" 
  },
  { 
    title: "Negócios Ativos", 
    value: "32", 
    icon: HandshakeIcon, 
    change: "+18%", 
    trend: "up",
    color: "info" 
  },
  { 
    title: "Tarefas Pendentes", 
    value: "18", 
    icon: CheckSquare, 
    change: "-8%", 
    trend: "down",
    color: "warning" 
  },
];

const chartData = [
  { name: "01/12", deals: 4, value: 24000 },
  { name: "05/12", deals: 6, value: 38000 },
  { name: "10/12", deals: 5, value: 28000 },
  { name: "15/12", deals: 8, value: 45000 },
  { name: "20/12", deals: 12, value: 72000 },
  { name: "25/12", deals: 9, value: 54000 },
  { name: "30/12", deals: 15, value: 89000 },
];

const pipelineData = [
  { name: "Lead", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Qualificado", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Proposta", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Negociação", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Fechado", value: 5, color: "hsl(var(--chart-5))" },
];

const recentDeals = [
  { name: "Projeto Alpha", company: "Tech Corp", value: "R$ 45.000", stage: "Proposta", initials: "TC", color: "bg-primary" },
  { name: "Consultoria Beta", company: "Inovação SA", value: "R$ 28.000", stage: "Negociação", initials: "IS", color: "bg-success" },
  { name: "Sistema Gamma", company: "Digital Ltd", value: "R$ 72.000", stage: "Fechamento", initials: "DL", color: "bg-info" },
];

const recentTasks = [
  { title: "Ligar para cliente Tech Corp", due: "Hoje", priority: "Alta" },
  { title: "Enviar proposta para Inovação SA", due: "Amanhã", priority: "Média" },
  { title: "Reunião de follow-up", due: "23/12", priority: "Baixa" },
];

const recentActivities = [
  { action: "Novo negócio criado", target: "Projeto Alpha", time: "2 min", icon: HandshakeIcon },
  { action: "Tarefa concluída", target: "Ligar para João", time: "15 min", icon: CheckSquare },
  { action: "Contato adicionado", target: "Maria Silva", time: "1 hora", icon: Users },
  { action: "Proposta enviada", target: "Tech Corp", time: "3 horas", icon: DollarSign },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", icon: "text-primary" },
  success: { bg: "bg-success/10", text: "text-success", icon: "text-success" },
  info: { bg: "bg-info/10", text: "text-info", icon: "text-info" },
  warning: { bg: "bg-warning/10", text: "text-warning", icon: "text-warning" },
};

export default function Dashboard() {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "Usuário";

  return (
    <div className="space-y-6">
      {/* Header with Greeting */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está o resumo do seu CRM hoje
          </p>
        </div>
        <Button asChild>
          <Link to="/kanban">
            Ver Kanban <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const colors = colorClasses[stat.color];
          return (
            <Card 
              key={stat.title} 
              className="hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`h-10 w-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Area Chart - Deals over time */}
        <Card className="lg:col-span-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Negócios - Últimos 30 dias
            </CardTitle>
            <CardDescription>Evolução do valor total dos negócios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `R$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Pipeline */}
        <Card className="lg:col-span-3 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HandshakeIcon className="h-5 w-5 text-info" />
              Negócios por Estágio
            </CardTitle>
            <CardDescription>Distribuição atual do pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value} negócios`, '']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Deals */}
        <Card className="animate-fade-in" style={{ animationDelay: "600ms" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                Negócios Recentes
              </CardTitle>
              <CardDescription>Últimos negócios em andamento</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/kanban">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${deal.color} text-primary-foreground text-sm font-semibold`}>
                      {deal.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{deal.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{deal.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{deal.value}</p>
                    <Badge variant="secondary" className="text-xs">
                      {deal.stage}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="animate-fade-in" style={{ animationDelay: "700ms" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-warning" />
                Tarefas Pendentes
              </CardTitle>
              <CardDescription>Próximas tarefas a serem realizadas</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tasks">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    task.priority === "Alta" ? "bg-destructive/10" :
                    task.priority === "Média" ? "bg-warning/10" :
                    "bg-muted"
                  }`}>
                    <CheckSquare className={`h-5 w-5 ${
                      task.priority === "Alta" ? "text-destructive" :
                      task.priority === "Média" ? "text-warning" :
                      "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Vencimento: {task.due}</span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      task.priority === "Alta" ? "border-destructive text-destructive" :
                      task.priority === "Média" ? "border-warning text-warning" :
                      "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-fade-in" style={{ animationDelay: "800ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-muted-foreground"> - {activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time} atrás</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

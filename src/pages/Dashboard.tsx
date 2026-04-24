import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, HandshakeIcon, CheckSquare, TrendingUp, TrendingDown, DollarSign, Clock, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/hooks/usePermissions";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const stats = [
  {
    title: "Total de Contatos",
    value: "248",
    icon: Users,
    change: "+12%",
    trend: "up",
    color: "primary",
    gradient: "from-indigo-500/20 to-blue-500/20"
  },
  {
    title: "Negócios Ativos",
    value: "32",
    icon: HandshakeIcon,
    change: "+18%",
    trend: "up",
    color: "info",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Tarefas Pendentes",
    value: "18",
    icon: CheckSquare,
    change: "-8%",
    trend: "down",
    color: "warning",
    gradient: "from-amber-500/20 to-orange-500/20"
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
  { name: "Lead", value: 35, color: "hsl(var(--primary))" },
  { name: "Qualificado", value: 25, color: "hsl(var(--info))" },
  { name: "Proposta", value: 20, color: "hsl(var(--success))" },
  { name: "Negociação", value: 15, color: "hsl(var(--warning))" },
  { name: "Fechado", value: 5, color: "hsl(var(--destructive))" },
];

const recentDeals = [
  { name: "Projeto Alpha", company: "Tech Corp", value: "R$ 45.000", stage: "Proposta", initials: "TC", color: "bg-primary" },
  { name: "Consultoria Beta", company: "Inovação SA", value: "R$ 28.000", stage: "Negociação", initials: "IS", color: "bg-success" },
  { name: "Sistema Gamma", company: "Digital Ltd", value: "R$ 72.000", stage: "Fechamento", initials: "DL", color: "bg-info" },
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

import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { profile } = useAuth();
  const { isAdmin } = usePermissions();
  const { mode } = useCrmMode();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  const firstName = profile?.full_name?.split(" ")[0] || "Usuário";

  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalContacts: 0,
    activeDeals: 0,
    pendingTasks: 0,
  });

  const [dashboardDeals, setDashboardDeals] = useState<any[]>([]);
  const [dashboardTasks, setDashboardTasks] = useState<any[]>([]);
  const [pipelineMetrics, setPipelineMetrics] = useState<any[]>([]);
  const [chartMetrics, setChartMetrics] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [profile?.id, mode, isAdmin]);

  const fetchDashboardData = async () => {
    if (!profile?.company_id) return;
    setIsLoading(true);

    try {
      const userId = profile.id;
      
      // 1. Fetch Stats Counts
      const contactsQuery = supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('business_type' as any, mode);
      const dealsQuery = supabase.from('deals').select('*', { count: 'exact', head: true }).is('closed_at', null).eq('business_type' as any, mode);
      const tasksQuery = supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('completed', false).eq('business_type' as any, mode);

      if (!isAdmin) {
        contactsQuery.eq('assigned_to', userId);
        dealsQuery.eq('assigned_to', userId);
        tasksQuery.eq('assigned_to', userId);
      }

      const [contactsRes, dealsRes, tasksRes] = await Promise.all([
        contactsQuery,
        dealsQuery,
        tasksQuery
      ]);

      setStatsData({
        totalContacts: contactsRes.count || 0,
        activeDeals: dealsRes.count || 0,
        pendingTasks: tasksRes.count || 0,
      });

      // 2. Fetch Recent Deals
      const recentDealsQuery = supabase
        .from('deals')
        .select('*, contacts(*)')
        .eq('business_type' as any, mode)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (!isAdmin) recentDealsQuery.eq('assigned_to', userId);
      const { data: rDeals } = await recentDealsQuery;
      setDashboardDeals(rDeals || []);

      // 3. Fetch Recent Activities (Tasks)
      const recentTasksQuery = supabase
        .from('tasks')
        .select('*')
        .eq('business_type' as any, mode)
        .order('created_at', { ascending: false })
        .limit(4);
      if (!isAdmin) recentTasksQuery.eq('assigned_to', userId);
      const { data: rTasks } = await recentTasksQuery;
      setDashboardTasks(rTasks || []);

      // 4. Pipeline Distribution (Real Stages)
      const pipelineQuery = supabase
        .from('deals')
        .select('*, pipeline_stages(name)')
        .eq('business_type' as any, mode)
        .is('closed_at', null);
      if (!isAdmin) pipelineQuery.eq('assigned_to', userId);
      const { data: pDeals } = await pipelineQuery;

      const stageCounts: Record<string, number> = {};
      pDeals?.forEach((d: any) => {
        const stageName = d.pipeline_stages?.name || 'Lead';
        stageCounts[stageName] = (stageCounts[stageName] || 0) + 1;
      });

      const colors = ["hsl(var(--primary))", "hsl(var(--info))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];
      const pMetrics = Object.entries(stageCounts).map(([name, value], i) => ({
        name,
        value,
        color: colors[i % colors.length]
      }));
      setPipelineMetrics(pMetrics.length > 0 ? pMetrics : [
        { name: "Sem Dados", value: 1, color: "hsl(var(--muted))" }
      ]);

      // 5. Chart Data (Last 7 days instead of hardcoded)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return format(d, 'yyyy-MM-dd');
      }).reverse();

      const chartM = last7Days.map(day => {
        const dayDeals = pDeals?.filter((d: any) => d.created_at?.startsWith(day)) || [];
        const totalValue = dayDeals.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0);
        
        let formattedName = day;
        try {
          const dateObj = new Date(day + 'T12:00:00'); // Add time to avoid TZ shifts
          if (!isNaN(dateObj.getTime())) {
            formattedName = format(dateObj, 'dd/MM');
          }
        } catch (e) {
          console.error("Date formatting error:", e);
        }

        return {
          name: formattedName,
          value: totalValue,
          deals: dayDeals.length
        };
      });
      setChartMetrics(chartM);

    } catch (err) {
      console.error("Dashboard calculation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: "Total de Contatos",
      value: statsData.totalContacts.toString(),
      icon: Users,
      change: "+0%",
      trend: "up",
      color: "primary"
    },
    {
      title: "Negócios Ativos",
      value: statsData.activeDeals.toString(),
      icon: HandshakeIcon,
      change: "+0%",
      trend: "up",
      color: "info"
    },
    {
      title: "Tarefas Pendentes",
      value: statsData.pendingTasks.toString(),
      icon: CheckSquare,
      change: "+0%",
      trend: "up",
      color: "warning"
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
  };

  // Internal component fix for activities icon mapping
  const getActivityIcon = (desc: string) => {
    if (desc.includes('tarefa')) return CheckSquare;
    if (desc.includes('contato')) return Users;
    return Zap;
  };

  const parseISO = (s: string) => new Date(s);


  return (
    <div className="space-y-8 pb-10">
      {/* Header with Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está o resumo do seu assistente hoje.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="hover-lift border-primary/20 hover:bg-primary/5">
            Baixar Relatório
          </Button>
          <Button className="hover-lift shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90" asChild>
            <Link to="/kanban">
              Ver Kanban <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {dashboardStats.map((stat, index) => {
          const colors = ({
            primary: { bg: "bg-primary/10", text: "text-primary", icon: "text-primary" },
            success: { bg: "bg-success/10", text: "text-success", icon: "text-success" },
            info: { bg: "bg-info/10", text: "text-info", icon: "text-info" },
            warning: { bg: "bg-warning/10", text: "text-warning", icon: "text-warning" },
          } as any)[stat.color];

          return (
            <Card
              key={stat.title}
              className="animate-fade-in transition-all duration-200 hover:shadow-md border-none shadow-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {stat.title}
                </CardTitle>
                <div className={`h-10 w-10 rounded-xl ${colors.bg} flex items-center justify-center shadow-inner`}>
                  <stat.icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display tracking-tight text-foreground">
                  {isLoading ? "..." : stat.value}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Dados em tempo real</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Area Chart - Deals over time */}
        <Card className="lg:col-span-4 animate-fade-in border-none shadow-xl bg-card/50 backdrop-blur-md" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-xl">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Negócios - Últimos 30 dias
            </CardTitle>
            <CardDescription>Evolução do valor total dos negócios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartMetrics}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs font-medium" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs font-medium" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                    tickFormatter={(value) => `R$${value / 1000}k`} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ fontWeight: 600 }}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Pipeline */}
        <Card className="lg:col-span-3 animate-fade-in border-none shadow-xl bg-card/50 backdrop-blur-md" style={{ animationDelay: "500ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-xl">
              <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center">
                <HandshakeIcon className="h-5 w-5 text-info" />
              </div>
              Negócios por Estágio
            </CardTitle>
            <CardDescription>Distribuição atual do pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineMetrics}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1200}
                  >
                    {pipelineMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${value} negócios`, '']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-semibold text-muted-foreground uppercase tracking-tighter">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Deals */}
        <Card className="animate-fade-in border-none shadow-xl bg-card/50 backdrop-blur-md" style={{ animationDelay: "600ms" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-display text-xl">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                Negócios Recentes
              </CardTitle>
              <CardDescription>Últimos negócios em andamento</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10" asChild>
              <Link to="/kanban">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardDeals.length > 0 ? dashboardDeals.map((deal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarFallback className={`bg-primary text-primary-foreground text-sm font-bold`}>
                      {(deal.contacts?.name || deal.title || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">{deal.contacts?.name || deal.title}</p>
                    <p className="text-sm text-muted-foreground font-medium truncate">{deal.contacts?.source || "Origem Direta"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-foreground">{formatCurrency(Number(deal.value) || 0)}</p>
                    <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest bg-muted/50 border-none">
                      {deal.status || "Lead"}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-muted-foreground text-sm">Nenhum negócio recente</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-fade-in border-none shadow-xl bg-card/50 backdrop-blur-md" style={{ animationDelay: "800ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-xl">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              Atividade Recente
            </CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:to-transparent">
              {dashboardTasks.length > 0 ? dashboardTasks.map((task, index) => {
                const Icon = getActivityIcon(task.title || "");
                return (
                  <div key={index} className="relative flex items-center gap-4 pl-1">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 z-10 animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
                      <Icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-bold text-foreground">{task.title}</span>
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                        <Clock className="h-3 w-3" />
                        {task.due_date ? format(parseISO(task.due_date), "dd 'de' MMM", { locale: ptBR }) : "Sem prazo"}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-10 text-muted-foreground text-sm">Nenhuma atividade recente</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

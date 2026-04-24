import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserX, Clock, HandshakeIcon, CheckSquare, Target, CheckCircle2, CalendarDays, LineChart, Link as LinkIcon, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useTeam } from "@/hooks/useTeam";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format, subDays, startOfMonth, endOfMonth, subMonths, isWithinInterval, startOfDay, endOfDay, differenceInMinutes, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

type PeriodRange = "hoje" | "ontem" | "este_mes" | "mes_passado" | "personalizado";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { mode } = useCrmMode();
  const { data: teamMembers } = useTeam();
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [period, setPeriod] = useState<PeriodRange>("este_mes");
  const [selectedBroker, setSelectedBroker] = useState<string>("todos");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  
  // States
  const [deals, setDeals] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [bolsaoStageId, setBolsaoStageId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [mode, profile?.company_id]);

  const fetchData = async () => {
    if (!profile?.company_id) return;
    setIsLoading(true);
    
    // 1. Get Company Settings for Bolsao
    const { data: companyData } = await supabase.from('companies').select('settings').limit(1).single() as any;
    const bolsaoStages = companyData?.settings?.bolsao_stages || {};
    
    // We need to know which pipeline is active to get the bolsao stage. 
    // Since this is global, let's just get the pipeline for the current mode.
    const { data: pipelines } = await supabase.from('pipelines').select('id').eq('business_type', mode).limit(1);
    if (pipelines && pipelines.length > 0) {
      setBolsaoStageId(bolsaoStages[pipelines[0].id] || null);
    }

    // Fetch Deals with Contacts
    const { data: dData } = await supabase
      .from('deals')
      .select('*, contacts(source), pipeline_stages(name), loss_reasons(name)')
      .eq('business_type', mode);
      
    setDeals(dData || []);

    // Fetch Appointments
    const { data: aData } = await supabase
      .from('appointments')
      .select('*, contacts(business_type)')
      // .eq('contacts.business_type', mode) - Cannot filter on joined table easily in supabase without inner join. 
      // We'll filter in memory if needed, but appointments are not huge.
    
    setAppointments(aData || []);

    // Fetch Contacts (for source pie chart if deal is missing)
    const { data: cData } = await supabase
      .from('contacts')
      .select('id, source, created_at, assigned_to')
      .eq('business_type', mode);
      
    setContacts(cData || []);
    setIsLoading(false);
  };

  // Helper to get Date Range
  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case "hoje":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "ontem":
        return { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) };
      case "este_mes":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "mes_passado":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "personalizado":
        return { 
          start: customDateRange?.from ? startOfDay(customDateRange.from) : startOfDay(now), 
          end: customDateRange?.to ? endOfDay(customDateRange.to) : (customDateRange?.from ? endOfDay(customDateRange.from) : endOfDay(now))
        };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  // Calculate Metrics based on filters
  const metrics = useMemo(() => {
    const { start, end } = getDateRange();
    
    // Filter functions
    const inDateRange = (dateStr: string | null) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return isWithinInterval(d, { start, end });
    };

    const matchesBroker = (assigned_to: string | null) => {
      if (selectedBroker === "todos") return true;
      // Bolsao leads have NO assigned_to usually, or we match exact broker
      if (selectedBroker === "bolsao") return !assigned_to;
      return assigned_to === selectedBroker;
    };

    // Filtered Datasets
    const fDeals = deals.filter(d => inDateRange(d.created_at) && matchesBroker(d.assigned_to));
    const fContacts = contacts.filter(c => inDateRange(c.created_at) && matchesBroker(c.assigned_to));
    const fAppointments = appointments.filter(a => inDateRange(a.start_time)); // Approximating

    // 1. Leads Atendidos (Not in Bolsao, assigned to someone)
    const leadsAtendidos = fDeals.filter(d => d.assigned_to && d.stage_id !== bolsaoStageId).length;
    
    // 2. Leads no Bolsão
    const leadsBolsao = fDeals.filter(d => d.stage_id === bolsaoStageId || !d.assigned_to).length;

    // 3. Velocidade para atender (TME)
    // We approximate this by looking at deals that have stage_entered_at and comparing to created_at
    let totalWaitTime = 0;
    let waitCount = 0;
    fDeals.forEach(d => {
      if (d.stage_entered_at && d.created_at && d.stage_id !== bolsaoStageId) {
        const diff = differenceInMinutes(parseISO(d.stage_entered_at), parseISO(d.created_at));
        if (diff >= 0 && diff < 60 * 24 * 7) { // Sanity check (max 7 days)
          totalWaitTime += diff;
          waitCount++;
        }
      }
    });
    const avgWaitMinutes = waitCount > 0 ? Math.round(totalWaitTime / waitCount) : 0;
    const avgWaitString = avgWaitMinutes > 60 
      ? `${Math.floor(avgWaitMinutes/60)}h ${avgWaitMinutes%60}m` 
      : `${avgWaitMinutes} min`;

    // 4. Visitas Agendadas
    const visitas = fAppointments.filter(a => a.status === 'scheduled' || a.status === 'completed').length;

    // 5. Em Negociação
    const negociacao = fDeals.filter(d => d.pipeline_stages?.name?.toLowerCase().includes('negocia')).length;

    // 6. Vendas (Ganhos)
    const ganhos = fDeals.filter(d => d.stage === 'won' || d.closed_at).length;

    // 7. Perdidos
    const perdidos = fDeals.filter(d => d.stage === 'lost' || d.lost_at).length;

    // Source Distribution (Canal)
    const sourceMap: Record<string, number> = {};
    fDeals.forEach(d => {
      const src = d.contacts?.source || 'Desconhecido';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });
    const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

    // Timeline Data (Leads per day)
    const timelineMap: Record<string, number> = {};
    fDeals.forEach(d => {
      if (d.created_at) {
        const dateStr = d.created_at.split('T')[0];
        timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;
      }
    });
    const timelineData = Object.entries(timelineMap)
      .map(([name, value]) => ({ name: format(parseISO(name), 'dd/MM'), value, date: name }))
      .sort((a,b) => a.date.localeCompare(b.date));

    // Motivos de perda
    const lostReasonsMap: Record<string, number> = {};
    fDeals.filter(d => d.stage === 'lost').forEach(d => {
       const reason = d.loss_reasons?.name || 'Não informado';
       lostReasonsMap[reason] = (lostReasonsMap[reason] || 0) + 1;
    });
    const lostReasonData = Object.entries(lostReasonsMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

    // VGV (Valor Geral de Vendas em Negociação)
    let vgvNegociacao = 0;
    fDeals.filter(d => d.pipeline_stages?.name?.toLowerCase().includes('negocia')).forEach(d => {
       vgvNegociacao += Number(d.value) || 0;
    });

    // Ranking de corretores (Gamificação)
    const brokerStats: Record<string, { name: string, wins: number, total: number, waitTime: number, waitCount: number }> = {};
    fDeals.forEach(d => {
       if (!d.assigned_to) return;
       if (!brokerStats[d.assigned_to]) {
          const b = teamMembers?.find(t => t.id === d.assigned_to);
          brokerStats[d.assigned_to] = { name: b?.full_name || 'Desconhecido', wins: 0, total: 0, waitTime: 0, waitCount: 0 };
       }
       brokerStats[d.assigned_to].total++;
       if (d.stage === 'won' || d.closed_at) brokerStats[d.assigned_to].wins++;
       
       if (d.stage_entered_at && d.created_at && d.stage_id !== bolsaoStageId) {
          const diff = differenceInMinutes(parseISO(d.stage_entered_at), parseISO(d.created_at));
          if (diff >= 0 && diff < 60*24*7) {
             brokerStats[d.assigned_to].waitTime += diff;
             brokerStats[d.assigned_to].waitCount++;
          }
       }
    });

    const brokerRanking = Object.values(brokerStats).map(b => ({
       name: b.name,
       wins: b.wins,
       conversion: b.total > 0 ? Math.round((b.wins / b.total) * 100) : 0,
       avgWait: b.waitCount > 0 ? Math.round(b.waitTime / b.waitCount) : 0
    })).sort((a, b) => b.wins - a.wins).slice(0, 5);

    return {
      leadsAtendidos,
      leadsBolsao,
      avgWaitString,
      visitas,
      negociacao,
      ganhos,
      perdidos,
      sourceData,
      timelineData,
      lostReasonData,
      vgvNegociacao,
      brokerRanking,
      totalLeads: fDeals.length
    };
  }, [deals, contacts, appointments, period, customDateRange, selectedBroker, bolsaoStageId, teamMembers]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658', '#FF6B6B', '#4ECDC4'];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Operacional (Admin)</h1>
          <p className="text-muted-foreground">Monitore o desempenho e fluxo de leads da sua equipe.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 bg-card p-2 rounded-lg border shadow-sm">
          <div className="space-y-1">
            <Label className="text-xs px-1 text-muted-foreground">Período</Label>
            <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="ontem">Ontem</SelectItem>
                <SelectItem value="este_mes">Este Mês</SelectItem>
                <SelectItem value="mes_passado">Mês Passado</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {period === "personalizado" && (
            <div className="space-y-1">
              <Label className="text-xs px-1 text-muted-foreground">Data Personalizada</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    size="sm"
                    className={cn(
                      "w-[240px] h-8 text-xs justify-start text-left font-normal",
                      !customDateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {customDateRange?.from ? (
                      customDateRange.to ? (
                        <>
                          {format(customDateRange.from, "dd LLL y", { locale: ptBR })} -{" "}
                          {format(customDateRange.to, "dd LLL y", { locale: ptBR })}
                        </>
                      ) : (
                        format(customDateRange.from, "dd LLL y", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={customDateRange?.from}
                    selected={customDateRange}
                    onSelect={setCustomDateRange}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs px-1 text-muted-foreground">Corretor</Label>
            <Select value={selectedBroker} onValueChange={setSelectedBroker}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Todos os Corretores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos (Equipe Inteira)</SelectItem>
                <SelectItem value="bolsao">Sem Dono (Bolsão)</SelectItem>
                {teamMembers?.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.full_name || 'Usuário Sem Nome'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
             <Button size="sm" variant="outline" className="h-8 gap-2">
                <Download className="w-3.5 h-3.5" /> Exportar
             </Button>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Leads Atendidos
              <CheckSquare className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-foreground">{isLoading ? '-' : metrics.leadsAtendidos}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de leads resgatados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-red-500/20 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Leads no Bolsão
              <UserX className="w-4 h-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-red-600 dark:text-red-500">{isLoading ? '-' : metrics.leadsBolsao}</div>
            <p className="text-xs text-muted-foreground mt-1">Não atendidos a tempo</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-amber-500/20 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Tempo Médio de Espera
              <Clock className="w-4 h-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-500">{isLoading ? '-' : metrics.avgWaitString}</div>
            <p className="text-xs text-muted-foreground mt-1">Tempo até primeiro contato</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-green-500/20 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Taxa de Conversão
              <Target className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-green-600 dark:text-green-500">
              {isLoading ? '-' : metrics.totalLeads > 0 ? Math.round((metrics.ganhos / metrics.totalLeads) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metrics.ganhos} ganhos / {metrics.totalLeads} leads</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics (Funnel Overview) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-3 flex items-center gap-3">
           <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md"><CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
           <div><p className="text-xs text-muted-foreground">Visitas Agendadas</p><p className="text-lg font-bold">{metrics.visitas}</p></div>
        </div>
        <div className="bg-card border rounded-lg p-3 flex items-center gap-3">
           <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md"><HandshakeIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" /></div>
           <div className="flex-1">
             <p className="text-xs text-muted-foreground">Em Negociação</p>
             <div className="flex items-baseline justify-between">
               <p className="text-lg font-bold">{metrics.negociacao}</p>
               <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(metrics.vgvNegociacao)}
               </p>
             </div>
           </div>
        </div>
        <div className="bg-card border rounded-lg p-3 flex items-center gap-3">
           <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md"><CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" /></div>
           <div><p className="text-xs text-muted-foreground">Vendas (Ganhos)</p><p className="text-lg font-bold">{metrics.ganhos}</p></div>
        </div>
        <div className="bg-card border rounded-lg p-3 flex items-center gap-3">
           <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md"><UserX className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /></div>
           <div><p className="text-xs text-muted-foreground">Perdidos</p><p className="text-lg font-bold">{metrics.perdidos}</p></div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" /> Entrada de Leads por Dia
            </CardTitle>
            <CardDescription>Volume de novos contatos gerados no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.timelineData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                     formatter={(value) => [`${value} leads`, 'Entradas']}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-info" /> Origem dos Leads
            </CardTitle>
            <CardDescription>Canais de aquisição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {metrics.sourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.sourceData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {metrics.sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} leads`, 'Quantidade']} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Sem dados de origem no período
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Ranking & Lost Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserX className="w-5 h-5 text-destructive" /> Motivos de Perda
            </CardTitle>
            <CardDescription>Principais razões para perda de negócios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {metrics.lostReasonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.lostReasonData}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {metrics.lostReasonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} perdas`, 'Quantidade']} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Sem dados de perdas no período
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" /> Ranking de Corretores
            </CardTitle>
            <CardDescription>Top 5 em vendas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {metrics.brokerRanking.length > 0 ? (
                metrics.brokerRanking.map((broker, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {i + 1}º
                      </div>
                      <div className="font-medium text-sm">{broker.name}</div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div className="text-right">
                        <div className="font-bold text-success">{broker.wins}</div>
                        <div className="text-muted-foreground">Vendas</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{broker.conversion}%</div>
                        <div className="text-muted-foreground">Conversão</div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="font-bold text-amber-600 dark:text-amber-500">
                           {broker.avgWait > 60 ? `${Math.floor(broker.avgWait/60)}h${broker.avgWait%60}m` : `${broker.avgWait}m`}
                        </div>
                        <div className="text-muted-foreground">TME</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground text-sm">Sem dados de corretores no período</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

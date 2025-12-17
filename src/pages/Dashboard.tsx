import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, HandshakeIcon, CheckSquare, TrendingUp, DollarSign } from "lucide-react";

const stats = [
  { title: "Total de Contatos", value: "248", icon: Users, change: "+12%", color: "text-blue-600" },
  { title: "Empresas", value: "45", icon: Building2, change: "+5%", color: "text-green-600" },
  { title: "Negócios Ativos", value: "32", icon: HandshakeIcon, change: "+18%", color: "text-purple-600" },
  { title: "Tarefas Pendentes", value: "18", icon: CheckSquare, change: "-8%", color: "text-orange-600" },
];

const recentDeals = [
  { name: "Projeto Alpha", company: "Tech Corp", value: "R$ 45.000", stage: "Proposta" },
  { name: "Consultoria Beta", company: "Inovação SA", value: "R$ 28.000", stage: "Negociação" },
  { name: "Sistema Gamma", company: "Digital Ltd", value: "R$ 72.000", stage: "Fechamento" },
];

const recentTasks = [
  { title: "Ligar para cliente Tech Corp", due: "Hoje", priority: "Alta" },
  { title: "Enviar proposta para Inovação SA", due: "Amanhã", priority: "Média" },
  { title: "Reunião de follow-up", due: "23/12", priority: "Baixa" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu CRM</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change} em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Negócios Recentes
            </CardTitle>
            <CardDescription>Últimos negócios em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{deal.name}</p>
                    <p className="text-sm text-muted-foreground">{deal.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{deal.value}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {deal.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tarefas Pendentes
            </CardTitle>
            <CardDescription>Próximas tarefas a serem realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Vencimento: {task.due}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === "Alta" ? "bg-destructive/10 text-destructive" :
                    task.priority === "Média" ? "bg-yellow-500/10 text-yellow-600" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

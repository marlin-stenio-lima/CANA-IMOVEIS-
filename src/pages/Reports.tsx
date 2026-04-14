import React from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  MousePointer2,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Search,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = React.useState<"Janeiro" | "Fevereiro">("Fevereiro");
  const year = "2026";
  const clientName = "Clínica Armando Cajubá";

  const data = {
    Janeiro: {
      examData: [
        { name: "US Doppler", investment: 183.76, leads: 31, cpl: 5.93, status: "Ótimo" },
        { name: "AB- ULTRASSONOGRAFIA", investment: 186.15, leads: 49, cpl: 3.80, status: "Ótimo" },
        { name: "Tomografia de crânio", investment: 169.53, leads: 13, cpl: 13.04, status: "Bom" },
        { name: "US Preparo Intestinal", investment: 178.33, leads: 27, cpl: 6.60, status: "Ótimo" },
        { name: "US ABDOMINAL", investment: 190.76, leads: 69, cpl: 2.76, status: "Extraordinário" },
      ],
      googleAdsData: { clicks: "70", interactions: "486", cpc: "R$ 0,01", cost: "R$ 0,95" },
      remarketingData: [
        { type: "PÚBLICO QUE NÃO CONHECE A CLÍNICA", reached: 16146, clicks: 282, cpc: "R$ 0,30", investment: 83.79 },
        { type: "PÚBLICO CLIENTE / PÚBLICO QUE JÁ CONHECE A CLÍNICA", reached: 17833, clicks: 437, cpc: "R$ 0,27", investment: 117.63 },
      ],
      totals: { meta: "1.109,95", google: "0,95", total: "1.110,90", leads: 942, roi: "4.8x" }
    },
    Fevereiro: {
      examData: [
        { name: "AB- ULTRASSONOGRAFIA", investment: 319.02, leads: 80, cpl: 3.99, status: "Extraordinário" },
        { name: "US Preparo Intestinal", investment: 239.44, leads: 55, cpl: 4.35, status: "Extraordinário" },
        { name: "US ABDOMINAL", investment: 317.20, leads: 76, cpl: 4.17, status: "Extraordinário" },
        { name: "Tomografia de crânio", investment: 236.40, leads: 37, cpl: 6.39, status: "Ótimo" },
        { name: "US Doppler", investment: 294.23, leads: 84, cpl: 3.50, status: "Extraordinário" },
      ],
      googleAdsData: { clicks: "243", interactions: "6.64k", cpc: "R$ 1,10", cost: "R$ 268,00" },
      remarketingData: [
        { type: "PÚBLICO QUE NÃO CONHECE A CLÍNICA", reached: 17660, clicks: 211, cpc: "R$ 0,25", investment: 52.66 },
        { type: "PÚBLICO CLIENTE / PÚBLICO QUE JÁ CONHECE A CLÍNICA", reached: 29906, clicks: 237, cpc: "R$ 0,31", investment: 74.84 },
      ],
      totals: { meta: "1.533,86", google: "268,00", total: "1.801,86", leads: 332, cpl: "4,62" }
    }
  };

  const currentData = data[selectedMonth];

  return (
    <div className="flex flex-col gap-8 p-1 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Relatório de Tráfego Pago</h1>
            <p className="text-slate-500 flex items-center gap-2 mt-1 font-medium">
              <Calendar className="h-4 w-4" /> {selectedMonth} de {year} | {clientName}
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(["Janeiro", "Fevereiro"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${selectedMonth === m
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" /> ROI Tracker Ativo
        </div>
      </div>

      {/* Financial Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100 border shadow-sm">
          <CardHeader className="py-4">
            <CardDescription className="text-blue-600 font-bold uppercase text-xs tracking-wider">Investimento Meta ({selectedMonth})</CardDescription>
            <CardTitle className="text-2xl font-bold">R$ {currentData.totals.meta}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-50 border-slate-100 border shadow-sm">
          <CardHeader className="py-4">
            <CardDescription className="text-slate-600 font-bold uppercase text-xs tracking-wider">Custo Google ({selectedMonth})</CardDescription>
            <CardTitle className="text-2xl font-bold">R$ {currentData.totals.google}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-600 border-none shadow-lg text-white">
          <CardHeader className="py-4">
            <CardDescription className="text-emerald-100 font-bold uppercase text-xs tracking-wider">Investimento Total</CardDescription>
            <CardTitle className="text-2xl font-bold">R$ {currentData.totals.total}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      {/* Google Ads Summary */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-slate-800">1. Desempenho Google Ads</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-md bg-white hover:scale-[1.02] transition-transform cursor-default">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1 font-medium text-blue-600">
                <MousePointer2 className="h-4 w-4" /> Cliques
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{currentData.googleAdsData.clicks}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-md bg-white hover:scale-[1.02] transition-transform cursor-default">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1 font-medium text-red-600">
                <TrendingUp className="h-4 w-4" /> Interações
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{currentData.googleAdsData.interactions}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-md bg-white hover:scale-[1.02] transition-transform cursor-default">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1 font-medium text-amber-600">
                <DollarSign className="h-4 w-4" /> CPC Médio
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{currentData.googleAdsData.cpc}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-md bg-white hover:scale-[1.02] transition-transform cursor-default">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1 font-medium text-emerald-600">
                <DollarSign className="h-4 w-4" /> Custo Total
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{currentData.googleAdsData.cost}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Meta Ads Exam Table */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-slate-800">2. Meta Ads - Desempenho por Exame</h2>
        </div>
        <Card className="shadow-lg border-none overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold py-4">Exame / Campanha</TableHead>
                <TableHead className="font-bold">Investimento</TableHead>
                <TableHead className="font-bold">Conversas (Leads)</TableHead>
                <TableHead className="font-bold">Custo/Lead</TableHead>
                <TableHead className="font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.examData.map((exam, index) => (
                <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-semibold text-slate-700 py-4">{exam.name}</TableCell>
                  <TableCell>R$ {exam.investment.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell className="font-medium text-primary flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> {exam.leads}
                  </TableCell>
                  <TableCell className="font-semibold">R$ {exam.cpl.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>
                    <Badge className={`${exam.status === "Extraordinário" ? "bg-emerald-500 hover:bg-emerald-600" :
                      exam.status === "Ótimo" ? "bg-blue-500 hover:bg-blue-600" :
                        "bg-amber-500 hover:bg-amber-600"
                      } text-white border-none px-3`}>
                      {exam.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Remarketing Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-slate-800">3. Engajamento e Remarketing (Públicos)</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentData.remarketingData.map((item, index) => (
            <Card key={index} className="border-none shadow-md overflow-hidden bg-white">
              <div className={`h-2 ${item.type.includes("NÃO CONHECE") ? "bg-blue-400" : "bg-orange-400"}`} />
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  {item.type}
                  <Badge variant="outline" className="text-xs">{item.reached} Alcance</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-medium">Investimento</p>
                    <p className="text-xl font-bold text-slate-800">R$ {item.investment?.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-medium">Cliques no Perfil</p>
                    <p className="text-xl font-bold text-slate-800">{item.clicks}</p>
                    <p className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
                      <TrendingUp className="h-2 w-2" /> Visita: {item.cpc}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-xs text-primary font-bold">Performance</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: item.type.includes("JÁ CONHECE") ? "85%" : "60%" }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {item.type.includes("JÁ CONHECE") ? "Alta" : "Estável"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Summary Footer */}
      <Card className="bg-slate-900 border-none text-white shadow-xl">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Visão Geral de {selectedMonth}</p>
              <h3 className="text-2xl font-bold">Investimento Consolidado Otimizado</h3>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total de Leads</p>
              <p className="text-3xl font-bold flex items-center justify-center gap-2">
                {currentData.totals.leads} <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              </p>
            </div>
            <div className="text-center border-l border-slate-700 pl-8">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                {selectedMonth === "Janeiro" ? "ROI Estimado" : "Custo Médio/Lead"}
              </p>
              <p className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                {selectedMonth === "Janeiro" ? (currentData.totals as any).roi : `R$ ${(currentData.totals as any).cpl}`} <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;

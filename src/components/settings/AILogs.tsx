import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface AILog {
  id: string;
  created_at: string;
  command: string;
  response: string;
  status: string;
  error_message: string | null;
  broker_id: string;
}

export function AILogs() {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("ai_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
      
    if (data && !error) {
      setLogs(data as AILog[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    
    // Auto refresh
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Logs da Inteligência Artificial</CardTitle>
            <CardDescription>Acompanhe em tempo real as ativações e comandos interceptados.</CardDescription>
          </div>
          <button onClick={fetchLogs} className="text-sm bg-secondary px-3 py-1 rounded-md hover:bg-secondary/80">
            Atualizar
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && logs.length === 0 ? (
          <div className="text-center py-4">Carregando logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-md border border-dashed">
            Nenhuma ativação recente. Envie um comando no WhatsApp!
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-md p-4 space-y-2 text-sm bg-card">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                  </span>
                  <Badge variant={log.status === 'success' ? 'default' : log.status === 'intercepted' ? 'secondary' : 'destructive'}>
                    {log.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <span className="font-semibold text-primary block mb-1">Comando Interceptado:</span>
                  <p className="bg-muted p-2 rounded-md font-mono text-xs">{log.command}</p>
                </div>

                {log.error_message && (
                  <div>
                    <span className="font-semibold text-destructive block mb-1">Erro:</span>
                    <p className="text-destructive bg-destructive/10 p-2 rounded-md font-mono text-xs">{log.error_message}</p>
                  </div>
                )}
                
                {log.response && (
                  <div>
                    <span className="font-semibold text-emerald-500 block mb-1">Resposta da IA:</span>
                    <p className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 p-2 rounded-md text-xs whitespace-pre-wrap">{log.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

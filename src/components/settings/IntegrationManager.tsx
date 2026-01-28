import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Smartphone, RefreshCw, CheckCircle2, User, Loader2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TeamManager } from "./TeamManager";

type Broker = {
    id: string;
    name: string;
    instance?: {
        name: string;
        status: string;
    }
}

export function IntegrationManager() {
    const [brokers, setBrokers] = useState<Broker[]>([]);
    const [loading, setLoading] = useState(false);
    const [connectingBroker, setConnectingBroker] = useState<string | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);

    const fetchBrokers = async () => {
        setLoading(true);
        // Fetch brokers and their instances
        const { data: team } = await supabase
            .from('team_members')
            .select(`
                id, name,
                instance:instances(name, status)
            `)
            .eq('active', true); // Assuming active brokers

        // Transform single instance array to object if needed, or take first
        const formatted = team?.map(t => ({
            id: t.id,
            name: t.name,
            instance: Array.isArray(t.instance) ? t.instance[0] : t.instance
        })) || [];

        setBrokers(formatted);
        setLoading(false);
    };

    useEffect(() => {
        fetchBrokers();
    }, []);

    const handleConnect = async (broker: Broker) => {
        setConnectingBroker(broker.id);
        setQrCode(null);

        try {
            // 1. Ensure instance exists in Evolution & DB
            // Generate a clean name: broker_id (shortened)
            const instanceName = `crm_${broker.id.split('-')[0]}`;

            // Call Manager to Create/Connect
            const { data: createData, error: createError } = await supabase.functions.invoke('evolution-manager', {
                body: { action: 'create', instanceName }
            });

            if (createError) throw createError;

            // 2. Get QR Code
            const { data: connectData, error: connectError } = await supabase.functions.invoke('evolution-manager', {
                body: { action: 'connect', instanceName }
            });

            if (connectError) throw connectError;

            if (connectData?.base64) {
                setQrCode(connectData.base64);

                // Save instance to DB if not exists
                const { error: dbError } = await supabase.from('instances').upsert({
                    name: instanceName,
                    assigned_to: broker.id,
                    company_id: '00000000-0000-0000-0000-000000000000', // Replace with Context later
                    status: 'connecting'
                }, { onConflict: 'name' });
                if (dbError) console.error("DB Error", dbError);

            } else if (connectData?.instance?.state === 'open') {
                toast.success("Broker já conectado!");
                await supabase.from('instances').update({ status: 'open' }).eq('name', instanceName);
                setConnectingBroker(null);
                fetchBrokers();
            }

        } catch (error) {
            console.error(error);
            toast.error("Erro ao conectar instância");
            setConnectingBroker(null);
        }
    };

    const handleRefreshStatus = async (instanceName: string) => {
        const { data } = await supabase.functions.invoke('evolution-manager', {
            body: { action: 'status', instanceName }
        });
        if (data?.instance?.state) {
            await supabase.from('instances').update({ status: data.instance.state }).eq('name', instanceName);
            fetchBrokers();
            toast("Status atualizado: " + data.instance.state);
        }
    };

    return (
        <div className="grid gap-4">
            {loading && <p className="text-muted-foreground text-sm">Carregando equipe...</p>}

            <div className="flex justify-end mb-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" /> Gerenciar Equipe
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <TeamManager onUpdate={fetchBrokers} />
                    </DialogContent>
                </Dialog>
            </div>

            {brokers.map((broker) => (
                <div key={broker.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">{broker.name}</p>
                            <div className="flex items-center gap-2 text-xs">
                                <span className={`w-2 h-2 rounded-full ${broker.instance?.status === 'open' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className="text-muted-foreground">
                                    {broker.instance?.status === 'open' ? 'Online' : 'Desconectado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {broker.instance && (
                            <Button variant="ghost" size="icon" onClick={() => handleRefreshStatus(broker.instance!.name)}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        )}

                        <Dialog open={connectingBroker === broker.id} onOpenChange={(open) => !open && setConnectingBroker(null)}>
                            <DialogTrigger asChild>
                                <Button
                                    variant={broker.instance?.status === 'open' ? 'outline' : 'default'}
                                    size="sm"
                                    onClick={() => handleConnect(broker)}
                                >
                                    {broker.instance?.status === 'open' ? 'Reconectar' : 'Conectar WhatsApp'}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Conectar {broker.name}</DialogTitle>
                                    <DialogDescription>Escaneie o QR Code com o WhatsApp deste corretor.</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col items-center justify-center p-4">
                                    {qrCode ? (
                                        <img src={qrCode} alt="QR Code" className="w-64 h-64 border rounded" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-8 w-8 animate-spin" />
                                            <p>Gerando instância...</p>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            ))}

            {brokers.length === 0 && !loading && (
                <div className="text-center p-8 border-2 border-dashed rounded text-muted-foreground">
                    <p>Nenhum corretor encontrado.</p>
                    <p className="text-xs">Adicione membros à equipe primeiro.</p>
                </div>
            )}
        </div>
    );
}

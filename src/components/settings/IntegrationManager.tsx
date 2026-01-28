import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    const [isNewConnectionOpen, setIsNewConnectionOpen] = useState(false);
    const [newInstanceName, setNewInstanceName] = useState("");
    const [selectedBrokerId, setSelectedBrokerId] = useState("");

    const handleCreateCustomConnection = async () => {
        if (!newInstanceName || !selectedBrokerId) {
            toast.error("Preencha todos os campos");
            return;
        }

        const broker = brokers.find(b => b.id === selectedBrokerId);
        if (!broker) return;

        setConnectingBroker(broker.id); // Re-use the connecting state to show the QR dialog
        setIsNewConnectionOpen(false); // Close the input dialog
        setQrCode(null);

        try {
            // 1. Create Instance in Evolution
            const { error: createError } = await supabase.functions.invoke('evolution-manager', {
                body: { action: 'create', instanceName: newInstanceName }
            });

            if (createError) throw createError;

            // 2. Get QR Code
            const { data: connectData, error: connectError } = await supabase.functions.invoke('evolution-manager', {
                body: { action: 'connect', instanceName: newInstanceName }
            });

            if (connectError) throw connectError;

            if (connectData?.base64) {
                setQrCode(connectData.base64);

                // Save to DB
                const { error: dbError } = await supabase.from('instances').upsert({
                    name: newInstanceName,
                    assigned_to: broker.id,
                    company_id: '00000000-0000-0000-0000-000000000000',
                    status: 'connecting'
                }, { onConflict: 'name' });

                if (dbError) console.error("DB Error", dbError);

            } else if (connectData?.instance?.state === 'open') {
                toast.success("Conexão já está ativa!");
                await supabase.from('instances').update({ status: 'open' }).eq('name: newInstanceName');
                setConnectingBroker(null);
                fetchBrokers();
            }

        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar conexão");
            setConnectingBroker(null);
        }
    };

    return (
        <div className="grid gap-4">
            {loading && <p className="text-muted-foreground text-sm">Carregando equipe...</p>}

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <Dialog open={isNewConnectionOpen} onOpenChange={setIsNewConnectionOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Smartphone className="h-4 w-4 mr-2" /> Nova Conexão
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nova Conexão WhatsApp</DialogTitle>
                                <DialogDescription>Crie uma nova instância e vincule a um corretor.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome da Conexão (Instância)</label>
                                    <Input
                                        placeholder="Ex: WhatsApp Comercial"
                                        value={newInstanceName}
                                        onChange={e => setNewInstanceName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Atribuir ao Corretor</label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedBrokerId}
                                        onChange={e => setSelectedBrokerId(e.target.value)}
                                    >
                                        <option value="" disabled>Selecione um membro...</option>
                                        {brokers.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <Button onClick={handleCreateCustomConnection} className="w-full">
                                    Gerar QR Code
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

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
                                    {broker.instance ? (broker.instance.status === 'open' ? 'Online' : 'Desconectado') : 'Sem instância'}
                                </span>
                                {broker.instance && <span className="text-xs text-muted-foreground font-mono">({broker.instance.name})</span>}
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
                                    {broker.instance?.status === 'open' ? 'Reconectar' : (broker.instance ? 'Conectar WhatsApp' : 'Criar & Conectar')}
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
                    <p className="text-xs">Adicione membros à equipe para começar.</p>
                </div>
            )}
        </div>
    );
}

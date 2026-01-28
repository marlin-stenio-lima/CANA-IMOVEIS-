import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Smartphone, RefreshCw, User, Loader2, UserPlus, Trash2, X, Link as LinkIcon, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TeamManager } from "./TeamManager";
import { Badge } from "@/components/ui/badge";

type InstanceUser = {
    user: {
        id: string;
        name: string;
    }
}

type Instance = {
    id: string;
    name: string;
    status: string;
    members: InstanceUser[];
}

type Broker = {
    id: string;
    name: string;
}

export function IntegrationManager() {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [brokers, setBrokers] = useState<Broker[]>([]);
    const [loading, setLoading] = useState(false);

    // Connection State
    const [connectingInstance, setConnectingInstance] = useState<string | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);

    // New Connection Dialog
    const [isNewConnectionOpen, setIsNewConnectionOpen] = useState(false);
    const [newInstanceName, setNewInstanceName] = useState("");
    const [newInstancePhone, setNewInstancePhone] = useState("");

    // Add User Dialog
    const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
    const [userToLink, setUserToLink] = useState("");

    const fetchData = async () => {
        setLoading(true);

        // 1. Fetch Instances with Members
        const { data: instanceData, error: instanceError } = await supabase
            .from('instances')
            .select(`
                id, name, status, phone,
                members:instance_members(
                    user:team_members(id, name)
                )
            `);

        if (instanceError) console.error("Error fetching instances:", instanceError);
        else setInstances(instanceData?.map(i => ({
            ...i,
            members: i.members || []
        })) as Instance[] || []);

        // 2. Fetch All active Brokers (for dropdowns)
        const { data: brokerData } = await supabase
            .from('team_members')
            .select('id, name')
            .eq('active', true);

        if (brokerData) setBrokers(brokerData);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Actions ---

    const handleConnect = async (instance: Instance & { phone?: string }) => {
        setConnectingInstance(instance.id);
        setQrCode(null);

        // Clean phone number from instance
        const phoneNumber = instance.phone ? instance.phone.replace(/\D/g, '') : null;
        console.log("Connecting instance:", instance.name, "Number:", phoneNumber);

        try {
            // STEP 1: Check Status & Clean "Zombie" Instances
            console.log("Checking status for cleanup...");
            const { data: statusData, error: statusError } = await supabase.functions.invoke('evolution-manager', {
                body: { action: 'status', instanceName: instance.name }
            });

            // If instance exists but is not 'open' (connected), we DELETE it to ensure a fresh start.
            // We ignore 404s (instance not found) which look like errors here.
            if (!statusError && statusData?.instance?.state && statusData.instance.state !== 'open') {
                console.log("Instance found in bad state (" + statusData.instance.state + "). Deleting to refresh...");
                await supabase.functions.invoke('evolution-manager', {
                    body: { action: 'delete', instanceName: instance.name }
                });
                // Give it a split second to clear
                await new Promise(r => setTimeout(r, 1000));
            }

            // STEP 2: Create Instance
            const { data: createData, error: createError } = await supabase.functions.invoke('evolution-manager', {
                body: {
                    action: 'create',
                    instanceName: instance.name,
                    number: phoneNumber
                }
            });

            if (createError) throw createError;
            if (createData?.error) throw new Error(createData.error);

            // STEP 3: Get QR Code
            const { data: connectData, error: connectError } = await supabase.functions.invoke('evolution-manager', {
                body: { action: 'connect', instanceName: instance.name }
            });

            if (connectError) throw connectError;
            if (connectData?.error) throw new Error(connectData.error);

            if (connectData?.base64) {
                setQrCode(connectData.base64);
                await supabase.from('instances').update({ status: 'connecting' }).eq('id', instance.id);
            } else if (connectData?.instance?.state === 'open') {
                toast.success("Conectado!");
                await supabase.from('instances').update({ status: 'open' }).eq('id', instance.id);
                setConnectingInstance(null);
                fetchData();
            } else {
                toast.warning("Não foi possível obter o QR Code. Tente atualizar.");
            }

        } catch (error: any) {
            console.error("Connection Error:", error);

            // Try to extract detailed error message
            let errorMessage = error.message || "Erro desconhecido";
            // Check if it's the "already exists" error bubbling up in a way we missed
            if (errorMessage.includes("already in use")) {
                // Retry connect strictly? No, we should have caught it above. 
                // If we are here, it means we really couldn't handle it or it failed elsewhere.
            }

            try {
                if (error.context && error.context.json) {
                    const body = await error.context.json();
                    errorMessage = `Evolution API: ${body.error || JSON.stringify(body)}`;
                }
            } catch (e) { }

            // Double check if we can ignore it here too if logic above failed (redundancy)
            if (errorMessage.includes("already in use")) {
                // If creation failed but flow stopped, user has to click again? 
                // We want to recover.
                // Actually, if we catch it above, we won't be here.
            }

            toast.error(`Erro ao conectar: ${errorMessage}`);
            setConnectingInstance(null);
        }
    };

    const handleRefreshStatus = async (instance: Instance) => {
        const { data } = await supabase.functions.invoke('evolution-manager', {
            body: { action: 'status', instanceName: instance.name }
        });
        if (data?.instance?.state) {
            await supabase.from('instances').update({ status: data.instance.state }).eq('id', instance.id);
            fetchData();
            toast.success("Status: " + data.instance.state);
        }
    };

    const handleDeleteInstance = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja EXCLUIR a conexão "${name}"? Isso vai desconectar o WhatsApp.`)) return;

        // Delete from Evolution (Optional - good practice to logout)
        await supabase.functions.invoke('evolution-manager', {
            body: { action: 'delete', instanceName: name } // API needs to support DELETE or Logout
        });

        // Delete from DB (Cascade removes members)
        const { error } = await supabase.from('instances').delete().eq('id', id);
        if (error) toast.error("Erro ao excluir");
        else {
            toast.success("Conexão excluída");
            fetchData();
        }
    };

    const handleCreateInstance = async () => {
        if (!newInstanceName) return toast.error("Nome obrigatório");

        const { error } = await supabase.from('instances').insert({
            name: newInstanceName,
            phone: newInstancePhone, // Save phone number
            status: 'closed',
            company_id: '00000000-0000-0000-0000-000000000000'
        });

        if (error) toast.error("Erro ao criar: " + error.message);
        else {
            toast.success("Conexão criada!");
            setIsNewConnectionOpen(false);
            setNewInstanceName("");
            setNewInstancePhone("");
            fetchData();
        }
    };

    const handleLinkUser = async () => {
        if (!selectedInstanceId || !userToLink) return;

        // Check if user is already linked to another instance -> Auto-unlink?
        // For now, let's just insert. The constraints allow multiple instances per user?
        // User requested: "user has to be auto-unlinked from existing instance".

        // 1. Find if user is in any other instance
        const { data: existingLinks } = await supabase
            .from('instance_members')
            .select('id, instance_id')
            .eq('user_id', userToLink);

        if (existingLinks && existingLinks.length > 0) {
            const confirmSwitch = confirm("Este usuário já está em outra conexão. Deseja mover ele para cá?");
            if (!confirmSwitch) return;

            // Remove from others
            await supabase.from('instance_members').delete().eq('user_id', userToLink);
        }

        // 2. Add to this instance
        const { error } = await supabase.from('instance_members').insert({
            instance_id: selectedInstanceId,
            user_id: userToLink
        });

        if (error) toast.error("Erro ao vincular");
        else {
            toast.success("Usuário vinculado!");
            setSelectedInstanceId(null);
            setUserToLink("");
            fetchData();
        }
    };

    const handleUnlinkUser = async (instanceId: string, userId: string) => {
        if (!confirm("Remover usuário desta conexão?")) return;

        const { error } = await supabase
            .from('instance_members')
            .delete()
            .match({ instance_id: instanceId, user_id: userId });

        if (error) toast.error("Erro ao desvincular");
        else {
            toast.success("Usuário removido da conexão");
            fetchData();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Dialog open={isNewConnectionOpen} onOpenChange={setIsNewConnectionOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Smartphone className="h-4 w-4 mr-2" /> Nova Conexão
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Conexão WhatsApp</DialogTitle>
                                <DialogDescription>Crie uma nova instância para conectar um número.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome da Conexão</label>
                                    <Input
                                        placeholder="Ex: WhatsApp Vendas"
                                        value={newInstanceName}
                                        onChange={e => setNewInstanceName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Número do WhatsApp (Com DDD)</label>
                                    <Input
                                        placeholder="Ex: 5511999999999"
                                        value={newInstancePhone}
                                        onChange={e => setNewInstancePhone(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Somente números. Necessário para a API conectar mais rápido.</p>
                                </div>
                                <Button onClick={handleCreateInstance} className="w-full">Criar</Button>
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
                        <TeamManager onUpdate={fetchData} />
                    </DialogContent>
                </Dialog>
            </div>

            {loading && <p className="text-muted-foreground text-sm">Carregando equipe...</p>}

            {/* Debug Info */}
            <div className="p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground mb-4">
                <p>Status Debug:</p>
                <p>Project: {process.env.NODE_ENV === 'development' ? supabase.supabaseUrl : '***'}</p>
                <p>Function: evolution-manager</p>
                <p>Verify: {instances.length} connections loaded</p>
            </div>

            <div className="grid gap-4">
                {instances.map(inst => (
                    <div key={inst.id} className="border rounded-lg p-4 flex flex-col gap-4 bg-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${inst.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                                    <Smartphone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{inst.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className={`w-2 h-2 rounded-full ${inst.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        {inst.status === 'open' ? 'Conectado' : 'Desconectado'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleRefreshStatus(inst)} title="Atualizar Status">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteInstance(inst.id, inst.name)} title="Excluir Conexão">
                                    <Trash2 className="h-4 w-4" />
                                </Button>

                                <Dialog open={connectingInstance === inst.id} onOpenChange={(o) => !o && setConnectingInstance(null)}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant={inst.status === 'open' ? 'outline' : 'default'} onClick={() => handleConnect(inst)}>
                                            {inst.status === 'open' ? 'Reconectar' : 'Conectar QR Code'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Escanear QR Code</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex justify-center p-4">
                                            {qrCode ? (
                                                <div className="bg-white p-4 rounded-lg">
                                                    <img src={qrCode} className="w-64 h-64" alt="QR Code" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground py-8">
                                                    <Loader2 className="h-8 w-8 animate-spin" />
                                                    <p>Gerando código...</p>
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="bg-muted/30 rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Usuários Vinculados
                                </h4>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setSelectedInstanceId(inst.id)}>
                                            <LinkIcon className="h-3 w-3 mr-1" /> Vincular Usuário
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Vincular Usuário a {inst.name}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-sm">Selecione o Corretor</label>
                                                <select
                                                    className="w-full p-2 border rounded-md"
                                                    value={userToLink}
                                                    onChange={e => setUserToLink(e.target.value)}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {brokers.map(b => (
                                                        <option key={b.id} value={b.id}>{b.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <Button onClick={handleLinkUser} className="w-full">
                                                Confirmar Vínculo
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="space-y-2">
                                {inst.members.length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic">Nenhum usuário vinculado a esta conexão.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {inst.members.map(m => (
                                            <Badge key={m.user.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {m.user.name}
                                                <button
                                                    onClick={() => handleUnlinkUser(inst.id, m.user.id)}
                                                    className="ml-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-full p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {instances.length === 0 && !loading && (
                    <div className="text-center p-8 border-2 border-dashed rounded text-muted-foreground">
                        <p>Nenhuma conexão WhatsApp criada.</p>
                        <Button variant="link" onClick={() => setIsNewConnectionOpen(true)}>Criar a primeira</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

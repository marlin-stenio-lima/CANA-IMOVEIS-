import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Shield, Copy, Check, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamPermissionsModal } from "./TeamPermissionsModal";
import { Label } from "@/components/ui/label";

export function TeamManager({ onUpdate }: { onUpdate?: () => void }) {
    const { profile } = useAuth();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Modals
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [permissionsMember, setPermissionsMember] = useState<any | null>(null);

    // Link Generator State
    const [inviteRole, setInviteRole] = useState("agent");
    const [inviteArea, setInviteArea] = useState("imoveis");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);

    const fetchTeam = async () => {
        setLoading(true);
        // Featches real users from profiles
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data) setMembers(data);
        setLoading(false);
    };

    useEffect(() => { fetchTeam(); }, []);

    const handleGenerateLink = () => {
        // Creates a link pointing to the homepage / auth with URL params
        const baseUrl = window.location.origin;
        const url = new URL(`${baseUrl}/auth`);
        url.searchParams.set('action', 'register');
        url.searchParams.set('role', inviteRole);
        url.searchParams.set('area', inviteArea);
        if (profile?.company_id) {
            url.searchParams.set('company_id', profile.company_id);
        }
        
        setGeneratedLink(url.toString());
        setCopied(false);
    };

    const handleDeleteMember = async (memberId: string, memberName: string) => {
        if (!confirm(`Tem certeza que deseja remover ${memberName} da equipe e excluí-lo completamente do sistema?`)) return;
        
        try {
            // Chama a função do banco de dados (RPC) que tem permissão para deletar de auth.users
            const { error } = await supabase.rpc('delete_user_by_admin', { p_user_id: memberId });
            
            if (error) {
                toast.error("Erro ao remover usuário: " + error.message);
            } else {
                toast.success("Usuário removido com sucesso!");
                fetchTeam();
                if (onUpdate) onUpdate();
            }
        } catch (e: any) {
            toast.error("Falha ao remover: " + e.message);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Link copiado para a área de transferência!");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Equipe e Permissões</h3>
                    <p className="text-sm text-muted-foreground">Gerencie quem tem acesso ao sistema, crie convites e edite permissões.</p>
                </div>
                
                {/* Invite Generator Modal */}
                <Dialog open={isInviteOpen} onOpenChange={(open) => { setIsInviteOpen(open); if(!open) setGeneratedLink(""); }}>
                    <DialogTrigger asChild>
                        <Button size="sm"><UserPlus className="h-4 w-4 mr-2" /> Gerar Convite</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Gerar Link de Convite</DialogTitle>
                            <DialogDescription>
                                Crie um link personalizado para convidar novos usuários.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Qual será o cargo?</Label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="agent">Usuário Comum (Corretor)</SelectItem>
                                        <SelectItem value="admin">Administrador Geral</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Em qual área o usuário vai atuar?</Label>
                                <Select value={inviteArea} onValueChange={setInviteArea}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="imoveis">Apenas Imóveis</SelectItem>
                                        <SelectItem value="barcos">Apenas Barcos</SelectItem>
                                        <SelectItem value="both">Ambas as Áreas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={handleGenerateLink} className="w-full">
                                Gerar Link
                            </Button>

                            {generatedLink && (
                                <div className="p-3 bg-secondary rounded-lg border mt-4 flex items-center gap-2">
                                    <Input value={generatedLink} readOnly className="h-8 flex-1 text-xs" />
                                    <Button size="sm" variant="outline" onClick={copyToClipboard} className="shrink-0 gap-2 h-8">
                                        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                        {copied ? "Copiado!" : "Copiar"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome e Contato</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Áreas Liberadas</TableHead>
                            <TableHead className="text-right">Permissões Especiais</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    Nenhum membro encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((m) => {
                                const roleName = m.role === 'admin' || m.role === 'owner' ? 'Admin' : 'Corretor';
                                const isSuper = m.role === 'owner';
                                const areas = m.access_areas || ['imoveis', 'barcos'];
                                
                                return (
                                <TableRow key={m.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{m.full_name || m.email || "Usuário não identificou o nome"}</span>
                                            <span className="text-xs text-muted-foreground">{m.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${m.role === 'admin' || m.role === 'owner' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {roleName}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {!areas.length && <span className="text-xs text-muted-foreground">Nenhuma</span>}
                                            {areas.includes('imoveis') && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded border">Imóveis</span>}
                                            {areas.includes('barcos') && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded border">Barcos</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!isSuper ? (
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => setPermissionsMember(m)} className="h-8 gap-1 text-xs">
                                                    <Shield className="h-3 w-3" />
                                                    Gerenciar
                                                </Button>
                                                {m.role !== 'owner' && m.email !== 'tatiana@canaaluxo.com' && m.full_name?.toLowerCase() !== 'tatiana' && (
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteMember(m.id, m.full_name || m.email)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Master</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Permissions Modal */}
            <TeamPermissionsModal 
                isOpen={!!permissionsMember} 
                onClose={() => setPermissionsMember(null)}
                member={permissionsMember}
                onUpdate={fetchTeam}
            />
        </div>
    )
}

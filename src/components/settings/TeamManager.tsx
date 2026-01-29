import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Trash2, Pencil, Save, X } from "lucide-react";
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

export function TeamManager({ onUpdate }: { onUpdate?: () => void }) {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("agent");

    const fetchTeam = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: false });
        if (data) setMembers(data);
        setLoading(false);
    };

    useEffect(() => { fetchTeam(); }, []);

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setRole("agent");
        setEditingId(null);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) resetForm();
        setIsOpen(open);
    };

    const handleEdit = (member: any) => {
        setEditingId(member.id);
        setName(member.name);
        setEmail(member.email || "");
        setPhone(member.phone || "");
        setRole(member.role);
        setIsOpen(true);
    };

    const handleSave = async () => {
        if (!name) return toast.error("Nome obrigatório");

        setLoading(true);

        if (editingId) {
            // Update existing
            const { error } = await supabase
                .from('team_members')
                .update({ name, email, phone, role: role as any })
                .eq('id', editingId);

            if (error) {
                console.error(error);
                toast.error("Erro ao atualizar membro");
            } else {
                toast.success("Membro atualizado!");
                setIsOpen(false);
                fetchTeam();
                if (onUpdate) onUpdate();
            }
        } else {
            // Create new
            const { data: newMember, error } = await supabase.from('team_members').insert({
                name,
                email,
                phone,
                role: role as any,
                company_id: '00000000-0000-0000-0000-000000000000', // Placeholder
            }).select().single();

            if (error) {
                console.error("Supabase Error:", error);
                toast.error(`Erro: ${error.message || "Falha ao adicionar membro"}`);
            } else {
                toast.success("Membro adicionado!");
                // Automatic Instance Creation REMOVED as per user request
                // We now only create the user. Connection is manual.

                setIsOpen(false);
                fetchTeam();
                if (onUpdate) onUpdate();
            }
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este membro?")) return;
        const { error } = await supabase.from('team_members').delete().eq('id', id);
        if (error) toast.error("Erro ao remover");
        else {
            toast.success("Membro removido");
            fetchTeam();
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Membros da Equipe</h3>
                    <p className="text-sm text-muted-foreground">Gerencie quem tem acesso ao sistema e atribua funções.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button size="sm"><UserPlus className="h-4 w-4 mr-2" /> Adicionar Membro</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Editar Membro" : "Novo Membro"}</DialogTitle>
                            <DialogDescription>
                                {editingId ? "Atualize as informações do membro da equipe." : "Adicione um corretor para gerenciar leads e WhatsApp."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome</label>
                                <Input placeholder="Nome do Corretor" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email (Opcional)</label>
                                <Input placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefone / WhatsApp</label>
                                <Input placeholder="5511999999999" value={phone} onChange={e => setPhone(e.target.value)} />
                                <p className="text-xs text-muted-foreground">Opcional. Adicione se quiser vincular uma conta de WhatsApp depois.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Função</label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="agent">Corretor (Acesso Limitado)</SelectItem>
                                        <SelectItem value="admin">Admin (Acesso Total)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSave} disabled={loading} className="w-full">
                                {loading ? "Salvando..." : (editingId ? "Salvar Alterações" : "Adicionar Membro")}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
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
                            members.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">{m.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{m.email || "-"}</span>
                                            <span className="text-xs text-muted-foreground">{m.phone || ""}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${m.role === 'admin' ? 'bg-red-100 text-red-700' :
                                            'bg-green-100 text-green-700'
                                            }`}>
                                            {m.role === 'agent' ? 'Corretor' : 'Admin'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(m)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

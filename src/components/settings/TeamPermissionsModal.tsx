import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function TeamPermissionsModal({ isOpen, onClose, member, onUpdate }: { isOpen: boolean, onClose: () => void, member: any, onUpdate: () => void }) {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(member?.role || 'agent');
    const [accessAreas, setAccessAreas] = useState<string[]>(member?.access_areas || ['imoveis', 'barcos']);
    const [permissions, setPermissions] = useState<Record<string, boolean>>(member?.permissions || {});

    const menuItems = [
        { id: 'dashboard', title: "Dashboard" },
        { id: 'contatos', title: "Contatos" },
        { id: 'kanban', title: "Kanban" },
        { id: 'conversas', title: "Conversas" },
        { id: 'tarefas', title: "Tarefas" },
        { id: 'agendamentos', title: "Agendamentos" },
        { id: 'central_ia', title: "Central IA" },
        { id: 'roletas', title: "Roletas (Distribuição)" },
        { id: 'whatsapp', title: "WhatsApp" },
        { id: 'configuracoes', title: "Configurações Globais" },
        { id: 'config_site', title: "Configurações do Site" },
        { id: 'integracoes', title: "Integrações" },
    ];

    const toggleArea = (area: string) => {
        setAccessAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
    };

    const togglePermission = (id: string, checked: boolean) => {
        setPermissions(prev => ({ ...prev, [id]: checked }));
    };

    const handleSave = async () => {
        if (!member?.id) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').update({
                role,
                access_areas: accessAreas,
                permissions
            }).eq('id', member.id);

            if (error) throw error;
            toast.success("Permissões atualizadas com sucesso!");
            onUpdate();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Erro ao atualizar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!member) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Permissões: {member.full_name || member.email}</DialogTitle>
                    <DialogDescription>Edite hierarquia, áreas de negócio e acesso fino a menus.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Role */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Hierarquia (Cargo)</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="agent">Usuário Comum (Corretor)</SelectItem>
                                <SelectItem value="admin">Administrador Geral</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Admin tem acesso total por padrão, exceto se bloqueado abaixo.</p>
                    </div>
                    
                    <Separator />

                    {/* Áreas de Negócio */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Áreas de Negócio Autorizadas</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2 border p-2 rounded-md flex-1">
                                <Checkbox 
                                    id="area-imoveis" 
                                    checked={accessAreas.includes('imoveis')} 
                                    onCheckedChange={() => toggleArea('imoveis')} 
                                />
                                <Label htmlFor="area-imoveis" className="cursor-pointer">Imóveis</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-2 rounded-md flex-1">
                                <Checkbox 
                                    id="area-barcos" 
                                    checked={accessAreas.includes('barcos')} 
                                    onCheckedChange={() => toggleArea('barcos')} 
                                />
                                <Label htmlFor="area-barcos" className="cursor-pointer">Barcos</Label>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Menu Granular */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Acessos Individuais (Menu)</Label>
                        <p className="text-xs text-muted-foreground mb-4">Abaixo você pode forçar a liberação ou bloqueio de um menu específico para este usuário.</p>
                        <div className="grid grid-cols-2 gap-3">
                            {menuItems.map(item => {
                                // Default visualization 
                                const isDefaultAllowed = role === 'admin' || ['dashboard', 'contatos', 'kanban', 'conversas', 'tarefas', 'agendamentos', 'whatsapp'].includes(item.id);
                                const isChecked = permissions[item.id] !== undefined ? permissions[item.id] : isDefaultAllowed;

                                return (
                                    <div key={item.id} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md border text-sm">
                                        <Checkbox 
                                            id={`perm-${item.id}`} 
                                            checked={isChecked}
                                            onCheckedChange={(c) => togglePermission(item.id, c === true)}
                                        />
                                        <Label htmlFor={`perm-${item.id}`} className="cursor-pointer font-normal truncate">
                                            {item.title}
                                        </Label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Button onClick={handleSave} disabled={loading} className="w-full">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Salvar Permissões
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Search, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function ContactLinkPropertyModal({ open, onOpenChange, contactId, onSuccess }: any) {
    const { profile } = useAuth();
    const [properties, setProperties] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) {
            fetchProperties();
        }
    }, [open, searchTerm]);

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from("properties")
                .select("*")
                .eq("company_id", profile?.company_id)
                .order("created_at", { ascending: false })
                .limit(20);

            if (searchTerm) {
                query = query.ilike("title", `%${searchTerm}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            setProperties(data || []);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLink = async (propertyId: string) => {
        setIsSaving(true);
        try {
            // Check if already linked
            const { data: existing } = await supabase
                .from("contact_properties")
                .select("id")
                .eq("contact_id", contactId)
                .eq("property_id", propertyId)
                .maybeSingle();

            if (existing) {
                toast.error("Este imóvel já está vinculado a este contato.");
                return;
            }

            const { error } = await supabase.from("contact_properties").insert({
                contact_id: contactId,
                property_id: propertyId,
                company_id: profile?.company_id
            });

            if (error) throw error;
            toast.success("Imóvel vinculado com sucesso!");
            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao vincular imóvel: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Vincular Imóvel / Barco</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por nome ou código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                        {isLoading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin w-5 h-5 text-indigo-600" /></div>
                        ) : properties.length === 0 ? (
                            <p className="text-center text-sm text-slate-500 py-4">Nenhum imóvel encontrado.</p>
                        ) : (
                            properties.map(p => (
                                <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg hover:border-indigo-200 transition-colors bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 overflow-hidden shrink-0">
                                            {p.property_images && p.property_images[0] ? (
                                                <img src={p.property_images[0].url} className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 line-clamp-1">{p.title}</p>
                                            <p className="text-xs text-slate-500 font-medium">R$ {(p.price || 0).toLocaleString('pt-BR')}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => handleLink(p.id)} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Vincular'}
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

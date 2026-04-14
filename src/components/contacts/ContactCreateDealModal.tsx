import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePipelines } from "@/hooks/usePipelines";
import { usePipelineStages } from "@/hooks/usePipelineStages";
import { useDeals } from "@/hooks/useDeals";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContactCreateDealModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contact: any;
    onSuccess: () => void;
}

export function ContactCreateDealModal({ open, onOpenChange, contact, onSuccess }: ContactCreateDealModalProps) {
    const { session } = useAuth();
    const { pipelines, selectedPipeline, setSelectedPipelineId } = usePipelines();
    const { stages } = usePipelineStages(selectedPipeline?.id || null);
    const { createDeal } = useDeals(selectedPipeline?.id || null);

    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");
    const [stageId, setStageId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Initial setups
    useEffect(() => {
        if (open) {
            setTitle(contact?.name || "");
            if (stages.length > 0 && !stageId) {
                setStageId(stages[0].id);
            }
        }
    }, [open, contact, stages]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !selectedPipeline || !stageId) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        setIsLoading(true);
        try {
            await createDeal.mutateAsync({
                title: title.trim(),
                value: value ? parseFloat(value) : 0,
                stage_id: stageId,
                pipeline_id: selectedPipeline.id,
                contact_id: contact.id,
                assigned_to: contact.assigned_to || session?.user?.id || null,
            });
            onSuccess();
            onOpenChange(false);

            // Reset
            setValue("");
            setTitle(contact?.name || "");

        } catch (error: any) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo Negócio</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Título do Negócio *</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Venda de Imóvel"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Valor do Negócio (R$)</Label>
                        <Input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="0.00"
                            min="0" step="0.01"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Pipeline</Label>
                        <Select value={selectedPipeline?.id || ""} onValueChange={setSelectedPipelineId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um pipeline" />
                            </SelectTrigger>
                            <SelectContent>
                                {pipelines.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Estágio *</Label>
                        <Select value={stageId} onValueChange={setStageId} disabled={!selectedPipeline || stages.length === 0}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um estágio" />
                            </SelectTrigger>
                            <SelectContent>
                                {stages.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading || !selectedPipeline || !stageId}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Criar Negócio
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

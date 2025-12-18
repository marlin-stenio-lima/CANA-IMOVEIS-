import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type LossReason = Tables<"loss_reasons">;

interface LossReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lossReasons: LossReason[];
  onConfirm: (lossReasonId: string) => void;
  onCreateReason: (name: string) => void;
  isLoading?: boolean;
}

export function LossReasonModal({
  open,
  onOpenChange,
  lossReasons,
  onConfirm,
  onCreateReason,
  isLoading,
}: LossReasonModalProps) {
  const [selectedReasonId, setSelectedReasonId] = useState<string>("");
  const [newReasonName, setNewReasonName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleConfirm = () => {
    if (selectedReasonId) {
      onConfirm(selectedReasonId);
      setSelectedReasonId("");
      onOpenChange(false);
    }
  };

  const handleCreateReason = () => {
    if (newReasonName.trim()) {
      onCreateReason(newReasonName.trim());
      setNewReasonName("");
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Motivo da Perda</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Selecione o motivo pelo qual este deal foi perdido:
          </p>

          {lossReasons.length > 0 ? (
            <RadioGroup value={selectedReasonId} onValueChange={setSelectedReasonId}>
              <div className="space-y-2">
                {lossReasons.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id} className="cursor-pointer">
                      {reason.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum motivo de perda cadastrado.
            </p>
          )}

          {isCreating ? (
            <div className="flex gap-2 mt-4">
              <Input
                value={newReasonName}
                onChange={(e) => setNewReasonName(e.target.value)}
                placeholder="Nome do motivo"
                onKeyDown={(e) => e.key === "Enter" && handleCreateReason()}
                autoFocus
              />
              <Button onClick={handleCreateReason} disabled={!newReasonName.trim()}>
                Adicionar
              </Button>
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar novo motivo
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedReasonId || isLoading}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PREDEFINED_REASONS = [
  "Preço muito alto",
  "Comprou com concorrente",
  "Desistiu da compra/aluguel",
  "Apenas curioso",
  "Não aprovou crédito",
  "Imóvel indisponível",
  "Outros"
];

interface LossReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lossReasons?: any[]; // Keep for compatibility but ignore
  onConfirm: (reason: string) => void;
  onCreateReason?: (name: string) => void; // Keep for compatibility
  isLoading?: boolean;
}

export function LossReasonModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: LossReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");

  const handleConfirm = () => {
    if (selectedReason) {
      const finalReason = selectedReason === "Outros" ? customReason : selectedReason;
      if (finalReason.trim()) {
        onConfirm(finalReason.trim());
        setSelectedReason("");
        setCustomReason("");
        onOpenChange(false);
      }
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
            Selecione o motivo pelo qual este lead foi perdido:
          </p>

          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            <div className="space-y-3">
              {PREDEFINED_REASONS.map((reason) => (
                <div key={reason} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={reason} id={reason} />
                    <Label htmlFor={reason} className="cursor-pointer">
                      {reason}
                    </Label>
                  </div>
                  {selectedReason === "Outros" && reason === "Outros" && (
                    <div className="pl-6 pt-1">
                      <Input
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Digite o motivo detalhado..."
                        onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedReason || (selectedReason === "Outros" && !customReason.trim()) || isLoading}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

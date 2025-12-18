import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Pipeline = Tables<"pipelines">;
type PipelineStage = Tables<"pipeline_stages">;

interface PipelineConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipeline?: Pipeline | null;
  stages: PipelineStage[];
  onSavePipeline: (data: { name: string; description: string; is_default: boolean }) => void;
  onCreateStage: (data: { name: string; color: string; target_days: number; is_won_stage: boolean; is_lost_stage: boolean }) => void;
  onUpdateStage: (id: string, data: Partial<PipelineStage>) => void;
  onDeleteStage: (id: string) => void;
  isCreating?: boolean;
}

const defaultColors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", 
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
];

export function PipelineConfigModal({
  open,
  onOpenChange,
  pipeline,
  stages,
  onSavePipeline,
  onCreateStage,
  onUpdateStage,
  onDeleteStage,
  isCreating,
}: PipelineConfigModalProps) {
  const [name, setName] = useState(pipeline?.name || "");
  const [description, setDescription] = useState(pipeline?.description || "");
  const [isDefault, setIsDefault] = useState(pipeline?.is_default || false);
  
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState(defaultColors[0]);
  const [newStageTargetDays, setNewStageTargetDays] = useState(7);

  const handleSavePipeline = () => {
    if (!name.trim()) return;
    onSavePipeline({ name: name.trim(), description: description.trim(), is_default: isDefault });
  };

  const handleCreateStage = () => {
    if (!newStageName.trim()) return;
    onCreateStage({
      name: newStageName.trim(),
      color: newStageColor,
      target_days: newStageTargetDays,
      is_won_stage: false,
      is_lost_stage: false,
    });
    setNewStageName("");
    setNewStageColor(defaultColors[stages.length % defaultColors.length]);
    setNewStageTargetDays(7);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Criar Pipeline" : "Configurar Pipeline"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="stages" disabled={isCreating}>Estágios</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Pipeline</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vendas, Projetos, Recrutamento..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo deste pipeline..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Pipeline Padrão</Label>
                <p className="text-sm text-muted-foreground">
                  Este pipeline será selecionado automaticamente
                </p>
              </div>
              <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePipeline} disabled={!name.trim()}>
                {isCreating ? "Criar Pipeline" : "Salvar"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="stages" className="space-y-4 pt-4">
            {/* Existing stages */}
            <div className="space-y-2">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stage.color || "#3B82F6" }}
                  />
                  <Input
                    value={stage.name}
                    onChange={(e) => onUpdateStage(stage.id, { name: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={stage.target_days || 7}
                    onChange={(e) => onUpdateStage(stage.id, { target_days: parseInt(e.target.value) || 7 })}
                    className="w-20"
                    min={1}
                  />
                  <span className="text-xs text-muted-foreground">dias</span>
                  <div className="flex gap-1">
                    {stage.is_won_stage && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Ganho</Badge>
                    )}
                    {stage.is_lost_stage && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">Perda</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteStage(stage.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add new stage */}
            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <p className="text-sm font-medium">Adicionar novo estágio</p>
              <div className="flex gap-3">
                <div className="flex gap-1">
                  {defaultColors.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full border-2 ${newStageColor === color ? "border-foreground" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewStageColor(color)}
                    />
                  ))}
                </div>
                <Input
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="Nome do estágio"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateStage()}
                />
                <Input
                  type="number"
                  value={newStageTargetDays}
                  onChange={(e) => setNewStageTargetDays(parseInt(e.target.value) || 7)}
                  className="w-20"
                  min={1}
                />
                <span className="text-xs text-muted-foreground self-center">dias</span>
                <Button onClick={handleCreateStage} disabled={!newStageName.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

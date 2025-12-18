import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { usePipelines } from "@/hooks/usePipelines";
import { usePipelineStages } from "@/hooks/usePipelineStages";
import { useDeals } from "@/hooks/useDeals";
import { useLossReasons } from "@/hooks/useLossReasons";
import {
  PipelineSelector,
  PipelineConfigModal,
  KanbanColumn,
  LossReasonModal,
  CreateDealModal,
} from "@/components/kanban";
import { toast } from "sonner";

export default function Kanban() {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [isCreatingPipeline, setIsCreatingPipeline] = useState(false);
  const [lossModalOpen, setLossModalOpen] = useState(false);
  const [createDealModalOpen, setCreateDealModalOpen] = useState(false);
  const [selectedDealForLoss, setSelectedDealForLoss] = useState<string | null>(null);
  const [initialStageForDeal, setInitialStageForDeal] = useState<string | undefined>(undefined);

  const {
    pipelines,
    isLoading: pipelinesLoading,
    selectedPipeline,
    setSelectedPipelineId,
    createPipeline,
    updatePipeline,
  } = usePipelines();

  const {
    stages,
    isLoading: stagesLoading,
    createStage,
    updateStage,
    deleteStage,
  } = usePipelineStages(selectedPipeline?.id || null);

  const {
    deals,
    isLoading: dealsLoading,
    createDeal,
    moveDealToStage,
    markAsWon,
    markAsLost,
    deleteDeal,
  } = useDeals(selectedPipeline?.id || null);

  const { lossReasons, createLossReason } = useLossReasons();

  const getDealsByStage = (stageId: string) => {
    return deals.filter((deal) => deal.stage_id === stageId);
  };

  const handleCreateNewPipeline = () => {
    setIsCreatingPipeline(true);
    setConfigModalOpen(true);
  };

  const handleOpenConfig = () => {
    setIsCreatingPipeline(false);
    setConfigModalOpen(true);
  };

  const handleSavePipeline = async (data: { name: string; description: string; is_default: boolean }) => {
    if (isCreatingPipeline) {
      await createPipeline.mutateAsync(data);
    } else if (selectedPipeline) {
      await updatePipeline.mutateAsync({ id: selectedPipeline.id, ...data });
    }
    if (isCreatingPipeline) {
      setConfigModalOpen(false);
    }
  };

  const handleCreateStage = async (data: { name: string; color: string; target_days: number; is_won_stage: boolean; is_lost_stage: boolean }) => {
    if (!selectedPipeline) return;
    await createStage.mutateAsync({
      ...data,
      pipeline_id: selectedPipeline.id,
      position: stages.length,
    });
  };

  const handleAddDealToStage = (stageId: string) => {
    setInitialStageForDeal(stageId);
    setCreateDealModalOpen(true);
  };

  const handleCreateDeal = async (data: { title: string; description?: string; value?: number; stage_id?: string }) => {
    if (!selectedPipeline) return;
    await createDeal.mutateAsync({
      ...data,
      pipeline_id: selectedPipeline.id,
    });
  };

  const handleMoveDeal = async (dealId: string, stageId: string) => {
    await moveDealToStage.mutateAsync({ dealId, stageId });
  };

  const handleMarkAsWon = async (dealId: string) => {
    await markAsWon.mutateAsync(dealId);
  };

  const handleMarkAsLost = (dealId: string) => {
    setSelectedDealForLoss(dealId);
    setLossModalOpen(true);
  };

  const handleConfirmLoss = async (lossReasonId: string) => {
    if (selectedDealForLoss) {
      await markAsLost.mutateAsync({ dealId: selectedDealForLoss, lossReasonId });
      setSelectedDealForLoss(null);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (confirm("Tem certeza que deseja excluir este deal?")) {
      await deleteDeal.mutateAsync(dealId);
    }
  };

  const handleViewDeal = (dealId: string) => {
    toast.info("Funcionalidade em desenvolvimento");
  };

  const handleEditDeal = (dealId: string) => {
    toast.info("Funcionalidade em desenvolvimento");
  };

  const isLoading = pipelinesLoading || stagesLoading || dealsLoading;

  // Show empty state if no pipelines exist
  if (!pipelinesLoading && pipelines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-xl font-semibold">Nenhum pipeline encontrado</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Crie seu primeiro pipeline para começar a gerenciar seus deals no Kanban.
        </p>
        <Button onClick={handleCreateNewPipeline}>
          Criar Pipeline
        </Button>
        <PipelineConfigModal
          open={configModalOpen}
          onOpenChange={setConfigModalOpen}
          pipeline={null}
          stages={[]}
          onSavePipeline={handleSavePipeline}
          onCreateStage={handleCreateStage}
          onUpdateStage={() => {}}
          onDeleteStage={() => {}}
          isCreating={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PipelineSelector
            pipelines={pipelines}
            selectedPipeline={selectedPipeline}
            onSelect={setSelectedPipelineId}
            onCreateNew={handleCreateNewPipeline}
            isLoading={pipelinesLoading}
          />
          <Button variant="ghost" size="icon" onClick={handleOpenConfig} disabled={!selectedPipeline}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : stages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
          <p className="text-muted-foreground">Este pipeline ainda não possui estágios.</p>
          <Button variant="outline" onClick={handleOpenConfig}>
            Configurar Estágios
          </Button>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={getDealsByStage(stage.id)}
              allStages={stages}
              onAddDeal={() => handleAddDealToStage(stage.id)}
              onViewDeal={handleViewDeal}
              onEditDeal={handleEditDeal}
              onMoveDeal={handleMoveDeal}
              onMarkAsWon={handleMarkAsWon}
              onMarkAsLost={handleMarkAsLost}
              onDeleteDeal={handleDeleteDeal}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <PipelineConfigModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        pipeline={isCreatingPipeline ? null : selectedPipeline}
        stages={stages}
        onSavePipeline={handleSavePipeline}
        onCreateStage={handleCreateStage}
        onUpdateStage={(id, data) => updateStage.mutate({ id, ...data })}
        onDeleteStage={(id) => deleteStage.mutate(id)}
        isCreating={isCreatingPipeline}
      />

      <LossReasonModal
        open={lossModalOpen}
        onOpenChange={setLossModalOpen}
        lossReasons={lossReasons}
        onConfirm={handleConfirmLoss}
        onCreateReason={(name) => createLossReason.mutate(name)}
      />

      <CreateDealModal
        open={createDealModalOpen}
        onOpenChange={setCreateDealModalOpen}
        stages={stages}
        initialStageId={initialStageForDeal}
        onSubmit={handleCreateDeal}
      />
    </div>
  );
}

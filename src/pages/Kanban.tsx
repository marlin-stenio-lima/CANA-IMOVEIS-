import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Filter, Plus, X } from "lucide-react";
import { usePipelines } from "@/hooks/usePipelines";
import { usePipelineStages } from "@/hooks/usePipelineStages";
import { useDeals } from "@/hooks/useDeals";
import { useLossReasons } from "@/hooks/useLossReasons";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { useTeam } from "@/hooks/useTeam";
import { useProperties } from "@/hooks/useProperties";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  PipelineSelector,
  PipelineConfigModal,
  KanbanColumn,
  KanbanCard,
  LossReasonModal,
  CreateDealModal,
  LinkDealData,
  EditDealModal,
  ViewDealModal
} from "@/components/kanban";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const SOURCES = [
  "Google",
  "Facebook",
  "Instagram",
  "Portal Imobiliário",
  "Indicação",
  "WhatsApp",
  "Outros"
];

export default function Kanban() {
  const { profile } = useAuth();
  const { mode } = useCrmMode();
  const queryClient = useQueryClient();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [isCreatingPipeline, setIsCreatingPipeline] = useState(false);
  const [lossModalOpen, setLossModalOpen] = useState(false);
  const [createDealModalOpen, setCreateDealModalOpen] = useState(false);
  const [selectedDealForLoss, setSelectedDealForLoss] = useState<string | null>(null);
  const [initialStageForDeal, setInitialStageForDeal] = useState<string | undefined>(undefined);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);

  // View/Edit State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null); // Type 'any' temporarily or import DealWithContact

  // Filters State
  const [filters, setFilters] = useState({
    dateRange: "all",
    propertyId: "all",
    source: "all",
    ownerId: "all"
  });

  const {
    pipelines,
    isLoading: pipelinesLoading,
    selectedPipeline,
    setSelectedPipelineId,
    createPipeline,
    updatePipeline,
    deletePipeline,
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
    updateDeal,
    moveDealToStage,
    markAsWon,
    markAsLost,
    deleteDeal,
  } = useDeals(selectedPipeline?.id || null);

  const { lossReasons, createLossReason } = useLossReasons();
  const { data: teamMembers = [] } = useTeam();
  const { properties = [] } = useProperties();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Avoid accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange !== "all") count++;
    if (filters.propertyId !== "all") count++;
    if (filters.source !== "all") count++;
    if (filters.ownerId !== "all") count++;
    return count;
  }, [filters]);

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Safety check for valid deal
      if (!deal || !deal.id) return false;

      // Filter by Pipeline
      if (selectedPipeline && deal.pipeline_id !== selectedPipeline.id) {
        return false;
      }

      // Filter by CRM Mode (Imoveis vs Barcos)
      if (mode && deal.contacts?.business_type) {
        if (deal.contacts.business_type !== mode) {
            return false;
        }
      }
      // Date Filter
      if (filters.dateRange !== "all") {
        const date = new Date(deal.created_at || "");
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (filters.dateRange === "today" && diffDays > 1) return false;
        if (filters.dateRange === "last-7" && diffDays > 7) return false;
        if (filters.dateRange === "last-30" && diffDays > 30) return false;
      }

      // Source Filter (Check contacts source)
      if (filters.source !== "all") {
        if (deal.contacts?.source !== filters.source) return false;
      }

      // Owner Filter (Check deal assigned_to)
      if (filters.ownerId !== "all") {
        if (deal.assigned_to !== filters.ownerId) return false;
      }

      // Property Filter (Check contact interest_property_id)
      if (filters.propertyId !== "all") {
        if (deal.contacts?.interest_property_id !== filters.propertyId) return false;
      }

      return true;
    });
  }, [deals, filters]);

  const getDealsByStage = (stageId: string) => {
    return filteredDeals.filter((deal) => deal.stage_id === stageId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDealId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDealId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the deal
    const deal = deals.find(d => d.id === activeId);
    if (!deal) return;

    // Determine the target stage logic
    let targetStageId = null;

    // Is 'overId' a stage?
    if (stages.find(s => s.id === overId)) {
      targetStageId = overId;
    } else {
      // Did we drop on another card? Find that card's stage
      const overDeal = deals.find(d => d.id === overId);
      if (overDeal) {
        targetStageId = overDeal.stage_id;
      }
    }

    if (targetStageId && targetStageId !== deal.stage_id) {
      const targetStage = stages.find(s => s.id === targetStageId);
      const isLostStage = targetStage?.is_lost_stage || targetStage?.name.toLowerCase().includes('perdid');
      
      if (isLostStage) {
        // Prompts for reason instead of moving directly
        handleMarkAsLost(activeId, targetStageId);
      } else {
        await handleMoveDeal(activeId, targetStageId);
      }
    }

    setActiveDealId(null);
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

  const handleCreateDeal = async (data: LinkDealData) => {
    if (!selectedPipeline || !profile?.company_id) return;

    try {
      // 1. Create Contact
      const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .insert({
          company_id: profile.company_id,
          name: data.contactName,
          phone: data.contactPhone,
          email: data.contactEmail,
          source: data.source,
          assigned_to: data.ownerId,
          interest_property_id: data.propertyId,
          notes: data.description,
          business_type: mode as any
        })
        .select()
        .single();

      if (contactError) throw contactError;

      // 2. Create Deal
      await createDeal.mutateAsync({
        title: data.title,
        description: data.description,
        value: data.value,
        stage_id: data.stage_id,
        pipeline_id: selectedPipeline.id,
        company_id: profile.company_id,
        contact_id: contact.id,
        assigned_to: data.ownerId
      });

      toast.success("Lead criado com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao criar lead: " + error.message);
    }
  };

  const [selectedTargetStageForLoss, setSelectedTargetStageForLoss] = useState<string | null>(null);

  const handleMoveDeal = async (dealId: string, stageId: string) => {
    await moveDealToStage.mutateAsync({ dealId, stageId });
  };

  const handleMarkAsWon = async (dealId: string) => {
    await markAsWon.mutateAsync(dealId);
  };

  const handleMarkAsLost = (dealId: string, targetStageId?: string) => {
    setSelectedDealForLoss(dealId);
    if (targetStageId) {
      setSelectedTargetStageForLoss(targetStageId);
    } else {
      setSelectedTargetStageForLoss(null);
    }
    setLossModalOpen(true);
  };

  const handleConfirmLoss = async (lossReasonText: string) => {
    if (selectedDealForLoss) {
      // If we are moving to a specific lost column, do both
      if (selectedTargetStageForLoss) {
         await updateDeal.mutateAsync({ 
           id: selectedDealForLoss, 
           stage_id: selectedTargetStageForLoss,
           lost_reason: lossReasonText,
           stage: "lost"
         } as any);
      } else {
         await markAsLost.mutateAsync({ dealId: selectedDealForLoss, lostReason: lossReasonText });
      }
      setSelectedDealForLoss(null);
      setSelectedTargetStageForLoss(null);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (confirm("Tem certeza que deseja excluir este deal?")) {
      await deleteDeal.mutateAsync(dealId);
    }
  };

  const handleViewDeal = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedDeal(deal);
      setViewModalOpen(true);
    }
  };

  const handleEditDeal = (dealId: string) => {
    // If called from View Modal, we might already have selectedDeal
    // If called from Card, we have ID
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedDeal(deal);
      setViewModalOpen(false); // Close view if open
      setEditModalOpen(true);
    }
  };

  const handleSaveDealEdit = async (dealId: string, updates: any) => {
    await updateDeal.mutateAsync({ id: dealId, ...updates });
  };

  const clearFilters = () => {
    setFilters({
      dateRange: "all",
      propertyId: "all",
      source: "all",
      ownerId: "all"
    });
  };

  const isStructureLoading = pipelinesLoading || stagesLoading;
  const isDealsLoading = dealsLoading;

  // Show empty state if no pipelines exist (and finished loading structure)
  if (!isStructureLoading && pipelines.length === 0) {
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
          onUpdateStage={() => { }}
          onDeleteStage={() => { }}
          isCreating={true}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] w-full max-w-full overflow-hidden space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 px-1 gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
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

          {/* Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 min-w-5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">Filtrar Leads</h4>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary" onClick={clearFilters}>
                      Limpar
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Data de Criação</Label>
                  <Select value={filters.dateRange} onValueChange={(v) => setFilters(prev => ({ ...prev, dateRange: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as datas</SelectItem>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="last-7">Últimos 7 dias</SelectItem>
                      <SelectItem value="last-30">Últimos 30 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Imóvel de Interesse</Label>
                  <Select value={filters.propertyId} onValueChange={(v) => setFilters(prev => ({ ...prev, propertyId: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os imóveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os imóveis</SelectItem>
                      {properties.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Origem</Label>
                  <Select value={filters.source} onValueChange={(v) => setFilters(prev => ({ ...prev, source: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as origens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as origens</SelectItem>
                      {SOURCES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Responsável</Label>
                  <Select value={filters.ownerId} onValueChange={(v) => setFilters(prev => ({ ...prev, ownerId: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os responsáveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">todos os responsáveis</SelectItem>
                      {teamMembers.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.full_name || m.job_title || "Usuário"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>


          {isDealsLoading && <span className="text-xs text-muted-foreground animate-pulse">Atualizando deals...</span>}
        </div>

        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setCreateDealModalOpen(true)}
          disabled={stages.length === 0}
        >
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Kanban Board */}
      {isStructureLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : stages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Este pipeline ainda não possui estágios.</p>
          <Button variant="outline" onClick={handleOpenConfig}>
            Configurar Estágios
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-2 h-full items-start px-1" style={{
            backgroundImage: "radial-gradient(#ccc 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundColor: "rgba(0,0,0,0.01)"
          }}>
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
          <DragOverlay>
            {activeDealId ? (() => {
              const activeDeal = deals.find(d => d.id === activeDealId);
              const activeStage = activeDeal ? stages.find(s => s.id === activeDeal.stage_id) : null;
              
              if (!activeDeal || !activeStage) return null;
              
              return (
                <div className="w-[280px] opacity-90 scale-105 shadow-2xl cursor-grabbing rotate-2 transition-transform">
                  <KanbanCard
                    deal={activeDeal}
                    stages={stages}
                    currentStage={activeStage}
                    onViewDetails={() => {}}
                    onEdit={() => {}}
                    onMoveToStage={() => {}}
                    onMarkAsWon={() => {}}
                    onMarkAsLost={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              );
            })() : null}
          </DragOverlay>
        </DndContext>
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
        onDeletePipeline={(id) => {
          deletePipeline.mutate(id);
          setConfigModalOpen(false);
        }}
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

      <ViewDealModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        deal={selectedDeal}
        onEdit={() => handleEditDeal(selectedDeal?.id)}
      />

      <EditDealModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        deal={selectedDeal}
        stages={stages}
        onSave={handleSaveDealEdit}
        onDelete={handleDeleteDeal}
        isLoading={isDealsLoading}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

export default function SupportApprovals() {
  const [requests, setRequests] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('property_update_requests')
      .select('*, properties(title)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (data) setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (req: any) => {
    try {
      const propertyChanges = { ...req.changes };
      const newImages = propertyChanges.newImages;
      delete propertyChanges.newImages;

      console.log("Tentando atualizar imóvel", req.property_id, "com dados:", propertyChanges);

      // update property (with select to verify it worked)
      const { data: updatedProp, error: propError } = await supabase
        .from('properties')
        .update(propertyChanges)
        .eq('id', req.property_id)
        .select();
      
      if (propError) {
         console.error("Erro do banco:", propError);
         throw new Error(propError.message);
      }
      
      if (!updatedProp || updatedProp.length === 0) {
         throw new Error("O imóvel não foi atualizado! Verifique se ele ainda existe ou se há bloqueio de permissão (RLS).");
      }

      // Insert new images
      if (newImages && newImages.length > 0) {
          const { data: existing } = await supabase
            .from('property_images')
            .select('position')
            .eq('property_id', req.property_id)
            .order('position', {ascending: false})
            .limit(1);
            
          let startPos = existing && existing.length > 0 ? existing[0].position + 1 : 0;
          
          const imageInserts = newImages.map((url: string, idx: number) => ({
             property_id: req.property_id,
             url: url,
             position: startPos + idx,
             is_cover: false
          }));
          
          const { error: imageError } = await supabase.from('property_images').insert(imageInserts);
          if (imageError) {
              console.error("Erro ao adicionar imagens", imageError);
              toast.error("Erro ao vincular as novas fotos");
          }
      }

      // update status
      const { error: reqError } = await supabase
        .from('property_update_requests')
        .update({ status: 'approved' })
        .eq('id', req.id);

      if (reqError) throw new Error(reqError.message);

      toast.success("Atualização aprovada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      fetchRequests();
    } catch(e: any) {
      toast.error("Erro ao aprovar: " + e.message);
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('property_update_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw new Error(error.message);
      toast.success("Solicitação rejeitada.");
      fetchRequests();
    } catch(e: any) {
      toast.error("Erro ao rejeitar: " + e.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Suporte e Aprovações</h1>
      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
           <AlertCircle className="mx-auto w-12 h-12 text-slate-300 mb-4" />
           <p className="text-slate-500 font-medium">Nenhuma solicitação de atualização pendente no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map(r => (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{r.properties?.title || 'Imóvel Desconhecido'}</h3>
                  <p className="text-sm text-slate-500 font-medium">Solicitado por: <span className="text-slate-700">{r.requested_by_name || 'Desconhecido'}</span> - {format(new Date(r.created_at), "dd/MM/yyyy HH:mm")}</p>
                  {r.requested_by_phone && <p className="text-xs text-slate-500 mt-1">Telefone: {r.requested_by_phone}</p>}
                </div>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 px-3 py-1 font-bold">Aprovação Pendente</Badge>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Dados a Atualizar</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {Object.entries(r.changes || {}).map(([key, val]) => {
                     if (key === 'newImages') return null;
                     
                     // Format arrays
                     const displayVal = Array.isArray(val) ? val.join(', ') : String(val);
                     if (!displayVal || displayVal === '0' || displayVal === 'NaN') return null; // skip empty
                     
                     return (
                       <div key={key} className="flex flex-col bg-white p-2.5 rounded-lg shadow-sm border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                             {key.replace('_', ' ')}
                          </span>
                          <span className="font-semibold text-slate-800 mt-0.5 break-words">{displayVal}</span>
                       </div>
                     );
                  })}
                </div>
                
                {r.changes?.newImages && r.changes.newImages.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Novas Fotos Enviadas</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {r.changes.newImages.map((url: string, idx: number) => (
                        <a key={idx} href={url} target="_blank" rel="noreferrer" className="shrink-0 border-2 border-indigo-100 rounded-lg overflow-hidden hover:border-indigo-400 transition-colors block">
                          <img src={url} alt={`Preview ${idx}`} className="h-20 w-32 object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleReject(r.id)}>
                   <X className="w-4 h-4 mr-2" />Rejeitar Modificação
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md" onClick={() => handleApprove(r)}>
                   <Check className="w-4 h-4 mr-2" />Aprovar e Salvar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

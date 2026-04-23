import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Loader2, Send, CheckCircle2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

export default function PropertyUpdateRequest() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    title: "",
    price: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    parking_spots: "",
    area_total: "",
    area_built: "",
    condo_fee: "",
    iptu: "",
    features: "",
    owner_name: "",
    owner_phone: "",
    owner_email: ""
  });

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    if (!propertyId) return;
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (error) throw error;
      if (data) {
        setProperty(data);
        setFormData({
          name: "",
          phone: "",
          email: "",
          title: data.title || "",
          price: data.price ? data.price.toString() : "",
          description: data.description || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          parking_spots: data.parking_spots?.toString() || "",
          area_total: data.area_total?.toString() || "",
          area_built: data.area_built?.toString() || "",
          condo_fee: data.condo_fee?.toString() || "",
          iptu: data.iptu?.toString() || "",
          features: (data.features || []).join(', '),
          owner_name: data.owner_name || "",
          owner_phone: data.owner_phone || "",
          owner_email: data.owner_email || ""
        });
      }
    } catch(e) {
      console.error(e);
      toast.error("Imóvel não encontrado. Verifique o link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const uploadedImageUrls: string[] = [];

      // Upload images first
      if (images.length > 0) {
        for (const file of images) {
          const fileExt = file.name.split('.').pop();
          const fileName = `requests/${propertyId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);
            
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('property-images')
              .getPublicUrl(fileName);
            uploadedImageUrls.push(publicUrl);
          } else {
            console.error("Upload error", uploadError);
          }
        }
      }

      const changes: any = {
        title: formData.title,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        parking_spots: parseInt(formData.parking_spots) || 0,
        area_total: parseFloat(formData.area_total) || 0,
        area_built: parseFloat(formData.area_built) || 0,
        condo_fee: parseFloat(formData.condo_fee) || 0,
        iptu: parseFloat(formData.iptu) || 0,
        features: formData.features.split(',').map(s => s.trim()).filter(Boolean),
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        owner_email: formData.owner_email
      };

      if (uploadedImageUrls.length > 0) {
        changes.newImages = uploadedImageUrls;
      }

      const { error } = await supabase.from('property_update_requests').insert({
        property_id: propertyId,
        requested_by_name: formData.owner_name || "Não informado",
        requested_by_phone: formData.owner_phone || "",
        requested_by_email: formData.owner_email || "",
        changes: changes
      });

      if (error) throw error;
      setIsSuccess(true);
    } catch(e) {
      console.error(e);
      toast.error("Erro ao enviar solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><h1>Imóvel não encontrado</h1></div>;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-100">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           <h2 className="text-2xl font-black text-slate-800 mb-2">Solicitação Enviada!</h2>
           <p className="text-slate-500 font-medium leading-relaxed">Sua sugestão de atualização para o imóvel <strong>{property.title}</strong> foi enviada para aprovação do administrador do CRM.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 scale-110">
             <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Atualização de Imóvel</h1>
          <p className="text-slate-500 font-medium">Preencha abaixo quais informações você deseja alterar neste imóvel. Suas mudanças irão para aprovação.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
           <div className="p-6 md:p-8 space-y-8">
              
              <div>
                <h3 className="text-sm font-black text-indigo-500 uppercase tracking-widest mb-4">Dados Básicos</h3>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Título / Nome do Imóvel</label>
                     <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Preço de Venda (Apenas números ex: 500000.00)</label>
                     <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Descrição Pública</label>
                     <Textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-white resize-none" />
                   </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h3 className="text-sm font-black text-indigo-500 uppercase tracking-widest mb-4">Características (Opcional)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Quartos</label>
                     <Input type="number" min="0" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Banheiros</label>
                     <Input type="number" min="0" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Vagas (Garagem)</label>
                     <Input type="number" min="0" value={formData.parking_spots} onChange={e => setFormData({...formData, parking_spots: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Área Total (m²)</label>
                     <Input type="number" min="0" value={formData.area_total} onChange={e => setFormData({...formData, area_total: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Área Útil (m²)</label>
                     <Input type="number" min="0" value={formData.area_built} onChange={e => setFormData({...formData, area_built: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Condomínio (R$)</label>
                     <Input type="number" step="0.01" min="0" value={formData.condo_fee} onChange={e => setFormData({...formData, condo_fee: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">IPTU (R$)</label>
                     <Input type="number" step="0.01" min="0" value={formData.iptu} onChange={e => setFormData({...formData, iptu: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5 sm:col-span-2">
                     <label className="text-xs font-bold text-slate-700">Comodidades (separadas por vírgula)</label>
                     <Input value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="Ex: Piscina, Churrasqueira, Salão de Festas, Cozinha" className="bg-white" />
                     <p className="text-[10px] text-slate-400 mt-1">Ex: Sala, Cozinha, Sala de Festas, etc.</p>
                   </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h3 className="text-sm font-black text-indigo-500 uppercase tracking-widest mb-4">Informações Ocultas do Proprietário</h3>
                <p className="text-xs text-slate-500 mb-4">Estes dados são visíveis apenas para os corretores do CRM.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Nome do Proprietário</label>
                     <Input value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700">Telefone / WhatsApp do Proprietário</label>
                     <Input value={formData.owner_phone} onChange={e => setFormData({...formData, owner_phone: e.target.value})} className="bg-white" />
                   </div>
                   <div className="space-y-1.5 sm:col-span-2">
                     <label className="text-xs font-bold text-slate-700">E-mail do Proprietário</label>
                     <Input type="email" value={formData.owner_email} onChange={e => setFormData({...formData, owner_email: e.target.value})} className="bg-white" />
                   </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h3 className="text-sm font-black text-indigo-500 uppercase tracking-widest mb-4">Novas Fotos</h3>
                <p className="text-xs text-slate-500 mb-4">Adicione novas fotos ao anúncio. Elas serão anexadas às existentes após a aprovação.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border">
                      <img 
                        src={URL.createObjectURL(img)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-100 transition-opacity h-6 w-6"
                        onClick={() => removeImage(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div 
                    className="aspect-video rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-8 w-8 text-indigo-400 mb-2" />
                    <span className="text-xs text-indigo-600 font-medium">Adicionar foto</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>

           </div>

           <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <p className="text-xs text-slate-400 font-medium max-w-[250px]">A alteração e as novas fotos serão enviadas para o painel de aprovações do CRM.</p>
              <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 min-w-[200px] shadow-lg shadow-indigo-200 w-full sm:w-auto">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                {isSubmitting ? 'Enviando...' : 'Pedir Atualização'}
              </Button>
           </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, KeyRound, Bot, Sparkles } from "lucide-react";

export function AiSettings() {
    const { profile } = useAuth();
    const [apiKey, setApiKey] = useState("");
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (profile?.company_id) {
            loadSettings();
        }
    }, [profile?.company_id]);

    const loadSettings = async () => {
        try {
            setIsFetching(true);
            // Sempre pega a primeira empresa cadastrada (Canaã)
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setApiKey(data.openai_api_key || "");
                setIsEnabled(data.ai_enabled || false);
            }
        } catch (error: any) {
            console.error("Error loading AI settings", error);
            // toast.error(`Erro: ${error.message}`); // Desativado para não poluir se for apenas tabela vazia
        } finally {
            setIsFetching(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Tenta achar a primeira empresa para atualizar
            const { data: currentCompany } = await supabase
                .from('companies')
                .select('id')
                .limit(1)
                .single();

            const companyId = currentCompany?.id;

            if (!companyId) {
                // Se não existir (estiver limpo), cria a primeira
                const { error: insertErr } = await supabase
                    .from('companies')
                    .insert({
                        name: 'Canaã Imóveis',
                        openai_api_key: apiKey,
                        ai_enabled: isEnabled
                    });
                if (insertErr) throw insertErr;
            } else {
                const { error: updateErr } = await supabase
                    .from('companies')
                    .update({
                        openai_api_key: apiKey,
                        ai_enabled: isEnabled
                    })
                    .eq('id', companyId);
                if (updateErr) throw updateErr;
            }

            toast.success("Configurações de IA salvas com sucesso!");
            loadSettings();
        } catch (error: any) {
            console.error(error);
            toast.error("Erro ao salvar! Rode o SQL de limpeza que te mandei!");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg">Agente de CRM Autônomo</h3>
                        <p className="text-sm text-indigo-700 mt-1">
                            Conecte o seu CRM à OpenAI para habilitar recursos como resumos automáticos, leitura de sentimento do cliente e alertas preditivos de esfriamento de leads.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div className="space-y-0.5">
                        <Label className="text-base">Ativar Motor de Inteligência Artificial</Label>
                        <p className="text-sm text-slate-500">
                            Permite que o sistema execute rotinas agendadas e calls webhook para analisar mensagens.
                        </p>
                    </div>
                    <Switch
                        checked={isEnabled}
                        onCheckedChange={setIsEnabled}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="api_key">OpenAI API Key (Chave Secreta)</Label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            id="api_key"
                            type="password"
                            placeholder="sk-proj-.............................................."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <p className="text-xs text-slate-500">
                        Essa chave será usada pelas nossas Edge Functions. Mantenha essa permissão restrita.
                        Recomendamos o uso da família GPT-4o-mini para melhor custo-benefício.
                    </p>
                </div>

                <div className="pt-8 flex justify-end">
                    <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto h-12 px-8 font-bold shadow-lg shadow-indigo-200">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Salvando Configurações..." : "Salvar Configurações da Central de IA"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

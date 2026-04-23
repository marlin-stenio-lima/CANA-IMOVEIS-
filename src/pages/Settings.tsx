import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, User, Users, Bell, Shield, Smartphone, RefreshCw, CheckCircle2, AlertCircle, Bot, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { TeamManager } from "@/components/settings/TeamManager";
import { AiSettings } from "@/components/settings/AiSettings";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { profile, user, refreshProfile } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'open' | 'close' | 'connecting' | 'unknown'>('unknown');
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form States
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileJobTitle, setProfileJobTitle] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileName(profile.full_name || "");
      setProfilePhone(profile.phone || "");
      setProfileJobTitle(profile.job_title || "");
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoadingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileName,
          phone: profilePhone,
          job_title: profileJobTitle
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar o perfil");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: { action: 'status' }
      });
      if (error) throw error;
      setConnectionStatus(data?.instance?.state || 'close');
    } catch (error) {
      console.error(error);
      setConnectionStatus('unknown');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQrCode = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evolution-manager', {
        body: { action: 'connect' }
      });
      if (error) throw error;

      if (data?.base64) {
        setQrCode(data.base64);
      } else if (data?.instance?.state === 'open') {
        setConnectionStatus('open');
        toast.success("Já está conectado!");
      }
    } catch (error) {
      toast.error("Erro ao gerar QR Code");
    } finally {
      setIsLoading(false);
    }
  };

  // Company Form States
  const [companyName, setCompanyName] = useState("");
  const [companyDocument, setCompanyDocument] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  useEffect(() => {
    // Check status on mount if tab is active (simplified)
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!profile?.company_id) return;
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();
      
      if (!error && data) {
        setCompanyName(data.name || "");
        setCompanyDocument(data.document || "");
        setCompanyEmail(data.email || "");
        setCompanyPhone(data.phone || "");
        setCompanyAddress(data.address || "");
      }
    };
    
    if (isAdmin && profile?.company_id) {
      fetchCompany();
    }
  }, [profile?.company_id, isAdmin]);

  const handleUpdateCompany = async () => {
    if (!profile?.company_id) return;
    setIsLoadingCompany(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: companyName,
          document: companyDocument,
          email: companyEmail,
          phone: companyPhone,
          address: companyAddress
        })
        .eq('id', profile.company_id);

      if (error) throw error;
      toast.success("Dados da empresa atualizados com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar dados da empresa");
    } finally {
      setIsLoadingCompany(false);
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';
  const defaultTab = isAdmin ? "company" : "profile";
  const currentTab = searchParams.get("tab") || defaultTab;

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          {isAdmin && <TabsTrigger value="company" className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Empresa</TabsTrigger>}
          <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" /> Perfil</TabsTrigger>
          {isAdmin && <TabsTrigger value="team" className="flex items-center gap-2"><Users className="h-4 w-4" /> Minha Equipe</TabsTrigger>}

          <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notificações</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="ai" className="flex items-center gap-2 text-indigo-600 font-bold"><Bot className="h-4 w-4" /> Inteligência Artificial</TabsTrigger>
          )}
          <TabsTrigger value="security" className="flex items-center gap-2"><Shield className="h-4 w-4" /> Segurança</TabsTrigger>
        </TabsList>



        {isAdmin && (
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Equipe</CardTitle>
                <CardDescription>Adicione, remova e gerencie permissões dos corretores.</CardDescription>
              </CardHeader>
              <CardContent>
                <TeamManager />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>Dados cadastrais da empresa principal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" placeholder="Sua Empresa Ltda" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" placeholder="00.000.000/0001-00" value={companyDocument} onChange={e => setCompanyDocument(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contato@empresa.com" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(11) 0000-0000" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input id="address" placeholder="Rua, número, bairro, cidade, estado, CEP" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} />
                </div>
                <Button onClick={handleUpdateCompany} disabled={isLoadingCompany}>
                  {isLoadingCompany ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="ai">
            <Card className="border-indigo-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-indigo-600" />
                  Inteligência Artificial
                </CardTitle>
                <CardDescription>Configure o motor de IA para automação e análise de leads.</CardDescription>
              </CardHeader>
              <CardContent>
                <AiSettings />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>Suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input 
                    id="user-email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={user?.email || ""}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-phone">Telefone</Label>
                  <Input 
                    id="user-phone" 
                    placeholder="(11) 99999-0000" 
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input 
                    id="role" 
                    placeholder="Gerente de Vendas" 
                    value={profileJobTitle}
                    onChange={(e) => setProfileJobTitle(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleUpdateProfile} disabled={isLoadingProfile}>
                {isLoadingProfile ? "Atualizando..." : "Atualizar Perfil"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-muted-foreground">Receba atualizações por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembretes de Tarefas</p>
                  <p className="text-sm text-muted-foreground">Seja notificado sobre tarefas pendentes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Atualizações de Negócios</p>
                  <p className="text-sm text-muted-foreground">Notificações sobre mudanças em negócios</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos Contatos</p>
                  <p className="text-sm text-muted-foreground">Aviso quando novos contatos forem adicionados</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Configurações de segurança da conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Alterar Senha</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import {
  LayoutDashboard,
  Users,
  Kanban,
  MessageCircle,
  CheckSquare,
  Calendar,
  Settings,
  LogOut,
  Zap,
  Building2,
  Globe,
  UserCheck,
  Smartphone,
  Bot,
  Target,
  Ship,
  Send,
  AlertCircle
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { usePermissions } from "@/hooks/usePermissions";
import { Separator } from "@/components/ui/separator";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { id: 'dashboard', title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { id: 'contatos', title: "Clientes", url: "/contacts", icon: Users },
  { id: 'kanban', title: "Kanban", url: "/kanban", icon: Kanban },
  { id: 'conversas', title: "Conversas", url: "/conversations", icon: MessageCircle },
  { id: 'tarefas', title: "Tarefas", url: "/tasks", icon: CheckSquare },
  { id: 'agendamentos', title: "Agendamentos", url: "/schedules", icon: Calendar },
  { id: 'central_ia', title: "Central IA", url: "/agents", icon: Bot },
  { id: 'roletas', title: "Roletas (Distribuição)", url: "/roleta", icon: Target },
  { id: 'whatsapp', title: "WhatsApp", url: "/whatsapp", icon: Smartphone },
  { id: 'disparos', title: "Disparos", url: "/broadcasts", icon: Send },
  { id: 'suporte', title: "Suporte", url: "/support", icon: AlertCircle },
];

const settingsItems = [
  { id: 'configuracoes', title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { profile, signOut } = useAuth();
  const { mode, setMode } = useCrmMode();
  const { canAccessImoveis, canAccessBarcos, canAccessMenu } = usePermissions();

  const currentPortalItems = mode === 'barcos'
    ? [
        { id: 'embarcacoes', title: 'Embarcações', url: '/barcos', icon: Ship },
        { id: 'config_site', title: "Config. Site", url: "/site-settings", icon: Globe },
      ]
    : [
        { id: 'imoveis', title: 'Imóveis', url: '/properties', icon: Building2 },
        { id: 'leads', title: "Leads Portal", url: "/leads", icon: UserCheck },
        { id: 'config_site', title: "Config. Site", url: "/site-settings", icon: Globe },
        { id: 'integracoes', title: "Integrações", url: "/integrations", icon: Zap },
      ];

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="bg-sidebar">
        <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className={`flex items-center justify-center shrink-0`}>
              <img src="/canaa-logo-transparent.png" alt="Canaã imóveis" className={collapsed ? "h-6 w-auto object-contain" : "h-10 w-auto object-contain py-1"} />
            </div>
          </div>
        </div>

        <Separator className="mx-4 w-auto" />

        {/* CRM Mode Toggle */}
        {!collapsed && canAccessImoveis && canAccessBarcos && (
          <div className="px-4 py-2">
            <div className="flex bg-sidebar-accent/50 rounded-lg p-1 border border-sidebar-border">
              <button
                onClick={() => setMode('imoveis')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${mode === 'imoveis' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Building2 className="h-4 w-4 shrink-0" />
                Imóveis
              </button>
              <button
                onClick={() => setMode('barcos')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${mode === 'barcos' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Ship className="h-4 w-4 shrink-0" />
                Barcos
              </button>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {menuItems.filter(item => canAccessMenu(item.id)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="group transition-all duration-200"
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>



        {currentPortalItems.filter(i => canAccessMenu(i.id)).length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4">
            {mode === 'barcos' ? 'Site' : 'Portal Imobiliário'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {currentPortalItems.filter(item => canAccessMenu(item.id)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="group transition-all duration-200"
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        <Separator className="mx-4 w-auto my-2" />

        {settingsItems.filter(i => canAccessMenu(i.id)).length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {settingsItems.filter(item => canAccessMenu(item.id)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="group transition-all duration-200"
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t bg-sidebar p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-all duration-200"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="px-3 py-2 text-xs text-muted-foreground text-center">
            Canaã imóveis v1.0.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

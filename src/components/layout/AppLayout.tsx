import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useCrmMode } from "@/contexts/CrmModeContext";
import { Bell, Search, ChevronRight, LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/contacts": "Contatos",
  "/kanban": "Kanban",
  "/conversations": "Conversas",
  "/tasks": "Tarefas",
  "/schedules": "Agendamentos",
  "/settings": "Configurações",
  "/reports": "Relatórios",
};

export function AppLayout() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const currentPath = location.pathname;
  const routeName = routeNames[currentPath] || "Página";

  const { canAccessImoveis, canAccessBarcos } = usePermissions();
  const { mode, setMode } = useCrmMode();

  // Force mode if user has restricted access
  useEffect(() => {
    if (canAccessImoveis && !canAccessBarcos && mode !== 'imoveis') setMode('imoveis');
    if (canAccessBarcos && !canAccessImoveis && mode !== 'barcos') setMode('barcos');
  }, [canAccessImoveis, canAccessBarcos, mode, setMode]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Professional Header */}
          <header className="h-16 border-b flex items-center px-4 gap-4 bg-card shadow-sm sticky top-0 z-10">


            <SidebarTrigger className="h-9 w-9" />

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{routeName}</span>
            </nav>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contatos, negócios..."
                  className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
                />


              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                        {getInitials(profile?.full_name || null)}
                      </AvatarFallback>
                    </Avatar>


                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium leading-none">
                        {profile?.full_name || "Usuário"}
                      </span>
                      <span className="text-xs text-muted-foreground leading-none mt-0.5">
                        {profile?.job_title || "Colaborador"}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{profile?.full_name || "Usuário"}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {profile?.job_title || "Colaborador"}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/settings?tab=profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  {(profile?.role === 'admin' || profile?.role === 'owner') && (
                    <DropdownMenuItem asChild>
                      <Link to="/settings?tab=company" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-muted/30 overflow-auto">
            <Outlet />
          </div>


        </main>
      </div>
    </SidebarProvider>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Kanban from "./pages/Kanban";
import Conversations from "./pages/Conversations";
import Tasks from "./pages/Tasks";
import Schedules from "./pages/Schedules";
import WhatsApp from "./pages/WhatsApp";
import Settings from "./pages/Settings";
import Properties from "./pages/Properties";
import SiteSettings from "./pages/SiteSettings";
import Leads from "./pages/Leads";
import PublicSite from "./pages/public/PublicSite";
import PublicProperty from "./pages/public/PublicProperty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Public Portal Routes - simplified URLs */}
            <Route path="/:slug/imovel/:propertyId" element={<PublicProperty />} />
            <Route path="/:slug" element={<PublicSite />} />
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/whatsapp" element={<WhatsApp />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/site-settings" element={<SiteSettings />} />
              <Route path="/leads" element={<Leads />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

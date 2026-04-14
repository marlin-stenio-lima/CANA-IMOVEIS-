import { useAuth } from "@/contexts/AuthContext";

export function usePermissions() {
    const { profile, isMock } = useAuth();

    if (!profile) {
        return {
            isAdmin: false,
            isOwner: false,
            canAccessImoveis: false,
            canAccessBarcos: false,
            canAccessMenu: () => false,
            role: 'agent',
            accessAreas: []
        };
    }

    const isJobTitleAdmin = profile?.job_title?.toLowerCase().includes('admin') || profile?.job_title?.toLowerCase().includes('diretor');
    
    // Default Fallbacks
    const role = (profile as any).role || (isMock || isJobTitleAdmin ? 'admin' : 'agent');
    const accessAreas = (profile as any).access_areas || ['imoveis', 'barcos'];
    const permissionsMap = (profile as any).permissions || {};

    const isAdmin = role === 'admin' || role === 'owner' || isJobTitleAdmin;
    const isOwner = role === 'owner' || (isMock && profile?.id === profile?.company_id);

    // Access Areas Check
    const canAccessImoveis = isAdmin || accessAreas.includes('imoveis');
    const canAccessBarcos = isAdmin || accessAreas.includes('barcos');

    // Menu Item Granular Check
    const canAccessMenu = (menuId: string) => {
        // If there's a specific override in the JSONB permissions column, respect it
        if (permissionsMap[menuId] !== undefined) {
            return permissionsMap[menuId];
        }

        // Otherwise, fallback to Role defaults
        // Admins can access everything by default
        if (isAdmin) return true;

        // Regular agents have default limited access
        const agentAllowedMenus = [
            'dashboard', 'contatos', 'kanban', 'conversas', 'tarefas', 'agendamentos', 'whatsapp'
        ];

        return agentAllowedMenus.includes(menuId);
    };

    return {
        isAdmin,
        isOwner,
        canAccessImoveis,
        canAccessBarcos,
        canAccessMenu,
        role,
        accessAreas
    };
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TeamMember {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    job_title: string | null;
}

export function useTeam() {
    const { profile } = useAuth();

    return useQuery({
        queryKey: ['team', profile?.company_id],
        queryFn: async () => {
            if (!profile?.company_id) return [];

            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, job_title')
                .eq('company_id', profile.company_id);

            if (error) {
                console.error("Error fetching team:", error);
                throw error;
            }

            // Fallback: If list is empty (RLS) or current user missing, ensure current user is in list
            let members = (data as TeamMember[]) || [];
            if (profile && !members.find(m => m.id === profile.id)) {
                members.push({
                    id: profile.id,
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url,
                    job_title: profile.job_title
                });
            }

            return members;
        },
        enabled: !!profile?.company_id,
    });
}

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  company_id: string;
  full_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  role?: string;
  access_areas?: string[];
  permissions?: Record<string, boolean>;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, companyName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  const CANAA_COMPANY_ID = 'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a';
  const ADMIN_EMAIL = 'tatiana@canaaluxo.com';
  const ADMIN_PASS = 'Alanh310896';

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, company_id, full_name, avatar_url, job_title, role, access_areas, permissions")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const provisionCanaa = async () => {
      if (isMock && user?.id === "00000000-0000-0000-0000-000000000000") {
        try {
          await supabase.from('companies').upsert({ id: CANAA_COMPANY_ID, name: 'Canaã Luxo', slug: 'canaa' }, { onConflict: 'id' });
          await supabase.from('profiles').upsert({ id: user.id, company_id: CANAA_COMPANY_ID, full_name: "Tatiana", job_title: "Diretora" }, { onConflict: 'id' });

          const PIPELINE_ID = 'f2be1234-f2be-4c2a-8c2a-2c2a6a6a6a6a';
          await supabase.from('pipelines').upsert({ id: PIPELINE_ID, company_id: CANAA_COMPANY_ID, name: "Imóveis", is_default: true }, { onConflict: 'id' });

          const STAGES = [
            { id: '11111111-1111-1111-1111-111111111111', pipeline_id: PIPELINE_ID, name: 'Lead', position: 0, color: '#3B82F6' },
            { id: '22222222-2222-2222-2222-222222222222', pipeline_id: PIPELINE_ID, name: 'Contato', position: 1, color: '#8B5CF6' },
            { id: '33333333-3333-3333-3333-333333333333', pipeline_id: PIPELINE_ID, name: 'Visita', position: 2, color: '#F59E0B' },
            { id: '44444444-4444-4444-4444-444444444444', pipeline_id: PIPELINE_ID, name: 'Proposta', position: 3, color: '#10B981' },
          ];
          for (const s of STAGES) await supabase.from('pipeline_stages').upsert(s, { onConflict: 'id' });

          const PROPERTIES = [
            { id: '00000000-0000-0000-0000-000000003074', company_id: CANAA_COMPANY_ID, title: "Residência Costeira de Alto Padrão", property_type: 'casa', transaction_type: 'venda', price: 9999990, status: 'disponivel', is_published: true, internal_id: '3074' },
            { id: '00000000-0000-0000-0000-000000030742', company_id: CANAA_COMPANY_ID, title: "Linda casa com vista para o mar", property_type: 'casa', transaction_type: 'venda', price: 2999990, status: 'disponivel', is_published: true, internal_id: '30742' },
            { id: '00000000-0000-0000-0000-000000030743', company_id: CANAA_COMPANY_ID, title: "Terreno beira mar, água cristalina!", property_type: 'terreno', transaction_type: 'venda', price: 5999990, status: 'disponivel', is_published: true, internal_id: '30743' },
            { id: '00000000-0000-0000-0000-000000030744', company_id: CANAA_COMPANY_ID, title: "Terreno Beira Mar Exclusivo", property_type: 'terreno', transaction_type: 'venda', price: 4999990, status: 'disponivel', is_published: true, internal_id: '30744' },
            { id: '00000000-0000-0000-0000-000000030745', company_id: CANAA_COMPANY_ID, title: "Casa com vista do sol poente", property_type: 'casa', transaction_type: 'venda', price: 3999990, status: 'disponivel', is_published: true, internal_id: '30745' },
            { id: '00000000-0000-0000-0000-000000030746', company_id: CANAA_COMPANY_ID, title: "Apartamento Vista Mar", property_type: 'apartamento', transaction_type: 'venda', price: 1999990, status: 'disponivel', is_published: true, internal_id: '30746' },
            { id: '00000000-0000-0000-0000-000000030747', company_id: CANAA_COMPANY_ID, title: "Casa em Condomínio Fechado", property_type: 'casa', transaction_type: 'venda', price: 7999990, status: 'disponivel', is_published: true, internal_id: '30747' }
          ];
          for (const p of PROPERTIES) await supabase.from('properties').upsert(p as any, { onConflict: 'id' });
          console.log("Canaã context provisioned successfully.");
        } catch (err) {
          console.error("Error provisioning Canaã context:", err);
        }
      }
    };
    provisionCanaa();
  }, [isMock, user?.id]);

  const signUp = async (email: string, password: string, fullName: string, companyName: string, additionalData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error: signUpError, data } = await supabase.auth.signUp({
        email, password, options: { 
          emailRedirectTo: redirectUrl, 
          data: { company_id: "c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a", company_name: companyName, full_name: fullName, is_owner: true, ...additionalData } 
        }
      });
      return { error: signUpError, session: data.session };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    // If it's the admin, we ensure the profile and company are provisioned with the REAL ID
    if (!error && data.user && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setIsMock(true);
      localStorage.setItem("crm_mock_session", "active");

      try {
        await supabase.from('companies').upsert({ id: CANAA_COMPANY_ID, name: 'Canaã Luxo', slug: 'canaa' }, { onConflict: 'id' });
        await supabase.from('profiles').upsert({
          id: data.user.id,
          company_id: CANAA_COMPANY_ID,
          full_name: "Tatiana",
          job_title: "Diretora"
        }, { onConflict: 'id' });

        // Refresh the profile state
        await fetchProfile(data.user.id);
      } catch (err) {
        console.error("Error provisioning admin profile:", err);
      }
    } else if (error && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      console.error("LOGIN FAIL: Usuário Tatiana não encontrado no Supabase Auth. Rode o script SQL de provimento.");
    }

    return { error };
  };

  const signOut = async () => {
    if (isMock) {
      localStorage.removeItem("crm_mock_session");
      setIsMock(false);
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, signIn, signUp, signOut, isMock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

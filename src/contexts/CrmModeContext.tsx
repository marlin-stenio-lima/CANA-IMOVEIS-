import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CrmMode = "imoveis" | "barcos";

interface CrmModeContextType {
  mode: CrmMode;
  setMode: (mode: CrmMode) => void;
}

const CrmModeContext = createContext<CrmModeContextType | undefined>(undefined);

export function CrmModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<CrmMode>("imoveis");

  useEffect(() => {
    const savedMode = localStorage.getItem("crm-mode") as CrmMode;
    if (savedMode && (savedMode === "imoveis" || savedMode === "barcos")) {
      setModeState(savedMode);
    }
  }, []);

  const setMode = (newMode: CrmMode) => {
    setModeState(newMode);
    localStorage.setItem("crm-mode", newMode);
  };

  return (
    <CrmModeContext.Provider value={{ mode, setMode }}>
      {children}
    </CrmModeContext.Provider>
  );
}

export function useCrmMode() {
  const context = useContext(CrmModeContext);
  if (context === undefined) {
    throw new Error("useCrmMode must be used within a CrmModeProvider");
  }
  return context;
}

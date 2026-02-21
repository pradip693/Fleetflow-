"use client";
import React, { createContext, useContext, useState } from "react";

interface SidebarConfig {
  variant: "inset" | "sidebar" | "floating";
  collapsible: "offcanvas" | "icon" | "none";
  side: "left" | "right";
}

interface SidebarContextType {
  config: SidebarConfig;
  updateConfig: (config: Partial<SidebarConfig>) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SidebarConfig>({
    variant: "inset",
    collapsible: "offcanvas",
    side: "left",
  });

  const updateConfig = (newConfig: Partial<SidebarConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <SidebarContext.Provider value={{ config, updateConfig }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarConfig() {
  const context = useContext(SidebarContext);
  if (!context) {
    // Return dummy if provider is missing to avoid crashing in isolate components if context is meant to be global
    // But usually we throw.
    return {
      config: {
        variant: "inset",
        collapsible: "offcanvas",
        side: "left",
      } as SidebarConfig,
      updateConfig: () => {},
    };
  }
  return context;
}

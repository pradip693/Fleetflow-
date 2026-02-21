"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeSettings {
  primaryColor: string;
  borderRadius: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number;
  spacing: number;
}

interface SettingsStore {
  theme: ThemeSettings;
  accessibility: AccessibilitySettings;
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  updateAccessibility: (accessibility: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "oklch(0.61 0.11 222)",
  borderRadius: 10,
};

const defaultAccessibility: AccessibilitySettings = {
  highContrast: false,
  fontSize: 100,
  spacing: 100,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      accessibility: defaultAccessibility,
      updateTheme: (theme) =>
        set((state) => ({
          theme: { ...state.theme, ...theme },
        })),
      updateAccessibility: (accessibility) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...accessibility },
        })),
      resetSettings: () =>
        set({
          theme: defaultTheme,
          accessibility: defaultAccessibility,
        }),
    }),
    {
      name: "app-settings",
    },
  ),
);

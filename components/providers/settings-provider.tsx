"use client";

import { useSettingsStore } from "@/stores/settings-store";
import { useEffect } from "react";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((state) => state.theme);
  const accessibility = useSettingsStore((state) => state.accessibility);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    // Apply theme settings
    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--radius", `${theme.borderRadius}px`);

    // Apply accessibility settings
    const fontSizeMultiplier = accessibility.fontSize / 100;
    const spacingMultiplier = accessibility.spacing / 100;

    root.style.setProperty(
      "--font-size-multiplier",
      fontSizeMultiplier.toString(),
    );
    root.style.setProperty(
      "--spacing-multiplier",
      spacingMultiplier.toString(),
    );

    // High contrast mode
    if (accessibility.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    console.log("Settings applied:", {
      fontSize: accessibility.fontSize,
      fontSizeMultiplier,
      spacing: accessibility.spacing,
      spacingMultiplier,
      highContrast: accessibility.highContrast,
    });
  }, [theme, accessibility]);

  return <>{children}</>;
}

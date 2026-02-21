import { ImportedTheme } from "@/types/theme-customizer";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";

export function useThemeManager() {
  const { resolvedTheme } = useTheme();
  const [brandColorsValues, setBrandColorsValuesState] = useState<
    Record<string, string>
  >({});

  const isDarkMode = resolvedTheme === "dark";

  const setBrandColorsValues = useCallback((colors: Record<string, string>) => {
    setBrandColorsValuesState(colors);
  }, []);

  const handleColorChange = useCallback((cssVar: string, value: string) => {
    setBrandColorsValuesState((prev) => ({ ...prev, [cssVar]: value }));
    document.documentElement.style.setProperty(cssVar, value);
  }, []);

  const applyImportedTheme = useCallback(
    (themeData: ImportedTheme, isDark: boolean) => {
      const vars = isDark ? themeData.dark : themeData.light;
      Object.entries(vars).forEach(([key, value]) => {
        // Logic to set CSS variable, handling -- prefix if needed or assuming passed key has it?
        // imported theme usually has keys like "--primary" or "primary" depending on parser.
        // import-modal.tsx parser extracts key from "--key: value", so key is "key".
        // line 39: lightTheme[variable.trim()] = value.trim()
        // regex: /--([^:]+):/ -> capturing group 1 excludes "--"
        // So key is "primary", "background", etc.
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    },
    [],
  );

  const resetTheme = useCallback(() => {
    document.documentElement.removeAttribute("style");
    setBrandColorsValuesState({});
  }, []);

  const applyRadius = useCallback((radius: string) => {
    document.documentElement.style.setProperty("--radius", radius);
  }, []);

  const applyTheme = useCallback((themeName: string, isDark: boolean) => {
    // Stub
  }, []);

  const applyTweakcnTheme = useCallback((themeData: any, isDark: boolean) => {
    // Stub
  }, []);

  return {
    applyImportedTheme,
    isDarkMode,
    resetTheme,
    applyRadius,
    brandColorsValues,
    setBrandColorsValues,
    handleColorChange,
    applyTheme,
    applyTweakcnTheme,
  };
}

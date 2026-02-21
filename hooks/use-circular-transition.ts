import { useTheme } from "next-themes";
import { useCallback } from "react";

export function useCircularTransition() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(
    (event: React.MouseEvent) => {
      const isDark = resolvedTheme === "dark";
      const newTheme = isDark ? "light" : "dark";
      setTheme(newTheme);
    },
    [resolvedTheme, setTheme],
  );

  return { toggleTheme };
}

// This script runs before React hydrates to prevent FOUC
(function () {
  try {
    const stored = localStorage.getItem("app-settings");
    if (!stored) return;

    const settings = JSON.parse(stored);
    const state = settings.state;

    if (!state) return;

    const root = document.documentElement;

    // Apply theme settings
    if (state.theme) {
      if (state.theme.primaryColor) {
        root.style.setProperty("--primary", state.theme.primaryColor);
      }
      if (state.theme.borderRadius !== undefined) {
        root.style.setProperty("--radius", `${state.theme.borderRadius}px`);
      }
    }

    // Apply accessibility settings
    if (state.accessibility) {
      if (state.accessibility.fontSize !== undefined) {
        const fontSizeMultiplier = state.accessibility.fontSize / 100;
        root.style.setProperty(
          "--font-size-multiplier",
          fontSizeMultiplier.toString(),
        );
      }

      if (state.accessibility.spacing !== undefined) {
        const spacingMultiplier = state.accessibility.spacing / 100;
        root.style.setProperty(
          "--spacing-multiplier",
          spacingMultiplier.toString(),
        );
      }

      if (state.accessibility.highContrast) {
        root.classList.add("high-contrast");
      }
    }
  } catch (e) {
    console.error("Failed to load settings:", e);
  }
})();

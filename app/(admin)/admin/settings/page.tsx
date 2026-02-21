"use client";

import { AppButton } from "@/components/shared/app-button";
import { AppConfirmDialog } from "@/components/shared/app-confirm-dialog";
import { FormSubsection } from "@/components/shared/form-subsection";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Accessibility,
  Circle,
  Maximize2,
  Palette,
  RotateCcw,
  Type,
} from "lucide-react";

const COLOR_PRESETS = [
  { name: "Blue", value: "oklch(0.61 0.11 222)", color: "#3b82f6" },
  { name: "Green", value: "oklch(0.55 0.15 145)", color: "#10b981" },
  { name: "Purple", value: "oklch(0.55 0.15 290)", color: "#8b5cf6" },
  { name: "Orange", value: "oklch(0.65 0.15 50)", color: "#f97316" },
  { name: "Pink", value: "oklch(0.65 0.20 350)", color: "#ec4899" },
  { name: "Teal", value: "oklch(0.60 0.12 195)", color: "#14b8a6" },
];

export default function SettingsPage() {
  const {
    theme,
    accessibility,
    updateTheme,
    updateAccessibility,
    resetSettings,
  } = useSettingsStore();

  const selectedColorPreset = COLOR_PRESETS.find(
    (preset) => preset.value === theme.primaryColor,
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Customize your application appearance and accessibility preferences
          </p>
        </div>

        {/* Theme Settings */}
        <div className="bg-card border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Palette className="size-5 text-primary" />
            </div>
            <FormSubsection
              title="Theme Customization"
              className="border-0 pb-0"
            />
          </div>

          {/* Primary Color */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Primary Color</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateTheme({ primaryColor: preset.value })}
                  className={`
                    group relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                    ${
                      theme.primaryColor === preset.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }
                  `}
                >
                  <div
                    className={`size-10 rounded-full shadow-sm ring-2 ring-offset-2 ring-offset-background transition-all group-hover:scale-110 ${
                      theme.primaryColor === preset.value
                        ? "ring-current"
                        : "ring-transparent"
                    }`}
                    style={{
                      backgroundColor: preset.color,
                      color:
                        theme.primaryColor === preset.value
                          ? preset.color
                          : "transparent",
                    }}
                  />
                  <span className="text-xs font-medium">{preset.name}</span>
                  {theme.primaryColor === preset.value && (
                    <Circle className="absolute top-2 right-2 size-3 fill-primary text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Border Radius</Label>
              <span className="text-sm text-muted-foreground font-mono">
                {theme.borderRadius}px
              </span>
            </div>
            <Slider
              value={[theme.borderRadius]}
              onValueChange={(value) => {
                const newValue = Array.isArray(value) ? value[0] : value;
                if (typeof newValue === "number") {
                  updateTheme({ borderRadius: newValue });
                }
              }}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex gap-3 items-center justify-between text-xs text-muted-foreground">
              <span>Sharp (0px)</span>
              <span>Rounded (20px)</span>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Preview</Label>
            <div className="flex gap-3">
              <div
                className="h-12 flex-1 bg-primary rounded-lg shadow-sm"
                style={{ borderRadius: `${theme.borderRadius}px` }}
              />
              <div
                className="h-12 flex-1 bg-muted border rounded-lg"
                style={{ borderRadius: `${theme.borderRadius}px` }}
              />
            </div>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-card border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Accessibility className="size-5 text-primary" />
            </div>
            <FormSubsection title="Accessibility" className="border-0 pb-0" />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label className="text-base font-medium cursor-pointer">
                High Contrast Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase text contrast for better readability
              </p>
            </div>
            <Switch
              checked={accessibility.highContrast}
              onCheckedChange={(checked) =>
                updateAccessibility({ highContrast: checked })
              }
            />
          </div>

          {/* Font Size */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="size-4 text-muted-foreground" />
                <Label className="text-base font-medium">Font Size</Label>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {accessibility.fontSize}%
              </span>
            </div>
            <Slider
              value={[accessibility.fontSize]}
              onValueChange={(value) => {
                const newValue = Array.isArray(value) ? value[0] : value;
                if (typeof newValue === "number") {
                  updateAccessibility({ fontSize: newValue });
                }
              }}
              min={75}
              max={150}
              step={5}
              className="w-full"
            />
            <div className="flex gap-3 items-center justify-between text-xs text-muted-foreground">
              <span>Small (75%)</span>
              <span>Normal (100%)</span>
              <span>Large (150%)</span>
            </div>
            <div className="mt-3 p-4 bg-muted/50 rounded-lg border space-y-2">
              <p className="text-sm text-muted-foreground">Preview:</p>
              <p className="text-base font-medium">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-lg font-semibold">Heading Text Example</p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Setting: {accessibility.fontSize}%
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  Base: {((16 * accessibility.fontSize) / 100).toFixed(1)}px
                </span>
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Maximize2 className="size-4 text-muted-foreground" />
                <Label className="text-base font-medium">Element Spacing</Label>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {accessibility.spacing}%
              </span>
            </div>
            <Slider
              value={[accessibility.spacing]}
              onValueChange={(value) => {
                const newValue = Array.isArray(value) ? value[0] : value;
                if (typeof newValue === "number") {
                  updateAccessibility({ spacing: newValue });
                }
              }}
              min={75}
              max={150}
              step={5}
              className="w-full"
            />
            <div className="flex gap-3 items-center justify-between text-xs text-muted-foreground">
              <span>Compact (75%)</span>
              <span>Normal (100%)</span>
              <span>Spacious (150%)</span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end pb-8">
          <AppConfirmDialog
            title="Reset All Settings?"
            description="This will restore all theme and accessibility settings to their default values. This action cannot be undone."
            onConfirm={resetSettings}
            confirmText="Reset Settings"
            variant="destructive"
            trigger={
              <AppButton variant="outline" className="gap-2">
                <RotateCcw className="size-4" />
                Reset to Defaults
              </AppButton>
            }
          />
        </div>
      </div>
    </div>
  );
}

"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface ColorPickerProps {
  label: string;
  cssVar: string;
  value: string;
  onChange: (cssVar: string, value: string) => void;
}

export function ColorPicker({
  label,
  cssVar,
  value,
  onChange,
}: ColorPickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(cssVar, e.target.value);
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <Label className="w-1/3 shrink-0 text-xs">{label}</Label>
      <div className="flex gap-2 w-full">
        {/* Simple text input for now as values might be HSL or unexpected formats */}
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          className="flex-1 h-8 text-xs"
        />
        {/* Optional color input if value is hex */}
        {value.startsWith("#") && (
          <Input
            type="color"
            value={value}
            onChange={handleChange}
            className="w-8 h-8 p-0 border-0"
          />
        )}
      </div>
    </div>
  );
}

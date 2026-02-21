"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

interface AppSelectProps {
  value?: string | null;
  onValueChange: (value: string | null) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function AppSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  className,
  disabled,
  id,
}: AppSelectProps) {
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange(null);
  };

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <div className="relative group w-full">
        <SelectTrigger
          id={id}
          className={cn(
            "w-full transition-all",
            value && "group-hover:[&_svg]:opacity-0", // Hide chevron on hover if value exists
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            aria-label="Clear selection"
          >
            <X className="size-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

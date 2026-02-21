"use client";

import * as React from "react";

import { ChevronsUpDown, X } from "lucide-react";

import { AppButton } from "@/components/shared/app-button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: React.ReactNode;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((s) => s !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <AppButton
            variant="outline"
            className={cn(
              "flex min-h-10 w-full items-center justify-between rounded-md px-3 font-normal",
              className,
            )}
          >
            <div className="flex flex-wrap gap-1">
              {selected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {selected.map((val) => {
                const option = options.find((o) => o.value === val);
                if (!option) return null;
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 flex items-center gap-1 rounded-md px-1.5 py-0.5 font-normal transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(val);
                    }}
                  >
                    {option.label}
                    <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                  </Badge>
                );
              })}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </AppButton>
        }
      />
      <DropdownMenuContent className="max-h-[300px] w-full min-w-(--radix-dropdown-menu-trigger-width) overflow-y-auto">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => handleSelect(option.value)}
            onSelect={(e) => e.preventDefault()}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  return (
    <Button variant="ghost" size="icon">
      <Globe className="h-4 w-4" />
    </Button>
  );
}

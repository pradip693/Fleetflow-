import { cn } from "@/lib/utils";

export function RequiredAsterisk({ className }: { className?: string }) {
  return <span className={cn("text-destructive ml-1 shrink-0", className)}>*</span>;
}

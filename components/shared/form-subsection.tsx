import { cn } from "@/lib/utils";

interface FormSubsectionProps {
  title: string;
  className?: string;
}

export function FormSubsection({ title, className }: FormSubsectionProps) {
  return (
    <h3 className={cn("text-lg font-semibold border-b pb-2", className)}>
      {title}
    </h3>
  );
}

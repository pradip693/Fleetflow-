"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";

import { AppButton } from "@/components/shared/app-button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends React.ComponentProps<typeof AppButton> {
  buttonText?: string;
  pendingText?: string;
}

export function SubmitButton({
  buttonText,
  pendingText,
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const effectiveButtonText = buttonText || "Sign In";
  const effectivePendingText = pendingText || "Signing In...";

  return (
    <AppButton
      type="submit"
      className={cn("w-full font-semibold", className)}
      isLoading={pending}
      {...props}
    >
      {pending ? effectivePendingText : effectiveButtonText}
    </AppButton>
  );
}

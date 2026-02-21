"use client";

import * as React from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { AppButton } from "@/components/shared/app-button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

export interface PasswordInputProps extends React.ComponentProps<"input"> {
  onVisibilityChange?: (isVisible: boolean) => void;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, onVisibilityChange, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const toggleVisibility = () => {
    const newState = !showPassword;
    setShowPassword(newState);
    onVisibilityChange?.(newState);
  };

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pe-10", className)}
        ref={ref}
        {...props}
      />
      <AppButton
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute end-0 top-0 h-full hover:bg-transparent"
        onClick={toggleVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeIcon
            className="text-foreground-muted size-4"
            aria-hidden="true"
          />
        ) : (
          <EyeOffIcon
            className="text-foreground-muted size-4"
            aria-hidden="true"
          />
        )}
      </AppButton>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

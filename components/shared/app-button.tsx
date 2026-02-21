"use client";

import * as React from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export interface AppButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      isLoading = false,
      disabled,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    // If asChild is true, we must ensure only one child is passed to the Button (which uses Slot).
    // We also typically don't show a loader in asChild mode because it would break the single-child requirement.
    if (asChild) {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={size}
          disabled={disabled || isLoading}
          className={cn(className)}
          asChild
          {...props}
        >
          {children}
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        className={cn(className)}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </Button>
    );
  },
);

AppButton.displayName = "AppButton";

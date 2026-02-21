"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface AppFormContainerProps {
  children: React.ReactNode;

  actions?: React.ReactNode;

  title: string;

  description?: string;

  formId: string;

  /**
   * Layout mode.
   * - `true`: Uses the full height available (minus offset), ideal for massive forms.
   * - `false`: Centers the form in a constrained card, ideal for smaller/medium forms.
   * @default false
   */
  fullScreen?: boolean;

  /**
   * The URL to redirect to when the close (X) button is clicked.
   * Usually the list view of the resource.
   */
  closeHref: string;

  /**
   * Optional class name overrides for the container card.
   */
  className?: string;
}

/**
 * **AppFormContainer**
 *
 * A standardized "Shell" for application forms.
 * It provides a consistent layout with a sticky header, scrollable content area,
 * and a sticky footer for actions.
 *
 * @example
 * <AppFormContainer
 *   title="Create User"
 *   formId="create-user-form"
 *   closeHref="/users"
 *   fullScreen={false}
 *   actions={<Button type="submit" form="create-user-form">Save</Button>}
 * >
 *   <form id="create-user-form">...</form>
 * </AppFormContainer>
 */
export function AppFormContainer({
  children,
  actions,
  title,
  description,
  formId: _formId, // Not used directly in JSX here, but reminds dev to match it in children/actions
  fullScreen = false,
  closeHref: _closeHref,
  className,
}: Readonly<AppFormContainerProps>) {
  // The actual Card UI shell
  const CardShell = (
    <div
      className={cn(
        "border-border bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all",
        // Variant Styles
        fullScreen
          ? "h-[calc(100vh-100px)] w-full" // Full Screen Mode
          : "max-h-[85vh] w-full max-w-2xl shadow-lg", // Centered Card Mode
        className,
      )}
    >
      {/* 1. Sticky Header */}
      <div className="border-border bg-muted/30 flex shrink-0 items-center justify-between border-b px-6 py-4 backdrop-blur-sm">
        <div className="space-y-1">
          <h2 className="text-foreground text-lg font-semibold tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
        {/* <Button
          variant="ghost"
          size="icon"
          asChild
          className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          <Link href={closeHref}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Link>
        </Button> */}
      </div>

      {/* 2. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        {/* 
           We don't force the <form> tag here to allow flexibility, 
           but the children should usually contain the <form id={formId}> 
        */}
        {children}
      </div>

      {/* 3. Sticky Footer Actions */}
      {actions && (
        <div className="border-border bg-card flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4">
          {actions}
        </div>
      )}
    </div>
  );

  // If Full Screen, render directly.
  if (fullScreen) {
    return CardShell;
  }

  // If Not Full Screen, wrap in a centering container.
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      {CardShell}
    </div>
  );
}

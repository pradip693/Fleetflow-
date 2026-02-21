import * as React from "react";

import { cn } from "@/lib/utils";

interface AppTableContainerProps {
  /**
   * The main title of the table section.
   */
  title: string;

  /**
   * Optional description text displayed below the title.
   */
  description?: string;

  /**
   * Optional action element (usually a Button) displayed on the right.
   */
  action?: React.ReactNode;

  /**
   * The table component (Client Component) goes here.
   */
  children: React.ReactNode;

  /**
   * Optional class name for the outer wrapper.
   */
  className?: string;
}

/**
 * **AppTableContainer**
 *
 * A standardized container for displaying data tables.
 * It provides a consistent header with title/actions and ensures the inner table
 * renders "edge-to-edge" without double borders.
 */
export function AppTableContainer({
  title,
  description,
  action,
  children,
  className,
}: Readonly<AppTableContainerProps>) {
  return (
    <div className={cn("p-0", className)}>
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        {/* Header Section */}
        <div className="border-border flex items-center justify-between border-b px-6 py-5">
          <div className="space-y-1">
            <h1 className="text-foreground text-xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>

        {/* 
          Content Section 
          We use utility classes to strip the borders/radius from the inner GlobalTable
          so it sits flush against this container.
        */}
        <div className="p-0">
          <div className="[&_div.border]:border-0 [&_div.rounded-xl]:rounded-none [&_div.shadow-sm]:shadow-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

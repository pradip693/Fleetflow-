"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const generateBreadcrumbLabel = (segment: string) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (uuidRegex.test(segment)) {
    return "Details";
  }

  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((item) => item !== "");

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1 sm:gap-1">
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink
            render={
              <Link
                href="/admin"
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-2 py-1 text-base font-medium transition-colors"
              >
                Home
              </Link>
            }
          />
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          if (segment === "dashboard" || segment === "admin") return null;
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = generateBreadcrumbLabel(segment);

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator>
                <ChevronRight className="text-muted-foreground/50 size-4 rtl:rotate-180" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="bg-primary/5 text-primary rounded-md px-2 py-1 text-base font-semibold">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link
                        href={href}
                        className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-2 py-1 text-base font-medium transition-colors"
                      >
                        {label}
                      </Link>
                    }
                  />
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

"use client";

import QueryProvider from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/contexts/sidebar-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <SidebarProvider>{children}</SidebarProvider>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryProvider>
  );
}

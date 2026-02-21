import type { Metadata } from "next";
import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";

import { SettingsProvider } from "@/components/providers/settings-provider";

export const metadata: Metadata = {
  title: "Admin Panel | Boilerplate Admin",
  description: "Admin panel for managing Boilerplate Admin application",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SettingsProvider>
      <SidebarProvider defaultOpen={defaultOpen} className="bg-muted">
        <AppSidebar />
        <div className="flex h-svh flex-col w-full overflow-hidden">
          <AdminHeader />
          <SidebarInset className="overflow-hidden shadow-md rounded-2xl! m-2 md:peer-data-[state=collapsed]:ml-2 ml-0! md:ml-0!">
            <div className="flex flex-1 flex-col gap-4 p-4 h-full overflow-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SettingsProvider>
  );
}

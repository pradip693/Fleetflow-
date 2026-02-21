"use client";

import { DynamicBreadcrumbs } from "@/components/layout/dynamic-breadcrumbs";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationDropdown } from "@/features/admin/components/notification";
import { ProfileDropdown } from "@/features/profile-settings/components/profile-dropdown";
import { useAuthStore } from "@/stores/auth-store";

export function AdminHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 bg-sidebar-border"
        />
        <DynamicBreadcrumbs />
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="mr-2 hidden flex-col items-end md:flex">
            <span className="text-base font-semibold text-sidebar-foreground">
              {user.first_name} {user.last_name}
            </span>
            <span className="text-sm lowercase text-muted-foreground font-medium">
              {user.role?.name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },

  {
    title: "Users",
    url: "/admin/user",
    icon: Users,
  },

  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className={cn(
        "border-r-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[64px]!" : "bg-sidebar w-[260px]",
      )}
    >
      <SidebarHeader
        className={cn(
          "flex items-center transition-all duration-300 ",
          isCollapsed
            ? "h-20 justify-center"
            : "h-20 px-6 pt-6 justify-start mb-0.5",
        )}
      >
        <div
          className={cn(
            "flex items-center transition-all duration-300 shrink-0",
            isCollapsed
              ? "size-12 justify-center rounded-full bg-black/5"
              : "gap-3 w-full",
          )}
        >
          <div
            className={cn(
              "rounded-lg flex items-center justify-center shrink-0 transition-all",
              isCollapsed ? "size-8 bg-primary" : "size-8 bg-primary",
            )}
          >
            <span
              className={cn(
                "font-bold text-primary-foreground",
                isCollapsed ? "text-sm" : "text-sm",
              )}
            >
              ⬢
            </span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
              Boilerplate
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "flex flex-col",
          isCollapsed ? "items-center" : "px-4 space-y-1",
        )}
      >
        <SidebarGroup className="p-0 w-full">
          <SidebarGroupContent>
            <SidebarMenu
              className={cn(
                "gap-2",
                isCollapsed
                  ? "items-center bg-primary/5 rounded-full py-3 px-2 mx-auto mt-2"
                  : "items-stretch",
              )}
            >
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className="flex justify-center w-full"
                  >
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.url}
                          className={cn(
                            "flex items-center w-full",
                            isCollapsed ? "justify-center" : "justify-start",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "transition-all duration-200",
                              isCollapsed ? "size-8" : "size-6",
                              isActive
                                ? "text-primary-foreground"
                                : "text-black group-hover:text-black",
                            )}
                          />
                          {!isCollapsed && (
                            <span className="ml-3 text-base font-medium truncate">
                              {item.title}
                            </span>
                          )}
                        </Link>
                      }
                      isActive={isActive}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={cn(
                        "transition-all duration-300 flex items-center",
                        isCollapsed
                          ? "size-12 rounded-4xl justify-center"
                          : "h-11 w-full px-4 rounded-xl justify-start",
                        isActive
                          ? "bg-primary! text-primary-foreground! shadow-md hover:bg-primary! hover:text-primary-foreground!"
                          : "hover:bg-black/5 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                      )}
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

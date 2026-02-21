"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types";
import {
  LayoutDashboard,
  Truck,
  Route,
  Wrench,
  Receipt,
  Users,
  BarChart3,
  LogOut,
  ChevronLeft,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard, roles: ["manager", "dispatcher", "safety_officer", "financial_analyst"] },
  { href: "/vehicles", label: "Vehicle Registry", icon: Truck, roles: ["manager", "dispatcher"] },
  { href: "/trips", label: "Trip Dispatcher", icon: Route, roles: ["manager", "dispatcher"] },
  { href: "/maintenance", label: "Maintenance", icon: Wrench, roles: ["manager"] },
  { href: "/expenses", label: "Expenses & Fuel", icon: Receipt, roles: ["manager", "financial_analyst"] },
  { href: "/drivers", label: "Driver Profiles", icon: Users, roles: ["manager", "safety_officer"] },
  { href: "/analytics", label: "Analytics", icon: BarChart3, roles: ["manager", "financial_analyst"] },
  { href: "/admin/access", label: "Access Control", icon: ShieldCheck, roles: ["manager"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasRole } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter((item) => hasRole(item.roles));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r sidebar-gradient transition-all duration-300 shrink-0 shadow-sm z-50",
          collapsed ? "w-16" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 items-center border-b shrink-0",
            collapsed ? "justify-center px-2" : "gap-2 px-4"
          )}
        >
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary cursor-pointer"
                >
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight gradient-text">FleetFlow</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-7 w-7 shrink-0"
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1 overflow-y-auto", collapsed ? "p-1.5" : "p-2")}>
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors",
                  collapsed
                    ? "h-10 w-full justify-center"
                    : "gap-3 px-3 py-2",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                  isActive ? "bg-white/10" : "bg-transparent"
                )}>
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                </div>
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}
        </nav>

        <Separator />

        {/* Footer */}
        <div className={cn("shrink-0", collapsed ? "p-1.5 space-y-1" : "p-2 space-y-1")}>
          {/* Profile link */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/profile"
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors",
                    pathname === "/profile"
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {initials}
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role.replace(/_/g, " ")}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                pathname === "/profile"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize truncate">{user?.role.replace(/_/g, " ")}</p>
              </div>
            </Link>
          )}

          {/* Logout */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

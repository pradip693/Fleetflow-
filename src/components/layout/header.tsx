"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useFleetStore } from "@/store/fleet-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  LogOut,
  User,
  Wrench,
  AlertTriangle,
  Truck,
  Route,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "warning" | "danger" | "info" | "success";
  icon: React.ReactNode;
  time: string;
}

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

import { ThemeToggle } from "./theme-toggle";

export function Header({ title, description, actions }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { vehicles, drivers, maintenance, trips } = useFleetStore();

  const notifications = useMemo<Notification[]>(() => {
    const items: Notification[] = [];

    vehicles
      .filter((v) => v.status === "In Shop")
      .forEach((v) => {
        items.push({
          id: `veh-shop-${v.id}`,
          title: "Vehicle In Shop",
          message: `${v.name} (${v.licensePlate}) is currently under maintenance.`,
          type: "warning",
          icon: <Wrench className="h-4 w-4" />,
          time: "Ongoing",
        });
      });

    vehicles
      .filter((v) => v.status === "Out of Service")
      .forEach((v) => {
        items.push({
          id: `veh-oos-${v.id}`,
          title: "Vehicle Out of Service",
          message: `${v.name} (${v.licensePlate}) has been retired from the fleet.`,
          type: "danger",
          icon: <AlertTriangle className="h-4 w-4" />,
          time: "Action needed",
        });
      });

    const now = new Date();
    drivers
      .filter((d) => {
        const expiry = new Date(d.licenseExpiry);
        const daysUntil = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntil <= 30;
      })
      .forEach((d) => {
        const expiry = new Date(d.licenseExpiry);
        const expired = expiry < now;
        items.push({
          id: `drv-lic-${d.id}`,
          title: expired ? "License Expired" : "License Expiring Soon",
          message: `${d.name}'s license ${expired ? "expired" : "expires"} on ${formatDate(d.licenseExpiry)}.`,
          type: expired ? "danger" : "warning",
          icon: <ShieldAlert className="h-4 w-4" />,
          time: expired ? "Expired" : "Expiring soon",
        });
      });

    maintenance
      .filter((m) => m.status === "In Progress")
      .forEach((m) => {
        const vehicle = vehicles.find((v) => v.id === m.vehicleId);
        items.push({
          id: `maint-${m.id}`,
          title: "Maintenance In Progress",
          message: `${m.type} on ${vehicle?.name ?? "Unknown"} — ${m.mechanic}.`,
          type: "info",
          icon: <Wrench className="h-4 w-4" />,
          time: formatDate(m.date),
        });
      });

    trips
      .filter((t) => t.status === "Draft")
      .forEach((t) => {
        items.push({
          id: `trip-draft-${t.id}`,
          title: "Pending Trip Dispatch",
          message: `Trip #${t.id}: ${t.origin} → ${t.destination} awaiting dispatch.`,
          type: "info",
          icon: <Route className="h-4 w-4" />,
          time: formatDate(t.createdAt),
        });
      });

    trips
      .filter((t) => t.status === "Dispatched")
      .forEach((t) => {
        const vehicle = vehicles.find((v) => v.id === t.vehicleId);
        const driver = drivers.find((d) => d.id === t.driverId);
        items.push({
          id: `trip-active-${t.id}`,
          title: "Active Trip",
          message: `${driver?.name ?? "Driver"} in ${vehicle?.name ?? "Vehicle"}: ${t.origin} → ${t.destination}.`,
          type: "success",
          icon: <Truck className="h-4 w-4" />,
          time: t.dispatchedAt ? formatDate(t.dispatchedAt) : "",
        });
      });

    return items;
  }, [vehicles, drivers, maintenance, trips]);

  const dangerCount = notifications.filter((n) => n.type === "danger" || n.type === "warning").length;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const typeStyles: Record<string, { bg: string; text: string }> = {
    danger: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400" },
    warning: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400" },
    info: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400" },
    success: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400" },
  };

  const badgeVariantMap: Record<string, "destructive" | "warning" | "info" | "success"> = {
    danger: "destructive",
    warning: "warning",
    info: "info",
    success: "success",
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b bg-background px-6 shadow-sm transition-colors">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 uppercase tracking-wide text-sm font-black md:text-xl md:normal-case md:font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground/80 font-medium">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        {/* <ThemeToggle /> */}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {dangerCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                  {dangerCount > 9 ? "9+" : dangerCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col sm:max-w-md p-0">
            <SheetHeader className="p-6 pb-2">
              <div className="flex items-center justify-between pr-6">
                <SheetTitle>Notifications</SheetTitle>
                <Badge variant="secondary" className="text-xs">
                  {notifications.length} total
                </Badge>
              </div>
              <SheetDescription>
                Fleet alerts, maintenance updates, and trip status
              </SheetDescription>
            </SheetHeader>

            <Separator />

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Bell className="mb-3 h-10 w-10 opacity-30" />
                  <p className="text-sm font-medium">All clear!</p>
                  <p className="text-xs">No notifications at the moment.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((n) => {
                    const style = typeStyles[n.type];
                    return (
                      <div
                        key={n.id}
                        className="flex gap-3 px-6 py-4 transition-colors hover:bg-muted/50"
                      >
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}
                        >
                          {n.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-tight">{n.title}</p>
                            <Badge
                              variant={badgeVariantMap[n.type]}
                              className="shrink-0 text-[10px] px-1.5 py-0"
                            >
                              {n.type}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                            {n.message}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground/70">
                            <Clock className="h-3 w-3" />
                            {n.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); router.push("/login"); }}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

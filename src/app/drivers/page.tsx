"use client";

import { useEffect, useState, useMemo } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Shield,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pencil,
  ChevronDown,
  UserCog,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Driver, DriverStatus } from "@/types";

const STATUS_OPTIONS: DriverStatus[] = ["On Duty", "Off Duty", "Suspended"];

const defaultForm: Omit<Driver, "id"> = {
  name: "",
  email: "",
  phone: "",
  licenseNumber: "",
  licenseCategory: "",
  licenseExpiry: "",
  status: "Off Duty",
  safetyScore: 100,
  tripsCompleted: 0,
  tripsCancelled: 0,
  joinedDate: new Date().toISOString().split("T")[0],
  avatar: "",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isLicenseExpired(expiry: string) {
  return new Date(expiry) < new Date();
}

function isLicenseExpiringSoon(expiry: string) {
  const expiryDate = new Date(expiry);
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return expiryDate >= now && expiryDate <= thirtyDaysFromNow;
}

function getSafetyColor(score: number) {
  if (score >= 90) return "text-emerald-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-600";
}

function getSafetyBg(score: number) {
  if (score >= 90) return "[&>div]:bg-emerald-500";
  if (score >= 70) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}

function getStatusVariant(status: DriverStatus) {
  switch (status) {
    case "On Duty":
      return "success" as const;
    case "Off Duty":
      return "secondary" as const;
    case "Suspended":
      return "destructive" as const;
  }
}

export default function DriversPage() {
  const { drivers, fetchAll, addDriver, updateDriver, isLoading } =
    useFleetStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      if (filterStatus !== "all" && d.status !== filterStatus) return false;
      if (
        searchQuery &&
        !d.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [drivers, filterStatus, searchQuery]);

  const totalFilteredDrivers = filteredDrivers.length;
  const paginatedDrivers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDrivers.slice(start, start + pageSize);
  }, [filteredDrivers, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  function openAddDialog() {
    setEditingId(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEditDialog(driver: Driver) {
    setEditingId(driver.id);
    setForm({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      licenseExpiry: driver.licenseExpiry,
      status: driver.status,
      safetyScore: driver.safetyScore,
      tripsCompleted: driver.tripsCompleted,
      tripsCancelled: driver.tripsCancelled,
      joinedDate: driver.joinedDate,
      avatar: driver.avatar,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.name || !form.licenseNumber || !form.licenseExpiry) return;
    if (editingId) {
      await updateDriver(editingId, form);
    } else {
      await addDriver(form);
    }
    setDialogOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  }

  function completionRate(d: Driver) {
    const total = d.tripsCompleted + d.tripsCancelled;
    return total > 0 ? (d.tripsCompleted / total) * 100 : 100;
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Driver Profiles"
        description="Manage driver performance and safety compliance"
        actions={
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 items-center flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "table" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {view === "grid" && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {paginatedDrivers.map((driver) => {
              const expired = isLicenseExpired(driver.licenseExpiry);
              const expiringSoon = isLicenseExpiringSoon(driver.licenseExpiry);
              const rate = completionRate(driver);

              return (
                <Card key={driver.id} className="relative overflow-hidden">
                  {expired && (
                    <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      LICENSE EXPIRED
                    </div>
                  )}
                  <CardHeader className={cn("pb-3", expired && "pt-10")}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(driver.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{driver.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {driver.licenseCategory}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(driver.status)}>
                          {driver.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(driver)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{driver.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5" />
                          <span>Safety Score</span>
                        </div>
                        <span className={cn("font-bold", getSafetyColor(driver.safetyScore))}>
                          {driver.safetyScore}
                        </span>
                      </div>
                      <Progress
                        value={driver.safetyScore}
                        className={cn("h-2", getSafetyBg(driver.safetyScore))}
                      />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          {driver.tripsCompleted}
                        </div>
                        <div className="text-muted-foreground">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          {driver.tripsCancelled}
                        </div>
                        <div className="text-muted-foreground">Cancelled</div>
                      </div>
                      <div>
                        <div className={cn("text-lg font-bold", rate >= 90 ? "text-emerald-600" : rate >= 70 ? "text-amber-600" : "text-red-600")}>
                          {rate.toFixed(0)}%
                        </div>
                        <div className="text-muted-foreground">Rate</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        License: {formatDate(driver.licenseExpiry)}
                      </div>
                      {expiringSoon && !expired && (
                        <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {totalFilteredDrivers === 0 && (
              <p className="text-sm text-muted-foreground col-span-full text-center py-12">
                No drivers found.
              </p>
            )}
          </div>
          <Pagination
            totalItems={totalFilteredDrivers}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={setPage}
            onPageSizeChange={(size) => setPageSize(size)}
            pageSizeOptions={[6, 9, 12, 24]}
          />
        )}

        {/* Table View */}
        {view === "table" && (
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Safety Score</TableHead>
                    <TableHead className="text-center">Trips</TableHead>
                    <TableHead className="text-center">Rate</TableHead>
                    <TableHead>License Expiry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalFilteredDrivers === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No drivers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDrivers.map((driver) => {
                      const expired = isLicenseExpired(driver.licenseExpiry);
                      const expiringSoon = isLicenseExpiringSoon(driver.licenseExpiry);
                      const rate = completionRate(driver);

                      return (
                        <TableRow key={driver.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {getInitials(driver.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{driver.name}</div>
                                <div className="text-xs text-muted-foreground">{driver.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{driver.licenseNumber}</div>
                            <div className="text-xs text-muted-foreground">
                              {driver.licenseCategory}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(driver.status)}>
                              {driver.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Progress
                                value={driver.safetyScore}
                                className={cn("h-2 flex-1", getSafetyBg(driver.safetyScore))}
                              />
                              <span className={cn("text-sm font-medium w-8 text-right", getSafetyColor(driver.safetyScore))}>
                                {driver.safetyScore}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-emerald-600">{driver.tripsCompleted}</span>
                            {" / "}
                            <span className="text-red-500">{driver.tripsCancelled}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={cn(
                                "font-medium",
                                rate >= 90 ? "text-emerald-600" : rate >= 70 ? "text-amber-600" : "text-red-600"
                              )}
                            >
                              {rate.toFixed(0)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={cn(expired && "text-red-600 font-medium")}>
                                {formatDate(driver.licenseExpiry)}
                              </span>
                              {expired && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                  EXPIRED
                                </Badge>
                              )}
                              {expiringSoon && !expired && (
                                <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                                  Soon
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(driver)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <Pagination
                totalItems={totalFilteredDrivers}
                pageSize={pageSize}
                currentPage={page}
                onPageChange={setPage}
                onPageSizeChange={(size) => setPageSize(size)}
                pageSizeOptions={[6, 9, 12, 24]}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Driver" : "Add Driver"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update driver profile and details."
                : "Register a new driver in the system."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="driver@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>License Number *</Label>
                <Input
                  value={form.licenseNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, licenseNumber: e.target.value }))
                  }
                  placeholder="DL-12345"
                />
              </div>
              <div className="space-y-2">
                <Label>License Category</Label>
                <Input
                  value={form.licenseCategory}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, licenseCategory: e.target.value }))
                  }
                  placeholder="Van, Truck, Bike"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>License Expiry *</Label>
                <Input
                  type="date"
                  value={form.licenseExpiry}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, licenseExpiry: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as DriverStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.licenseExpiry && isLicenseExpired(form.licenseExpiry) && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  This license is expired. The driver cannot be assigned to new trips.
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.name || !form.licenseNumber || !form.licenseExpiry}
            >
              {editingId ? "Update" : "Add"} Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

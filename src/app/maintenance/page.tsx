"use client";

import { useEffect, useState, useMemo } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Maintenance, MaintenanceStatus } from "@/types";
import {
  Plus, Search, MoreHorizontal, Wrench, CheckCircle2, IndianRupee, Pencil,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { parseISO, format } from "date-fns";

const STATUS_BADGE_MAP: Record<MaintenanceStatus, "warning" | "success" | "info"> = {
  "In Progress": "warning",
  Completed: "success",
  Scheduled: "info",
};

const SERVICE_TYPES = [
  "Oil Change",
  "Tire Rotation",
  "Brake Inspection",
  "Engine Repair",
  "Transmission Service",
  "Battery Replacement",
  "Suspension Check",
  "AC Service",
  "Other",
] as const;

const INITIAL_FORM = {
  vehicleId: "",
  type: "",
  description: "",
  cost: "",
  date: "",
  status: "Scheduled" as MaintenanceStatus,
  mechanic: "",
  nextDueDate: "",
  nextDueOdometer: "",
};

export default function MaintenancePage() {
  const {
    maintenance, vehicles,
    fetchMaintenance, fetchVehicles,
    addMaintenance, updateMaintenance, updateVehicle,
  } = useFleetStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Maintenance | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completingRecord, setCompletingRecord] = useState<Maintenance | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchMaintenance();
    fetchVehicles();
  }, [fetchMaintenance, fetchVehicles]);

  const vehicleMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles],
  );

  const filteredRecords = useMemo(() => {
    let list = maintenance;
    if (statusFilter !== "all") {
      list = list.filter((m) => m.status === statusFilter);
    }
    if (vehicleFilter !== "all") {
      list = list.filter((m) => m.vehicleId === Number(vehicleFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => {
        const vehicle = vehicleMap.get(m.vehicleId);
        return (
          m.type.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.mechanic.toLowerCase().includes(q) ||
          vehicle?.name.toLowerCase().includes(q) ||
          false
        );
      });
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [maintenance, statusFilter, vehicleFilter, search, vehicleMap]);

  const totalFilteredRecords = filteredRecords.length;
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, vehicleFilter]);

  const totalCost = useMemo(
    () => maintenance.reduce((sum, m) => sum + m.cost, 0),
    [maintenance],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of maintenance) counts[m.status] = (counts[m.status] ?? 0) + 1;
    return counts;
  }, [maintenance]);

  function resetForm() {
    setForm(INITIAL_FORM);
    setFormError("");
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setDialogOpen(true);
  }

  function openEdit(record: Maintenance) {
    setEditing(record);
    setForm({
      vehicleId: String(record.vehicleId),
      type: record.type,
      description: record.description,
      cost: String(record.cost),
      date: record.date.split("T")[0],
      status: record.status,
      mechanic: record.mechanic,
      nextDueDate: record.nextDueDate?.split("T")[0] ?? "",
      nextDueOdometer: record.nextDueOdometer != null ? String(record.nextDueOdometer) : "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.vehicleId || !form.type || !form.cost || !form.date || !form.mechanic) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const data = {
      vehicleId: Number(form.vehicleId),
      type: form.type,
      description: form.description,
      cost: Number(form.cost),
      date: form.date,
      status: form.status,
      mechanic: form.mechanic,
      nextDueDate: form.nextDueDate || null,
      nextDueOdometer: form.nextDueOdometer ? Number(form.nextDueOdometer) : null,
    };

    if (editing) {
      await updateMaintenance(editing.id, data);
      if (data.status === "In Progress" && editing.status !== "In Progress") {
        await updateVehicle(data.vehicleId, { status: "In Shop" });
      }
    } else {
      await addMaintenance(data);
      if (data.status === "In Progress") {
        await updateVehicle(data.vehicleId, { status: "In Shop" });
      }
    }

    resetForm();
    setDialogOpen(false);
  }

  function openCompleteConfirm(record: Maintenance) {
    setCompletingRecord(record);
    setCompleteDialogOpen(true);
  }

  async function handleMarkCompleted(restoreVehicle: boolean) {
    if (!completingRecord) return;

    await updateMaintenance(completingRecord.id, { status: "Completed" });

    if (restoreVehicle) {
      await updateVehicle(completingRecord.vehicleId, { status: "Available" });
    }

    setCompleteDialogOpen(false);
    setCompletingRecord(null);
  }

  async function handleStartService(record: Maintenance) {
    await updateMaintenance(record.id, { status: "In Progress" });
    await updateVehicle(record.vehicleId, { status: "In Shop" });
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Maintenance & Service Logs"
        description="Track vehicle maintenance, repairs, and scheduled services"
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Service Log
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <IndianRupee className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
                <p className="text-xs text-muted-foreground">Total Cost</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-2xl h-8 w-8 text-blue-600 flex items-center justify-center font-bold">#</span>
              <div>
                <p className="text-2xl font-bold">{statusCounts["Scheduled"] ?? 0}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Wrench className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold">{statusCounts["In Progress"] ?? 0}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{statusCounts["Completed"] ?? 0}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search maintenance records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Mechanic</TableHead>
                <TableHead className="hidden lg:table-cell">Next Due</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalFilteredRecords === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No maintenance records found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => {
                  const vehicle = vehicleMap.get(record.vehicleId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{vehicle?.name ?? "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{vehicle?.licensePlate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{record.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                          {record.description || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(record.cost)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(record.date)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE_MAP[record.status]}>{record.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{record.mechanic}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {record.nextDueDate ? formatDate(record.nextDueDate) : "—"}
                        {record.nextDueOdometer != null && (
                          <div className="text-xs">{record.nextDueOdometer.toLocaleString()} km</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(record)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {record.status === "Scheduled" && (
                              <DropdownMenuItem onClick={() => handleStartService(record)}>
                                <Wrench className="mr-2 h-4 w-4" /> Start Service
                              </DropdownMenuItem>
                            )}
                            {record.status !== "Completed" && (
                              <DropdownMenuItem onClick={() => openCompleteConfirm(record)}>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <Pagination
            totalItems={totalFilteredRecords}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service Record" : "Add Service Log"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the maintenance record details."
                : "Log a new maintenance or service record."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {formError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="grid gap-2">
              <Label>Vehicle *</Label>
              <Select
                value={form.vehicleId}
                onValueChange={(v) => setForm((f) => ({ ...f, vehicleId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.name} — {v.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Service Type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as MaintenanceStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the service or issue..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Cost (₹) *</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.cost}
                  onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Date *</Label>
                <DatePicker
                  date={form.date ? parseISO(form.date) : undefined}
                  setDate={(d) => setForm((f) => ({ ...f, date: d ? format(d, "yyyy-MM-dd") : "" }))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Mechanic *</Label>
              <Input
                placeholder="Mechanic name"
                value={form.mechanic}
                onChange={(e) => setForm((f) => ({ ...f, mechanic: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Next Due Date</Label>
                <DatePicker
                  date={form.nextDueDate ? parseISO(form.nextDueDate) : undefined}
                  setDate={(d) => setForm((f) => ({ ...f, nextDueDate: d ? format(d, "yyyy-MM-dd") : "" }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Next Due Odometer (km)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.nextDueOdometer}
                  onChange={(e) => setForm((f) => ({ ...f, nextDueOdometer: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? (
                <><Pencil className="mr-2 h-4 w-4" /> Update Record</>
              ) : (
                <><Plus className="mr-2 h-4 w-4" /> Add Record</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Confirmation Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete Maintenance</DialogTitle>
            <DialogDescription>
              Mark this service record as completed. Would you like to set the vehicle back to &quot;Available&quot;?
            </DialogDescription>
          </DialogHeader>
          {completingRecord && (
            <div className="py-2 space-y-1 text-sm">
              <p><span className="text-muted-foreground">Vehicle:</span>{" "}
                <span className="font-medium">{vehicleMap.get(completingRecord.vehicleId)?.name}</span>
              </p>
              <p><span className="text-muted-foreground">Service:</span>{" "}
                <span className="font-medium">{completingRecord.type}</span>
              </p>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => handleMarkCompleted(false)}>
              Complete Only
            </Button>
            <Button onClick={() => handleMarkCompleted(true)}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Complete &amp; Restore Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

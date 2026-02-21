"use client";

import { useEffect, useMemo, useState } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { formatNumber } from "@/lib/utils";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  Truck,
  Filter,
} from "lucide-react";
import type { Vehicle, VehicleType, VehicleStatus } from "@/types";

const STATUS_VARIANT: Record<VehicleStatus, "success" | "info" | "warning" | "destructive"> = {
  Available: "success",
  "On Trip": "info",
  "In Shop": "warning",
  "Out of Service": "destructive",
};

const VEHICLE_TYPES: VehicleType[] = ["Truck", "Van", "Bike"];
const VEHICLE_STATUSES: VehicleStatus[] = ["Available", "On Trip", "In Shop", "Out of Service"];
const REGIONS = ["North", "South", "East", "West"];

type FormData = {
  name: string;
  model: string;
  licensePlate: string;
  type: VehicleType;
  maxCapacity: string;
  region: string;
  status: VehicleStatus;
};

const EMPTY_FORM: FormData = {
  name: "",
  model: "",
  licensePlate: "",
  type: "Van",
  maxCapacity: "",
  region: "North",
  status: "Available",
};

export default function VehiclesPage() {
  const {
    vehicles,
    isLoading,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  } = useFleetStore();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vehicles.filter((v) => {
      if (typeFilter !== "all" && v.type !== typeFilter) return false;
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (
        q &&
        !v.name.toLowerCase().includes(q) &&
        !v.licensePlate.toLowerCase().includes(q) &&
        !v.model.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [vehicles, search, typeFilter, statusFilter]);

  const totalFiltered = filtered.length;
  const paginatedVehicles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, statusFilter]);

  function openAdd() {
    setEditingVehicle(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setForm({
      name: vehicle.name,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
      type: vehicle.type,
      maxCapacity: String(vehicle.maxCapacity),
      region: vehicle.region,
      status: vehicle.status,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.model || !form.licensePlate || !form.maxCapacity) return;
    setSaving(true);
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, {
          name: form.name,
          model: form.model,
          licensePlate: form.licensePlate,
          type: form.type,
          maxCapacity: Number(form.maxCapacity),
          region: form.region,
          status: form.status,
        });
      } else {
        await addVehicle({
          name: form.name,
          model: form.model,
          licensePlate: form.licensePlate,
          type: form.type,
          maxCapacity: Number(form.maxCapacity),
          odometer: 0,
          region: form.region,
          status: form.status,
          acquisitionCost: 0,
          acquiredDate: new Date().toISOString().split("T")[0],
          imageUrl: "",
        });
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(vehicle: Vehicle) {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!vehicleToDelete) return;
    setDeleting(true);
    try {
      await deleteVehicle(vehicleToDelete.id);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  async function toggleRetired(vehicle: Vehicle) {
    const newStatus: VehicleStatus =
      vehicle.status === "Out of Service" ? "Available" : "Out of Service";
    await updateVehicle(vehicle.id, { status: newStatus });
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Vehicle Registry"
        description="Manage your fleet assets"
        actions={
          <Button onClick={openAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        }
      />

      <div className="flex-1 space-y-4 p-6">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, plate, or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {VEHICLE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {VEHICLE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm text-muted-foreground">
            <Filter className="mr-1 inline h-3.5 w-3.5" />
            {filtered.length} of {vehicles.length} vehicles
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name / Model</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Max Capacity</TableHead>
                  <TableHead className="hidden lg:table-cell">Odometer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Region</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totalFiltered === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Truck className="h-8 w-8" />
                        <p>No vehicles found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.model}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {vehicle.licensePlate}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{vehicle.type}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatNumber(vehicle.maxCapacity)} kg
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatNumber(vehicle.odometer)} km
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[vehicle.status]}>
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {vehicle.region}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(vehicle)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleRetired(vehicle)}>
                              <Power className="mr-2 h-4 w-4" />
                              {vehicle.status === "Out of Service"
                                ? "Reactivate"
                                : "Retire"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => confirmDelete(vehicle)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination
              totalItems={totalFiltered}
              pageSize={pageSize}
              currentPage={page}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
            </DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Update the vehicle details below."
                : "Fill in the details to register a new vehicle."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="v-name">Name</Label>
                <Input
                  id="v-name"
                  placeholder="e.g. Van-06"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-model">Model</Label>
                <Input
                  id="v-model"
                  placeholder="e.g. Ford Transit 2024"
                  value={form.model}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="v-plate">License Plate</Label>
                <Input
                  id="v-plate"
                  placeholder="e.g. FL-1006"
                  value={form.licensePlate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, licensePlate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, type: v as VehicleType }))
                  }
                >
                  <SelectTrigger id="v-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="v-capacity">Max Capacity (kg)</Label>
                <Input
                  id="v-capacity"
                  type="number"
                  placeholder="e.g. 500"
                  value={form.maxCapacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxCapacity: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-region">Region</Label>
                <Select
                  value={form.region}
                  onValueChange={(v) => setForm((f) => ({ ...f, region: v }))}
                >
                  <SelectTrigger id="v-region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editingVehicle && (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label>Out of Service</Label>
                  <p className="text-xs text-muted-foreground">
                    Mark this vehicle as retired
                  </p>
                </div>
                <Switch
                  checked={form.status === "Out of Service"}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({
                      ...f,
                      status: checked ? "Out of Service" : "Available",
                    }))
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                saving || !form.name || !form.model || !form.licensePlate || !form.maxCapacity
              }
            >
              {saving ? "Saving..." : editingVehicle ? "Save Changes" : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {vehicleToDelete?.name}
              </span>{" "}
              ({vehicleToDelete?.licensePlate})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

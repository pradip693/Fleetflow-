"use client";

import { useEffect, useState, useMemo } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";
import type { Trip, TripStatus } from "@/types";
import {
  Plus, Search, MoreHorizontal, Send, CheckCircle2, XCircle, ArrowRight,
  Truck, FileText, Clock, Ban,
} from "lucide-react";

const STATUS_BADGE_MAP: Record<TripStatus, "secondary" | "info" | "success" | "destructive"> = {
  Draft: "secondary",
  Dispatched: "info",
  Completed: "success",
  Cancelled: "destructive",
};

const INITIAL_FORM = {
  vehicleId: "",
  driverId: "",
  origin: "",
  destination: "",
  cargoWeight: "",
  cargoDescription: "",
  estimatedDistance: "",
  notes: "",
};

export default function TripsPage() {
  const {
    trips, vehicles, drivers,
    fetchTrips, fetchVehicles, fetchDrivers,
    addTrip, updateTrip, updateVehicle, updateDriver,
  } = useFleetStore();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completingTrip, setCompletingTrip] = useState<Trip | null>(null);
  const [endOdometer, setEndOdometer] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchTrips();
    fetchVehicles();
    fetchDrivers();
  }, [fetchTrips, fetchVehicles, fetchDrivers]);

  const vehicleMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles],
  );
  const driverMap = useMemo(
    () => new Map(drivers.map((d) => [d.id, d])),
    [drivers],
  );

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === "Available"),
    [vehicles],
  );
  const availableDrivers = useMemo(
    () =>
      drivers.filter(
        (d) => d.status === "On Duty" && new Date(d.licenseExpiry) > new Date(),
      ),
    [drivers],
  );

  const filteredTrips = useMemo(() => {
    let list = trips;
    if (activeTab !== "all") {
      list = list.filter((t) => t.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => {
        const vehicle = vehicleMap.get(t.vehicleId);
        const driver = driverMap.get(t.driverId);
        return (
          t.origin.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.cargoDescription.toLowerCase().includes(q) ||
          vehicle?.name.toLowerCase().includes(q) ||
          driver?.name.toLowerCase().includes(q) ||
          String(t.id).includes(q)
        );
      });
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [trips, activeTab, search, vehicleMap, driverMap]);

  const totalFilteredTrips = filteredTrips.length;
  const paginatedTrips = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTrips.slice(start, start + pageSize);
  }, [filteredTrips, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, activeTab]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: trips.length };
    for (const t of trips) counts[t.status] = (counts[t.status] ?? 0) + 1;
    return counts;
  }, [trips]);

  const selectedVehicle = form.vehicleId
    ? vehicles.find((v) => v.id === Number(form.vehicleId))
    : null;

  function resetForm() {
    setForm(INITIAL_FORM);
    setFormError("");
  }

  async function handleCreateTrip() {
    if (!form.vehicleId || !form.driverId || !form.origin || !form.destination || !form.cargoWeight) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const weight = Number(form.cargoWeight);
    if (selectedVehicle && weight > selectedVehicle.maxCapacity) {
      setFormError(
        `Cargo weight (${weight} kg) exceeds vehicle max capacity (${selectedVehicle.maxCapacity} kg).`,
      );
      return;
    }

    const vehicle = vehicleMap.get(Number(form.vehicleId));

    await addTrip({
      vehicleId: Number(form.vehicleId),
      driverId: Number(form.driverId),
      origin: form.origin,
      destination: form.destination,
      cargoWeight: weight,
      cargoDescription: form.cargoDescription,
      estimatedDistance: Number(form.estimatedDistance) || 0,
      status: "Draft",
      createdAt: new Date().toISOString(),
      dispatchedAt: null,
      completedAt: null,
      startOdometer: vehicle?.odometer ?? null,
      endOdometer: null,
      notes: form.notes,
    });

    resetForm();
    setCreateOpen(false);
  }

  async function handleDispatch(trip: Trip) {
    await updateTrip(trip.id, {
      status: "Dispatched",
      dispatchedAt: new Date().toISOString(),
    });
    await updateVehicle(trip.vehicleId, { status: "On Trip" });
    await updateDriver(trip.driverId, { status: "On Duty" });
  }

  function openCompleteDialog(trip: Trip) {
    setCompletingTrip(trip);
    setEndOdometer("");
    setCompleteOpen(true);
  }

  async function handleComplete() {
    if (!completingTrip) return;
    const odometerValue = Number(endOdometer);
    if (!endOdometer || isNaN(odometerValue) || odometerValue <= 0) return;

    await updateTrip(completingTrip.id, {
      status: "Completed",
      completedAt: new Date().toISOString(),
      endOdometer: odometerValue,
    });
    await updateVehicle(completingTrip.vehicleId, {
      status: "Available",
      odometer: odometerValue,
    });
    await updateDriver(completingTrip.driverId, { status: "On Duty" });

    setCompleteOpen(false);
    setCompletingTrip(null);
  }

  async function handleCancel(trip: Trip) {
    await updateTrip(trip.id, {
      status: "Cancelled",
      completedAt: new Date().toISOString(),
    });
    if (trip.status === "Dispatched") {
      await updateVehicle(trip.vehicleId, { status: "Available" });
      await updateDriver(trip.driverId, { status: "On Duty" });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Trip Dispatcher"
        description="Create, dispatch, and manage fleet trips"
        actions={
          <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Create Trip
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([
            { label: "Draft", icon: FileText, count: statusCounts["Draft"] ?? 0, color: "text-muted-foreground" },
            { label: "Dispatched", icon: Truck, count: statusCounts["Dispatched"] ?? 0, color: "text-blue-600" },
            { label: "Completed", icon: CheckCircle2, count: statusCounts["Completed"] ?? 0, color: "text-emerald-600" },
            { label: "Cancelled", icon: Ban, count: statusCounts["Cancelled"] ?? 0, color: "text-destructive" },
          ] as const).map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <s.icon className={`h-8 w-8 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold">{s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trips..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs + Table */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Trips ({statusCounts.all ?? 0})</TabsTrigger>
            <TabsTrigger value="Draft">Draft ({statusCounts["Draft"] ?? 0})</TabsTrigger>
            <TabsTrigger value="Dispatched">Dispatched ({statusCounts["Dispatched"] ?? 0})</TabsTrigger>
            <TabsTrigger value="Completed">Completed ({statusCounts["Completed"] ?? 0})</TabsTrigger>
            <TabsTrigger value="Cancelled">Cancelled ({statusCounts["Cancelled"] ?? 0})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalFilteredTrips === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                        No trips found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTrips.map((trip) => {
                      const vehicle = vehicleMap.get(trip.vehicleId);
                      const driver = driverMap.get(trip.driverId);
                      return (
                        <TableRow key={trip.id}>
                          <TableCell className="font-mono text-xs">#{trip.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{vehicle?.name ?? "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">{vehicle?.licensePlate}</div>
                          </TableCell>
                          <TableCell>{driver?.name ?? "Unknown"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="truncate max-w-[100px]">{trip.origin}</span>
                              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                              <span className="truncate max-w-[100px]">{trip.destination}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{trip.cargoWeight} kg</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                              {trip.cargoDescription}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={STATUS_BADGE_MAP[trip.status]}>{trip.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(trip.createdAt)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {trip.status === "Draft" && (
                                  <DropdownMenuItem onClick={() => handleDispatch(trip)}>
                                    <Send className="mr-2 h-4 w-4" /> Dispatch
                                  </DropdownMenuItem>
                                )}
                                {trip.status === "Dispatched" && (
                                  <DropdownMenuItem onClick={() => openCompleteDialog(trip)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
                                  </DropdownMenuItem>
                                )}
                                {trip.status !== "Completed" && trip.status !== "Cancelled" && (
                                  <DropdownMenuItem
                                    onClick={() => handleCancel(trip)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" /> Cancel
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
                totalItems={totalFilteredTrips}
                pageSize={pageSize}
                currentPage={page}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Trip Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) resetForm(); setCreateOpen(open); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>Fill in the trip details. All fields marked with * are required.</DialogDescription>
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
                onValueChange={(v) => { setForm((f) => ({ ...f, vehicleId: v })); setFormError(""); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select available vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.length === 0 ? (
                    <SelectItem value="__none" disabled>No available vehicles</SelectItem>
                  ) : (
                    availableVehicles.map((v) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.name} — {v.licensePlate} (Max: {v.maxCapacity} kg)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Driver *</Label>
              <Select
                value={form.driverId}
                onValueChange={(v) => setForm((f) => ({ ...f, driverId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select available driver" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.length === 0 ? (
                    <SelectItem value="__none" disabled>No available drivers</SelectItem>
                  ) : (
                    availableDrivers.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name} — {d.licenseCategory}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Origin *</Label>
                <Input
                  placeholder="e.g. Dallas, TX"
                  value={form.origin}
                  onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Destination *</Label>
                <Input
                  placeholder="e.g. Houston, TX"
                  value={form.destination}
                  onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Cargo Weight (kg) *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.cargoWeight}
                  onChange={(e) => { setForm((f) => ({ ...f, cargoWeight: e.target.value })); setFormError(""); }}
                />
                {selectedVehicle && (
                  <p className="text-xs text-muted-foreground">
                    Vehicle capacity: {selectedVehicle.maxCapacity} kg
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Est. Distance (km)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.estimatedDistance}
                  onChange={(e) => setForm((f) => ({ ...f, estimatedDistance: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Cargo Description</Label>
              <Input
                placeholder="What is being transported?"
                value={form.cargoDescription}
                onChange={(e) => setForm((f) => ({ ...f, cargoDescription: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setCreateOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateTrip}>
              <Plus className="mr-2 h-4 w-4" /> Create Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Trip Dialog */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete Trip #{completingTrip?.id}</DialogTitle>
            <DialogDescription>
              Enter the end odometer reading to complete this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {completingTrip?.startOdometer != null && (
              <p className="text-sm text-muted-foreground">
                Start odometer: <span className="font-medium text-foreground">{completingTrip.startOdometer.toLocaleString()} km</span>
              </p>
            )}
            <div className="grid gap-2">
              <Label>End Odometer (km) *</Label>
              <Input
                type="number"
                placeholder="Current odometer reading"
                value={endOdometer}
                onChange={(e) => setEndOdometer(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>Cancel</Button>
            <Button onClick={handleComplete} disabled={!endOdometer || Number(endOdometer) <= 0}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

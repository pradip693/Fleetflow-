"use client";

import { useEffect, useMemo, useState } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { Vehicle, VehicleType, VehicleStatus } from "@/types";

// Extracted Components
import { VehicleFilters } from "./vehicle-filters";
import { VehicleTable } from "./vehicle-table";
import { VehicleDialog } from "./vehicle-dialog";
import { DeleteVehicleDialog } from "./delete-vehicle-dialog";

const STATUS_VARIANT: Record<VehicleStatus, string> = {
    Available: "success",
    "On Trip": "info",
    "In Shop": "warning",
    "Out of Service": "destructive",
};

const VEHICLE_TYPES: VehicleType[] = ["Truck", "Van", "Bike"];
const VEHICLE_STATUSES: VehicleStatus[] = ["Available", "On Trip", "In Shop", "Out of Service"];
const REGIONS = ["North", "South", "East", "West"];

const EMPTY_FORM = {
    name: "",
    model: "",
    licensePlate: "",
    type: "Van" as VehicleType,
    maxCapacity: "",
    region: "North",
    status: "Available" as VehicleStatus,
    acquiredDate: new Date().toISOString().split("T")[0],
    acquisitionCost: "0",
};

interface VehiclesClientProps {
    initialVehicles: Vehicle[];
}

export function VehiclesClient({ initialVehicles }: VehiclesClientProps) {
    const {
        vehicles: storeVehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
    } = useFleetStore();

    useEffect(() => {
        useFleetStore.setState({
            vehicles: initialVehicles,
            isLoading: false
        });
    }, [initialVehicles]);

    const vehicles = storeVehicles.length ? storeVehicles : initialVehicles;

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const hasFilters = search !== "" || typeFilter !== "all" || statusFilter !== "all";

    function handleClearFilters() {
        setSearch("");
        setTypeFilter("all");
        setStatusFilter("all");
    }

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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

    const paginatedVehicles = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [search, typeFilter, statusFilter]);

    async function handleSave() {
        if (!form.name || !form.model || !form.licensePlate || !form.maxCapacity) return;
        setSaving(true);
        try {
            if (editingVehicle) {
                await updateVehicle(editingVehicle.id, {
                    ...form,
                    maxCapacity: Number(form.maxCapacity),
                    acquisitionCost: Number(form.acquisitionCost),
                });
            } else {
                await addVehicle({
                    ...form,
                    maxCapacity: Number(form.maxCapacity),
                    acquisitionCost: Number(form.acquisitionCost),
                    odometer: 0,
                    imageUrl: "",
                });
            }
            setDialogOpen(false);
        } finally {
            setSaving(false);
        }
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

    return (
        <div className="flex flex-col min-h-full bg-slate-50/30 dark:bg-transparent">
            <Header
                title="Vehicle Registry"
                description="Manage your fleet assets and tracking"
                actions={
                    <Button onClick={() => { setEditingVehicle(null); setForm(EMPTY_FORM); setDialogOpen(true); }} size="sm" className="rounded-xl shadow-lg shadow-indigo-500/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Vehicle
                    </Button>
                }
            />

            <div className="flex-1 space-y-6 p-6">
                <VehicleFilters
                    search={search}
                    setSearch={setSearch}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    totalFiltered={filtered.length}
                    totalVehicles={vehicles.length}
                    vehicleTypes={VEHICLE_TYPES}
                    vehicleStatuses={VEHICLE_STATUSES}
                    hasFilters={hasFilters}
                    onClear={handleClearFilters}
                />

                <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
                    <CardContent className="p-0">
                        <VehicleTable
                            vehicles={paginatedVehicles}
                            statusVariants={STATUS_VARIANT}
                            page={page}
                            pageSize={pageSize}
                            totalFiltered={filtered.length}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                            onEdit={(v) => {
                                setEditingVehicle(v);
                                setForm({
                                    name: v.name,
                                    model: v.model,
                                    licensePlate: v.licensePlate,
                                    type: v.type,
                                    maxCapacity: String(v.maxCapacity),
                                    region: v.region,
                                    status: v.status,
                                    acquiredDate: v.acquiredDate || new Date().toISOString().split("T")[0],
                                    acquisitionCost: String(v.acquisitionCost || 0),
                                });
                                setDialogOpen(true);
                            }}
                            onDelete={(v) => {
                                setVehicleToDelete(v);
                                setDeleteDialogOpen(true);
                            }}
                            onToggleStatus={async (v) => {
                                const newStatus: VehicleStatus = v.status === "Out of Service" ? "Available" : "Out of Service";
                                await updateVehicle(v.id, { status: newStatus });
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            <VehicleDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingVehicle={editingVehicle}
                form={form}
                setForm={setForm}
                saving={saving}
                onSave={handleSave}
                vehicleTypes={VEHICLE_TYPES}
                regions={REGIONS}
            />

            <DeleteVehicleDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                vehicle={vehicleToDelete}
                deleting={deleting}
                onDelete={handleDelete}
            />
        </div>
    );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Maintenance, MaintenanceStatus, Vehicle } from "@/types";
import { Pagination } from "@/components/ui/pagination";

// Extracted Components
import { MaintenanceStats } from "./maintenance-stats";
import { MaintenanceFilters } from "./maintenance-filters";
import { MaintenanceTable } from "./maintenance-table";
import { MaintenanceDialog } from "./maintenance-dialog";
import { CompleteMaintenanceDialog } from "./complete-maintenance-dialog";

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

interface MaintenanceClientProps {
    initialData: {
        maintenance: Maintenance[];
        vehicles: Vehicle[];
    };
}

export function MaintenanceClient({ initialData }: MaintenanceClientProps) {
    const {
        maintenance: storeMaintenance, vehicles: storeVehicles,
        addMaintenance, updateMaintenance, updateVehicle,
    } = useFleetStore();

    useEffect(() => {
        useFleetStore.setState({
            maintenance: initialData.maintenance,
            vehicles: initialData.vehicles,
            isLoading: false
        });
    }, [initialData]);

    const maintenance = storeMaintenance.length ? storeMaintenance : initialData.maintenance;
    const vehicles = storeVehicles.length ? storeVehicles : initialData.vehicles;

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
        <div className="flex flex-col min-h-full bg-slate-50/30 dark:bg-transparent">
            <Header
                title="Fleet Telemetry & Service"
                description="Monitor lifecycle protocols, diagnostics, and recovery timelines"
                actions={
                    <Button
                        size="sm"
                        onClick={openCreate}
                        className="rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Registry
                    </Button>
                }
            />

            <div className="flex-1 space-y-8 p-6">
                <MaintenanceStats totalCost={totalCost} statusCounts={statusCounts} />

                <MaintenanceFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    vehicleFilter={vehicleFilter}
                    setVehicleFilter={setVehicleFilter}
                    vehicles={vehicles}
                />

                <MaintenanceTable
                    records={paginatedRecords}
                    vehicleMap={vehicleMap}
                    statusBadgeMap={STATUS_BADGE_MAP}
                    onEdit={openEdit}
                    onStartService={handleStartService}
                    onMarkCompleted={openCompleteConfirm}
                />

                {totalFilteredRecords > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
                        <Pagination
                            totalItems={totalFilteredRecords}
                            pageSize={pageSize}
                            currentPage={page}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                )}
            </div>

            <MaintenanceDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editing={editing}
                form={form}
                setForm={setForm}
                formError={formError}
                vehicles={vehicles}
                serviceTypes={SERVICE_TYPES}
                onSave={handleSave}
                resetForm={resetForm}
            />

            <CompleteMaintenanceDialog
                open={completeDialogOpen}
                onOpenChange={setCompleteDialogOpen}
                record={completingRecord}
                vehicleMap={vehicleMap}
                onMarkCompleted={handleMarkCompleted}
            />
        </div>
    );
}

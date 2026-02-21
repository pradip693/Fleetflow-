"use client";

import { useEffect, useState, useMemo } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Driver, DriverStatus } from "@/types";
import { Pagination } from "@/components/ui/pagination";

// Extracted Components
import { DriverFilters } from "./driver-filters";
import { DriverCard } from "./driver-card";
import { DriverTable } from "./driver-table";
import { DriverDialog } from "./driver-dialog";

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
    if (!expiry) return false;
    return new Date(expiry) < new Date();
}

function isLicenseExpiringSoon(expiry: string) {
    if (!expiry) return false;
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

interface DriversClientProps {
    initialDrivers: Driver[];
}

export function DriversClient({ initialDrivers }: DriversClientProps) {
    const { drivers: storeDrivers, addDriver, updateDriver } = useFleetStore();

    useEffect(() => {
        useFleetStore.setState({
            drivers: initialDrivers,
            isLoading: false
        });
    }, [initialDrivers]);

    const drivers = storeDrivers.length ? storeDrivers : initialDrivers;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [view, setView] = useState<"grid" | "table">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(view === "grid" ? 9 : 10);

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

    return (
        <div className="flex flex-col min-h-full bg-slate-50/30 dark:bg-transparent">
            <Header
                title="Personnel Directory"
                description="Monitor operator performance, health, and compliance"
                actions={
                    <Button
                        size="sm"
                        onClick={openAddDialog}
                        className="rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Operator
                    </Button>
                }
            />

            <div className="flex-1 space-y-8 p-6">
                <DriverFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    view={view}
                    setView={setView}
                    statusOptions={STATUS_OPTIONS}
                />

                {view === "grid" ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {paginatedDrivers.map((driver) => (
                            <DriverCard
                                key={driver.id}
                                driver={driver}
                                onEdit={openEditDialog}
                                isLicenseExpired={isLicenseExpired}
                                isLicenseExpiringSoon={isLicenseExpiringSoon}
                                getStatusVariant={getStatusVariant}
                                getSafetyColor={getSafetyColor}
                                getSafetyBg={getSafetyBg}
                                getInitials={getInitials}
                            />
                        ))}
                        {totalFilteredDrivers === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                    No personnel matching your criteria
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <DriverTable
                        drivers={paginatedDrivers}
                        onEdit={openEditDialog}
                        isLicenseExpired={isLicenseExpired}
                        isLicenseExpiringSoon={isLicenseExpiringSoon}
                        getStatusVariant={getStatusVariant}
                        getSafetyColor={getSafetyColor}
                        getSafetyBg={getSafetyBg}
                        getInitials={getInitials}
                    />
                )}

                {totalFilteredDrivers > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
                        <Pagination
                            totalItems={totalFilteredDrivers}
                            pageSize={pageSize}
                            currentPage={page}
                            onPageChange={setPage}
                            onPageSizeChange={(size) => setPageSize(size)}
                            pageSizeOptions={[6, 9, 12, 24]}
                        />
                    </div>
                )}
            </div>

            <DriverDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingId={editingId}
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                isExpired={isLicenseExpired}
                statusOptions={STATUS_OPTIONS}
            />
        </div>
    );
}

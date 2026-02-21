"use client";

import { useEffect, useMemo, useState } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Truck, Wrench, Gauge, PackageOpen } from "lucide-react";
import type { Vehicle, Driver, Trip, Maintenance, Expense, VehicleStatus, TripStatus } from "@/types";

// Extracted Components
import { DashboardKPIs } from "./dashboard-kpis";
import { DashboardCharts } from "./dashboard-charts";
import { RecentTripsTable } from "./recent-trips-table";
import { DashboardQuickStats } from "./dashboard-quick-stats";

const STATUS_VARIANT: Record<VehicleStatus, "success" | "info" | "warning" | "destructive"> = {
    Available: "success",
    "On Trip": "info",
    "In Shop": "warning",
    "Out of Service": "destructive",
};

const TRIP_STATUS_VARIANT: Record<TripStatus, "success" | "info" | "warning" | "destructive" | "secondary"> = {
    Draft: "secondary",
    Dispatched: "info",
    Completed: "success",
    Cancelled: "destructive",
};

const VEHICLE_STATUS_COLORS: Record<string, string> = {
    Available: "#10b981",
    "On Trip": "#6366f1",
    "In Shop": "#f59e0b",
    "Out of Service": "#ef4444",
};

interface DashboardClientProps {
    initialData: {
        vehicles: Vehicle[];
        drivers: Driver[];
        trips: Trip[];
        maintenance: Maintenance[];
        expenses: Expense[];
    };
}

export function DashboardClient({ initialData }: DashboardClientProps) {
    const {
        vehicles: storeVehicles,
        drivers: storeDrivers,
        trips: storeTrips,
        maintenance: storeMaintenance,
        expenses: storeExpenses,
    } = useFleetStore();

    useEffect(() => {
        useFleetStore.setState({
            vehicles: initialData.vehicles,
            drivers: initialData.drivers,
            trips: initialData.trips,
            maintenance: initialData.maintenance,
            expenses: initialData.expenses,
            isLoading: false
        });
    }, [initialData]);

    const vehicles = storeVehicles.length ? storeVehicles : initialData.vehicles;
    const drivers = storeDrivers.length ? storeDrivers : initialData.drivers;
    const trips = storeTrips.length ? storeTrips : initialData.trips;
    const maintenance = storeMaintenance.length ? storeMaintenance : initialData.maintenance;

    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [regionFilter, setRegionFilter] = useState<string>("all");

    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            if (typeFilter !== "all" && v.type !== typeFilter) return false;
            if (statusFilter !== "all" && v.status !== statusFilter) return false;
            if (regionFilter !== "all" && v.region !== regionFilter) return false;
            return true;
        });
    }, [vehicles, typeFilter, statusFilter, regionFilter]);

    const regions = useMemo(
        () => [...new Set(vehicles.map((v) => v.region))].sort(),
        [vehicles]
    );

    const activeFleetCount = filteredVehicles.filter((v) => v.status === "On Trip").length;
    const maintenanceAlertsCount = filteredVehicles.filter((v) => v.status === "In Shop").length;
    const utilization = filteredVehicles.length > 0
        ? Math.round(
            ((filteredVehicles.filter((v) => v.status === "On Trip" || v.status === "In Shop").length) /
                filteredVehicles.length) *
            100
        )
        : 0;
    const pendingCargoCount = trips.filter((t) => t.status === "Draft").length;

    const statusDistribution = useMemo(() => {
        const counts: Record<string, number> = {
            "Available": 0,
            "On Trip": 0,
            "In Shop": 0,
            "Out of Service": 0
        };
        filteredVehicles.forEach((v) => {
            counts[v.status] = (counts[v.status] || 0) + 1;
        });
        return Object.entries(counts)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    }, [filteredVehicles]);

    const typeDistribution = useMemo(() => {
        const map: Record<string, Record<string, number>> = {};
        filteredVehicles.forEach((v) => {
            if (!map[v.type]) map[v.type] = {};
            map[v.type][v.status] = (map[v.type][v.status] || 0) + 1;
        });
        return Object.entries(map).map(([type, statuses]) => ({
            type,
            ...statuses,
        }));
    }, [filteredVehicles]);

    const recentTrips = useMemo(() => {
        return [...trips]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [trips]);

    const kpis = [
        {
            label: "Active Fleet",
            value: activeFleetCount,
            icon: Truck,
            trend: `${filteredVehicles.length} total`,
            trendUp: activeFleetCount > 0,
            color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400",
        },
        {
            label: "In Repair",
            value: maintenanceAlertsCount,
            icon: Wrench,
            trend: `${maintenance.filter((m) => m.status === "In Progress").length} in progress`,
            trendUp: maintenanceAlertsCount === 0,
            color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400",
        },
        {
            label: "Utilization",
            value: `${utilization}%`,
            icon: Gauge,
            trend: `${trips.filter(t => t.status === "Completed").length} trips done`,
            trendUp: utilization > 60,
            color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400",
        },
        {
            label: "Pending Cargo",
            value: pendingCargoCount,
            icon: PackageOpen,
            trend: `${trips.filter((t) => t.status === "Dispatched").length} dispatched`,
            trendUp: pendingCargoCount === 0,
            color: "text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400",
        },
    ];

    const getVehicleName = (id: number) =>
        vehicles.find((v) => v.id === id)?.name ?? `#${id}`;

    const getDriverName = (id: number) =>
        drivers.find((d) => d.id === id)?.name ?? `#${id}`;

    return (
        <div className="flex flex-col min-h-full bg-slate-50/30 dark:bg-transparent">
            <Header
                title="Command Center"
                description="Fleet operations and real-time logistics overview"
            />

            <div className="flex-1 space-y-8 p-6">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[160px] rounded-xl border-slate-200 dark:border-slate-800">
                            <SelectValue placeholder="Vehicle Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Truck">Truck</SelectItem>
                            <SelectItem value="Van">Van</SelectItem>
                            <SelectItem value="Bike">Bike</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[170px] rounded-xl border-slate-200 dark:border-slate-800">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="On Trip">On Trip</SelectItem>
                            <SelectItem value="In Shop">In Shop</SelectItem>
                            <SelectItem value="Out of Service">Out of Service</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                        <SelectTrigger className="w-[160px] rounded-xl border-slate-200 dark:border-slate-800">
                            <SelectValue placeholder="Region" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Regions</SelectItem>
                            {regions.map((r) => (
                                <SelectItem key={r} value={r}>
                                    {r}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DashboardKPIs kpis={kpis} />

                <DashboardCharts
                    statusDistribution={statusDistribution}
                    typeDistribution={typeDistribution}
                    statusColors={VEHICLE_STATUS_COLORS}
                />

                <RecentTripsTable
                    trips={recentTrips}
                    getVehicleName={getVehicleName}
                    getDriverName={getDriverName}
                    statusVariants={TRIP_STATUS_VARIANT}
                />

                <DashboardQuickStats
                    totalVehicles={vehicles.length}
                    totalTrips={trips.length}
                    activeDrivers={drivers.filter((d) => d.status === "On Duty").length}
                />
            </div>
        </div>
    );
}

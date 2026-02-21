"use client";

import { useEffect, useState, useMemo } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Trip, TripStatus, Vehicle, Driver } from "@/types";
import { Pagination } from "@/components/ui/pagination";

// Extracted Components
import { TripStats } from "./trip-stats";
import { TripFilters } from "./trip-filters";
import { TripTable } from "./trip-table";
import { TripDialog } from "./trip-dialog";
import { CompleteTripDialog } from "./complete-trip-dialog";

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

interface TripsClientProps {
    initialData: {
        trips: Trip[];
        vehicles: Vehicle[];
        drivers: Driver[];
    };
}

export function TripsClient({ initialData }: TripsClientProps) {
    const {
        trips: storeTrips, vehicles: storeVehicles, drivers: storeDrivers,
        addTrip, updateTrip, updateVehicle, updateDriver,
    } = useFleetStore();

    useEffect(() => {
        useFleetStore.setState({
            trips: initialData.trips,
            vehicles: initialData.vehicles,
            drivers: initialData.drivers,
            isLoading: false
        });
    }, [initialData]);

    const trips = storeTrips.length ? storeTrips : initialData.trips;
    const vehicles = storeVehicles.length ? storeVehicles : initialData.vehicles;
    const drivers = storeDrivers.length ? storeDrivers : initialData.drivers;

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
        <div className="flex flex-col min-h-full bg-slate-50/30 dark:bg-transparent">
            <Header
                title="Fleet Logistics"
                description="Dispatch coordination and real-time task management"
                actions={
                    <Button
                        size="sm"
                        onClick={() => { resetForm(); setCreateOpen(true); }}
                        className="rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                    </Button>
                }
            />

            <div className="flex-1 space-y-8 p-6">
                <TripStats counts={statusCounts} />

                <TripFilters
                    search={search}
                    setSearch={setSearch}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    counts={statusCounts}
                />

                <TripTable
                    trips={paginatedTrips}
                    vehicleMap={vehicleMap}
                    driverMap={driverMap}
                    statusBadgeMap={STATUS_BADGE_MAP}
                    onDispatch={handleDispatch}
                    onComplete={openCompleteDialog}
                    onCancel={handleCancel}
                />

                {totalFilteredTrips > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
                        <Pagination
                            totalItems={totalFilteredTrips}
                            pageSize={pageSize}
                            currentPage={page}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                )}
            </div>

            <TripDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                form={form}
                setForm={setForm}
                formError={formError}
                setFormError={setFormError}
                availableVehicles={availableVehicles}
                availableDrivers={availableDrivers}
                selectedVehicle={selectedVehicle}
                onSubmit={handleCreateTrip}
                resetForm={resetForm}
            />

            <CompleteTripDialog
                open={completeOpen}
                onOpenChange={setCompleteOpen}
                trip={completingTrip}
                endOdometer={endOdometer}
                setEndOdometer={setEndOdometer}
                onComplete={handleComplete}
            />
        </div>
    );
}

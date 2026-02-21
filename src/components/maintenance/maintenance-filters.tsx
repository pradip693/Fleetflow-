import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Vehicle } from "@/types";

interface MaintenanceFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (val: string) => void;
    vehicles: Vehicle[];
}

export function MaintenanceFilters({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
    vehicles,
}: MaintenanceFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search maintenance records..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] rounded-xl border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
            </Select>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger className="w-[180px] rounded-xl border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Filter by vehicle" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Vehicles</SelectItem>
                    {vehicles.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                            {v.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

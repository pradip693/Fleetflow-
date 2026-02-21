import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import type { VehicleType, VehicleStatus } from "@/types";

interface VehicleFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    typeFilter: string;
    setTypeFilter: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    totalFiltered: number;
    totalVehicles: number;
    vehicleTypes: VehicleType[];
    vehicleStatuses: VehicleStatus[];
    hasFilters: boolean;
    onClear: () => void;
}

export function VehicleFilters({
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    totalFiltered,
    totalVehicles,
    vehicleTypes,
    vehicleStatuses,
    hasFilters,
    onClear,
}: VehicleFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[260px] max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search name, plate, or model..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold"
                />
            </div>

            <div className="flex items-center gap-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px] rounded-xl border-slate-200 dark:border-slate-800 font-bold">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="font-bold">All Types</SelectItem>
                        {vehicleTypes.map((t) => (
                            <SelectItem key={t} value={t} className="font-bold">
                                {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px] rounded-xl border-slate-200 dark:border-slate-800 font-bold">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="font-bold">All Statuses</SelectItem>
                        {vehicleStatuses.map((s) => (
                            <SelectItem key={s} value={s} className="font-bold">
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="h-9 px-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <X className="mr-1 h-3 w-3" /> Clear
                    </Button>
                )}
            </div>

            <div className="ml-auto flex items-center gap-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                    <Filter className="h-3 w-3" />
                    <span className="text-slate-900 dark:text-slate-100">{totalFiltered}</span>
                    <span className="opacity-50">of</span>
                    <span className="text-slate-900 dark:text-slate-100">{totalVehicles} assets</span>
                </div>
            </div>
        </div>
    );
}

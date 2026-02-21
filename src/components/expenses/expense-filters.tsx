import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Filter, X } from "lucide-react";
import { parseISO, format } from "date-fns";
import type { Vehicle, ExpenseType } from "@/types";

interface ExpenseFiltersProps {
    vehicles: Vehicle[];
    expenseTypes: ExpenseType[];
    filterVehicle: string;
    setFilterVehicle: (val: string) => void;
    filterType: string;
    setFilterType: (val: string) => void;
    filterDateFrom: string;
    setFilterDateFrom: (val: string) => void;
    filterDateTo: string;
    setFilterDateTo: (val: string) => void;
    showFilters: boolean;
    setShowFilters: (val: boolean) => void;
    clearFilters: () => void;
    hasFilters: boolean;
}

export function ExpenseFilters({
    vehicles,
    expenseTypes,
    filterVehicle,
    setFilterVehicle,
    filterType,
    setFilterType,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    showFilters,
    setShowFilters,
    clearFilters,
    hasFilters,
}: ExpenseFiltersProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button
                    variant={showFilters ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-xl"
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-xl">
                        <X className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>
            {showFilters && (
                <Card className="glass-card shadow-lg border-none">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vehicle</Label>
                                <Select value={filterVehicle} onValueChange={setFilterVehicle}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="All Vehicles" />
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
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</Label>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {expenseTypes.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date From</Label>
                                <DatePicker
                                    date={filterDateFrom ? parseISO(filterDateFrom) : undefined}
                                    setDate={(d) => setFilterDateFrom(d ? format(d, "yyyy-MM-dd") : "")}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date To</Label>
                                <DatePicker
                                    date={filterDateTo ? parseISO(filterDateTo) : undefined}
                                    setDate={(d) => setFilterDateTo(d ? format(d, "yyyy-MM-dd") : "")}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

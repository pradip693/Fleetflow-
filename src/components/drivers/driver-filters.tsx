import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List } from "lucide-react";
import type { DriverStatus } from "@/types";

interface DriverFiltersProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    filterStatus: string;
    setFilterStatus: (val: string) => void;
    view: "grid" | "table";
    setView: (val: "grid" | "table") => void;
    statusOptions: DriverStatus[];
}

export function DriverFilters({
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    view,
    setView,
    statusOptions,
}: DriverFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center flex-1 w-full sm:w-auto">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search drivers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 rounded-xl border-slate-200 dark:border-slate-800"
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px] rounded-xl border-slate-200 dark:border-slate-800">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Status</SelectItem>
                        {statusOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                <Button
                    variant={view === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setView("grid")}
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                    variant={view === "table" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setView("table")}
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

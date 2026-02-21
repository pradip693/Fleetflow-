import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import type { Vehicle, VehicleStatus } from "@/types";

interface VehicleTableProps {
    vehicles: Vehicle[];
    statusVariants: Record<VehicleStatus, string>;
    page: number;
    pageSize: number;
    totalFiltered: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicle: Vehicle) => void;
    onToggleStatus: (vehicle: Vehicle) => void;
}

export function VehicleTable({
    vehicles,
    statusVariants,
    page,
    pageSize,
    totalFiltered,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
    onToggleStatus,
}: VehicleTableProps) {
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest pl-6">Name / Model</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">License Plate</TableHead>
                        <TableHead className="hidden sm:table-cell font-bold uppercase text-[10px] tracking-widest">Type</TableHead>
                        <TableHead className="hidden md:table-cell font-bold uppercase text-[10px] tracking-widest">Max Cap</TableHead>
                        <TableHead className="hidden lg:table-cell font-bold uppercase text-[10px] tracking-widest">Odometer</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                        <TableHead className="hidden md:table-cell font-bold uppercase text-[10px] tracking-widest">Region</TableHead>
                        <TableHead className="w-[70px] pr-6 font-bold uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-40 text-center text-muted-foreground font-medium italic">
                                No vehicles matching your search were found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        vehicles.map((vehicle) => (
                            <TableRow key={vehicle.id} className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                <TableCell className="pl-6">
                                    <div className="flex flex-col py-1">
                                        <p className="font-black text-sm tracking-tight">{vehicle.name}</p>
                                        <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-tighter">
                                            {vehicle.model}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <span className="inline-flex items-center justify-center font-mono text-[10px] font-black bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 shadow-sm text-slate-700 dark:text-slate-300 min-w-[100px]">
                                        {vehicle.licensePlate}
                                    </span>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest border-slate-200 dark:border-slate-800">
                                        {vehicle.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell font-bold text-xs tracking-tighter">
                                    {formatNumber(vehicle.maxCapacity)} kg
                                </TableCell>
                                <TableCell className="hidden lg:table-cell font-medium text-xs text-muted-foreground italic">
                                    {formatNumber(vehicle.odometer)} km
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant={statusVariants[vehicle.status] as any}
                                        className="font-black uppercase tracking-tighter text-[9px] px-2.5 py-0.5"
                                    >
                                        {vehicle.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell font-bold text-[10px] text-muted-foreground/60 uppercase tracking-widest italic">
                                    {vehicle.region}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-primary/10 transition-colors">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                                            <DropdownMenuItem onClick={() => onEdit(vehicle)} className="rounded-lg">
                                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                                Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onToggleStatus(vehicle)} className="rounded-lg">
                                                <Power className="mr-2 h-3.5 w-3.5" />
                                                {vehicle.status === "Out of Service" ? "Reactivate" : "Retire Asset"}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                                            <DropdownMenuItem
                                                onClick={() => onDelete(vehicle)}
                                                className="text-destructive focus:text-destructive rounded-lg"
                                            >
                                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                Delete Asset
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <Pagination
                    totalItems={totalFiltered}
                    pageSize={pageSize}
                    currentPage={page}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            </div>
        </div>
    );
}

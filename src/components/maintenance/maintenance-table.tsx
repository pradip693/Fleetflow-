import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Wrench, CheckCircle2, Pencil } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Maintenance, Vehicle, MaintenanceStatus } from "@/types";

interface MaintenanceTableProps {
    records: Maintenance[];
    vehicleMap: Map<number, Vehicle>;
    statusBadgeMap: Record<MaintenanceStatus, "warning" | "success" | "info">;
    onEdit: (record: Maintenance) => void;
    onStartService: (record: Maintenance) => void;
    onMarkCompleted: (record: Maintenance) => void;
}

export function MaintenanceTable({
    records,
    vehicleMap,
    statusBadgeMap,
    onEdit,
    onStartService,
    onMarkCompleted,
}: MaintenanceTableProps) {
    return (
        <div className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest pl-6">Asset</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Service Item</TableHead>
                        <TableHead className="hidden md:table-cell font-bold uppercase text-[10px] tracking-widest">Notes</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Financials</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Timeline</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                        <TableHead className="hidden lg:table-cell font-bold uppercase text-[10px] tracking-widest">Personnel</TableHead>
                        <TableHead className="hidden lg:table-cell font-bold uppercase text-[10px] tracking-widest">Future Due</TableHead>
                        <TableHead className="w-12 pr-6" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="h-32 text-center text-muted-foreground font-medium italic">
                                No maintenance logs found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        records.map((record) => {
                            const vehicle = vehicleMap.get(record.vehicleId);
                            return (
                                <TableRow key={record.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <TableCell className="pl-6">
                                        <div className="font-black text-sm">{vehicle?.name ?? "N/A"}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{vehicle?.licensePlate}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Wrench className="h-3.5 w-3.5 text-indigo-500/70" />
                                            <span className="text-sm font-bold">{record.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-xs text-muted-foreground truncate max-w-[180px] block italic font-medium">
                                            {record.description || "—"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-black text-sm">{formatCurrency(record.cost)}</TableCell>
                                    <TableCell className="text-[10px] font-bold text-muted-foreground uppercase">
                                        {formatDate(record.date)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusBadgeMap[record.status]} className="font-black uppercase text-[9px] px-2.5">
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="text-xs font-bold">{record.mechanic}</div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">
                                            {record.nextDueDate ? formatDate(record.nextDueDate) : "—"}
                                        </div>
                                        {record.nextDueOdometer != null && (
                                            <div className="text-[9px] font-black text-indigo-600/70">{record.nextDueOdometer.toLocaleString()} km</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-600">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-slate-100 dark:border-slate-800">
                                                <DropdownMenuItem onClick={() => onEdit(record)} className="font-bold text-xs uppercase tracking-widest">
                                                    <Pencil className="mr-2 h-3.5 w-3.5" /> Edit Log
                                                </DropdownMenuItem>
                                                {record.status === "Scheduled" && (
                                                    <DropdownMenuItem onClick={() => onStartService(record)} className="font-bold text-xs uppercase tracking-widest">
                                                        <Wrench className="mr-2 h-3.5 w-3.5" /> Begin Service
                                                    </DropdownMenuItem>
                                                )}
                                                {record.status !== "Completed" && (
                                                    <DropdownMenuItem onClick={() => onMarkCompleted(record)} className="font-bold text-xs uppercase tracking-widest">
                                                        <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Finalize
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Send, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Trip, Vehicle, Driver, TripStatus } from "@/types";

interface TripTableProps {
    trips: Trip[];
    vehicleMap: Map<number, Vehicle>;
    driverMap: Map<number, Driver>;
    statusBadgeMap: Record<TripStatus, "secondary" | "info" | "success" | "destructive">;
    onDispatch: (trip: Trip) => void;
    onComplete: (trip: Trip) => void;
    onCancel: (trip: Trip) => void;
}

export function TripTable({
    trips,
    vehicleMap,
    driverMap,
    statusBadgeMap,
    onDispatch,
    onComplete,
    onCancel,
}: TripTableProps) {
    return (
        <div className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="w-24 font-bold uppercase text-[10px] tracking-widest pl-6">ID</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Asset</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Operator</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Logistics Path</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Payload</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Timeline</TableHead>
                        <TableHead className="w-12 pr-6" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trips.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-medium italic">
                                No active logistics tasks found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        trips.map((trip) => {
                            const vehicle = vehicleMap.get(trip.vehicleId);
                            const driver = driverMap.get(trip.driverId);
                            return (
                                <TableRow key={trip.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <TableCell className="font-black text-sm pl-6">#{trip.id}</TableCell>
                                    <TableCell>
                                        <div className="font-black text-sm">{vehicle?.name ?? "N/A"}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{vehicle?.licensePlate}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-sm">{driver?.name ?? "N/A"}</div>
                                        <div className="text-[10px] font-bold text-indigo-600/70 uppercase tracking-widest">{driver?.licenseCategory}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-600 dark:text-slate-400">
                                            <span className="truncate max-w-[120px]">{trip.origin}</span>
                                            <ArrowRight className="h-3 w-3 shrink-0 opacity-40" />
                                            <span className="truncate max-w-[120px]">{trip.destination}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-black text-sm">{trip.cargoWeight.toLocaleString()} kg</div>
                                        <div className="text-[10px] font-bold text-muted-foreground truncate max-w-[140px] opacity-70">
                                            {trip.cargoDescription}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={statusBadgeMap[trip.status]} className="font-black uppercase text-[9px] px-2.5">
                                            {trip.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-bold text-muted-foreground">
                                        {formatDate(trip.createdAt)}
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-600">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-slate-100 dark:border-slate-800">
                                                {trip.status === "Draft" && (
                                                    <DropdownMenuItem onClick={() => onDispatch(trip)} className="font-bold text-xs uppercase tracking-widest">
                                                        <Send className="mr-2 h-3.5 w-3.5" /> Dispatch
                                                    </DropdownMenuItem>
                                                )}
                                                {trip.status === "Dispatched" && (
                                                    <DropdownMenuItem onClick={() => onComplete(trip)} className="font-bold text-xs uppercase tracking-widest">
                                                        <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Complete
                                                    </DropdownMenuItem>
                                                )}
                                                {trip.status !== "Completed" && trip.status !== "Cancelled" && (
                                                    <DropdownMenuItem
                                                        onClick={() => onCancel(trip)}
                                                        className="text-destructive focus:text-destructive font-bold text-xs uppercase tracking-widest"
                                                    >
                                                        <XCircle className="mr-2 h-3.5 w-3.5" /> Abort
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Trip, TripStatus } from "@/types";

interface RecentTripsTableProps {
    trips: Trip[];
    getVehicleName: (id: number) => string;
    getDriverName: (id: number) => string;
    statusVariants: Record<TripStatus, any>;
}

export function RecentTripsTable({ trips, getVehicleName, getDriverName, statusVariants }: RecentTripsTableProps) {
    return (
        <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest pl-6">Trip ID</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest">Asset</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest">Operator</TableHead>
                            <TableHead className="hidden md:table-cell font-bold uppercase text-[10px] tracking-widest">Route</TableHead>
                            <TableHead className="hidden sm:table-cell font-bold uppercase text-[10px] tracking-widest text-right">Payload</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                            <TableHead className="hidden lg:table-cell font-bold uppercase text-[10px] tracking-widest pr-6 text-right">Logged At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trips.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium italic">
                                    No recent activity found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            trips.map((trip) => (
                                <TableRow key={trip.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <TableCell className="font-black text-sm pl-6">#{trip.id}</TableCell>
                                    <TableCell className="font-bold text-xs">{getVehicleName(trip.vehicleId)}</TableCell>
                                    <TableCell className="font-bold text-xs">{getDriverName(trip.driverId)}</TableCell>
                                    <TableCell className="hidden max-w-[240px] md:table-cell">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                                            <span className="truncate">{trip.origin}</span>
                                            <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
                                            <span className="truncate">{trip.destination}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-right font-bold text-xs">
                                        {formatNumber(trip.cargoWeight)} kg
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={statusVariants[trip.status]} className="font-black uppercase text-[9px] px-2.5">
                                            {trip.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-right text-[10px] font-medium text-muted-foreground pr-6">
                                        {formatDate(trip.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

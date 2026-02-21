import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Driver, DriverStatus } from "@/types";

interface DriverTableProps {
    drivers: Driver[];
    onEdit: (driver: Driver) => void;
    isLicenseExpired: (expiry: string) => boolean;
    isLicenseExpiringSoon: (expiry: string) => boolean;
    getStatusVariant: (status: DriverStatus) => "success" | "secondary" | "destructive" | "info" | "warning";
    getSafetyColor: (score: number) => string;
    getSafetyBg: (score: number) => string;
    getInitials: (name: string) => string;
}

export function DriverTable({
    drivers,
    onEdit,
    isLicenseExpired,
    isLicenseExpiringSoon,
    getStatusVariant,
    getSafetyColor,
    getSafetyBg,
    getInitials,
}: DriverTableProps) {
    return (
        <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest pl-6">Operator</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Credential</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Security Score</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Logistics</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Compliance</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-right pr-6">Manage</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {drivers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium italic">
                                No fleet operators found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        drivers.map((driver) => {
                            const expired = isLicenseExpired(driver.licenseExpiry);
                            const expiringSoon = isLicenseExpiringSoon(driver.licenseExpiry);
                            const totalTrips = driver.tripsCompleted + driver.tripsCancelled;
                            const rate = totalTrips > 0 ? (driver.tripsCompleted / totalTrips) * 100 : 100;

                            return (
                                <TableRow key={driver.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-white dark:border-slate-800">
                                                <AvatarFallback className="text-[10px] font-black bg-indigo-500/10 text-indigo-600">
                                                    {getInitials(driver.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-black text-sm">{driver.name}</div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{driver.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-xs">{driver.licenseNumber}</div>
                                        <div className="text-[10px] font-black text-indigo-600/70 uppercase tracking-widest">
                                            {driver.licenseCategory}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getStatusVariant(driver.status)} className="font-black uppercase text-[9px] px-2.5">
                                            {driver.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2.5 min-w-[140px]">
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full transition-all duration-1000", getSafetyBg(driver.safetyScore).replace('[&>div]:', ''))}
                                                    style={{ width: `${driver.safetyScore}%` }}
                                                />
                                            </div>
                                            <span className={cn("text-[10px] font-black w-6 text-right", getSafetyColor(driver.safetyScore))}>
                                                {driver.safetyScore}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 font-black text-xs">
                                                <span className="text-emerald-600">{driver.tripsCompleted}</span>
                                                <span className="text-slate-300 dark:text-slate-700">/</span>
                                                <span className="text-red-500">{driver.tripsCancelled}</span>
                                            </div>
                                            <div className={cn("text-[9px] font-black uppercase tracking-tighter opacity-80", rate >= 90 ? "text-emerald-600" : rate >= 70 ? "text-amber-600" : "text-red-600")}>
                                                {rate.toFixed(0)}% Efficiency
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("text-[11px] font-bold", expired ? "text-red-600" : "text-muted-foreground")}>
                                                {formatDate(driver.licenseExpiry)}
                                            </span>
                                            {expired && (
                                                <Badge variant="destructive" className="text-[8px] font-black px-1.5 py-0 uppercase">
                                                    Expired
                                                </Badge>
                                            )}
                                            {expiringSoon && !expired && (
                                                <Badge variant="warning" className="text-[8px] font-black px-1.5 py-0 uppercase">
                                                    Soon
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-600"
                                            onClick={() => onEdit(driver)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}

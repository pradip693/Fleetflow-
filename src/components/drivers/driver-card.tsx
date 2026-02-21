import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Shield, Calendar, Pencil, AlertTriangle } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Driver, DriverStatus } from "@/types";

interface DriverCardProps {
    driver: Driver;
    onEdit: (driver: Driver) => void;
    isLicenseExpired: (expiry: string) => boolean;
    isLicenseExpiringSoon: (expiry: string) => boolean;
    getStatusVariant: (status: DriverStatus) => "success" | "secondary" | "destructive" | "info" | "warning";
    getSafetyColor: (score: number) => string;
    getSafetyBg: (score: number) => string;
    getInitials: (name: string) => string;
}

export function DriverCard({
    driver,
    onEdit,
    isLicenseExpired,
    isLicenseExpiringSoon,
    getStatusVariant,
    getSafetyColor,
    getSafetyBg,
    getInitials,
}: DriverCardProps) {
    const expired = isLicenseExpired(driver.licenseExpiry);
    const expiringSoon = isLicenseExpiringSoon(driver.licenseExpiry);
    const totalTrips = driver.tripsCompleted + driver.tripsCancelled;
    const rate = totalTrips > 0 ? (driver.tripsCompleted / totalTrips) * 100 : 100;

    return (
        <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 group hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden">
            {expired && (
                <div className="absolute top-0 left-0 right-0 bg-red-600 text-[10px] font-black tracking-widest text-white text-center py-1 flex items-center justify-center gap-1 z-10">
                    <AlertTriangle className="h-3 w-3" />
                    LICENSE EXPIRED
                </div>
            )}
            <CardHeader className={cn("pb-3", expired && "pt-10")}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white dark:border-slate-800 shadow-lg">
                            <AvatarFallback className="bg-indigo-500/10 text-indigo-600 font-black text-lg">
                                {getInitials(driver.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg font-black tracking-tight">{driver.name}</CardTitle>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                                {driver.licenseCategory}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusVariant(driver.status)} className="font-black uppercase text-[9px] px-2.5">
                            {driver.status}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-600"
                            onClick={() => onEdit(driver)}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2.5 text-muted-foreground font-bold text-xs">
                        <Mail className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="truncate">{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground font-bold text-xs">
                        <Phone className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{driver.phone}</span>
                    </div>
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                            <Shield className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Safety Score</span>
                        </div>
                        <span className={cn("text-sm font-black", getSafetyColor(driver.safetyScore))}>
                            {driver.safetyScore}
                        </span>
                    </div>
                    <Progress
                        value={driver.safetyScore}
                        className={cn("h-2 rounded-full bg-slate-100 dark:bg-slate-800", getSafetyBg(driver.safetyScore))}
                    />
                </div>

                <Separator className="bg-slate-100 dark:bg-slate-800" />

                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-xl font-black tracking-tighter text-foreground">
                            {driver.tripsCompleted}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Done</div>
                    </div>
                    <div>
                        <div className="text-xl font-black tracking-tighter text-foreground">
                            {driver.tripsCancelled}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Lost</div>
                    </div>
                    <div>
                        <div className={cn("text-xl font-black tracking-tighter", rate >= 90 ? "text-emerald-600" : rate >= 70 ? "text-amber-600" : "text-red-600")}>
                            {rate.toFixed(0)}%
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Rate</div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5 uppercase tracking-wider">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        Exp: {formatDate(driver.licenseExpiry)}
                    </div>
                    {expiringSoon && !expired && (
                        <Badge variant="warning" className="text-[8px] font-black px-1.5 py-0 uppercase">
                            Soon
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

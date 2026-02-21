import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CostData {
    vehicleId: number;
    vehicleName: string;
    fuelCost: number;
    maintenanceCost: number;
}

interface VehicleCostBreakdownProps {
    data: CostData[];
}

export function VehicleCostBreakdown({ data }: VehicleCostBreakdownProps) {
    return (
        <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">Per-Vehicle Operational Cost</h2>
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {data.map((item) => {
                    const total = item.fuelCost + item.maintenanceCost;
                    const fuelPct = total > 0 ? (item.fuelCost / total) * 100 : 0;
                    return (
                        <Card key={item.vehicleId} className="glass-card border-none shadow-xl shadow-indigo-500/5 group">
                            <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                        <Truck className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{item.vehicleName}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Fuel Costs</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                        {formatCurrency(item.fuelCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Maintenance</span>
                                    <span className="font-bold text-orange-600 dark:text-orange-400">
                                        {formatCurrency(item.maintenanceCost)}
                                    </span>
                                </div>
                                <Separator className="bg-slate-100 dark:bg-slate-800" />
                                <div className="flex justify-between text-base font-black tracking-tight">
                                    <span>Total Operational</span>
                                    <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(total)}</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-1000"
                                            style={{ width: `${fuelPct}%` }}
                                        />
                                        <div
                                            className="h-full bg-orange-500 transition-all duration-1000"
                                            style={{ width: `${100 - fuelPct}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            Fuel {fuelPct.toFixed(0)}%
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                                            Maintenance {(100 - fuelPct).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {data.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-full py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 italic">
                        No vehicle cost data available yet.
                    </p>
                )}
            </div>
        </div>
    );
}

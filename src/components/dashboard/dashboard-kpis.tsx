import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface KPIItem {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend: string;
    trendUp: boolean;
    color: string;
}

interface DashboardKPIsProps {
    kpis: KPIItem[];
}

export function DashboardKPIs({ kpis }: DashboardKPIsProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
                <Card key={kpi.label} className="glass-card border-none shadow-xl shadow-indigo-500/5 group hover:shadow-indigo-500/10 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {kpi.label}
                        </CardTitle>
                        <div className={cn("rounded-xl p-2.5 transition-transform group-hover:scale-110 duration-300", kpi.color)}>
                            <kpi.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">{kpi.value}</div>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold">
                            {kpi.trendUp ? (
                                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>Good</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                                    <TrendingDown className="h-3 w-3" />
                                    <span>Alert</span>
                                </div>
                            )}
                            <span className="text-muted-foreground opacity-70">/ {kpi.trend}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

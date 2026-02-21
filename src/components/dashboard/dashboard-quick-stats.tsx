import { Card, CardContent } from "@/components/ui/card";
import { Truck, TrendingUp, Gauge } from "lucide-react";

interface DashboardQuickStatsProps {
    totalVehicles: number;
    totalTrips: number;
    activeDrivers: number;
}

export function DashboardQuickStats({ totalVehicles, totalTrips, activeDrivers }: DashboardQuickStatsProps) {
    const stats = [
        {
            label: "Fleet Assets",
            value: totalVehicles,
            icon: Truck,
            color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
        },
        {
            label: "Operational Trips",
            value: totalTrips,
            icon: TrendingUp,
            color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
        },
        {
            label: "Operators On Duty",
            value: activeDrivers,
            icon: Gauge,
            color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.label} className="glass-card border-none shadow-xl shadow-indigo-500/5 group overflow-hidden">
                    <CardContent className="flex items-center gap-5 p-6">
                        <div className={`rounded-2xl p-3.5 transition-all group-hover:scale-110 duration-500 ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

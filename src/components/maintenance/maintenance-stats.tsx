import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, Wrench, CheckCircle2, CalendarClock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MaintenanceStatsProps {
    totalCost: number;
    statusCounts: Record<string, number>;
}

export function MaintenanceStats({ totalCost, statusCounts }: MaintenanceStatsProps) {
    const stats = [
        { label: "Total Cost", icon: IndianRupee, value: formatCurrency(totalCost), color: "text-emerald-600", bg: "bg-emerald-600/10" },
        { label: "Scheduled", icon: CalendarClock, value: statusCounts["Scheduled"] ?? 0, color: "text-blue-600", bg: "bg-blue-600/10" },
        { label: "In Progress", icon: Wrench, value: statusCounts["In Progress"] ?? 0, color: "text-amber-600", bg: "bg-amber-600/10" },
        { label: "Completed", icon: CheckCircle2, value: statusCounts["Completed"] ?? 0, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
                <Card key={s.label} className="glass-card border-none shadow-xl shadow-indigo-500/5 group hover:shadow-indigo-500/10 transition-all duration-300">
                    <CardContent className="flex items-center gap-5 p-6">
                        <div className={`rounded-2xl p-4 transition-all group-hover:scale-110 duration-500 ${s.bg}`}>
                            <s.icon className={`h-6 w-6 ${s.color}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                            <p className="text-xl font-black tracking-tighter">{s.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

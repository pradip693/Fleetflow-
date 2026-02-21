import { Card, CardContent } from "@/components/ui/card";
import { FileText, Truck, CheckCircle2, Ban } from "lucide-react";

interface TripStatsProps {
    counts: Record<string, number>;
}

export function TripStats({ counts }: TripStatsProps) {
    const stats = [
        { label: "Draft", icon: FileText, count: counts["Draft"] ?? 0, color: "text-slate-500", bg: "bg-slate-500/10" },
        { label: "Dispatched", icon: Truck, count: counts["Dispatched"] ?? 0, color: "text-blue-600", bg: "bg-blue-600/10" },
        { label: "Completed", icon: CheckCircle2, count: counts["Completed"] ?? 0, color: "text-emerald-600", bg: "bg-emerald-600/10" },
        { label: "Cancelled", icon: Ban, count: counts["Cancelled"] ?? 0, color: "text-destructive", bg: "bg-destructive/10" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
                <Card key={s.label} className="glass-card border-none shadow-xl shadow-indigo-500/5 group hover:shadow-indigo-500/10 transition-all duration-300">
                    <CardContent className="flex items-center gap-5 p-6">
                        <div className={`rounded-2xl p-4 transition-all group-hover:scale-110 duration-500 ${s.bg}`}>
                            <s.icon className={`h-6 w-6 ${s.color}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                            <p className="text-2xl font-black tracking-tighter">{s.count}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

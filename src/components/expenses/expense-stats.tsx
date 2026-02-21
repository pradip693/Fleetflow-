import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, IndianRupee, Receipt, Droplets } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface ExpenseStatsProps {
    totalFuelCost: number;
    totalExpenses: number;
    avgCostPerTrip: number;
    totalLiters: number;
    fuelEntriesCount: number;
    totalEntriesCount: number;
}

export function ExpenseStats({
    totalFuelCost,
    totalExpenses,
    avgCostPerTrip,
    totalLiters,
    fuelEntriesCount,
    totalEntriesCount,
}: ExpenseStatsProps) {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden group">
                <div className="h-1 w-full bg-blue-500 opacity-50" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Total Fuel Cost
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Fuel className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black tracking-tighter">{formatCurrency(totalFuelCost)}</div>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1">
                        From {fuelEntriesCount} fuel entries
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden group">
                <div className="h-1 w-full bg-emerald-500 opacity-50" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Total Expenses
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black tracking-tighter">{formatCurrency(totalExpenses)}</div>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1">
                        {totalEntriesCount} total entries
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden group">
                <div className="h-1 w-full bg-orange-500 opacity-50" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Avg Cost per Trip
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-orange-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black tracking-tighter">{formatCurrency(avgCostPerTrip)}</div>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1">Across linked trips</p>
                </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden group">
                <div className="h-1 w-full bg-cyan-500 opacity-50" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Total Liters
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black tracking-tighter">{formatNumber(totalLiters)} L</div>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1">Fuel consumed</p>
                </CardContent>
            </Card>
        </div>
    );
}

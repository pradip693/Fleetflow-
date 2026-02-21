"use client";

import { useMemo, useEffect } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
    Download,
    Activity,
    Shield,
    IndianRupee,
    TrendingUp,
    Truck,
    Users,
    Fuel,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts";
import type { Vehicle, Driver, Trip, Maintenance, Expense } from "@/types";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"];
const VEHICLE_STATUS_COLORS: Record<string, string> = {
    Available: "#10b981",
    Active: "#3b82f6",
    "In Shop": "#f59e0b",
    "Out of Service": "#ef4444",
};

const CARGO_RATE_PER_KG = 2.5; // Estimated revenue per kg in INR (scaled from USD)

interface AnalyticsClientProps {
    initialData: {
        vehicles: Vehicle[];
        drivers: Driver[];
        trips: Trip[];
        maintenance: Maintenance[];
        expenses: Expense[];
    };
}

export function AnalyticsClient({ initialData }: AnalyticsClientProps) {
    const {
        vehicles,
        drivers,
        trips,
        maintenance,
        expenses,
        isLoading
    } = useFleetStore();

    // Hydrate store on mount to sync with server data
    useEffect(() => {
        useFleetStore.setState({
            vehicles: initialData.vehicles,
            drivers: initialData.drivers,
            trips: initialData.trips,
            maintenance: initialData.maintenance,
            expenses: initialData.expenses,
            isLoading: false
        });
    }, [initialData]);

    // If store is empty, fallback to initialData
    const activeVehicles = vehicles.length ? vehicles : initialData.vehicles;
    const activeDrivers = drivers.length ? drivers : initialData.drivers;
    const activeTrips = trips.length ? trips : initialData.trips;
    const activeMaintenance = maintenance.length ? maintenance : initialData.maintenance;
    const activeExpenses = expenses.length ? expenses : initialData.expenses;

    const metrics = useMemo(() => {
        const totalRevenue = activeTrips
            .filter((t) => t.status === "Completed")
            .reduce((acc, t) => acc + t.cargoWeight * CARGO_RATE_PER_KG, 0);

        const totalFuelCost = activeExpenses
            .filter((e) => e.type === "Fuel")
            .reduce((acc, e) => acc + e.cost, 0);

        const totalMaintenanceCost = activeMaintenance.reduce(
            (acc, m) => acc + m.cost,
            0
        );

        const avgSafety =
            activeDrivers.reduce((acc, d) => acc + d.safetyScore, 0) /
            (activeDrivers.length || 1);

        return {
            totalRevenue,
            totalFuelCost,
            totalMaintenanceCost,
            totalOperationalCost: totalFuelCost + totalMaintenanceCost,
            avgSafety,
            profit: totalRevenue - (totalFuelCost + totalMaintenanceCost),
        };
    }, [activeTrips, activeExpenses, activeMaintenance, activeDrivers]);

    const vehicleStatusData = useMemo(() => {
        const counts: Record<string, number> = {};
        activeVehicles.forEach((v) => {
            counts[v.status] = (counts[v.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [activeVehicles]);

    const monthlyFuelData = useMemo(() => {
        const fuelExpenses = activeExpenses.filter((e) => e.type === "Fuel");
        const monthly: Record<string, number> = {};
        fuelExpenses.forEach((e) => {
            const month = e.date.slice(0, 7);
            monthly[month] = (monthly[month] || 0) + e.cost;
        });
        return Object.entries(monthly)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, cost]) => ({
                month: new Date(month + "-01").toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                }),
                cost,
            }));
    }, [activeExpenses]);

    const driverSafetyData = useMemo(() => {
        return activeDrivers
            .map((d) => ({
                name: d.name.split(" ")[0],
                score: d.safetyScore,
                fill:
                    d.safetyScore >= 90
                        ? "#10b981"
                        : d.safetyScore >= 70
                            ? "#f59e0b"
                            : "#ef4444",
            }))
            .sort((a, b) => b.score - a.score);
    }, [activeDrivers]);

    const tripStatusData = useMemo(() => {
        const counts: Record<string, number> = {};
        activeTrips.forEach((t) => {
            counts[t.status] = (counts[t.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [activeTrips]);

    const costPerVehicleData = useMemo(() => {
        const costs: Record<number, { fuel: number; maintenance: number }> = {};
        activeVehicles.forEach((v) => {
            costs[v.id] = { fuel: 0, maintenance: 0 };
        });

        activeExpenses
            .filter((e) => e.type === "Fuel")
            .forEach((e) => {
                if (costs[e.vehicleId]) costs[e.vehicleId].fuel += e.cost;
            });

        activeMaintenance.forEach((m) => {
            if (costs[m.vehicleId]) costs[m.vehicleId].maintenance += m.cost;
        });

        return activeVehicles
            .map((v) => ({
                name: v.name,
                fuel: costs[v.id]?.fuel || 0,
                maintenance: costs[v.id]?.maintenance || 0,
            }))
            .sort((a, b) => b.fuel + b.maintenance - (a.fuel + a.maintenance))
            .slice(0, 5);
    }, [activeVehicles, activeExpenses, activeMaintenance]);

    const fuelEfficiencyData = useMemo(() => {
        const vehicleStats: Record<number, { fuel: number; distance: number }> = {};

        activeExpenses
            .filter((e) => e.type === "Fuel")
            .forEach((e) => {
                if (!vehicleStats[e.vehicleId])
                    vehicleStats[e.vehicleId] = { fuel: 0, distance: 0 };
                vehicleStats[e.vehicleId].fuel += e.liters;
            });

        activeTrips.forEach((t) => {
            if (t.status === "Completed") {
                if (!vehicleStats[t.vehicleId])
                    vehicleStats[t.vehicleId] = { fuel: 0, distance: 0 };
                vehicleStats[t.vehicleId].distance += t.estimatedDistance;
            }
        });

        return activeVehicles
            .filter((v) => vehicleStats[v.id] && vehicleStats[v.id].fuel > 0)
            .map((v) => ({
                name: v.name,
                efficiency: Number(
                    (vehicleStats[v.id].distance / vehicleStats[v.id].fuel).toFixed(2)
                ),
            }))
            .sort((a, b) => b.efficiency - a.efficiency);
    }, [activeVehicles, activeExpenses, activeTrips]);

    const vehicleROI = useMemo(() => {
        return activeVehicles.map((v) => {
            const vTrips = activeTrips.filter(
                (t) => t.vehicleId === v.id && t.status === "Completed"
            );
            const vExpenses = activeExpenses.filter(
                (e) => e.vehicleId === v.id && e.type === "Fuel"
            );
            const vMaintenance = activeMaintenance.filter((m) => m.vehicleId === v.id);

            const revenue = vTrips.reduce((acc, t) => acc + t.cargoWeight * CARGO_RATE_PER_KG, 0);
            const operationalCost =
                vExpenses.reduce((acc, e) => acc + e.cost, 0) +
                vMaintenance.reduce((acc, m) => acc + m.cost, 0);

            return {
                id: v.id,
                name: v.name,
                trips: vTrips.length,
                revenue,
                cost: operationalCost,
                profit: revenue - operationalCost,
                margin: revenue > 0 ? ((revenue - operationalCost) / revenue) * 100 : 0,
            };
        });
    }, [activeVehicles, activeTrips, activeExpenses, activeMaintenance]);

    const exportCSV = () => {
        const headers = ["Vehicle", "Trips", "Revenue", "Cost", "Profit", "Margin"];
        const rows = vehicleROI.map((r) => [
            r.name,
            r.trips,
            r.revenue,
            r.cost,
            r.profit,
            `${r.margin.toFixed(1)}%`,
        ]);

        const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `fleet_roi_${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const CustomTooltip = ({
        active,
        payload,
        label,
    }: any) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="rounded-lg border bg-background p-3 shadow-md">
                <p className="text-sm font-medium mb-1">{label}</p>
                {payload.map((entry: any, i: number) => (
                    <p key={i} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: {typeof entry.value === "number" && (entry.name.toLowerCase().includes("cost") || entry.name.toLowerCase().includes("revenue") || entry.name.toLowerCase().includes("profit") || entry.name.includes("₹"))
                            ? formatCurrency(entry.value)
                            : formatNumber(entry.value)}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
            <Header
                title="Predictive Analytics"
                description="Data-driven insights for fleet optimization and ROI analysis"
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={exportCSV}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                }
            />

            <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue (Est.)</CardTitle>
                            <IndianRupee className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(metrics.totalRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                ₹{CARGO_RATE_PER_KG}/kg on {activeTrips.filter((t) => t.status === "Completed").length} completed trips
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Operational Cost</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(metrics.totalOperationalCost)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Fuel + Maintenance</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Profit Margin</CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(metrics.profit)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {((metrics.profit / (metrics.totalRevenue || 1)) * 100).toFixed(1)}% average margin
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Safety Index</CardTitle>
                            <Shield className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metrics.avgSafety.toFixed(1)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across {activeDrivers.length} drivers
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-1 border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Vehicle Status Distribution</CardTitle>
                            <CardDescription>Real-time fleet availability overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={vehicleStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            dataKey="value"
                                            label={({ name, percent }: any) =>
                                                `${name ?? ""} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                            }
                                        >
                                            {vehicleStatusData.map((entry) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={VEHICLE_STATUS_COLORS[entry.name] ?? PIE_COLORS[0]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Monthly Fuel Consumption</CardTitle>
                            <CardDescription>Fuel cost trends and seasonal variations (₹)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyFuelData}>
                                        <defs>
                                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                                        <XAxis dataKey="month" className="text-[10px]" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                                        <YAxis className="text-[10px]" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="cost" name="Fuel Cost" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-1 border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Driver Performance Index</CardTitle>
                            <CardDescription>Top ranked drivers by safety score</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={driverSafetyData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-slate-800" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" className="text-[10px]" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={60} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                                        <Bar dataKey="score" name="Safety Score" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-1 border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Asset Utilization</CardTitle>
                            <CardDescription>Trip status breakdown across tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={tripStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            dataKey="value"
                                            label={({ name, percent }: any) =>
                                                `${name ?? ""} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                            }
                                        >
                                            {tripStatusData.map((entry, index) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-1 border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Strategic Cost Analysis</CardTitle>
                            <CardDescription>Top 5 cost-intensive vehicles (₹)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={costPerVehicleData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="top" align="right" />
                                        <Bar dataKey="fuel" name="Fuel" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={30} />
                                        <Bar dataKey="maintenance" name="Maint." stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Vehicle ROI Section */}
                <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold">Vehicle ROI Analysis</CardTitle>
                                <CardDescription>
                                    Strategic profitability analysis per asset (₹)
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={exportCSV} className="h-8">
                                <Download className="mr-2 h-3.5 w-3.5" />
                                CSV
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <TableRow className="border-slate-200/60 dark:border-slate-800/60">
                                    <TableHead className="font-bold">Vehicle Name</TableHead>
                                    <TableHead className="text-center font-bold">Trips</TableHead>
                                    <TableHead className="text-right font-bold">Total Revenue</TableHead>
                                    <TableHead className="text-right font-bold">Operational Cost</TableHead>
                                    <TableHead className="text-right font-bold">Net Profit</TableHead>
                                    <TableHead className="text-right font-bold">Margin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicleROI.map((v) => (
                                    <TableRow key={v.id} className="border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors">
                                        <TableCell className="font-medium">{v.name}</TableCell>
                                        <TableCell className="text-center">{v.trips}</TableCell>
                                        <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-medium">
                                            {formatCurrency(v.revenue)}
                                        </TableCell>
                                        <TableCell className="text-right text-red-600 dark:text-red-400">
                                            {formatCurrency(v.cost)}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100">
                                            {formatCurrency(v.profit)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className={v.margin > 0 ? "text-emerald-600" : "text-red-600"}>
                                                    {v.margin.toFixed(1)}%
                                                </span>
                                                <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={v.margin > 0 ? "h-full bg-emerald-500" : "h-full bg-red-500"}
                                                        style={{ width: `${Math.min(Math.abs(v.margin), 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

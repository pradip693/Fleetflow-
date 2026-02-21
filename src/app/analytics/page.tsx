"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
const VEHICLE_STATUS_COLORS: Record<string, string> = {
  Available: "#10b981",
  "On Trip": "#3b82f6",
  "In Shop": "#f59e0b",
  "Out of Service": "#ef4444",
};
const TRIP_STATUS_COLORS: Record<string, string> = {
  Draft: "#94a3b8",
  Dispatched: "#3b82f6",
  Completed: "#10b981",
  Cancelled: "#ef4444",
};

const CARGO_RATE_PER_KG = 2;

export default function AnalyticsPage() {
  const {
    vehicles,
    drivers,
    trips,
    maintenance,
    expenses,
    fetchAll,
    isLoading,
  } = useFleetStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const vehicleMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles]
  );

  // --- Metric Cards ---
  const metrics = useMemo(() => {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(
      (v) => v.status === "Available" || v.status === "On Trip"
    ).length;
    const fleetUtilization =
      totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;

    const avgSafety =
      drivers.length > 0
        ? drivers.reduce((s, d) => s + d.safetyScore, 0) / drivers.length
        : 0;

    const completedTrips = trips.filter((t) => t.status === "Completed");
    const totalRevenue = completedTrips.reduce(
      (s, t) => s + t.cargoWeight * CARGO_RATE_PER_KG,
      0
    );

    const totalFuelCost = expenses
      .filter((e) => e.type === "Fuel")
      .reduce((s, e) => s + e.cost, 0);
    const totalMaintenanceCost = maintenance.reduce((s, m) => s + m.cost, 0);
    const totalOperationalCost = totalFuelCost + totalMaintenanceCost;

    return { fleetUtilization, avgSafety, totalRevenue, totalOperationalCost };
  }, [vehicles, drivers, trips, expenses, maintenance]);

  // --- Chart Data ---
  const vehicleStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => {
      counts[v.status] = (counts[v.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [vehicles]);

  const monthlyFuelData = useMemo(() => {
    const fuelExpenses = expenses.filter((e) => e.type === "Fuel");
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
  }, [expenses]);

  const driverSafetyData = useMemo(() => {
    return drivers
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
  }, [drivers]);

  const tripStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    trips.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [trips]);

  const costPerVehicleData = useMemo(() => {
    const costs: Record<number, { fuel: number; maintenance: number }> = {};
    vehicles.forEach((v) => {
      costs[v.id] = { fuel: 0, maintenance: 0 };
    });
    expenses
      .filter((e) => e.type === "Fuel")
      .forEach((e) => {
        if (costs[e.vehicleId]) costs[e.vehicleId].fuel += e.cost;
      });
    maintenance.forEach((m) => {
      if (costs[m.vehicleId]) costs[m.vehicleId].maintenance += m.cost;
    });
    return vehicles
      .map((v) => ({
        name: v.name,
        Fuel: costs[v.id]?.fuel ?? 0,
        Maintenance: costs[v.id]?.maintenance ?? 0,
      }))
      .filter((d) => d.Fuel > 0 || d.Maintenance > 0);
  }, [vehicles, expenses, maintenance]);

  const fuelEfficiencyData = useMemo(() => {
    const vehicleFuel: Record<number, { liters: number; distance: number }> = {};
    expenses
      .filter((e) => e.type === "Fuel" && e.liters > 0)
      .forEach((e) => {
        if (!vehicleFuel[e.vehicleId]) {
          vehicleFuel[e.vehicleId] = { liters: 0, distance: 0 };
        }
        vehicleFuel[e.vehicleId].liters += e.liters;
      });

    trips
      .filter((t) => t.status === "Completed")
      .forEach((t) => {
        if (vehicleFuel[t.vehicleId]) {
          vehicleFuel[t.vehicleId].distance += t.estimatedDistance;
        }
      });

    return Object.entries(vehicleFuel)
      .filter(([, d]) => d.liters > 0 && d.distance > 0)
      .map(([id, d]) => ({
        name: vehicleMap.get(Number(id))?.name ?? `#${id}`,
        efficiency: parseFloat((d.distance / d.liters).toFixed(2)),
      }))
      .sort((a, b) => b.efficiency - a.efficiency);
  }, [expenses, trips, vehicleMap]);

  // --- ROI Table ---
  const roiData = useMemo(() => {
    return vehicles.map((v) => {
      const vehicleTrips = trips.filter(
        (t) => t.vehicleId === v.id && t.status === "Completed"
      );
      const revenue = vehicleTrips.reduce(
        (s, t) => s + t.cargoWeight * CARGO_RATE_PER_KG,
        0
      );
      const fuelCost = expenses
        .filter((e) => e.vehicleId === v.id && e.type === "Fuel")
        .reduce((s, e) => s + e.cost, 0);
      const maintCost = maintenance
        .filter((m) => m.vehicleId === v.id)
        .reduce((s, m) => s + m.cost, 0);
      const totalCost = fuelCost + maintCost;
      const profit = revenue - totalCost;
      const roi =
        v.acquisitionCost > 0
          ? ((revenue - totalCost) / v.acquisitionCost) * 100
          : 0;

      return {
        id: v.id,
        name: v.name,
        type: v.type,
        acquisitionCost: v.acquisitionCost,
        revenue,
        fuelCost,
        maintCost,
        totalCost,
        profit,
        roi,
      };
    });
  }, [vehicles, trips, expenses, maintenance]);

  // --- CSV Export ---
  const exportCSV = useCallback(() => {
    const headers = [
      "Vehicle",
      "Type",
      "Acquisition Cost",
      "Revenue",
      "Fuel Cost",
      "Maintenance Cost",
      "Total Cost",
      "Profit",
      "ROI %",
    ];
    const rows = roiData.map((r) => [
      r.name,
      r.type,
      r.acquisitionCost.toFixed(2),
      r.revenue.toFixed(2),
      r.fuelCost.toFixed(2),
      r.maintCost.toFixed(2),
      r.totalCost.toFixed(2),
      r.profit.toFixed(2),
      r.roi.toFixed(2),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fleetflow-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [roiData]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === "number" && (entry.name.includes("Cost") || entry.name.includes("Revenue") || entry.name.includes("Profit"))
              ? formatCurrency(entry.value)
              : formatNumber(entry.value as number)}
          </p>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Analytics & Reports"
        description="Operational insights and financial analysis"
        actions={
          <Button size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.fleetUtilization.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {vehicles.filter((v) => v.status === "Available" || v.status === "On Trip").length}{" "}
                of {vehicles.length} vehicles active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Safety Score</CardTitle>
              <Shield className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.avgSafety.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {drivers.length} drivers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (Est.)</CardTitle>
              <IndianRupee className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                ₹{CARGO_RATE_PER_KG}/kg on {trips.filter((t) => t.status === "Completed").length} completed trips
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Operational Cost</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.totalOperationalCost)}
              </div>
              <p className="text-xs text-muted-foreground">Fuel + Maintenance</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Vehicle Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vehicle Status Distribution</CardTitle>
              <CardDescription>Current fleet status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {vehicleStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={vehicleStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }: Record<string, unknown>) =>
                        `${name ?? ""} (${(((percent as number) ?? 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {vehicleStatusData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={VEHICLE_STATUS_COLORS[entry.name] ?? PIE_COLORS[0]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                  No vehicle data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Fuel Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Fuel Costs</CardTitle>
              <CardDescription>Fuel spending over time</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyFuelData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyFuelData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                    <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(value), "Fuel Cost"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--background))",
                      }}
                    />
                    <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Fuel Cost" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                  No fuel expense data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Driver Safety Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Driver Safety Scores</CardTitle>
              <CardDescription>Individual driver performance</CardDescription>
            </CardHeader>
            <CardContent>
              {driverSafetyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={driverSafetyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={70}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: any) => [`${value}`, "Safety Score"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--background))",
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Score">
                      {driverSafetyData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                  No driver data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trip Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trip Status Distribution</CardTitle>
              <CardDescription>Overview of all trip statuses</CardDescription>
            </CardHeader>
            <CardContent>
              {tripStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={tripStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }: Record<string, unknown>) =>
                        `${name ?? ""} (${(((percent as number) ?? 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {tripStatusData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={TRIP_STATUS_COLORS[entry.name] ?? PIE_COLORS[0]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                  No trip data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost per Vehicle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost per Vehicle</CardTitle>
              <CardDescription>Fuel + Maintenance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {costPerVehicleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={costPerVehicleData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        formatCurrency(value),
                        name,
                      ]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--background))",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Fuel"
                      stackId="cost"
                      fill="#3b82f6"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="Maintenance"
                      stackId="cost"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                  No cost data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fuel Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fuel Efficiency per Vehicle</CardTitle>
              <CardDescription>Estimated distance / liters (km/L)</CardDescription>
            </CardHeader>
            <CardContent>
              {fuelEfficiencyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={fuelEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: any) => [`${value} km/L`, "Efficiency"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--background))",
                      }}
                    />
                    <Bar dataKey="efficiency" fill="#10b981" radius={[4, 4, 0, 0]} name="km/L">
                      {fuelEfficiencyData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                  No fuel efficiency data
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Vehicle ROI Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Vehicle ROI Analysis</CardTitle>
                <CardDescription>
                  Revenue estimated at ₹{CARGO_RATE_PER_KG}/kg of cargo on completed trips
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Acquisition</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Fuel Cost</TableHead>
                  <TableHead className="text-right">Maint. Cost</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roiData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No vehicle data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  roiData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(row.acquisitionCost)}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">
                        {formatCurrency(row.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(row.fuelCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(row.maintCost)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${row.profit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {formatCurrency(row.profit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            row.roi >= 0 ? "success" : "destructive"
                          }
                        >
                          {row.roi >= 0 ? "+" : ""}
                          {row.roi.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

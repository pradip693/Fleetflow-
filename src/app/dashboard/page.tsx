"use client";

import { useEffect, useMemo, useState } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  Truck,
  Wrench,
  Gauge,
  PackageOpen,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { VehicleType, VehicleStatus, TripStatus } from "@/types";

const STATUS_VARIANT: Record<VehicleStatus, "success" | "info" | "warning" | "destructive"> = {
  Available: "success",
  "On Trip": "info",
  "In Shop": "warning",
  "Out of Service": "destructive",
};

const TRIP_STATUS_VARIANT: Record<TripStatus, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  Draft: "secondary",
  Dispatched: "info",
  Completed: "success",
  Cancelled: "destructive",
};

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function DashboardPage() {
  const {
    vehicles,
    drivers,
    trips,
    maintenance,
    expenses,
    isLoading,
    fetchAll,
  } = useFleetStore();

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (typeFilter !== "all" && v.type !== typeFilter) return false;
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (regionFilter !== "all" && v.region !== regionFilter) return false;
      return true;
    });
  }, [vehicles, typeFilter, statusFilter, regionFilter]);

  const regions = useMemo(
    () => [...new Set(vehicles.map((v) => v.region))].sort(),
    [vehicles]
  );

  const activeFleet = filteredVehicles.filter((v) => v.status === "On Trip").length;
  const maintenanceAlerts = filteredVehicles.filter((v) => v.status === "In Shop").length;
  const utilization = filteredVehicles.length > 0
    ? Math.round(
        ((filteredVehicles.filter((v) => v.status === "On Trip" || v.status === "In Shop").length) /
          filteredVehicles.length) *
          100
      )
    : 0;
  const pendingCargo = trips.filter((t) => t.status === "Draft").length;

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredVehicles.forEach((v) => {
      counts[v.status] = (counts[v.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredVehicles]);

  const typeDistribution = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    filteredVehicles.forEach((v) => {
      if (!map[v.type]) map[v.type] = {};
      map[v.type][v.status] = (map[v.type][v.status] || 0) + 1;
    });
    return Object.entries(map).map(([type, statuses]) => ({
      type,
      ...statuses,
    }));
  }, [filteredVehicles]);

  const recentTrips = useMemo(() => {
    return [...trips]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [trips]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.cost, 0),
    [expenses]
  );

  const completedTrips = trips.filter((t) => t.status === "Completed").length;

  const kpiCards = [
    {
      label: "Active Fleet",
      value: activeFleet,
      icon: Truck,
      trend: `${filteredVehicles.length} total`,
      trendUp: activeFleet > 0,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
      label: "Maintenance Alerts",
      value: maintenanceAlerts,
      icon: Wrench,
      trend: `${maintenance.filter((m) => m.status === "In Progress").length} in progress`,
      trendUp: false,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400",
    },
    {
      label: "Utilization Rate",
      value: `${utilization}%`,
      icon: Gauge,
      trend: `${completedTrips} trips completed`,
      trendUp: utilization > 50,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400",
    },
    {
      label: "Pending Cargo",
      value: pendingCargo,
      icon: PackageOpen,
      trend: `${trips.filter((t) => t.status === "Dispatched").length} dispatched`,
      trendUp: pendingCargo === 0,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400",
    },
  ];

  const getVehicleName = (id: number) =>
    vehicles.find((v) => v.id === id)?.name ?? `#${id}`;

  const getDriverName = (id: number) =>
    drivers.find((d) => d.id === id)?.name ?? `#${id}`;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Command Center"
        description="Fleet overview at a glance"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Bike">Bike</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="On Trip">On Trip</SelectItem>
              <SelectItem value="In Shop">In Shop</SelectItem>
              <SelectItem value="Out of Service">Out of Service</SelectItem>
            </SelectContent>
          </Select>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <div className={`rounded-lg p-2 ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  {kpi.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-amber-500" />
                  )}
                  {kpi.trend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & Table */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Status Distribution Pie */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Vehicle Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusDistribution.map((entry, i) => (
                        <Cell
                          key={entry.name}
                          fill={
                            PIE_COLORS[
                              Object.keys(STATUS_VARIANT).indexOf(entry.name) % PIE_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
                  No vehicles match the current filters
                </div>
              )}
            </CardContent>
          </Card>

          {/* Type Breakdown Bar Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Fleet by Type &amp; Status</CardTitle>
            </CardHeader>
            <CardContent>
              {typeDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={typeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="type" className="text-xs" />
                    <YAxis allowDecimals={false} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Available" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="On Trip" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="In Shop" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="Out of Service" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
                  No vehicles match the current filters
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="hidden md:table-cell">Route</TableHead>
                  <TableHead className="hidden sm:table-cell">Cargo (kg)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No trips found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">#{trip.id}</TableCell>
                      <TableCell>{getVehicleName(trip.vehicleId)}</TableCell>
                      <TableCell>{getDriverName(trip.driverId)}</TableCell>
                      <TableCell className="hidden max-w-[240px] truncate md:table-cell">
                        <span className="flex items-center gap-1">
                          <span className="truncate">{trip.origin}</span>
                          <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <span className="truncate">{trip.destination}</span>
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {formatNumber(trip.cargoWeight)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={TRIP_STATUS_VARIANT[trip.status]}>
                          {trip.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(trip.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats Footer */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-blue-100 p-2.5 dark:bg-blue-900/40">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
                <p className="text-xl font-bold">{vehicles.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-emerald-100 p-2.5 dark:bg-emerald-900/40">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Trips</p>
                <p className="text-xl font-bold">{trips.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-purple-100 p-2.5 dark:bg-purple-900/40">
                <Gauge className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Drivers</p>
                <p className="text-xl font-bold">
                  {drivers.filter((d) => d.status === "On Duty").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

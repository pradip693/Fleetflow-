"use client";

import { useEffect, useState, useMemo } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Fuel,
  DollarSign,
  Receipt,
  Droplets,
  Pencil,
  Filter,
  X,
  TrendingUp,
  Truck,
} from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import type { Expense, ExpenseType } from "@/types";

const EXPENSE_TYPES: ExpenseType[] = ["Fuel", "Toll", "Parking", "Other"];

const defaultForm: Omit<Expense, "id"> = {
  vehicleId: 0,
  tripId: null,
  type: "Fuel",
  liters: 0,
  cost: 0,
  date: new Date().toISOString().split("T")[0],
  notes: "",
};

export default function ExpensesPage() {
  const {
    expenses,
    vehicles,
    trips,
    maintenance,
    fetchAll,
    addExpense,
    updateExpense,
    isLoading,
  } = useFleetStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [filterVehicle, setFilterVehicle] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const vehicleMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles]
  );

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (filterVehicle !== "all" && e.vehicleId !== Number(filterVehicle))
        return false;
      if (filterType !== "all" && e.type !== filterType) return false;
      if (filterDateFrom && e.date < filterDateFrom) return false;
      if (filterDateTo && e.date > filterDateTo) return false;
      return true;
    });
  }, [expenses, filterVehicle, filterType, filterDateFrom, filterDateTo]);

  const totalFilteredExpenses = filteredExpenses.length;
  const paginatedExpenses = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredExpenses.slice(start, start + pageSize);
  }, [filteredExpenses, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filterVehicle, filterType, filterDateFrom, filterDateTo]);

  const stats = useMemo(() => {
    const fuelExpenses = expenses.filter((e) => e.type === "Fuel");
    const totalFuelCost = fuelExpenses.reduce((sum, e) => sum + e.cost, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);
    const totalLiters = fuelExpenses.reduce((sum, e) => sum + e.liters, 0);
    const tripsWithExpenses = new Set(expenses.map((e) => e.tripId).filter(Boolean));
    const avgCostPerTrip =
      tripsWithExpenses.size > 0 ? totalExpenses / tripsWithExpenses.size : 0;

    return { totalFuelCost, totalExpenses, avgCostPerTrip, totalLiters };
  }, [expenses]);

  const vehicleCostBreakdown = useMemo(() => {
    const breakdown: Record<
      number,
      { vehicleName: string; fuelCost: number; maintenanceCost: number }
    > = {};

    vehicles.forEach((v) => {
      breakdown[v.id] = {
        vehicleName: v.name,
        fuelCost: 0,
        maintenanceCost: 0,
      };
    });

    expenses
      .filter((e) => e.type === "Fuel")
      .forEach((e) => {
        if (breakdown[e.vehicleId]) {
          breakdown[e.vehicleId].fuelCost += e.cost;
        }
      });

    maintenance.forEach((m) => {
      if (breakdown[m.vehicleId]) {
        breakdown[m.vehicleId].maintenanceCost += m.cost;
      }
    });

    return Object.entries(breakdown)
      .map(([id, data]) => ({ vehicleId: Number(id), ...data }))
      .filter((d) => d.fuelCost > 0 || d.maintenanceCost > 0);
  }, [vehicles, expenses, maintenance]);

  function openAddDialog() {
    setEditingId(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEditDialog(expense: Expense) {
    setEditingId(expense.id);
    setForm({
      vehicleId: expense.vehicleId,
      tripId: expense.tripId,
      type: expense.type,
      liters: expense.liters,
      cost: expense.cost,
      date: expense.date,
      notes: expense.notes,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.vehicleId || form.cost <= 0) return;
    const payload = {
      ...form,
      liters: form.type === "Fuel" ? form.liters : 0,
    };
    if (editingId) {
      await updateExpense(editingId, payload);
    } else {
      await addExpense(payload);
    }
    setDialogOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  }

  function clearFilters() {
    setFilterVehicle("all");
    setFilterType("all");
    setFilterDateFrom("");
    setFilterDateTo("");
  }

  const completedTrips = trips.filter((t) => t.status === "Completed");

  const typeBadgeVariant = (type: ExpenseType) => {
    switch (type) {
      case "Fuel":
        return "info" as const;
      case "Toll":
        return "warning" as const;
      case "Parking":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
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
        title="Expenses & Fuel Logging"
        description="Track and manage all vehicle expenses"
        actions={
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fuel Cost</CardTitle>
              <Fuel className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalFuelCost)}</div>
              <p className="text-xs text-muted-foreground">
                From {expenses.filter((e) => e.type === "Fuel").length} fuel entries
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                {expenses.length} total entries
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Cost per Trip</CardTitle>
              <Receipt className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.avgCostPerTrip)}</div>
              <p className="text-xs text-muted-foreground">Across linked trips</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Liters</CardTitle>
              <Droplets className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalLiters)} L</div>
              <p className="text-xs text-muted-foreground">Fuel consumed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          {(filterVehicle !== "all" ||
            filterType !== "all" ||
            filterDateFrom ||
            filterDateTo) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Vehicle</Label>
                  <Select value={filterVehicle} onValueChange={setFilterVehicle}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Vehicles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {EXPENSE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date To</Label>
                  <Input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Liters</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totalFilteredExpenses === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No expenses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {vehicleMap.get(expense.vehicleId)?.name ?? `Vehicle #${expense.vehicleId}`}
                      </TableCell>
                      <TableCell>
                        {expense.tripId ? `#${expense.tripId}` : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={typeBadgeVariant(expense.type)}>{expense.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {expense.type === "Fuel" ? `${formatNumber(expense.liters)} L` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(expense.cost)}
                      </TableCell>
                      <TableCell>{formatDate(expense.date)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {expense.notes || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(expense)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination
              totalItems={totalFilteredExpenses}
              pageSize={pageSize}
              currentPage={page}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Per-Vehicle Operational Cost Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Total Operational Cost per Vehicle</h2>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {vehicleCostBreakdown.map((item) => {
              const total = item.fuelCost + item.maintenanceCost;
              const fuelPct = total > 0 ? (item.fuelCost / total) * 100 : 0;
              return (
                <Card key={item.vehicleId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm">{item.vehicleName}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fuel Costs</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(item.fuelCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Maintenance Costs</span>
                      <span className="font-medium text-orange-600">
                        {formatCurrency(item.maintenanceCost)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total Operational</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-orange-500"
                        style={{ width: "100%" }}
                      >
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${fuelPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Fuel {fuelPct.toFixed(0)}%</span>
                      <span>Maintenance {(100 - fuelPct).toFixed(0)}%</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {vehicleCostBreakdown.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full">
                No vehicle cost data available yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Expense" : "Add Expense"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the expense details below."
                : "Log a new expense or fuel purchase."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Vehicle *</Label>
              <Select
                value={form.vehicleId ? String(form.vehicleId) : ""}
                onValueChange={(v) => setForm((f) => ({ ...f, vehicleId: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.name} ({v.licensePlate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trip (Optional)</Label>
              <Select
                value={form.tripId ? String(form.tripId) : "none"}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, tripId: v === "none" ? null : Number(v) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No trip linked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No trip linked</SelectItem>
                  {completedTrips.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      #{t.id} - {t.origin} → {t.destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Expense Type *</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((f) => ({ ...f, type: v as ExpenseType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.type === "Fuel" && (
              <div className="space-y-2">
                <Label>Liters</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.liters || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, liters: parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="Enter liters"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Cost ($) *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.cost || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cost: parseFloat(e.target.value) || 0 }))
                }
                placeholder="Enter cost"
              />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Optional notes"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!form.vehicleId || form.cost <= 0}>
              {editingId ? "Update" : "Add"} Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

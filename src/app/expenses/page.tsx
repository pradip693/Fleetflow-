"use client";

import { useEffect, useState, useMemo } from "react";
import { useFleetStore } from "@/store/fleet-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Expense, ExpenseType } from "@/types";

// Extracted Components
import { ExpenseStats } from "@/components/expenses/expense-stats";
import { ExpenseFilters } from "@/components/expenses/expense-filters";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { VehicleCostBreakdown } from "@/components/expenses/vehicle-cost-breakdown";

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

  const stats = useMemo(() => {
    const fuelExpenses = expenses.filter((e) => e.type === "Fuel");
    const totalFuelCost = fuelExpenses.reduce((sum, e) => sum + e.cost, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);
    const totalLiters = fuelExpenses.reduce((sum, e) => sum + e.liters, 0);
    const tripsWithExpenses = new Set(expenses.map((e) => e.tripId).filter(Boolean));
    const avgCostPerTrip =
      tripsWithExpenses.size > 0 ? totalExpenses / tripsWithExpenses.size : 0;

    return {
      totalFuelCost,
      totalExpenses,
      avgCostPerTrip,
      totalLiters,
      fuelEntriesCount: fuelExpenses.length,
      totalEntriesCount: expenses.length,
    };
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

  const paginatedExpenses = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredExpenses.slice(start, start + pageSize);
  }, [filteredExpenses, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filterVehicle, filterType, filterDateFrom, filterDateTo]);

  async function handleSave() {
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

  const openEditDialog = (expense: Expense) => {
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
  };

  const hasFilters = filterVehicle !== "all" || filterType !== "all" || !!filterDateFrom || !!filterDateTo;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50/50 dark:bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/30 dark:bg-transparent">
      <Header
        title="Expenses & Fuel"
        description="Track and manage all vehicle expenses"
        actions={
          <Button size="sm" onClick={() => { setEditingId(null); setForm(defaultForm); setDialogOpen(true); }} className="rounded-xl shadow-lg shadow-indigo-500/20">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <ExpenseStats {...stats} />

        <div className="space-y-4">
          <ExpenseFilters
            vehicles={vehicles}
            expenseTypes={EXPENSE_TYPES}
            filterVehicle={filterVehicle}
            setFilterVehicle={setFilterVehicle}
            filterType={filterType}
            setFilterType={setFilterType}
            filterDateFrom={filterDateFrom}
            setFilterDateFrom={setFilterDateFrom}
            filterDateTo={filterDateTo}
            setFilterDateTo={setFilterDateTo}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            clearFilters={() => {
              setFilterVehicle("all");
              setFilterType("all");
              setFilterDateFrom("");
              setFilterDateTo("");
            }}
            hasFilters={hasFilters}
          />

          <ExpenseTable
            expenses={paginatedExpenses}
            vehicleMap={vehicleMap}
            page={page}
            pageSize={pageSize}
            totalFiltered={filteredExpenses.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onEdit={openEditDialog}
          />
        </div>

        <VehicleCostBreakdown data={vehicleCostBreakdown} />
      </div>

      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingId={editingId}
        form={form}
        setForm={setForm}
        vehicles={vehicles}
        completedTrips={trips.filter((t) => t.status === "Completed")}
        expenseTypes={EXPENSE_TYPES}
        onSubmit={handleSave}
      />
    </div>
  );
}

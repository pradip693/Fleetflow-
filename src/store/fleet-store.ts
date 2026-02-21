import { create } from "zustand";
import type { Vehicle, Driver, Trip, Maintenance, Expense } from "@/types";
import { API_URL } from "@/lib/utils";

interface FleetState {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenance: Maintenance[];
  expenses: Expense[];
  isLoading: boolean;

  fetchVehicles: () => Promise<void>;
  fetchDrivers: () => Promise<void>;
  fetchTrips: () => Promise<void>;
  fetchMaintenance: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  fetchAll: () => Promise<void>;

  addVehicle: (vehicle: Omit<Vehicle, "id">) => Promise<void>;
  updateVehicle: (id: number, data: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;

  addDriver: (driver: Omit<Driver, "id">) => Promise<void>;
  updateDriver: (id: number, data: Partial<Driver>) => Promise<void>;

  addTrip: (trip: Omit<Trip, "id">) => Promise<void>;
  updateTrip: (id: number, data: Partial<Trip>) => Promise<void>;

  addMaintenance: (record: Omit<Maintenance, "id">) => Promise<void>;
  updateMaintenance: (id: number, data: Partial<Maintenance>) => Promise<void>;

  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: number, data: Partial<Expense>) => Promise<void>;
}

export const useFleetStore = create<FleetState>()((set, get) => ({
  vehicles: [],
  drivers: [],
  trips: [],
  maintenance: [],
  expenses: [],
  isLoading: false,

  fetchVehicles: async () => {
    const res = await fetch(`${API_URL}/vehicles`);
    const vehicles = await res.json();
    set({ vehicles });
  },
  fetchDrivers: async () => {
    const res = await fetch(`${API_URL}/drivers`);
    const drivers = await res.json();
    set({ drivers });
  },
  fetchTrips: async () => {
    const res = await fetch(`${API_URL}/trips`);
    const trips = await res.json();
    set({ trips });
  },
  fetchMaintenance: async () => {
    const res = await fetch(`${API_URL}/maintenance`);
    const maintenance = await res.json();
    set({ maintenance });
  },
  fetchExpenses: async () => {
    const res = await fetch(`${API_URL}/expenses`);
    const expenses = await res.json();
    set({ expenses });
  },
  fetchAll: async () => {
    set({ isLoading: true });
    await Promise.all([
      get().fetchVehicles(),
      get().fetchDrivers(),
      get().fetchTrips(),
      get().fetchMaintenance(),
      get().fetchExpenses(),
    ]);
    set({ isLoading: false });
  },

  addVehicle: async (vehicle) => {
    const res = await fetch(`${API_URL}/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });
    const newVehicle = await res.json();
    set((s) => ({ vehicles: [...s.vehicles, newVehicle] }));
  },
  updateVehicle: async (id, data) => {
    const res = await fetch(`${API_URL}/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({ vehicles: s.vehicles.map((v) => (v.id === id ? updated : v)) }));
  },
  deleteVehicle: async (id) => {
    await fetch(`${API_URL}/vehicles/${id}`, { method: "DELETE" });
    set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) }));
  },

  addDriver: async (driver) => {
    const res = await fetch(`${API_URL}/drivers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    });
    const newDriver = await res.json();
    set((s) => ({ drivers: [...s.drivers, newDriver] }));
  },
  updateDriver: async (id, data) => {
    const res = await fetch(`${API_URL}/drivers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({ drivers: s.drivers.map((d) => (d.id === id ? updated : d)) }));
  },

  addTrip: async (trip) => {
    const res = await fetch(`${API_URL}/trips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
    });
    const newTrip = await res.json();
    set((s) => ({ trips: [...s.trips, newTrip] }));
  },
  updateTrip: async (id, data) => {
    const res = await fetch(`${API_URL}/trips/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({ trips: s.trips.map((t) => (t.id === id ? updated : t)) }));
  },

  addMaintenance: async (record) => {
    const res = await fetch(`${API_URL}/maintenance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    const newRecord = await res.json();
    set((s) => ({ maintenance: [...s.maintenance, newRecord] }));
  },
  updateMaintenance: async (id, data) => {
    const res = await fetch(`${API_URL}/maintenance/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({ maintenance: s.maintenance.map((m) => (m.id === id ? updated : m)) }));
  },

  addExpense: async (expense) => {
    const res = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    const newExpense = await res.json();
    set((s) => ({ expenses: [...s.expenses, newExpense] }));
  },
  updateExpense: async (id, data) => {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? updated : e)) }));
  },
}));

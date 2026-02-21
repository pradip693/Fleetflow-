import { api } from "@/lib/utils";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Vehicle, Driver, Trip, Maintenance, Expense } from "@/types";

export const metadata = {
  title: "Command Center | FleetFlow",
  description: "Fleet overview and essential metrics.",
};

export default async function DashboardPage() {
  try {
    const [vehicles, drivers, trips, maintenance, expenses] = await Promise.all([
      api<Vehicle[]>("vehicles"),
      api<Driver[]>("drivers"),
      api<Trip[]>("trips"),
      api<Maintenance[]>("maintenance"),
      api<Expense[]>("expenses"),
    ]);

    const initialData = {
      vehicles,
      drivers,
      trips,
      maintenance,
      expenses,
    };

    return <DashboardClient initialData={initialData} />;
  } catch (error) {
    console.error("Dashboard data fetch failed:", error);
    return (
      <DashboardClient
        initialData={{
          vehicles: [],
          drivers: [],
          trips: [],
          maintenance: [],
          expenses: [],
        }}
      />
    );
  }
}

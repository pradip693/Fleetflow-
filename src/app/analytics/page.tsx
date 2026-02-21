import { api } from "@/lib/utils";
import { AnalyticsClient } from "@/components/analytics/analytics-client";
import type { Vehicle, Driver, Trip, Maintenance, Expense } from "@/types";

export const metadata = {
  title: "Predictive Analytics | FleetFlow",
  description: "Detailed fleet analytics and ROI insights.",
};

export default async function AnalyticsPage() {
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

    return <AnalyticsClient initialData={initialData} />;
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);

    // Fallback to empty data to prevent crash if server is down during SSR
    // In production, you'd show an error page or redirect
    return (
      <AnalyticsClient
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

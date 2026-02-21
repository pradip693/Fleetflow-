import { api } from "@/lib/utils";
import { TripsClient } from "@/components/trips/trips-client";
import type { Trip, Vehicle, Driver } from "@/types";

export const metadata = {
  title: "Logistics Manifests | FleetFlow",
  description: "Track and manage fleet deployments and logistics.",
};

export default async function TripsPage() {
  try {
    const [trips, vehicles, drivers] = await Promise.all([
      api<Trip[]>("trips"),
      api<Vehicle[]>("vehicles"),
      api<Driver[]>("drivers"),
    ]);

    const initialData = {
      trips,
      vehicles,
      drivers,
    };

    return <TripsClient initialData={initialData} />;
  } catch (error) {
    console.error("Failed to fetch trips data:", error);

    return (
      <TripsClient
        initialData={{
          trips: [],
          vehicles: [],
          drivers: [],
        }}
      />
    );
  }
}

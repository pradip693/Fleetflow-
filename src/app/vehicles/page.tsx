import { api } from "@/lib/utils";
import { VehiclesClient } from "@/components/vehicles/vehicles-client";
import type { Vehicle } from "@/types";

export const metadata = {
  title: "Vehicle Registry | FleetFlow",
  description: "Manage your fleet assets and vehicle details.",
};

export default async function VehiclesPage() {
  try {
    const vehicles = await api<Vehicle[]>("vehicles");
    return <VehiclesClient initialVehicles={vehicles} />;
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return <VehiclesClient initialVehicles={[]} />;
  }
}

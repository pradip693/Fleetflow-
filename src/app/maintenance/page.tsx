import { api } from "@/lib/utils";
import { MaintenanceClient } from "@/components/maintenance/maintenance-client";
import type { Maintenance, Vehicle } from "@/types";

export const metadata = {
  title: "Asset Maintenance | FleetFlow",
  description: "Track vehicle lifecycle, repairs, and diagnostics.",
};

export default async function MaintenancePage() {
  try {
    const [maintenance, vehicles] = await Promise.all([
      api<Maintenance[]>("maintenance"),
      api<Vehicle[]>("vehicles"),
    ]);

    const initialData = {
      maintenance,
      vehicles,
    };

    return <MaintenanceClient initialData={initialData} />;
  } catch (error) {
    console.error("Failed to fetch maintenance data:", error);

    return (
      <MaintenanceClient
        initialData={{
          maintenance: [],
          vehicles: [],
        }}
      />
    );
  }
}

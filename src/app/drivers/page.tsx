import { api } from "@/lib/utils";
import { DriversClient } from "@/components/drivers/drivers-client";
import type { Driver } from "@/types";

export const metadata = {
  title: "Driver Profiles | FleetFlow",
  description: "Manage driver performance and safety compliance.",
};

export default async function DriversPage() {
  try {
    const drivers = await api<Driver[]>("drivers");
    return <DriversClient initialDrivers={drivers} />;
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    return <DriversClient initialDrivers={[]} />;
  }
}

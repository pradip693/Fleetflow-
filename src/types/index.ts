export type UserRole = "manager" | "dispatcher" | "safety_officer" | "financial_analyst";

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export type VehicleType = "Truck" | "Van" | "Bike";
export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Out of Service";

export interface Vehicle {
  id: number;
  name: string;
  model: string;
  licensePlate: string;
  type: VehicleType;
  maxCapacity: number;
  odometer: number;
  status: VehicleStatus;
  region: string;
  acquisitionCost: number;
  acquiredDate: string;
  imageUrl: string;
}

export type DriverStatus = "On Duty" | "Off Duty" | "Suspended";

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  status: DriverStatus;
  safetyScore: number;
  tripsCompleted: number;
  tripsCancelled: number;
  joinedDate: string;
  avatar: string;
}

export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";

export interface Trip {
  id: number;
  vehicleId: number;
  driverId: number;
  origin: string;
  destination: string;
  cargoWeight: number;
  cargoDescription: string;
  status: TripStatus;
  createdAt: string;
  dispatchedAt: string | null;
  completedAt: string | null;
  startOdometer: number | null;
  endOdometer: number | null;
  estimatedDistance: number;
  notes: string;
}

export type MaintenanceStatus = "Completed" | "In Progress" | "Scheduled";

export interface Maintenance {
  id: number;
  vehicleId: number;
  type: string;
  description: string;
  cost: number;
  date: string;
  status: MaintenanceStatus;
  mechanic: string;
  nextDueDate: string | null;
  nextDueOdometer: number | null;
}

export type ExpenseType = "Fuel" | "Toll" | "Parking" | "Other";

export interface Expense {
  id: number;
  vehicleId: number;
  tripId: number | null;
  type: ExpenseType;
  liters: number;
  cost: number;
  date: string;
  notes: string;
}

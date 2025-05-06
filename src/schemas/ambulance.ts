export interface Ambulance {
  id: string;
  plateNumber: string;
  assignedTo: {
    id: string;
    name: string;
    address: string;
    suburb: string;
    city: string;
    district: string;
    phone: string;
    email: string;
  };
  model: string;
  modelYear: number;
  type: string;
  status: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  assignedToId: number;
  unavailableUntil?: string;
  lastMaintenanceAt?: string;
}

export interface HelpRequest {
  id: number | string;
  patient: string;
  location: string;
  status: string;
  type: string;
  driver?: string;
  driverId?: number | string;
  driverContact?: string;
  distance?: string | number;
  lat?: number;
  lng?: number;
  reportedAt?: Date;
  approvalCounterExpiresAt?: Date;
}

export enum GraphFilterOptions {
  DAILY = "Daily",
  MONTHLY = "Monthly",
  YEARLY = "Yearly",
}

export interface AmbulanceGraphVal {
  name: string;
  added: number;
  removed: number;
}

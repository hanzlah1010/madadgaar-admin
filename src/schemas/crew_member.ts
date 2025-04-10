export enum crewStatus {
  AVAILABLE = "Available",
  ON_DUTY = "On Duty",
  OFF_DUTY = "Off Duty",
}

export enum crewCategories {
  MEDICAL = "medical",
  DRIVING = "driving",
}

export interface CrewMemeber {
  id: number;
  name: string;
  role: string;
  category: crewCategories;
  status: crewStatus;
}

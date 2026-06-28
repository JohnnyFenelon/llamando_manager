export type UserRole = "agent" | "supervisor";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
}

export type CustomerStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "closed_won"
  | "closed_lost";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: CustomerStatus;
  assignedAgent: string;
  interest: string;
  notes: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

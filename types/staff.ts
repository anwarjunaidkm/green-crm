export type StaffStatus = "Active" | "Inactive";

export interface Staff {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  salary: number;
  joiningDate: string;
  designation: string;
  status: StaffStatus;
}

export type StaffInput = Omit<Staff, "id">;

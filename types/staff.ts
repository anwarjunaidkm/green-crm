export type StaffStatus = "Active" | "Inactive";

// ============================================================
// EMPLOYEE FILTERS (DROPDOWN OPTIONS)
// ============================================================

export interface DepartmentOption {
  id: number;
  department_name: string;
}

export interface DesignationOption {
  id: number;
  designation_name: string;
}

export interface RoleOption {
  id: number;
  name: string;
  display_name: string;
  description?: string;
}

export interface EmployeeFiltersData {
  departments: DepartmentOption[];
  designations: DesignationOption[];
  roles: RoleOption[];
}

export interface EmployeeFiltersResponse {
  status: boolean;
  message: string;
  data: EmployeeFiltersData;
}

// ============================================================
// CREATE EMPLOYEE API PAYLOAD & RESPONSE
// ============================================================

export interface CreateEmployeePayload {
  employee_name: string;
  department: number | string;
  designation: number | string;
  user_name: string;
  email: string;
  phone: string;
  role: number | string;
  status: string; // "1" for Active, "0" for Inactive
  password: string;
}

export interface CreateEmployeeResponse {
  status: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

// ============================================================
// CRM LOCAL STAFF MODEL
// ============================================================

export interface Staff {
  id: string;
  fullName: string;
  userName?: string;
  phone: string;
  email: string;
  password?: string;
  salary?: number;
  joiningDate?: string;
  departmentId?: number | string;
  departmentName?: string;
  designationId?: number | string;
  designation: string;
  roleId?: number | string;
  roleName?: string;
  status: StaffStatus;
}

export type StaffInput = Omit<Staff, "id">;

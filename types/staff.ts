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
  joining_date?: string;
  salary?: number | string;
}

export interface CreateEmployeeResponse {
  status: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

// ============================================================
// EMPLOYEE LIST API TYPES
// ============================================================

export interface EmployeeListItem {
  id: number;
  name: string;
  contact?: string;
  email: string;
  phone: string;
  designation: string;
  designation_id?: number;
  salary?: number | string | null;
  joining_date?: string | null;
  joining_date_formatted?: string | null;
  status: number | string;
  status_text: string;
  department: string;
  department_id?: number;
  role: string;
  role_id?: number;
  created_at?: string;
}

export interface EmployeePagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface EmployeeListResponse {
  status: boolean;
  message: string;
  data: EmployeeListItem[];
  pagination: EmployeePagination;
}

export interface EmployeeListParams {
  search?: string;
  page?: number;
  per_page?: number;
}

// ============================================================
// VIEW EMPLOYEE API TYPES
// ============================================================

export interface ViewEmployeeDetail {
  id: number;
  name?: string;
  employee_name: string;
  department?: string;
  department_id?: number | string;
  designation?: string;
  designation_id?: number | string;
  username?: string;
  user_name?: string;
  email: string;
  phone: string;
  phone_number?: string;
  salary?: number | string | null;
  joining_date?: string | null;
  joining_date_formatted?: string | null;
  role?: string;
  role_id?: number | string;
  status: number | string;
  status_text?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ViewEmployeeResponse {
  status: boolean;
  message: string;
  data: ViewEmployeeDetail;
}

// ============================================================
// UPDATE EMPLOYEE API TYPES
// ============================================================

export interface UpdateEmployeePayload {
  id: number | string;
  employee_name: string;
  department: number | string;
  designation: number | string;
  user_name: string;
  email: string;
  phone: string;
  salary?: number | string | null;
  joining_date?: string | null;
  role: number | string;
  status: number | string;
  current_password?: string;
  password?: string;
}

export interface UpdateEmployeeResponse {
  status: boolean;
  message: string;
  id?: number | string;
  errors?: Record<string, string[]>;
}

// ============================================================
// DELETE EMPLOYEE API TYPES
// ============================================================

export interface DeleteEmployeeResponse {
  status: boolean;
  message: string;
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

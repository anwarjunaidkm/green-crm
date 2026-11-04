// ============================================================
// CRM USER ROLES
// ============================================================

export type UserRole = "super_admin" | "staff";

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  employee_id?: number | string;
  employee_name?: string;
  department_id?: number | string;
  department_name?: string;
  designation_id?: number | string;
  designation_name?: string;
  role_id?: number | string;
  role_name?: string;
  role_display_name?: string;
}

export interface LoginResponseData {
  user: ApiUser;
  token: string;
}

export interface LoginApiResponse {
  status: boolean;
  message: string;
  data: LoginResponseData;
}

// ============================================================
// LOGGED-IN USER SESSION
// ============================================================

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  employee_id?: number | string;
  employee_name?: string;
  department_id?: number | string;
  department_name?: string;
  designation_id?: number | string;
  designation_name?: string;
  role_id?: number | string;
  role_name?: string;
  role_display_name?: string;
  token?: string;
}

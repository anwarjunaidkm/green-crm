// ============================================================
// CRM USER ROLES
// ============================================================

// Add future roles here.
// Example:
// export type UserRole = "super_admin" | "staff" | "manager";

export type UserRole = "super_admin" | "staff";

// ============================================================
// LOGGED-IN USER
// ============================================================

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

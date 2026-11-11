import api from "@/lib/axios";
import type { LoginApiResponse, User } from "@/types/auth";
import type {
  CreateEmployeePayload,
  CreateEmployeeResponse,
  DeleteEmployeeResponse,
  EmployeeFiltersData,
  EmployeeFiltersResponse,
  EmployeeListParams,
  EmployeeListResponse,
  UpdateEmployeePayload,
  UpdateEmployeeResponse,
  ViewEmployeeDetail,
  ViewEmployeeResponse,
} from "@/types/staff";

// ============================================================
// LEADS API
// ============================================================

export const getLeads = async () => {
  const response = await api.get("/leads");
  return response.data;
};

export const getLeadById = async (id: string | number) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const createLead = async (leadData: Record<string, unknown>) => {
  const response = await api.post("/leads", leadData);
  return response.data;
};

export const updateLead = async (
  id: string | number,
  leadData: Record<string, unknown>,
) => {
  const response = await api.put(`/leads/${id}`, leadData);
  return response.data;
};

export const updateLeadStatus = async (
  id: string | number,
  statusData: Record<string, unknown>,
) => {
  const response = await api.patch(`/leads/${id}/status`, statusData);
  return response.data;
};

export const deleteLead = async (id: string | number) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

// ============================================================
// PRODUCTS API
// ============================================================

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id: string | number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData: Record<string, unknown>) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const deleteProduct = async (id: string | number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// ============================================================
// AUTH API
// ============================================================

export const login = async (credentials: {
  email: string;
  password?: string;
}) => {
  const response = await api.post<LoginApiResponse>("/auth/login", credentials);
  const resData = response.data;

  const token = resData?.data?.token;
  const apiUser = resData?.data?.user;

  if (token && typeof window !== "undefined") {
    sessionStorage.setItem("greenvedha_token", token);
    localStorage.setItem("greenvedha_token", token);
  }

  if (apiUser && typeof window !== "undefined") {
    const sessionUser: User = {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role_name === "super_admin" ? "super_admin" : "staff",
      employee_id: apiUser.employee_id,
      employee_name: apiUser.employee_name,
      department_id: apiUser.department_id,
      department_name: apiUser.department_name,
      designation_id: apiUser.designation_id,
      designation_name: apiUser.designation_name,
      role_id: apiUser.role_id,
      role_name: apiUser.role_name,
      role_display_name: apiUser.role_display_name,
      token,
    };

    sessionStorage.setItem("greenvedha_user", JSON.stringify(sessionUser));
  }

  return resData;
};

export const logout = async () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("greenvedha_token");
    localStorage.removeItem("greenvedha_token");
    sessionStorage.removeItem("greenvedha_user");
  }
};

// ============================================================
// EMPLOYEE / STAFF API
// ============================================================

/**
 * Fetch employee filter options (departments, designations, roles) directly from API
 */
export const getEmployeeFilters = async (): Promise<EmployeeFiltersData> => {
  const response = await api.get<EmployeeFiltersResponse>("/employee-filters");
  if (response.data?.status && response.data?.data) {
    return response.data.data;
  }
  return {
    departments: [],
    designations: [],
    roles: [],
  };
};

/**
 * Fetch employee list with search and pagination
 */
export const getEmployeeList = async (
  params?: EmployeeListParams,
): Promise<EmployeeListResponse> => {
  const response = await api.get<EmployeeListResponse>("/employee-list", {
    params: {
      search: params?.search ?? "",
      page: params?.page ?? 1,
      per_page: params?.per_page ?? 10,
    },
  });
  return response.data;
};

/**
 * Create a new employee / staff member via backend API
 */
export const createEmployee = async (
  payload: CreateEmployeePayload,
): Promise<CreateEmployeeResponse> => {
  const body: Record<string, unknown> = {
    employee_name: payload.employee_name.trim(),
    department: Number(payload.department),
    designation: Number(payload.designation),
    user_name: payload.user_name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    role: Number(payload.role),
    status: String(payload.status ?? "1"),
    password: payload.password,
  };

  if (payload.joining_date) {
    body.joining_date = payload.joining_date;
  }

  if (
    payload.salary !== undefined &&
    payload.salary !== "" &&
    payload.salary !== null
  ) {
    body.salary = Number(payload.salary);
  }

  const response = await api.post<CreateEmployeeResponse>(
    "/create-employee",
    body,
  );
  return response.data;
};

/**
 * View employee details directly from API
 * POST /view-employee with body { "id": id }
 */
export const viewEmployee = async (
  id: number | string,
): Promise<ViewEmployeeDetail> => {
  const response = await api.post<ViewEmployeeResponse>("/view-employee", {
    id: Number(id),
  });
  if (response.data?.status && response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to load employee details.");
};

/**
 * Update an existing employee via API
 * PUT /update-employee
 */
export const updateEmployee = async (
  payload: UpdateEmployeePayload,
): Promise<UpdateEmployeeResponse> => {
  const body: Record<string, unknown> = {
    id: Number(payload.id),
    employee_name: payload.employee_name.trim(),
    department: Number(payload.department),
    designation: Number(payload.designation),
    user_name: payload.user_name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    role: Number(payload.role),
    status: Number(payload.status),
  };

  if (
    payload.salary !== undefined &&
    payload.salary !== "" &&
    payload.salary !== null
  ) {
    body.salary = Number(payload.salary);
  } else {
    body.salary = null;
  }

  if (payload.joining_date) {
    body.joining_date = payload.joining_date;
  } else {
    body.joining_date = null;
  }

  if (payload.password) {
    body.password = payload.password;
    if (payload.current_password) {
      body.current_password = payload.current_password;
    }
  }

  const response = await api.put<UpdateEmployeeResponse>(
    "/update-employee",
    body,
  );
  return response.data;
};

/**
 * Delete an employee via API
 * DELETE /delete-employee with body { "id": id }
 */
export const deleteEmployee = async (
  id: number | string,
): Promise<DeleteEmployeeResponse> => {
  const response = await api.delete<DeleteEmployeeResponse>(
    "/delete-employee",
    {
      data: { id: Number(id) },
    },
  );
  return response.data;
};

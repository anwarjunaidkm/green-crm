import api from "@/lib/axios";

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
  leadData: Record<string, unknown>
) => {
  const response = await api.put(`/leads/${id}`, leadData);
  return response.data;
};

export const updateLeadStatus = async (
  id: string | number,
  statusData: Record<string, unknown>
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

export const login = async (credentials: Record<string, unknown>) => {
  const response = await api.post("/auth/login", credentials);
  const data = response.data;

  if (data?.token && typeof window !== "undefined") {
    sessionStorage.setItem("greenvedha_token", data.token);
  }

  return data;
};

export const logout = async () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("greenvedha_token");
    sessionStorage.removeItem("greenvedha_user");
  }
};

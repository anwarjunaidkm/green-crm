export type ProductStatus = "Active" | "Out of Stock" | "Draft" | "Archived";

// ============================================================
// PRODUCT FILTERS (DROPDOWN OPTIONS)
// ============================================================

export interface ProductUnitOption {
  id: number;
  name: string;
  unit_name?: string;
  code?: string;
  short_name?: string;
}

export interface ProductCategoryOption {
  id: number;
  name: string;
  category_name?: string;
  slug?: string;
}

export interface ProductStatusOption {
  id: number;
  name: string;
  value: number;
}

export interface ProductFiltersData {
  product_units: ProductUnitOption[];
  product_categories: ProductCategoryOption[];
  product_status: ProductStatusOption[];
}

export interface ProductFiltersResponse {
  status: boolean;
  message: string;
  data: ProductFiltersData;
}

// ============================================================
// PRODUCT LIST API PAYLOAD & RESPONSE
// ============================================================

export interface ProductListItem {
  id: number | string;
  name: string;
  item_code?: string;
  sku?: string;
  category?: string | null;
  category_name?: string | null;
  category_id?: number | null;
  unit?: string | null;
  unit_name?: string | null;
  unit_id?: number | null;
  selling_price?: number | string | null;
  price?: number | string | null;
  mrp?: number | string | null;
  initial_stock?: number | string | null;
  stock?: number | string | null;
  status: number | string;
  status_text?: string;
  description?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
}

export interface ProductListPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface ProductListSummary {
  total_products: number;
  in_stock: number;
  out_of_stock: number;
  categories: number;
}

export interface ProductListResponse {
  status: boolean;
  message: string;
  data: ProductListItem[];
  pagination: ProductListPagination;
  summary: ProductListSummary;
}

export interface ProductListParams {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string | number;
  filter?: string;
}

// ============================================================
// CREATE PRODUCT API PAYLOAD & RESPONSE
// ============================================================

export interface CreateProductPayload {
  name: string;
  item_code: string;
  category_id?: number | string | null;
  unit_id?: number | string | null;
  selling_price: number | string;
  mrp?: number | string | null;
  initial_stock?: number | string;
  description?: string;
  status: number | string; // 1 = Active, 2 = Draft, 3 = Out Of Stock
}

export interface CreateProductResponse {
  status: boolean;
  success?: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

// ============================================================
// LOCAL CRM PRODUCT MODEL
// ============================================================

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  mrp?: number;
  stock: number;
  unit: string;
  status: ProductStatus;
  description?: string;
  createdAt: string;
}

export const PRODUCT_CATEGORIES: readonly string[] = [];

export const PRODUCT_UNITS: readonly string[] = [];

export const DEFAULT_PRODUCTS: Product[] = [];

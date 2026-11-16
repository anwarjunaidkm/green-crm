"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductFilters,
  getProducts,
  getProductList,
  getProductById,
  createProduct,
  deleteProduct,
} from "@/services/apiService";
import type {
  CreateProductPayload,
  ProductFiltersData,
  ProductListParams,
  ProductListResponse,
} from "@/types/product";

// ============================================================
// QUERY KEYS
// ============================================================

export const productKeys = {
  all: ["products"] as const,
  filters: ["product-filters"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  detail: (id: string | number) => [...productKeys.all, id.toString()] as const,
};

// ============================================================
// HOOKS
// ============================================================

// 1. Fetch product filter options (units, categories, status)
export function useProductFilters() {
  return useQuery<ProductFiltersData>({
    queryKey: productKeys.filters,
    queryFn: getProductFilters,
    staleTime: 5 * 60 * 1000,
  });
}

// 2. Fetch product list with search, pagination, and status filters
export function useProductList(params: ProductListParams = {}) {
  const page = params.page ?? 1;
  const per_page = params.per_page ?? 10;
  const search = params.search ?? "";
  const status = params.status ?? "";
  const filter = params.filter ?? "";

  return useQuery<ProductListResponse>({
    queryKey: [
      ...productKeys.lists(),
      { page, per_page, search, status, filter },
    ],
    queryFn: () => getProductList({ page, per_page, search, status, filter }),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
}

// 2. Get all products
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getProducts,
  });
}

// 3. Get single product
export function useProduct(id: string | number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

// 4. Create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

// 5. Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

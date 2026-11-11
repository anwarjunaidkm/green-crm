"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeFilters,
  getEmployeeList,
  updateEmployee,
  viewEmployee,
} from "@/services/apiService";
import type {
  CreateEmployeePayload,
  EmployeeFiltersData,
  EmployeeListParams,
  EmployeeListResponse,
  UpdateEmployeePayload,
  ViewEmployeeDetail,
} from "@/types/staff";

// ============================================================
// QUERY KEYS
// ============================================================

export const staffKeys = {
  all: ["staff"] as const,
  filters: ["employee-filters"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  detail: (id: string | number) => [...staffKeys.all, id.toString()] as const,
};

// ============================================================
// HOOKS
// ============================================================

/**
 * Fetch employee dropdown filter options (departments, designations, roles)
 */
export function useEmployeeFilters() {
  return useQuery<EmployeeFiltersData>({
    queryKey: staffKeys.filters,
    queryFn: getEmployeeFilters,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

/**
 * Query hook for paginated and searchable employee list
 */
export function useEmployeeList(params: EmployeeListParams = {}) {
  const page = params.page ?? 1;
  const per_page = params.per_page ?? 10;
  const search = params.search ?? "";

  return useQuery<EmployeeListResponse>({
    queryKey: [...staffKeys.lists(), { search, page, per_page }],
    queryFn: () => getEmployeeList({ search, page, per_page }),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
}

/**
 * Mutation to create a new staff / employee
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      // Invalidate any staff cache
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
}

/**
 * Query hook to fetch single employee details for view/edit
 */
export function useViewEmployee(id: string | number | undefined) {
  return useQuery<ViewEmployeeDetail>({
    queryKey: staffKeys.detail(id ?? ""),
    queryFn: () => viewEmployee(id!),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Mutation to update an existing employee
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => updateEmployee(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
      queryClient.invalidateQueries({
        queryKey: staffKeys.detail(variables.id),
      });
    },
  });
}

/**
 * Mutation to delete an employee
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  getEmployeeFilters,
} from "@/services/apiService";
import type {
  CreateEmployeePayload,
  EmployeeFiltersData,
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

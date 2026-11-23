"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeadFilters,
  getLeads,
  getLeadList,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
} from "@/services/apiService";
import type {
  CreateLeadPayload,
  LeadFiltersData,
  LeadListParams,
  LeadListResponse,
} from "@/types/lead";

// ============================================================
// QUERY KEYS
// ============================================================

export const leadKeys = {
  all: ["leads"] as const,
  filters: ["lead-filters"] as const,
  lists: () => [...leadKeys.all, "list"] as const,
  list: (params: LeadListParams) => [...leadKeys.lists(), params] as const,
  detail: (id: string | number) => [...leadKeys.all, id.toString()] as const,
};

// ============================================================
// HOOKS
// ============================================================

// 1. Fetch lead dropdown filter options (lead_statuses, lead_channels, products)
export function useLeadFilters() {
  return useQuery<LeadFiltersData>({
    queryKey: leadKeys.filters,
    queryFn: getLeadFilters,
    staleTime: 5 * 60 * 1000,
  });
}

// 2. Fetch leads with server-side filters, search, pagination, and summary cards
export function useLeadList(params: LeadListParams) {
  return useQuery<LeadListResponse>({
    queryKey: leadKeys.list(params),
    queryFn: () => getLeadList(params),
  });
}

// 2. Get all leads
export function useLeads() {
  return useQuery({
    queryKey: leadKeys.all,
    queryFn: getLeads,
  });
}

// 3. Get single lead by ID
export function useLead(id: string | number) {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: () => getLeadById(id),
    enabled: !!id,
  });
}

// 4. Create lead
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
  });
}

// 5. Update lead
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Record<string, unknown>;
    }) => updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
  });
}

// 6. Update lead status
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Record<string, unknown>;
    }) => updateLeadStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
  });
}

// 7. Delete lead
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeadFilters,
  getLeads,
  getLeadList,
  getLeadById,
  viewLead,
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
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
  ViewLeadResponse,
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
  view: (id: string | number) =>
    [...leadKeys.all, "view", id.toString()] as const,
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
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
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

// 3.1 Get full view lead details (basic_details, lead_progress, update_history, follow_up_history)
export function useViewLead(id: string | number) {
  return useQuery<ViewLeadResponse>({
    queryKey: leadKeys.view(id),
    queryFn: () => viewLead(id),
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
    mutationFn: (payload: UpdateLeadPayload) => updateLead(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: leadKeys.view(variables.id),
        });
      }
    },
  });
}

// 6. Update lead status
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLeadStatusPayload) => updateLeadStatus(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: leadKeys.view(variables.id),
        });
      }
    },
  });
}

// 7. Delete lead
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteLead(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.removeQueries({ queryKey: leadKeys.view(deletedId) });
    },
  });
}

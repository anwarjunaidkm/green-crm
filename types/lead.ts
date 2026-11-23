import type { LeadStatus } from "@/config/leadConfig";

// ============================================================
// LEAD FILTERS (DROPDOWN OPTIONS)
// ============================================================

export interface LeadFilterStatusOption {
  id: number;
  name?: string;
  status_name?: string;
  title?: string;
  color?: string;
}

export interface LeadFilterChannelOption {
  id: number;
  name?: string;
  channel_name?: string;
  title?: string;
}

export interface LeadFilterProductOption {
  id: number;
  name: string;
  item_code: string;
  selling_price: string | number;
}

export interface LeadFiltersData {
  lead_statuses: LeadFilterStatusOption[];
  lead_channels: LeadFilterChannelOption[];
  products: LeadFilterProductOption[];
}

export interface LeadFiltersResponse {
  status: boolean;
  message: string;
  data: LeadFiltersData;
}

// ============================================================
// CREATE LEAD API PAYLOAD & RESPONSE
// ============================================================

export interface CreateLeadPayload {
  customer_name: string;
  phone: string;
  lead_channel_id?: number | string | null;
  lead_status_id?: number | string | null;
  product_id?: number | string | null;
  remarks?: string;
  email?: string;
  company?: string;
  location?: string;
}

export interface CreateLeadResponse {
  status: boolean;
  success?: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

// ============================================================
// LEAD LIST API (LIST, PAGINATION, SUMMARY)
// ============================================================

export interface LeadListItem {
  id: number;
  lead_code: string;
  name: string;
  phone: string;
  status: string;
  status_color?: string;
  source: string;
  product?: string | { id?: number; name?: string; item_code?: string; selling_price?: string | number } | null;
  follow_up_day?: number;
  next_follow_up?: string;
  assigned_to?: string;
  remarks?: string;
  created_at?: string;
  is_starred?: boolean | number;
}

export interface LeadPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface LeadStatusCard {
  status_id: number;
  name: string;
  slug: string;
  color: string;
  count: number;
}

export interface LeadSummary {
  total_leads: number;
  status_cards: LeadStatusCard[];
}

export interface LeadListResponse {
  status: boolean;
  message: string;
  data: LeadListItem[];
  pagination: LeadPagination;
  summary: LeadSummary;
}

export interface LeadListParams {
  page?: number;
  per_page?: number;
  search?: string;
  lead_status_id?: number | string;
  lead_channel_id?: number | string;
  product_id?: number | string;
  follow_up_day?: number | string;
  is_starred?: number | boolean | string;
}

// ============================================================
// TIMELINE & HISTORY
// ============================================================

export type LeadHistoryType =
  | "lead_created"
  | "status_updated"
  | "follow_up_updated"
  | "note_added"
  | "assigned_changed"
  | "call_logged"
  | "message_sent";

export interface LeadTimelineItem {
  id: string;

  type: LeadHistoryType;

  title: string;

  oldValue?: string;
  newValue?: string;

  note?: string;

  followUpDate?: string;
  followUpTime?: string;

  updatedBy: string;

  createdAt: string;
}

export interface StoredLeadUpdate {
  status: LeadStatus;

  followUpDate: string;
  followUpTime: string;

  note: string;

  timeline: LeadTimelineItem[];
}

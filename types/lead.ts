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
  status_slug?: string;
  source: string;
  product?: string | { id?: number; name?: string; item_code?: string; selling_price?: string | number } | null;
  follow_up_day?: number;
  next_follow_up?: string;
  assigned_to?: string;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
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
  status_id?: number | string;
  lead_channel_id?: number | string;
  assigned_to?: number | string;
  product_id?: number | string;
  is_starred?: number | boolean | string;
  follow_up_date?: string;
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
  id: string | number;
  type?: LeadHistoryType;
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

// ============================================================
// VIEW LEAD API RESPONSE
// ============================================================

export interface LeadBasicDetails {
  id: number | string;
  lead_code: string;
  name?: string;
  customer_name: string;
  phone: string;
  email?: string;
  company?: string;
  location?: string;
  lead_channel_id?: number;
  lead_channel?: string;
  source?: string;
  lead_status_id?: number;
  lead_status: string;
  lead_status_color?: string;
  follow_up_day?: number;
  next_follow_up_date?: string;
  next_follow_up_date_formatted?: string;
  next_follow_up_time?: string | null;
  next_follow_up_time_formatted?: string | null;
  next_follow_up?: string;
  assigned_to?: string;
  assigned_to_id?: number;
  created_by?: string;
  created_by_id?: number;
  remarks?: string;
  created_at?: string;
  created_at_formatted?: string;
}

export interface LeadProgressStep {
  status_id: number;
  name: string;
  slug: string;
  color: string;
  order: number;
  is_current: boolean;
  is_completed: boolean;
  completed_at?: string | null;
  completed_at_formatted?: string | null;
}

export interface LeadUpdateHistoryItem {
  id: number | string;
  title: string;
  status_id?: number;
  status_name?: string;
  status_color?: string;
  updated_by?: string;
  updated_by_id?: number;
  updated_date?: string;
  remarks?: string;
  created_at?: string;
}

export interface LeadFollowUpHistoryItem {
  id: number | string;
  follow_up_date?: string;
  follow_up_date_formatted?: string;
  follow_up_time?: string | null;
  follow_up_time_formatted?: string | null;
  remarks?: string;
  created_at?: string;
  created_by?: string;
  created_by_id?: number;
}

export interface ViewLeadData {
  basic_details: LeadBasicDetails;
  lead_progress: LeadProgressStep[];
  lead_status_history: LeadProgressStep[];
  update_history: LeadUpdateHistoryItem[];
  follow_up_history: LeadFollowUpHistoryItem[];
}

export interface ViewLeadResponse {
  status: boolean;
  message: string;
  data: ViewLeadData;
}

// ============================================================
// UPDATE LEAD STATUS API PAYLOAD & RESPONSE
// ============================================================

export interface UpdateLeadStatusPayload {
  id: number | string;
  lead_status_id: number | string;
  next_follow_up_date?: string | null;
  next_follow_up_time?: string | null;
  remarks?: string;
}

export interface UpdateLeadStatusResponse {
  status: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

// ============================================================
// UPDATE LEAD API PAYLOAD & RESPONSE
// ============================================================

export interface UpdateLeadPayload {
  id: number | string;
  customer_name: string;
  phone: string;
  lead_channel_id?: number | string | null;
  remarks?: string;
  email?: string;
  company?: string;
  location?: string;
  product_id?: number | string | null;
}

export interface UpdateLeadResponse {
  status: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

// ============================================================
// DELETE LEAD API PAYLOAD & RESPONSE
// ============================================================

export interface DeleteLeadPayload {
  id: number | string;
}

export interface DeleteLeadResponse {
  status: boolean;
  message: string;
  data?: any;
}

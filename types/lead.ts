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

import type { LeadStatus } from "@/config/leadConfig";

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

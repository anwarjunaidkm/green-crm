"use client";

import { useState } from "react";

import LeadView from "@/components/LeadView/LeadView";
import { getLeadDataById } from "@/lib/leadStorage";
import type { LeadTimelineItem } from "@/types/lead";
import type { LeadStatus } from "@/config/leadConfig";

// ============================================================
// TYPES
// ============================================================

interface LeadViewContainerProps {
  leadId: string;
}

export interface LeadViewData {
  id: string;

  name: string;
  avatar: string;

  phone: string;
  email: string;

  company: string;
  location: string;

  assignedTo: string;
  source: string;

  status: LeadStatus;

  createdAt: string;
  createdTime: string;

  followUpDate: string;
  followUpTime: string;

  followUpNote: string;

  timeline: LeadTimelineItem[];
}

// ============================================================
// COMPONENT
// ============================================================

export default function LeadViewContainer({ leadId }: LeadViewContainerProps) {
  const [lead] = useState<LeadViewData>(() => getLeadDataById(leadId));

  return <LeadView lead={lead} />;
}

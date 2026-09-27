"use client";

import { useState } from "react";

import LeadView from "@/components/LeadView/LeadView";

import { LEAD_STATUS, type LeadStatus } from "@/config/leadConfig";

import type { LeadTimelineItem, StoredLeadUpdate } from "@/types/lead";

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
// BASE LEAD
// Later replace this with API data
// ============================================================

function getBaseLead(leadId: string): LeadViewData {
  return {
    id: leadId,

    name: "Ahmed Ali",

    avatar: "A",

    phone: "+971 50 123 4567",

    email: "ahmed@example.com",

    company: "Equal Infotech",

    location: "Dubai, UAE",

    assignedTo: "Anwar",

    source: "Website Form",

    status: LEAD_STATUS.NEW_LEAD,

    createdAt: "24 Sep 2026",

    createdTime: "09:15 AM",

    followUpDate: "28 Sep 2026",

    followUpTime: "10:30 AM",

    followUpNote: "Call regarding ERP demo and discuss pricing.",

    timeline: [
      {
        id: `created-${leadId}`,

        type: "lead_created",

        title: "Lead Created",

        newValue: LEAD_STATUS.NEW_LEAD,

        note: "Lead received from Website Form.",

        updatedBy: "Anwar",

        createdAt: "2026-09-24T09:15:00",
      },
    ],
  };
}

// ============================================================
// LOAD LEAD
// ============================================================

function getLeadData(leadId: string): LeadViewData {
  const baseLead = getBaseLead(leadId);

  // localStorage only exists in browser
  if (typeof window === "undefined") {
    return baseLead;
  }

  try {
    const storageKey = `greenveda_lead_${leadId}`;

    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      return baseLead;
    }

    const update: StoredLeadUpdate = JSON.parse(saved);

    return {
      ...baseLead,

      status: update.status ?? baseLead.status,

      followUpDate: update.followUpDate || baseLead.followUpDate,

      followUpTime: update.followUpTime || baseLead.followUpTime,

      followUpNote: update.note || baseLead.followUpNote,

      timeline: [...(update.timeline ?? []), ...baseLead.timeline],
    };
  } catch (error) {
    console.error("Failed to load lead:", error);

    return baseLead;
  }
}

// ============================================================
// COMPONENT
// ============================================================

export default function LeadViewContainer({ leadId }: LeadViewContainerProps) {
  const [lead] = useState<LeadViewData>(() => getLeadData(leadId));

  return <LeadView lead={lead} />;
}

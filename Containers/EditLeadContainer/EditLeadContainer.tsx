"use client";

import { useState } from "react";

import EditLead from "@/components/EditLead/EditLead";

import { LEAD_STATUS } from "@/config/leadConfig";

import type { StoredLeadUpdate } from "@/types/lead";
import type { LeadViewData } from "@/Containers/LeadViewContainer/LeadViewContainer";

// ============================================================
// TYPES
// ============================================================

interface EditLeadContainerProps {
  leadId: string;
}

// ============================================================
// BASE LEAD
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
// LOAD LEAD (with any saved edits merged in)
// ============================================================

function getLeadData(leadId: string): LeadViewData {
  const baseLead = getBaseLead(leadId);

  if (typeof window === "undefined") {
    return baseLead;
  }

  try {
    const storageKey = `greenveda_lead_${leadId}`;
    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      return baseLead;
    }

    const update: StoredLeadUpdate & {
      editedDetails?: Partial<LeadViewData>;
    } = JSON.parse(saved);

    return {
      ...baseLead,
      ...(update.editedDetails ?? {}),
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

export default function EditLeadContainer({
  leadId,
}: EditLeadContainerProps) {
  const [lead] = useState<LeadViewData>(() => getLeadData(leadId));

  return <EditLead lead={lead} />;
}

"use client";

import { useState } from "react";

import EditLead from "@/components/EditLead/EditLead";
import { getLeadDataById } from "@/lib/leadStorage";
import type { LeadViewData } from "@/Containers/LeadViewContainer/LeadViewContainer";

// ============================================================
// TYPES
// ============================================================

interface EditLeadContainerProps {
  leadId: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function EditLeadContainer({
  leadId,
}: EditLeadContainerProps) {
  const [lead] = useState<LeadViewData>(() => getLeadDataById(leadId));

  return <EditLead lead={lead} />;
}

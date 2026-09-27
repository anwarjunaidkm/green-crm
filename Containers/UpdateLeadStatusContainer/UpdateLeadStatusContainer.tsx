"use client";

import UpdateLeadStatus from "@/components/UpdateLeadStatus/UpdateLeadStatus";

interface UpdateLeadStatusContainerProps {
  leadId: string;
}

export default function UpdateLeadStatusContainer({
  leadId,
}: UpdateLeadStatusContainerProps) {
  return <UpdateLeadStatus leadId={leadId} defaultStatus="New Lead" />;
}

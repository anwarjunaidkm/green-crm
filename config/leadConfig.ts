export const LEAD_STATUS = {
  NEW_LEAD: "New Lead",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  FOLLOW_UP: "Follow-up",
  PROPOSAL_SENT: "Proposal Sent",
  CLOSED_WON: "Closed Won",
  NOT_INTERESTED: "Not Interested",
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  [LEAD_STATUS.NEW_LEAD]: "bg-blue-100 text-blue-600",

  [LEAD_STATUS.CONTACTED]: "bg-slate-100 text-slate-600",

  [LEAD_STATUS.INTERESTED]: "bg-amber-100 text-amber-700",

  [LEAD_STATUS.FOLLOW_UP]: "bg-emerald-100 text-emerald-700",

  [LEAD_STATUS.PROPOSAL_SENT]: "bg-violet-100 text-violet-700",

  [LEAD_STATUS.CLOSED_WON]: "bg-green-100 text-green-700",

  [LEAD_STATUS.NOT_INTERESTED]: "bg-red-100 text-red-600",
};

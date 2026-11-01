import { LEAD_STATUS, type LeadStatus } from "@/config/leadConfig";
import type { Lead } from "@/components/Common/LeadTable/LeadTable";
import type { LeadTimelineItem, StoredLeadUpdate } from "@/types/lead";
import type { LeadViewData } from "@/Containers/LeadViewContainer/LeadViewContainer";

export const LEAD_STORAGE_KEY = "greenvedha_leads_list";

export const DEFAULT_LEADS: Lead[] = [
  {
    id: 1,
    name: "Ahmed Ali",
    subText: "Website Form",
    phone: "+971 50 123 4567",
    status: LEAD_STATUS.NEW_LEAD,
    followUpDate: "28 Sep 2025",
    followUpTime: "10:30 AM",
    source: "Website Form",
    assignedTo: "Anwar",
    avatar: "A",
  },
  {
    id: 2,
    name: "Sarah Khan",
    subText: "Product Inquiry",
    phone: "+971 55 987 6543",
    status: LEAD_STATUS.INTERESTED,
    followUpDate: "29 Sep 2025",
    followUpTime: "02:00 PM",
    source: "Social Media",
    assignedTo: "Fatima",
    avatar: "S",
  },
  {
    id: 3,
    name: "Mohammed Raza",
    subText: "Meta Ads",
    phone: "+971 56 222 3344",
    status: LEAD_STATUS.FOLLOW_UP,
    followUpDate: "30 Sep 2025",
    followUpTime: "11:00 AM",
    source: "Meta Ads",
    assignedTo: "Ali",
    avatar: "M",
  },
  {
    id: 4,
    name: "Ayesha Siddiqui",
    subText: "Referral",
    phone: "+971 50 111 2233",
    status: LEAD_STATUS.CONTACTED,
    followUpDate: "27 Sep 2025",
    followUpTime: "03:30 PM",
    source: "Referral",
    assignedTo: "Anwar",
    avatar: "A",
  },
  {
    id: 5,
    name: "Khalid Al Mansoor",
    subText: "Website Form",
    phone: "+971 58 445 6677",
    status: LEAD_STATUS.PROPOSAL_SENT,
    followUpDate: "01 Oct 2025",
    followUpTime: "10:00 AM",
    source: "Website Form",
    assignedTo: "Fatima",
    avatar: "K",
  },
  {
    id: 6,
    name: "Sara Ahmed",
    subText: "LinkedIn",
    phone: "+971 52 778 8899",
    status: LEAD_STATUS.NOT_INTERESTED,
    followUpDate: "-",
    source: "LinkedIn",
    assignedTo: "John",
    avatar: "S",
  },
  {
    id: 7,
    name: "Omar Farooq",
    subText: "Cold Call",
    phone: "+971 54 665 7788",
    status: LEAD_STATUS.NEW_LEAD,
    followUpDate: "28 Sep 2025",
    followUpTime: "04:00 PM",
    source: "Cold Call",
    assignedTo: "Ali",
    avatar: "O",
  },
];

export interface CreateLeadInput {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  location?: string;
  source: string;
  assignedTo?: string;
  status?: LeadStatus;
  note?: string;
}

export function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") {
    return DEFAULT_LEADS;
  }

  try {
    const raw = window.localStorage.getItem(LEAD_STORAGE_KEY);
    let list: Lead[] = DEFAULT_LEADS;

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    } else {
      window.localStorage.setItem(
        LEAD_STORAGE_KEY,
        JSON.stringify(DEFAULT_LEADS)
      );
    }

    // Merge any individual status/details updates saved for each lead
    return list.map((lead) => {
      try {
        const itemRaw = window.localStorage.getItem(`greenveda_lead_${lead.id}`);
        if (!itemRaw) return lead;

        const parsedUpdate: StoredLeadUpdate & {
          editedDetails?: Partial<LeadViewData>;
        } = JSON.parse(itemRaw);

        return {
          ...lead,
          name: parsedUpdate.editedDetails?.name || lead.name,
          phone: parsedUpdate.editedDetails?.phone || lead.phone,
          source: parsedUpdate.editedDetails?.source || lead.source,
          assignedTo: parsedUpdate.editedDetails?.assignedTo || lead.assignedTo,
          status: parsedUpdate.status || lead.status,
          followUpDate: parsedUpdate.followUpDate || lead.followUpDate,
          followUpTime: parsedUpdate.followUpTime || lead.followUpTime,
        };
      } catch {
        return lead;
      }
    });
  } catch (err) {
    console.error("Failed to load leads from localStorage:", err);
    return DEFAULT_LEADS;
  }
}

export function saveNewLead(input: CreateLeadInput): Lead {
  const newId = Date.now();
  const initial = input.name.trim().charAt(0).toUpperCase() || "L";
  const status = input.status || LEAD_STATUS.NEW_LEAD;

  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);
  const timeFormatted = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  const newLead: Lead = {
    id: newId,
    name: input.name.trim(),
    subText: input.source,
    phone: input.phone.trim(),
    status: status,
    followUpDate: "Not set",
    followUpTime: "",
    source: input.source,
    assignedTo: input.assignedTo || "Unassigned",
    avatar: initial,
    note: input.note?.trim(),
  };

  if (typeof window !== "undefined") {
    try {
      // 1. Prepend to leads list
      const currentLeads = getStoredLeads();
      const updatedList = [newLead, ...currentLeads];
      window.localStorage.setItem(
        LEAD_STORAGE_KEY,
        JSON.stringify(updatedList)
      );

      // 2. Initialize lead details storage
      const initialLeadDetails: StoredLeadUpdate & {
        editedDetails: Partial<LeadViewData>;
      } = {
        status: status,
        followUpDate: "Not set",
        followUpTime: "",
        note: input.note?.trim() || "Lead created",
        editedDetails: {
          name: input.name.trim(),
          avatar: initial,
          phone: input.phone.trim(),
          email: input.email?.trim() || "",
          company: input.company?.trim() || "",
          location: input.location?.trim() || "",
          source: input.source,
          assignedTo: input.assignedTo || "Unassigned",
          status: status,
          createdAt: dateFormatted,
          createdTime: timeFormatted,
        },
        timeline: [
          {
            id: `created-${newId}`,
            type: "lead_created",
            title: "Lead Created",
            newValue: status,
            note: input.note?.trim() || `Lead received from ${input.source}.`,
            updatedBy: input.assignedTo || "Admin",
            createdAt: now.toISOString(),
          },
        ],
      };

      window.localStorage.setItem(
        `greenveda_lead_${newId}`,
        JSON.stringify(initialLeadDetails)
      );
    } catch (err) {
      console.error("Failed to save new lead:", err);
    }
  }

  return newLead;
}

export function getLeadDataById(leadId: string): LeadViewData {
  const defaultFallback: LeadViewData = {
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

  if (typeof window === "undefined") {
    return defaultFallback;
  }

  try {
    // 1. Find in stored leads list
    const leads = getStoredLeads();
    const matched = leads.find((l) => l.id.toString() === leadId.toString());

    let base: LeadViewData = defaultFallback;
    if (matched) {
      base = {
        id: matched.id.toString(),
        name: matched.name,
        avatar: matched.avatar || matched.name.charAt(0).toUpperCase(),
        phone: matched.phone,
        email: "",
        company: "",
        location: "",
        assignedTo: matched.assignedTo,
        source: matched.source,
        status: matched.status,
        createdAt: "Today",
        createdTime: "09:00 AM",
        followUpDate: matched.followUpDate || "Not set",
        followUpTime: matched.followUpTime || "",
        followUpNote: matched.note || "",
        timeline: [
          {
            id: `created-${matched.id}`,
            type: "lead_created",
            title: "Lead Created",
            newValue: matched.status,
            note: `Lead received from ${matched.source}.`,
            updatedBy: matched.assignedTo,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    // 2. Read individual updates
    const saved = window.localStorage.getItem(`greenveda_lead_${leadId}`);
    if (!saved) {
      return base;
    }

    const update: StoredLeadUpdate & {
      editedDetails?: Partial<LeadViewData>;
    } = JSON.parse(saved);

    return {
      ...base,
      ...(update.editedDetails ?? {}),
      status: update.status ?? base.status,
      followUpDate: update.followUpDate || base.followUpDate,
      followUpTime: update.followUpTime || base.followUpTime,
      followUpNote: update.note || base.followUpNote,
      timeline: [...(update.timeline ?? []), ...base.timeline],
    };
  } catch (err) {
    console.error("Failed to get lead by id:", err);
    return defaultFallback;
  }
}

"use client";

import {
  CalendarDays,
  Check,
  Phone,
  Plus,
  Send,
  UserRound,
  UserX,
  Users,
} from "lucide-react";

import { LEAD_STATUS } from "@/config/leadConfig";
import LeadTable, { Lead } from "@/components/Common/LeadTable/LeadTable";

// ============================================================
// STATUS CARDS
// ============================================================

const stats = [
  {
    label: "New Lead",
    value: 12,
    icon: UserRound,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    label: "Contacted",
    value: 8,
    icon: Phone,
    iconClass: "bg-slate-100 text-slate-500",
  },
  {
    label: "Interested",
    value: 6,
    icon: Users,
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    label: "Follow-up",
    value: 4,
    icon: CalendarDays,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Proposal Sent",
    value: 3,
    icon: Send,
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    label: "Closed Won",
    value: 2,
    icon: Check,
    iconClass: "bg-green-100 text-green-600",
  },
  {
    label: "Not Interested",
    value: 0,
    icon: UserX,
    iconClass: "bg-red-100 text-red-500",
  },
];

// ============================================================
// DUMMY LEADS
// Later replace this with API data
// ============================================================

const leads: Lead[] = [
  {
    id: 1,
    name: "Ahmed Ali",
    subText: "Website Form",
    phone: "+971 50 123 4567",
    status: LEAD_STATUS.NEW_LEAD,
    followUpDate: "28 Sep 2025",
    followUpTime: "10:30 AM",
    source: "Website",
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
    source: "Website",
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

// ============================================================
// CONTAINER
// ============================================================

function LeadContainer() {
  return (
    <div className="min-h-full bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.4px] text-slate-900">
              Leads
            </h1>

            <p className="mt-1 text-[11px] text-slate-400">
              Manage and track all your leads
            </p>
          </div>

          <button
            type="button"
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={15} />
            New Lead
          </button>
        </div>

        {/* ================= STATUS CARDS ================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}
                  >
                    <Icon size={16} />
                  </div>

                  <div>
                    <p className="text-lg font-semibold leading-none text-slate-800">
                      {item.value}
                    </p>

                    <p className="mt-2 text-[10px] font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= TABLE ================= */}

        <LeadTable data={leads} total={30} />
      </div>
    </div>
  );
}

export default LeadContainer;

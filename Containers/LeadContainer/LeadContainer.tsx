"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { DEFAULT_LEADS, getStoredLeads } from "@/lib/leadStorage";

// ============================================================
// CONTAINER
// ============================================================

function LeadContainer() {
  const [leads, setLeads] = useState<Lead[]>(DEFAULT_LEADS);

  useEffect(() => {
    setLeads(getStoredLeads());
  }, []);

  // Compute status counts dynamically from leads
  const stats = [
    {
      label: "New Lead",
      value: leads.filter((l) => l.status === LEAD_STATUS.NEW_LEAD).length,
      icon: UserRound,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Contacted",
      value: leads.filter((l) => l.status === LEAD_STATUS.CONTACTED).length,
      icon: Phone,
      iconClass: "bg-slate-100 text-slate-500",
    },
    {
      label: "Interested",
      value: leads.filter((l) => l.status === LEAD_STATUS.INTERESTED).length,
      icon: Users,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      label: "Follow-up",
      value: leads.filter((l) => l.status === LEAD_STATUS.FOLLOW_UP).length,
      icon: CalendarDays,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Proposal Sent",
      value: leads.filter((l) => l.status === LEAD_STATUS.PROPOSAL_SENT).length,
      icon: Send,
      iconClass: "bg-violet-100 text-violet-600",
    },
    {
      label: "Closed Won",
      value: leads.filter((l) => l.status === LEAD_STATUS.CLOSED_WON).length,
      icon: Check,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      label: "Not Interested",
      value: leads.filter((l) => l.status === LEAD_STATUS.NOT_INTERESTED).length,
      icon: UserX,
      iconClass: "bg-red-100 text-red-500",
    },
  ];

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

          <Link
            href="/leads/add"
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
          >
            <Plus size={15} />
            Add Lead
          </Link>
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

        <LeadTable data={leads} total={leads.length} />
      </div>
    </div>
  );
}

export default LeadContainer;

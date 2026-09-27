"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import {
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MoreHorizontal,
  MoreVertical,
  Phone,
  Search,
} from "lucide-react";

import { LEAD_STATUS_STYLES, type LeadStatus } from "@/config/leadConfig";

// ============================================================
// TYPES
// ============================================================

export interface Lead {
  id: number;
  name: string;
  subText: string;
  phone: string;
  status: LeadStatus;
  followUpDate: string;
  followUpTime?: string;
  source: string;
  assignedTo: string;
  avatar: string;
  note?: string;
}

interface LeadTableProps {
  data: Lead[];
  total?: number;
}

// ============================================================
// LEAD TABLE
// ============================================================

export default function LeadTable({ data, total = 30 }: LeadTableProps) {
  return (
    <>
      {/* =====================================================
          MOBILE VIEW
      ===================================================== */}

      <div className="lg:hidden">
        {/* STATUS TABS */}

        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            <MobileTab label="All" count={24} />

            <MobileTab label="New" count={12} active color="blue" />

            <MobileTab label="Follow-ups" count={8} color="green" />

            <MobileTab label="Interested" count={6} color="amber" />

            <MobileTab label="Confirmed" count={6} color="purple" />
          </div>
        </div>

        {/* SEARCH */}

        <div className="relative mt-3">
          <Search
            size={16}
            strokeWidth={2}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8090ae]"
          />

          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            className="h-10 w-full rounded-xl border border-[#dbe3ef] bg-white pl-10 pr-3 text-[11px] text-[#172554] outline-none placeholder:text-[#8090ae] focus:border-blue-300"
          />
        </div>

        {/* MOBILE LEADS */}

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-white">
          {data.map((lead, index) => (
            <MobileLeadRow key={lead.id} lead={lead} index={index} />
          ))}
        </div>

        {/* MOBILE COUNT */}

        <p className="mt-3 text-center text-[9px] text-slate-400">
          Showing {data.length} of {total} leads
        </p>
      </div>

      {/* =====================================================
          DESKTOP VIEW
      ===================================================== */}

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.03)] lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse">
            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead>
              <tr className="border-b border-slate-200 bg-[#fbfcfd]">
                <th className="w-[45px] px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    aria-label="Select all leads"
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </th>

                <TableHeader>Name</TableHeader>

                <TableHeader>Phone</TableHeader>

                <TableHeader>Status</TableHeader>

                <TableHeader>Next Follow-up</TableHeader>

                <TableHeader>Source</TableHeader>

                <TableHeader>Assigned To</TableHeader>

                <th className="w-[70px] px-4 py-3 text-center text-[10px] font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>
              {data.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/70"
                >
                  {/* CHECKBOX */}

                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${lead.name}`}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </td>

                  {/* NAME */}

                  <td className="px-4 py-3">
                    <Link
                      href={`/lead-view/${lead.id}`}
                      className="group flex items-center gap-3"
                    >
                      <Avatar
                        name={lead.name}
                        avatar={lead.avatar}
                        size="small"
                      />

                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-[11px] font-semibold text-slate-800 transition group-hover:text-blue-600">
                          {lead.name}
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          {lead.subText}
                        </p>
                      </div>
                    </Link>
                  </td>

                  {/* PHONE */}

                  <td className="px-4 py-3">
                    <Link
                      href={`/lead-view/${lead.id}`}
                      className="block whitespace-nowrap text-[10px] text-slate-600"
                    >
                      {lead.phone}
                    </Link>
                  </td>

                  {/* STATUS */}

                  <td className="px-4 py-3">
                    <Link
                      href={`/lead-view/${lead.id}`}
                      className="inline-block"
                    >
                      <StatusBadge status={lead.status} />
                    </Link>
                  </td>

                  {/* FOLLOW UP */}

                  <td className="px-4 py-3">
                    <Link href={`/lead-view/${lead.id}`} className="block">
                      <p className="whitespace-nowrap text-[10px] font-medium text-slate-600">
                        {lead.followUpDate}
                      </p>

                      {lead.followUpTime && (
                        <p className="mt-0.5 text-[9px] text-slate-400">
                          {lead.followUpTime}
                        </p>
                      )}
                    </Link>
                  </td>

                  {/* SOURCE */}

                  <td className="px-4 py-3">
                    <Link
                      href={`/lead-view/${lead.id}`}
                      className="block whitespace-nowrap text-[10px] text-slate-600"
                    >
                      {lead.source}
                    </Link>
                  </td>

                  {/* ASSIGNED TO */}

                  <td className="px-4 py-3">
                    <Link
                      href={`/lead-view/${lead.id}`}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-600">
                        {lead.assignedTo.charAt(0).toUpperCase()}
                      </div>

                      <span className="whitespace-nowrap text-[10px] text-slate-600">
                        {lead.assignedTo}
                      </span>
                    </Link>
                  </td>

                  {/* ACTION */}

                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      aria-label={`Actions for ${lead.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            DESKTOP PAGINATION
        ===================================================== */}

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <p className="text-[10px] text-slate-400">
            Showing 1 – {data.length} of {total} leads
          </p>

          <div className="flex items-center gap-1">
            <PaginationButton>
              <ChevronLeft size={14} />
            </PaginationButton>

            <PaginationButton active>1</PaginationButton>

            <PaginationButton>2</PaginationButton>

            <PaginationButton>3</PaginationButton>

            <PaginationButton>4</PaginationButton>

            <PaginationButton>
              <ChevronRight size={14} />
            </PaginationButton>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// MOBILE LEAD ROW
// ============================================================

function MobileLeadRow({ lead, index }: { lead: Lead; index: number }) {
  const defaultNotes = [
    "Call regarding ERP demo and discuss pricing.",
    "Send proposal and follow up next week.",
    "Confirm requirements and share brochure.",
    "Discuss project scope.",
    "Client to review proposal.",
    "Call to understand requirement.",
    "Send company profile.",
  ];

  const note = lead.note ?? defaultNotes[index % defaultNotes.length];

  return (
    <div className="relative border-b border-slate-100 bg-white last:border-b-0">
      {/* =====================================================
          CLICKABLE LEAD CONTENT
      ===================================================== */}

      <Link
        href={`/lead-view/${lead.id}`}
        className="block px-3 py-3 pr-[105px] transition hover:bg-slate-50 active:bg-slate-50"
      >
        <div className="grid grid-cols-[40px_minmax(85px,0.9fr)_minmax(110px,1.25fr)] items-start gap-2">
          {/* AVATAR */}

          <Avatar name={lead.name} avatar={lead.avatar} size="large" />

          {/* =================================================
              NAME / PHONE / SOURCE
          ================================================= */}

          <div className="min-w-0 pt-0.5">
            <h3 className="truncate text-[10px] font-semibold leading-tight text-[#081b4b]">
              {lead.name}
            </h3>

            <p className="mt-1 truncate text-[8px] font-medium text-[#58709d]">
              {lead.phone}
            </p>

            <div className="mt-1.5 flex min-w-0 items-center gap-1 text-[8px] text-[#65799f]">
              <Building2 size={10} strokeWidth={2} className="shrink-0" />

              <span className="truncate">{lead.source}</span>
            </div>
          </div>

          {/* =================================================
              STATUS / FOLLOW UP / NOTE
          ================================================= */}

          <div className="min-w-0">
            <StatusBadge status={lead.status} />

            <div className="mt-1.5 flex items-center gap-1">
              <CalendarDays
                size={11}
                strokeWidth={2.3}
                className="shrink-0 text-[#0968f7]"
              />

              <p className="truncate text-[8px] font-medium text-[#58709d]">
                {lead.followUpDate}

                {lead.followUpTime && <> • {lead.followUpTime}</>}
              </p>
            </div>

            {note && (
              <p className="mt-1.5 line-clamp-2 text-[8px] leading-[1.35] text-[#58709d]">
                {note}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* =====================================================
          MOBILE ACTIONS

          These are OUTSIDE Link.
          So no button inside <a>.
      ===================================================== */}

      <div className="absolute bottom-3 right-3 flex items-center gap-1">
        <MobileAction label={`Call ${lead.name}`}>
          <Phone size={12} />
        </MobileAction>

        <MobileAction label={`Message ${lead.name}`}>
          <MessageSquare size={11} />
        </MobileAction>

        <MobileAction label={`More actions for ${lead.name}`} secondary>
          <MoreHorizontal size={14} />
        </MobileAction>
      </div>

      {/* =====================================================
          VIEW ARROW
      ===================================================== */}

      <Link
        href={`/lead-view/${lead.id}`}
        aria-label={`Open ${lead.name}`}
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[#8090ae] transition hover:bg-slate-100"
      >
        <ChevronRight size={12} />
      </Link>
    </div>
  );
}

// ============================================================
// MOBILE STATUS TAB
// ============================================================

function MobileTab({
  label,
  count,
  active = false,
  color = "slate",
}: {
  label: string;
  count: number;
  active?: boolean;
  color?: "blue" | "green" | "amber" | "purple" | "slate";
}) {
  const countStyles = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-violet-100 text-violet-600",
    slate: "bg-slate-100 text-slate-500",
  };

  return (
    <button
      type="button"
      className={`relative flex h-10 items-center gap-2 rounded-xl border px-3 text-[10px] font-medium transition ${
        active
          ? "border-blue-100 bg-[#f5f8ff] text-[#06245c]"
          : "border-slate-100 bg-white text-[#162a55]"
      }`}
    >
      <span>{label}</span>

      <span
        className={`flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${countStyles[color]}`}
      >
        {count}
      </span>

      {active && (
        <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#1769f6]" />
      )}
    </button>
  );
}

// ============================================================
// MOBILE ACTION
// ============================================================

function MobileAction({
  children,
  label,
  secondary = false,
}: {
  children: ReactNode;
  label: string;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
        secondary
          ? "border-[#e0e7f1] bg-white text-[#58709d] hover:bg-slate-50"
          : "border-[#dce8fb] bg-[#f2f7ff] text-[#0066f5] hover:bg-blue-100"
      }`}
    >
      {children}
    </button>
  );
}

// ============================================================
// AVATAR
// ============================================================

function Avatar({
  name,
  avatar,
  size,
}: {
  name: string;
  avatar: string;
  size: "small" | "large";
}) {
  const colors = [
    "bg-[#dce9ff] text-[#0968f7]",
    "bg-[#fff0c9] text-[#c98700]",
    "bg-[#d8f5ec] text-[#009b79]",
    "bg-[#eadcff] text-[#7032d4]",
    "bg-[#ffdce5] text-[#d81745]",
  ];

  const color = colors[name.length % colors.length];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${color} ${
        size === "large" ? "h-10 w-10 text-[15px]" : "h-9 w-9 text-[11px]"
      }`}
    >
      {avatar}
    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex max-w-full whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-medium ${LEAD_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

// ============================================================
// DESKTOP TABLE HEADER
// ============================================================

function TableHeader({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500">
      {children}
    </th>
  );
}

// ============================================================
// PAGINATION
// ============================================================

function PaginationButton({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-[10px] font-medium transition ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

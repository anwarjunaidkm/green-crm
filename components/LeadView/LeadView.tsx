"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  UserRound,
} from "lucide-react";

import {
  LEAD_STATUS,
  LEAD_STATUS_STYLES,
  type LeadStatus,
} from "@/config/leadConfig";

import type { LeadTimelineItem } from "@/types/lead";

import LeadTimeline from "@/components/LeadView/LeadTimeline";

// ============================================================
// TYPES
// ============================================================

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

interface LeadViewProps {
  lead: LeadViewData;
}

// ============================================================
// STATUS FLOW
// ============================================================

const STATUS_FLOW: {
  value: LeadStatus;
  label: string;
}[] = [
  {
    value: LEAD_STATUS.NEW_LEAD,
    label: "New Lead",
  },
  {
    value: LEAD_STATUS.CONTACTED,
    label: "Contacted",
  },
  {
    value: LEAD_STATUS.INTERESTED,
    label: "Interested",
  },
  {
    value: LEAD_STATUS.FOLLOW_UP,
    label: "Follow-up",
  },
  {
    value: LEAD_STATUS.PROPOSAL_SENT,
    label: "Proposal",
  },
  {
    value: LEAD_STATUS.CLOSED_WON,
    label: "Won",
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function LeadView({ lead }: LeadViewProps) {
  return (
    <div className="min-h-full bg-[#f6f8fc] pb-8">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:h-[68px]">
          <div className="flex min-w-0 items-center">
            <Link
              href="/leads"
              aria-label="Back to leads"
              className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-blue-600 transition hover:bg-blue-50"
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-semibold text-[#0b1d48] lg:text-[17px]">
                Lead Details
              </h1>

              <p className="mt-0.5 hidden text-[9px] text-slate-400 sm:block">
                View lead information, follow-ups and complete update history
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="More actions"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:py-6">
        {/* ====================================================
            PROFILE CARD
        ==================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.025)]">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-start gap-3 lg:gap-4">
              {/* AVATAR */}

              <LeadAvatar name={lead.name} avatar={lead.avatar} />

              {/* NAME / STATUS */}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-[17px] font-semibold tracking-[-0.2px] text-[#0b1d48] lg:text-[20px]">
                    {lead.name}
                  </h2>

                  <StatusBadge status={lead.status} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-slate-500 lg:text-[10px]">
                  <span className="flex items-center gap-1">
                    <Building2 size={12} />
                    {lead.source}
                  </span>

                  <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                  <span>Added {lead.createdAt}</span>

                  <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                  <span>{lead.createdTime}</span>
                </div>
              </div>
            </div>

            {/* ==================================================
                QUICK ACTIONS
            ================================================== */}

            <div className="mt-5 grid grid-cols-4 gap-2 border-t border-slate-100 pt-4 sm:flex sm:gap-3">
              <QuickAction
                icon={Phone}
                label="Call"
                href={`tel:${lead.phone}`}
              />

              <QuickAction
                icon={MessageSquare}
                label="Message"
                href={`sms:${lead.phone}`}
              />

              <QuickAction icon={MessageCircle} label="WhatsApp" />

              <QuickAction icon={MoreHorizontal} label="More" />
            </div>
          </div>

          {/* ==================================================
              STATUS PROGRESS
          ================================================== */}

          <div className="border-t border-slate-100 bg-[#fbfcfe] px-4 py-4 sm:px-5 lg:px-6">
            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.08em] text-slate-400">
              Lead Progress
            </p>

            <StatusProgress currentStatus={lead.status} />
          </div>
        </section>

        {/* ====================================================
            MOBILE VIEW
            NO HISTORY
        ==================================================== */}

        <div className="mt-4 space-y-4 lg:hidden">
          {/* LEAD INFORMATION */}

          <LeadInformation lead={lead} />

          {/* NEXT FOLLOW-UP */}

          <NextFollowUp lead={lead} />

          {/* ==================================================
              UPDATE STATUS
              NORMAL BUTTON - NOT FIXED/STICKY/ABSOLUTE
          ================================================== */}

          <Link
            href={`/lead-view/${lead.id}/update-status`}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.18)] transition hover:bg-[#005de2] active:scale-[0.99]"
          >
            <Pencil size={16} />
            Update Status
          </Link>
        </div>

        {/* ====================================================
            DESKTOP VIEW
        ==================================================== */}

        <div className="mt-5 hidden grid-cols-[minmax(0,1fr)_380px] items-start gap-5 lg:grid">
          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="space-y-5">
            <LeadInformation lead={lead} />

            {/* HISTORY - DESKTOP ONLY */}

            <LeadTimeline timeline={lead.timeline} />
          </div>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <div className="sticky top-5 space-y-5">
            <NextFollowUp lead={lead} />

            {/* ==================================================
                CURRENT STATUS
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.025)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    Current Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={lead.status} large />
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Check size={17} />
                </div>
              </div>

              <Link
                href={`/lead-view/${lead.id}/update-status`}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.16)] transition hover:bg-[#005de2]"
              >
                <Pencil size={14} />
                Update Status
              </Link>
            </section>

            {/* ==================================================
                LEAD META
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-slate-400">
                Lead Information
              </p>

              <div className="mt-4 space-y-3">
                <SmallMeta label="Lead ID" value={`#${lead.id}`} />

                <SmallMeta
                  label="Created"
                  value={`${lead.createdAt} • ${lead.createdTime}`}
                />

                <SmallMeta label="Assigned To" value={lead.assignedTo} />

                <SmallMeta label="Source" value={lead.source} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// LEAD INFORMATION
// ============================================================

function LeadInformation({ lead }: { lead: LeadViewData }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.025)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[12px] font-semibold text-[#0b1d48] lg:text-[13px]">
            Lead Information
          </h3>

          <p className="mt-1 hidden text-[9px] text-slate-400 sm:block">
            Contact and business information
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <InformationRow
          icon={Phone}
          label="Phone"
          value={lead.phone}
          href={`tel:${lead.phone}`}
        />

        <InformationRow
          icon={Mail}
          label="Email"
          value={lead.email}
          href={`mailto:${lead.email}`}
        />

        <InformationRow
          icon={Building2}
          label="Company"
          value={lead.company || "-"}
        />

        <InformationRow
          icon={MapPin}
          label="Location"
          value={lead.location || "-"}
        />

        <InformationRow
          icon={UserRound}
          label="Assigned To"
          value={lead.assignedTo}
        />

        <InformationRow icon={Building2} label="Source" value={lead.source} />
      </div>
    </section>
  );
}

// ============================================================
// INFORMATION ROW
// ============================================================

function InformationRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4f7fb] text-[#58709d]">
        <Icon size={14} />
      </div>

      <div className="min-w-0">
        <p className="text-[8px] font-medium uppercase tracking-[0.05em] text-slate-400">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-[10px] font-medium ${
            href ? "text-blue-600" : "text-[#0b1d48]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      {href ? <a href={href}>{content}</a> : content}
    </div>
  );
}

// ============================================================
// NEXT FOLLOW-UP
// ============================================================

function NextFollowUp({ lead }: { lead: LeadViewData }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.025)]">
      <div className="border-b border-blue-100 bg-[#f6f9ff] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <CalendarDays size={14} />
          </div>

          <div>
            <h3 className="text-[11px] font-semibold text-[#0b1d48]">
              Next Follow-up
            </h3>

            <p className="mt-0.5 text-[8px] text-slate-400">
              Scheduled follow-up
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {/* DATE */}

          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-blue-600" />

            <div>
              <p className="text-[8px] text-slate-400">Date</p>

              <p className="mt-0.5 text-[10px] font-semibold text-[#0b1d48]">
                {formatFollowUpDate(lead.followUpDate)}
              </p>
            </div>
          </div>

          {/* TIME */}

          <div className="flex items-center gap-2">
            <Clock3 size={14} className="text-blue-600" />

            <div>
              <p className="text-[8px] text-slate-400">Time</p>

              <p className="mt-0.5 text-[10px] font-semibold text-[#0b1d48]">
                {formatFollowUpTime(lead.followUpTime)}
              </p>
            </div>
          </div>
        </div>

        {/* NOTE */}

        {lead.followUpNote && (
          <div className="mt-4 rounded-xl bg-[#f8fafc] p-3">
            <div className="flex items-start gap-2">
              <MessageSquare
                size={13}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <p className="text-[9px] leading-[1.6] text-slate-600">
                {lead.followUpNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// STATUS PROGRESS
// ============================================================

function StatusProgress({ currentStatus }: { currentStatus: LeadStatus }) {
  const currentIndex = STATUS_FLOW.findIndex(
    (item) => item.value === currentStatus,
  );

  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

  const isNotInterested = currentStatus === LEAD_STATUS.NOT_INTERESTED;

  return (
    <div>
      <div className="flex w-full items-start">
        {STATUS_FLOW.map((item, index) => {
          const completed = !isNotInterested && index < safeCurrentIndex;

          const active = !isNotInterested && index === safeCurrentIndex;

          return (
            <div
              key={item.value}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* CONNECTING LINE */}

              {index < STATUS_FLOW.length - 1 && (
                <div
                  className={`absolute left-1/2 top-[11px] h-[2px] w-full ${
                    index < safeCurrentIndex ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}

              {/* CIRCLE */}

              <div
                className={`relative z-10 flex h-[23px] w-[23px] items-center justify-center rounded-full border-2 transition ${
                  completed
                    ? "border-blue-600 bg-blue-600 text-white"
                    : active
                      ? "border-blue-600 bg-white text-blue-600"
                      : "border-slate-200 bg-white text-slate-300"
                }`}
              >
                {completed ? (
                  <Check size={11} strokeWidth={3} />
                ) : (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>

              {/* LABEL */}

              <p
                className={`mt-2 whitespace-nowrap text-center text-[7px] font-medium sm:text-[8px] ${
                  active || completed ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* NOT INTERESTED */}

      {isNotInterested && (
        <div className="mt-4 flex items-center justify-center">
          <span className="rounded-full bg-red-50 px-3 py-1.5 text-[9px] font-semibold text-red-600">
            Lead marked as Not Interested
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f7ff] text-blue-600 transition group-hover:bg-blue-100">
        <Icon size={15} />
      </div>

      <span className="mt-1.5 text-[8px] font-medium text-slate-500 sm:text-[9px]">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="group flex min-w-[55px] flex-col items-center">
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className="group flex min-w-[55px] flex-col items-center"
    >
      {content}
    </button>
  );
}

// ============================================================
// AVATAR
// ============================================================

function LeadAvatar({ name, avatar }: { name: string; avatar: string }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#dce9ff] text-[19px] font-semibold text-[#0968f7] lg:h-16 lg:w-16 lg:text-[22px]">
      {avatar || name.charAt(0).toUpperCase()}
    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
  large = false,
}: {
  status: LeadStatus;
  large?: boolean;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full font-medium ${
        LEAD_STATUS_STYLES[status]
      } ${large ? "px-3 py-1.5 text-[10px]" : "px-2.5 py-1 text-[8px]"}`}
    >
      {status}
    </span>
  );
}

// ============================================================
// SMALL META
// ============================================================

function SmallMeta({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[9px] text-slate-400">{label}</span>

      <span className="text-right text-[9px] font-medium text-[#0b1d48]">
        {value}
      </span>
    </div>
  );
}

// ============================================================
// FORMAT FOLLOW-UP DATE
// ============================================================

function formatFollowUpDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ============================================================
// FORMAT FOLLOW-UP TIME
// ============================================================

function formatFollowUpTime(value: string) {
  if (!value) {
    return "-";
  }

  if (/^\d{2}:\d{2}$/.test(value)) {
    const [hours, minutes] = value.split(":").map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return value;
}

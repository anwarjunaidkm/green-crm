"use client";

import { useState, type ElementType, type FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleX,
  Clock3,
  MessageSquare,
  Phone,
  Send,
  UserRound,
} from "lucide-react";

import { LEAD_STATUS, type LeadStatus } from "@/config/leadConfig";

import type { LeadTimelineItem, StoredLeadUpdate } from "@/types/lead";

// ============================================================
// TYPES
// ============================================================

interface UpdateLeadStatusProps {
  leadId: string;
  defaultStatus: LeadStatus;
}

interface StatusOption {
  value: LeadStatus;
  title: string;
  description: string;
  icon: ElementType;
  iconClass: string;
  selectedClass: string;
}

interface InitialUpdateState {
  status: LeadStatus;
  previousStatus: LeadStatus;
  followUpDate: string;
  followUpTime: string;
}

// ============================================================
// STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: LEAD_STATUS.CONTACTED,
    title: "Contacted",
    description: "Spoke with lead",
    icon: Phone,
    iconClass: "bg-blue-100 text-blue-600",
    selectedClass: "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500",
  },
  {
    value: LEAD_STATUS.INTERESTED,
    title: "Interested",
    description: "Showing interest",
    icon: UserRound,
    iconClass: "bg-amber-100 text-amber-600",
    selectedClass: "border-amber-400 bg-amber-50/40 ring-1 ring-amber-400",
  },
  {
    value: LEAD_STATUS.FOLLOW_UP,
    title: "Follow-up",
    description: "Need to follow up",
    icon: Phone,
    iconClass: "bg-violet-100 text-violet-600",
    selectedClass: "border-violet-400 bg-violet-50/40 ring-1 ring-violet-400",
  },
  {
    value: LEAD_STATUS.PROPOSAL_SENT,
    title: "Proposal Sent",
    description: "Quotation shared",
    icon: MessageSquare,
    iconClass: "bg-purple-100 text-purple-600",
    selectedClass: "border-purple-400 bg-purple-50/40 ring-1 ring-purple-400",
  },
  {
    value: LEAD_STATUS.CLOSED_WON,
    title: "Closed Won",
    description: "Converted to customer",
    icon: Check,
    iconClass: "bg-emerald-100 text-emerald-600",
    selectedClass:
      "border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-400",
  },
  {
    value: LEAD_STATUS.NOT_INTERESTED,
    title: "Not Interested",
    description: "Not a potential customer",
    icon: CircleX,
    iconClass: "bg-red-100 text-red-600",
    selectedClass: "border-red-400 bg-red-50/40 ring-1 ring-red-400",
  },
];

// ============================================================
// GET INITIAL DATA
// ============================================================

function getInitialUpdateState(
  leadId: string,
  defaultStatus: LeadStatus,
): InitialUpdateState {
  const nextDefaultStatus =
    defaultStatus === LEAD_STATUS.NEW_LEAD
      ? LEAD_STATUS.CONTACTED
      : defaultStatus;

  const fallback: InitialUpdateState = {
    status: nextDefaultStatus,
    previousStatus: defaultStatus,
    followUpDate: "",
    followUpTime: "",
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storageKey = `greenveda_lead_${leadId}`;

    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      return fallback;
    }

    const parsed: StoredLeadUpdate = JSON.parse(saved);

    return {
      status: parsed.status ?? nextDefaultStatus,

      previousStatus: parsed.status ?? defaultStatus,

      followUpDate: parsed.followUpDate ?? "",

      followUpTime: parsed.followUpTime ?? "",
    };
  } catch (error) {
    console.error("Failed to load lead:", error);

    return fallback;
  }
}

// ============================================================
// COMPONENT
// ============================================================

export default function UpdateLeadStatus({
  leadId,
  defaultStatus,
}: UpdateLeadStatusProps) {
  const router = useRouter();

  // ==========================================================
  // INITIAL DATA
  // ==========================================================

  const [initialData] = useState(() =>
    getInitialUpdateState(leadId, defaultStatus),
  );

  // ==========================================================
  // STATE
  // ==========================================================

  const [status, setStatus] = useState<LeadStatus>(initialData.status);

  const [previousStatus] = useState<LeadStatus>(initialData.previousStatus);

  const [followUpDate, setFollowUpDate] = useState(initialData.followUpDate);

  const [followUpTime, setFollowUpTime] = useState(initialData.followUpTime);

  const [note, setNote] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // ==========================================================
  // SAVE UPDATE
  // ==========================================================

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!status) {
      return;
    }

    if (!note.trim()) {
      return;
    }

    setIsSaving(true);

    const storageKey = `greenveda_lead_${leadId}`;

    try {
      // ======================================================
      // EXISTING DATA
      // ======================================================

      const existing = window.localStorage.getItem(storageKey);

      const previous: StoredLeadUpdate | null = existing
        ? JSON.parse(existing)
        : null;

      const oldStatus = previous?.status ?? previousStatus;

      const oldFollowUpDate = previous?.followUpDate ?? "";

      const oldFollowUpTime = previous?.followUpTime ?? "";

      const oldTimeline = previous?.timeline ?? [];

      const newTimelineItems: LeadTimelineItem[] = [];

      const createdAt = new Date().toISOString();

      // ======================================================
      // STATUS HISTORY
      // ======================================================

      if (oldStatus !== status) {
        newTimelineItems.push({
          id: crypto.randomUUID(),

          type: "status_updated",

          title: "Status Updated",

          oldValue: oldStatus,

          newValue: status,

          note: note.trim(),

          followUpDate,

          followUpTime,

          updatedBy: "Anwar",

          createdAt,
        });
      }

      // ======================================================
      // FOLLOW-UP HISTORY
      // ======================================================

      const followUpChanged =
        oldFollowUpDate !== followUpDate || oldFollowUpTime !== followUpTime;

      if (followUpChanged) {
        const oldFollowUp =
          [oldFollowUpDate, oldFollowUpTime].filter(Boolean).join(" • ") ||
          "Not set";

        const newFollowUp =
          [followUpDate, followUpTime].filter(Boolean).join(" • ") || "Not set";

        newTimelineItems.push({
          id: crypto.randomUUID(),

          type: "follow_up_updated",

          title: "Follow-up Updated",

          oldValue: oldFollowUp,

          newValue: newFollowUp,

          note: note.trim(),

          followUpDate,

          followUpTime,

          updatedBy: "Anwar",

          createdAt,
        });
      }

      // ======================================================
      // NOTE ONLY
      // ======================================================

      if (oldStatus === status && !followUpChanged) {
        newTimelineItems.push({
          id: crypto.randomUUID(),

          type: "note_added",

          title: "Note Added",

          note: note.trim(),

          updatedBy: "Anwar",

          createdAt,
        });
      }

      // ======================================================
      // SAVE
      // ======================================================

      const updatedData: StoredLeadUpdate = {
        status,

        followUpDate,

        followUpTime,

        note: note.trim(),

        timeline: [...newTimelineItems, ...oldTimeline],
      };

      window.localStorage.setItem(storageKey, JSON.stringify(updatedData));

      // ======================================================
      // BACK TO LEAD
      // ======================================================

      router.push(`/lead-view/${leadId}`);
    } catch (error) {
      console.error("Failed to update lead:", error);

      setIsSaving(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-full bg-[#f6f8fc] pb-24 lg:pb-8">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1100px] items-center px-4 sm:px-6 lg:h-[68px]">
          <Link
            href={`/lead-view/${leadId}`}
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-[15px] font-semibold text-[#0b1d48] lg:text-[17px]">
              Update Lead Status
            </h1>

            <p className="mt-0.5 hidden text-[9px] text-slate-400 lg:block">
              Update status, follow-up information and notes
            </p>
          </div>
        </div>
      </header>

      {/* ======================================================
          FORM
      ====================================================== */}

      <form
        id="lead-status-form"
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1100px] px-4 py-5 sm:px-6 lg:py-6"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* ==================================================
              STATUS
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionTitle number="1" title="Select New Status" required />

            {/* CURRENT */}

            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[9px] text-slate-400">Current Status</p>

              <p className="mt-0.5 text-[11px] font-semibold text-[#0b1d48]">
                {previousStatus}
              </p>
            </div>

            {/* OPTIONS */}

            <div className="mt-3 space-y-2">
              {STATUS_OPTIONS.map((option) => (
                <StatusCard
                  key={option.value}
                  option={option}
                  selected={status === option.value}
                  onClick={() => setStatus(option.value)}
                />
              ))}
            </div>
          </section>

          {/* ==================================================
              RIGHT CONTENT
          ================================================== */}

          <div className="space-y-5">
            {/* ================================================
                FOLLOW-UP
            ================================================ */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="2" title="Follow-up Date & Time" required />

              <div className="mt-4 grid grid-cols-2 gap-3">
                {/* DATE */}

                <div>
                  <label className="mb-1.5 block text-[9px] font-medium text-slate-500">
                    Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                    />

                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-[10px] font-medium text-[#0b1d48] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* TIME */}

                <div>
                  <label className="mb-1.5 block text-[9px] font-medium text-slate-500">
                    Time
                  </label>

                  <div className="relative">
                    <Clock3
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                    />

                    <input
                      type="time"
                      value={followUpTime}
                      onChange={(e) => setFollowUpTime(e.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-[10px] font-medium text-[#0b1d48] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================
                NOTE
            ================================================ */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="3" title="Note" required />

              <div className="relative mt-4">
                <textarea
                  value={note}
                  maxLength={500}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write what happened in this update..."
                  className="min-h-[135px] w-full resize-none rounded-xl border border-slate-200 bg-white p-3 pb-7 text-[11px] leading-[1.6] text-[#0b1d48] outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <span className="absolute bottom-3 right-3 text-[8px] text-slate-400">
                  {note.length}
                  /500
                </span>
              </div>
            </section>

            {/* ================================================
                UPDATE SUMMARY
                DESKTOP ONLY
            ================================================ */}

            <section className="hidden rounded-2xl border border-blue-100 bg-blue-50/50 p-4 lg:block">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <CheckCircle2 size={15} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-[#0b1d48]">
                    Update Summary
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-[9px]">
                    <span className="text-slate-500">{previousStatus}</span>

                    <ChevronRight size={12} className="text-slate-400" />

                    <span className="font-semibold text-blue-600">
                      {status}
                    </span>
                  </div>

                  <p className="mt-2 text-[9px] text-slate-500">
                    This update will be added to the lead history.
                  </p>
                </div>
              </div>
            </section>

            {/* ================================================
                SAVE UPDATE

                ONE BUTTON
                MOBILE + DESKTOP
                NORMAL DOCUMENT FLOW
            ================================================ */}

            <button
              type="submit"
              disabled={isSaving || !note.trim()}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.18)] transition hover:bg-[#005de2] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />

              {isSaving ? "Updating..." : "Save Update"}
            </button>
          </div>
        </div>

        {/* ====================================================
            EXTRA SPACE ABOVE MOBILE BOTTOM NAV
        ==================================================== */}

        <div className="h-6 lg:hidden" />
      </form>
    </div>
  );
}

// ============================================================
// STATUS CARD
// ============================================================

function StatusCard({
  option,
  selected,
  onClick,
}: {
  option: StatusOption;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[58px] w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
        selected
          ? option.selectedClass
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {/* ICON */}

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${option.iconClass}`}
      >
        <Icon size={15} />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <p
          className={`text-[11px] font-semibold ${
            option.value === LEAD_STATUS.NOT_INTERESTED
              ? "text-red-600"
              : "text-[#0b1d48]"
          }`}
        >
          {option.title}
        </p>

        <p
          className={`mt-0.5 text-[9px] ${
            option.value === LEAD_STATUS.NOT_INTERESTED
              ? "text-red-400"
              : "text-slate-400"
          }`}
        >
          {option.description}
        </p>
      </div>

      {/* SELECTED */}

      {selected ? (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <Check size={11} strokeWidth={3} />
        </div>
      ) : (
        <ChevronRight size={15} className="text-slate-400" />
      )}
    </button>
  );
}

// ============================================================
// SECTION TITLE
// ============================================================

function SectionTitle({
  number,
  title,
  required,
}: {
  number: string;
  title: string;
  required?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] font-semibold text-[#0b1d48]">
        {number}.
      </span>

      <h2 className="text-[11px] font-semibold text-[#0b1d48]">{title}</h2>

      {required && <span className="text-red-500">*</span>}
    </div>
  );
}

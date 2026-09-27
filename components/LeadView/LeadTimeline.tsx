"use client";

import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FilePlus2,
  MessageSquare,
  Phone,
  UserRound,
} from "lucide-react";

import type { LeadHistoryType, LeadTimelineItem } from "@/types/lead";

// ============================================================
// TYPES
// ============================================================

interface LeadTimelineProps {
  timeline: LeadTimelineItem[];
}

// ============================================================
// COMPONENT
// ============================================================

export default function LeadTimeline({ timeline }: LeadTimelineProps) {
  if (!timeline.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-[11px] text-slate-400">No update history yet.</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <h3 className="text-[13px] font-semibold text-[#0b1d48]">
          Update History
        </h3>

        <p className="mt-1 text-[9px] text-slate-400">
          Complete history of changes made to this lead
        </p>
      </div>

      <div>
        {timeline.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            last={index === timeline.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// TIMELINE ITEM
// ============================================================

function TimelineItem({
  item,
  last,
}: {
  item: LeadTimelineItem;
  last: boolean;
}) {
  const config = getTimelineConfig(item.type);

  const Icon = config.icon;

  return (
    <div className="relative flex gap-3">
      {/* LINE */}

      {!last && (
        <div className="absolute bottom-0 left-[16px] top-[32px] w-px bg-slate-200" />
      )}

      {/* ICON */}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.iconClass}`}
      >
        <Icon size={14} />
      </div>

      {/* CONTENT */}

      <div className={`min-w-0 flex-1 ${!last ? "pb-6" : "pb-1"}`}>
        {/* HEADER */}

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold text-[#0b1d48] sm:text-[11px]">
              {item.title}
            </p>

            <p className="mt-0.5 text-[8px] text-slate-400">
              by {item.updatedBy}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[8px] font-medium text-slate-500">
              {formatDate(item.createdAt)}
            </p>

            <p className="mt-0.5 text-[8px] text-slate-400">
              {formatTime(item.createdAt)}
            </p>
          </div>
        </div>

        {/* OLD -> NEW */}

        {item.oldValue && item.newValue && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[8px] font-medium text-slate-500">
              {item.oldValue}
            </span>

            <ChevronRight size={12} className="text-slate-300" />

            <span className="rounded-md bg-blue-50 px-2 py-1 text-[8px] font-semibold text-blue-600">
              {item.newValue}
            </span>
          </div>
        )}

        {/* CREATED */}

        {!item.oldValue && item.newValue && (
          <div className="mt-2">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-[8px] font-semibold text-blue-600">
              {item.newValue}
            </span>
          </div>
        )}

        {/* NOTE */}

        {item.note && (
          <div className="mt-2.5 rounded-lg bg-[#f8fafc] p-3">
            <div className="flex items-start gap-2">
              <MessageSquare
                size={12}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <p className="text-[9px] leading-[1.6] text-slate-600">
                {item.note}
              </p>
            </div>
          </div>
        )}

        {/* FOLLOW UP */}

        {(item.followUpDate || item.followUpTime) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] text-slate-500">
            {item.followUpDate && (
              <div className="flex items-center gap-1">
                <CalendarDays size={11} className="text-blue-500" />

                <span>Next follow-up: {item.followUpDate}</span>
              </div>
            )}

            {item.followUpTime && (
              <div className="flex items-center gap-1">
                <Clock3 size={11} className="text-blue-500" />

                <span>{item.followUpTime}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CONFIG
// ============================================================

function getTimelineConfig(type: LeadHistoryType) {
  switch (type) {
    case "lead_created":
      return {
        icon: FilePlus2,
        iconClass: "bg-blue-100 text-blue-600",
      };

    case "status_updated":
      return {
        icon: Check,
        iconClass: "bg-emerald-100 text-emerald-600",
      };

    case "follow_up_updated":
      return {
        icon: CalendarDays,
        iconClass: "bg-violet-100 text-violet-600",
      };

    case "note_added":
      return {
        icon: MessageSquare,
        iconClass: "bg-amber-100 text-amber-600",
      };

    case "assigned_changed":
      return {
        icon: UserRound,
        iconClass: "bg-cyan-100 text-cyan-600",
      };

    case "call_logged":
      return {
        icon: Phone,
        iconClass: "bg-green-100 text-green-600",
      };

    case "message_sent":
      return {
        icon: MessageSquare,
        iconClass: "bg-purple-100 text-purple-600",
      };

    default:
      return {
        icon: Check,
        iconClass: "bg-slate-100 text-slate-600",
      };
  }
}

// ============================================================
// DATE
// ============================================================

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

// ============================================================
// TIME
// ============================================================

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

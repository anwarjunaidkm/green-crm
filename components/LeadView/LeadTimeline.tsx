"use client";

import { Check, FilePlus2, MessageSquare } from "lucide-react";
import type { LeadUpdateHistoryItem } from "@/types/lead";

// ============================================================
// TYPES
// ============================================================

interface LeadTimelineProps {
  updateHistory?: LeadUpdateHistoryItem[];
}

// ============================================================
// COMPONENT
// ============================================================

export default function LeadTimeline({ updateHistory }: LeadTimelineProps) {
  if (!updateHistory || updateHistory.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
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
        {updateHistory.map((item, index) => (
          <UpdateHistoryItem
            key={item.id}
            item={item}
            last={index === updateHistory.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// API UPDATE HISTORY ITEM
// ============================================================

function UpdateHistoryItem({
  item,
  last,
}: {
  item: LeadUpdateHistoryItem;
  last: boolean;
}) {
  const isCreated = item.title?.toLowerCase().includes("created");
  const Icon = isCreated ? FilePlus2 : Check;
  const statusColor = item.status_color || "#3B82F6";

  return (
    <div className="relative flex gap-3">
      {/* LINE */}
      {!last && (
        <div className="absolute bottom-0 left-[16px] top-[32px] w-px bg-slate-200" />
      )}

      {/* ICON */}
      <div
        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: `${statusColor}18`,
          color: statusColor,
        }}
      >
        <Icon size={14} />
      </div>

      {/* CONTENT */}
      <div className={`min-w-0 flex-1 ${!last ? "pb-6" : "pb-1"}`}>
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold text-[#0b1d48] sm:text-[11px]">
                {item.title}
              </p>
              {item.status_name && (
                <span
                  className="rounded-full px-2 py-0.5 text-[8px] font-medium"
                  style={{
                    backgroundColor: `${statusColor}15`,
                    color: statusColor,
                    borderColor: `${statusColor}30`,
                    borderWidth: 1,
                  }}
                >
                  {item.status_name}
                </span>
              )}
            </div>

            {item.updated_by && (
              <p className="mt-0.5 text-[8px] text-slate-400">
                by {item.updated_by}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[8px] font-medium text-slate-500">
              {item.updated_date || formatDate(item.created_at || "")}
            </p>
          </div>
        </div>

        {/* REMARKS */}
        {item.remarks && (
          <div className="mt-2.5 rounded-lg border border-slate-100 bg-[#f8fafc] p-3">
            <div className="flex items-start gap-2">
              <MessageSquare
                size={12}
                className="mt-0.5 shrink-0 text-slate-400"
              />
              <p className="text-[9px] leading-[1.6] text-slate-600">
                {item.remarks}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// FORMAT DATE HELPER
// ============================================================

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

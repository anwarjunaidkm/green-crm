"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  RefreshCw,
  Trash2,
  UserRound,
  Waypoints,
  X,
} from "lucide-react";

import { useDeleteLead } from "@/hooks/useLeads";
import type {
  LeadProgressStep,
  LeadUpdateHistoryItem,
  ViewLeadData,
} from "@/types/lead";
import LeadTimeline from "@/components/LeadView/LeadTimeline";

// ============================================================
// TYPES
// ============================================================

interface LeadViewProps {
  data: ViewLeadData;
}

// ============================================================
// COMPONENT
// ============================================================

export default function LeadView({ data }: LeadViewProps) {
  const router = useRouter();
  const deleteLeadMutation = useDeleteLead();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const basic = data.basic_details;

  const id = String(basic.id);
  const leadCode = basic.lead_code || `#${id}`;
  const name = basic.customer_name || basic.name || "Lead Details";
  const phone = basic.phone || "";
  const email = basic.email || "";
  const assignedTo = basic.assigned_to || "-";
  const createdBy = basic.created_by || "";
  const source = basic.lead_channel || basic.source || "-";
  const statusName = basic.lead_status || "New";
  const statusColor = basic.lead_status_color || "#3B82F6";

  const createdAtFormatted =
    basic.created_at_formatted ||
    (basic.created_at
      ? new Date(basic.created_at).toLocaleDateString()
      : "-");

  const followUpDate =
    basic.next_follow_up_date_formatted ||
    basic.next_follow_up ||
    basic.next_follow_up_date ||
    "";

  const followUpTime =
    basic.next_follow_up_time_formatted ||
    basic.next_follow_up_time ||
    "";

  const followUpNote = basic.remarks || "";

  const leadProgress = data.lead_progress ?? [];
  const updateHistory: LeadUpdateHistoryItem[] = data.update_history ?? [];

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
              <div className="flex items-center gap-2">
                <h1 className="truncate text-[15px] font-semibold text-[#0b1d48] lg:text-[17px]">
                  Lead Details
                </h1>
                {leadCode && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600">
                    {leadCode}
                  </span>
                )}
              </div>

              <p className="mt-0.5 hidden text-[9px] text-slate-400 sm:block">
                View lead information, follow-ups and complete update history
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/lead-view/${id}/edit`}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#176b32]"
            >
              <Pencil size={14} />
              Edit
            </Link>

            <button
              type="button"
              onClick={() => {
                setDeleteError("");
                setShowDeleteModal(true);
              }}
              title="Delete Lead"
              className="flex h-9 items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 text-[11px] font-medium text-red-600 transition hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
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
              <LeadAvatar name={name} />

              {/* NAME / STATUS */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-[17px] font-semibold tracking-[-0.2px] text-[#0b1d48] lg:text-[20px]">
                    {name}
                  </h2>

                  <StatusBadge status={statusName} color={statusColor} />

                  {leadCode && (
                    <span className="text-[11px] text-slate-400">
                      • {leadCode}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-slate-500 lg:text-[10px]">
                  <span className="flex items-center gap-1">
                    <Waypoints size={12} />
                    {source}
                  </span>

                  <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                  <span>Added {createdAtFormatted}</span>
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
                href={phone ? `tel:${phone}` : undefined}
              />

              <QuickAction
                icon={MessageSquare}
                label="Message"
                href={phone ? `sms:${phone}` : undefined}
              />

              <QuickAction
                icon={MessageCircle}
                label="WhatsApp"
                href={
                  phone
                    ? `https://wa.me/${phone.replace(/\D/g, "")}`
                    : undefined
                }
              />

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

            <DynamicStatusProgress
              progress={leadProgress}
              currentStatus={statusName}
              currentStatusColor={statusColor}
            />
          </div>
        </section>

        {/* ====================================================
            MOBILE VIEW
        ==================================================== */}
        <div className="mt-4 space-y-4 lg:hidden">
          {/* LEAD INFORMATION */}
          <LeadInformation
            phone={phone}
            email={email}
            assignedTo={assignedTo}
            source={source}
            remarks={basic.remarks}
          />

          {/* NEXT FOLLOW-UP */}
          <NextFollowUp
            date={followUpDate}
            time={followUpTime}
            note={followUpNote}
            followUpDay={basic.follow_up_day}
          />

          {/* UPDATE HISTORY */}
          <LeadTimeline updateHistory={updateHistory} />

          {/* UPDATE STATUS BUTTON */}
          <Link
            href={`/lead-view/${id}/update-status`}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#176b32] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(23,107,50,0.18)] transition hover:bg-[#125727] active:scale-[0.99]"
          >
            <Pencil size={16} />
            Update Status
          </Link>
        </div>

        {/* ====================================================
            DESKTOP VIEW
        ==================================================== */}
        <div className="mt-5 hidden grid-cols-[minmax(0,1fr)_380px] items-start gap-5 lg:grid">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <LeadInformation
              phone={phone}
              email={email}
              assignedTo={assignedTo}
              source={source}
              remarks={basic.remarks}
            />

            {/* UPDATE HISTORY TIMELINE */}
            <LeadTimeline updateHistory={updateHistory} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="sticky top-5 space-y-5">
            <NextFollowUp
              date={followUpDate}
              time={followUpTime}
              note={followUpNote}
              followUpDay={basic.follow_up_day}
            />

            {/* CURRENT STATUS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.025)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    Current Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={statusName}
                      color={statusColor}
                      large
                    />
                  </div>
                </div>

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${statusColor}18`,
                    color: statusColor,
                  }}
                >
                  <Check size={18} />
                </div>
              </div>

              <Link
                href={`/lead-view/${id}/update-status`}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#176b32] text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(23,107,50,0.16)] transition hover:bg-[#125727]"
              >
                <Pencil size={14} />
                Update Status
              </Link>
            </section>

            {/* LEAD META */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-slate-400">
                Lead Information
              </p>

              <div className="mt-4 space-y-3">
                <SmallMeta label="Lead Code" value={leadCode || "-"} />
                <SmallMeta label="Created" value={createdAtFormatted} />
                {createdBy && (
                  <SmallMeta label="Created By" value={createdBy} />
                )}
                <SmallMeta label="Assigned To" value={assignedTo} />
                <SmallMeta label="Source" value={source} />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !deleteLeadMutation.isPending && setShowDeleteModal(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLeadMutation.isPending}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0b1d48]">
                  Delete Lead
                </h3>
                <p className="text-[11px] text-slate-500">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Are you sure you want to delete lead <strong className="text-[#0b1d48]">{name}</strong> ({leadCode})?
            </p>

            {deleteError && (
              <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={deleteLeadMutation.isPending}
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLeadMutation.isPending}
                onClick={async () => {
                  try {
                    setDeleteError("");
                    await deleteLeadMutation.mutateAsync(id);
                    setShowDeleteModal(false);
                    router.push("/leads");
                  } catch (err: unknown) {
                    const errorObj = err as {
                      response?: { data?: { message?: string } };
                      message?: string;
                    };
                    setDeleteError(
                      errorObj.response?.data?.message ||
                        errorObj.message ||
                        "Failed to delete lead. Please try again."
                    );
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 active:scale-[0.99] transition disabled:opacity-50"
              >
                {deleteLeadMutation.isPending ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    Delete Lead
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// LEAD INFORMATION CARD
// ============================================================

function LeadInformation({
  phone,
  email,
  assignedTo,
  source,
  remarks,
}: {
  phone: string;
  email: string;
  assignedTo: string;
  source: string;
  remarks?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.025)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[12px] font-semibold text-[#0b1d48] lg:text-[13px]">
            Lead Information
          </h3>
          <p className="mt-1 hidden text-[9px] text-slate-400 sm:block">
            Contact and lead details
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <InformationRow
          icon={Phone}
          label="Phone"
          value={phone || "-"}
          href={phone ? `tel:${phone}` : undefined}
        />

        <InformationRow
          icon={Mail}
          label="Email"
          value={email || "-"}
          href={email ? `mailto:${email}` : undefined}
        />

        <InformationRow
          icon={UserRound}
          label="Assigned To"
          value={assignedTo || "-"}
        />

        <InformationRow
          icon={Waypoints}
          label="Source / Channel"
          value={source || "-"}
        />

        {remarks && (
          <InformationRow
            icon={FileText}
            label="Remarks"
            value={remarks}
          />
        )}
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

function NextFollowUp({
  date,
  time,
  note,
  followUpDay,
}: {
  date: string;
  time: string;
  note: string;
  followUpDay?: number;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.025)]">
      <div className="border-b border-blue-100 bg-[#f6f9ff] px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between">
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

          {followUpDay !== undefined && followUpDay !== null && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-medium text-blue-700">
              {followUpDay === 0 ? "Today" : `Day ${followUpDay}`}
            </span>
          )}
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
                {formatFollowUpDate(date)}
              </p>
            </div>
          </div>

          {/* TIME */}
          <div className="flex items-center gap-2">
            <Clock3 size={14} className="text-blue-600" />
            <div>
              <p className="text-[8px] text-slate-400">Time</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[#0b1d48]">
                {formatFollowUpTime(time)}
              </p>
            </div>
          </div>
        </div>

        {/* NOTE */}
        {note && (
          <div className="mt-4 rounded-xl bg-[#f8fafc] p-3">
            <div className="flex items-start gap-2">
              <MessageSquare
                size={13}
                className="mt-0.5 shrink-0 text-slate-400"
              />
              <p className="text-[9px] leading-[1.6] text-slate-600">
                {note}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// DYNAMIC STATUS PROGRESS
// ============================================================

function DynamicStatusProgress({
  progress,
  currentStatus,
  currentStatusColor,
}: {
  progress: LeadProgressStep[];
  currentStatus: string;
  currentStatusColor: string;
}) {
  // If API returned progress steps, render them dynamically
  if (progress && progress.length > 0) {
    return (
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-[320px] items-start">
          {progress.map((step, index) => {
            const stepColor = step.color || "#3B82F6";
            const completed = step.is_completed;
            const active = step.is_current;

            return (
              <div
                key={step.status_id || index}
                className="relative flex flex-1 flex-col items-center"
              >
                {/* CONNECTING LINE */}
                {index < progress.length - 1 && (
                  <div
                    className="absolute left-1/2 top-[11px] h-[2px] w-full"
                    style={{
                      backgroundColor:
                        completed && progress[index + 1]?.is_completed
                          ? stepColor
                          : "#e2e8f0",
                    }}
                  />
                )}

                {/* CIRCLE */}
                <div
                  className="relative z-10 flex h-[23px] w-[23px] items-center justify-center rounded-full border-2 transition"
                  style={{
                    borderColor:
                      completed || active ? stepColor : "#cbd5e1",
                    backgroundColor: completed ? stepColor : "#ffffff",
                    color: completed ? "#ffffff" : stepColor,
                  }}
                >
                  {completed ? (
                    <Check size={11} strokeWidth={3} />
                  ) : (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: active ? stepColor : "#94a3b8",
                      }}
                    />
                  )}
                </div>

                {/* LABEL */}
                <p
                  className="mt-2 whitespace-nowrap text-center text-[7px] font-medium sm:text-[8px]"
                  style={{
                    color: active || completed ? stepColor : "#94a3b8",
                  }}
                >
                  {step.name}
                </p>

                {/* COMPLETED AT */}
                {step.completed_at_formatted && (
                  <p className="mt-0.5 text-center text-[6.5px] text-slate-400">
                    {step.completed_at_formatted}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If no progression chain returned, show current status cleanly
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
        style={{
          backgroundColor: `${currentStatusColor}15`,
          color: currentStatusColor,
          borderColor: `${currentStatusColor}35`,
          borderWidth: 1,
        }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: currentStatusColor }}
        />
        {currentStatus}
      </span>
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
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group flex min-w-[55px] flex-col items-center"
      >
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

function LeadAvatar({ name }: { name: string }) {
  const initial = (name || "L").charAt(0).toUpperCase();

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#dce9ff] text-[19px] font-semibold text-[#0968f7] lg:h-16 lg:w-16 lg:text-[22px]">
      {initial}
    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
  color,
  large = false,
}: {
  status: string;
  color?: string;
  large?: boolean;
}) {
  if (color) {
    return (
      <span
        className={`inline-flex items-center whitespace-nowrap rounded-full font-medium ${
          large ? "px-3 py-1.5 text-[10px]" : "px-2.5 py-1 text-[8px]"
        }`}
        style={{
          backgroundColor: `${color}18`,
          color: color,
          borderColor: `${color}35`,
          borderWidth: 1,
        }}
      >
        <span
          className="mr-1.5 h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 ${
        large ? "px-3 py-1.5 text-[10px]" : "px-2.5 py-1 text-[8px]"
      }`}
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
  if (!value) return "-";

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

function formatFollowUpTime(value: string | null | undefined) {
  if (!value) return "-";

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

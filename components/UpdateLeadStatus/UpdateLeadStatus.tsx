"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Send,
} from "lucide-react";

import { useUpdateLeadStatus } from "@/hooks/useLeads";
import type { LeadBasicDetails, LeadFilterStatusOption } from "@/types/lead";

// ============================================================
// TYPES
// ============================================================

interface UpdateLeadStatusProps {
  leadId: string;
  lead: LeadBasicDetails;
  statuses: LeadFilterStatusOption[];
}

// ============================================================
// COMPONENT
// ============================================================

export default function UpdateLeadStatus({
  leadId,
  lead,
  statuses,
}: UpdateLeadStatusProps) {
  const router = useRouter();
  const updateStatusMutation = useUpdateLeadStatus();

  // Form State
  const [selectedStatusId, setSelectedStatusId] = useState<number | string>(
    lead.lead_status_id || statuses[0]?.id || "",
  );
  const [followUpDate, setFollowUpDate] = useState<string>(
    lead.next_follow_up_date || "",
  );
  const [followUpTime, setFollowUpTime] = useState<string>(
    lead.next_follow_up_time || "",
  );
  const [remarks, setRemarks] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const isSaving = updateStatusMutation.isPending;

  // Selected Status Info
  const selectedStatus = statuses.find(
    (s) => String(s.id) === String(selectedStatusId),
  );
  const selectedStatusName =
    selectedStatus?.name ||
    selectedStatus?.status_name ||
    selectedStatus?.title ||
    "Selected Status";
  const selectedStatusColor = selectedStatus?.color || "#3B82F6";

  const currentStatusName = lead.lead_status || "Current";
  const currentStatusColor = lead.lead_status_color || "#3B82F6";
  const customerName = lead.customer_name || lead.name || "Lead";
  const leadCode = lead.lead_code || `#${leadId}`;

  // ==========================================================
  // VALIDATION & SUBMIT
  // ==========================================================

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedStatusId) {
      newErrors.lead_status_id = "Please select a status";
    }

    if (!remarks.trim()) {
      newErrors.remarks = "Remarks / note is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;
    setErrors({});

    try {
      await updateStatusMutation.mutateAsync({
        id: Number(leadId),
        lead_status_id: Number(selectedStatusId),
        next_follow_up_date: followUpDate || null,
        next_follow_up_time: followUpTime || null,
        remarks: remarks.trim(),
      });

      setIsSuccess(true);

      setTimeout(() => {
        router.push(`/lead-view/${leadId}`);
      }, 700);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
        message?: string;
      };

      const backendErrors = errorObj.response?.data?.errors;
      if (backendErrors && typeof backendErrors === "object") {
        const mappedErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(backendErrors)) {
          if (Array.isArray(msgs) && msgs.length > 0) {
            mappedErrors[key] = msgs[0];
          }
        }
        const firstMessage =
          errorObj.response?.data?.message ||
          Object.values(backendErrors).flat()[0] ||
          "Validation failed. Please verify your inputs.";
        mappedErrors.form = firstMessage;
        setErrors(mappedErrors);
      } else {
        setErrors({
          form:
            errorObj.response?.data?.message ||
            errorObj.message ||
            "Failed to update lead status. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-full bg-[#f6f8fc]">
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1100px] items-center px-4 sm:px-6 lg:h-[68px]">
          <Link
            href={`/lead-view/${leadId}`}
            aria-label="Back to lead"
            className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[15px] font-semibold text-[#0b1d48] lg:text-[17px]">
                Update Lead Status
              </h1>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600">
                {leadCode}
              </span>
            </div>

            <p className="mt-0.5 hidden text-[9px] text-slate-400 lg:block">
              Update status, follow-up information and note for {customerName}
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
        className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 lg:py-6"
      >
        {/* SUCCESS ALERT */}
        {isSuccess && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <p className="text-xs font-medium">
              Lead status updated successfully! Redirecting...
            </p>
          </div>
        )}

        {/* ERROR BANNER */}
        {errors.form && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <p className="text-xs font-medium">{errors.form}</p>
          </div>
        )}

        {/* FORM GRID */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* ==================================================
              1. STATUS SELECTION
          ================================================== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionTitle number="1" title="Select New Status" required />

            {/* CURRENT STATUS BAR */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
              <div>
                <p className="text-[9px] font-medium text-slate-400">Current Status</p>
                <p className="mt-0.5 text-[11px] font-semibold text-[#0b1d48]">
                  {customerName}
                </p>
              </div>

              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-medium"
                style={{
                  backgroundColor: `${currentStatusColor}18`,
                  color: currentStatusColor,
                  borderColor: `${currentStatusColor}35`,
                  borderWidth: 1,
                }}
              >
                <span
                  className="mr-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: currentStatusColor }}
                />
                {currentStatusName}
              </span>
            </div>

            {/* STATUS OPTIONS LIST */}
            <div className="mt-4 space-y-2">
              {statuses.map((option) => {
                const isSelected = String(option.id) === String(selectedStatusId);
                const isCurrent = String(option.id) === String(lead.lead_status_id);
                const title = option.name || option.status_name || option.title || `Status ${option.id}`;
                const color = option.color || "#3B82F6";

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSelectedStatusId(option.id);
                      if (errors.lead_status_id) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.lead_status_id;
                          return next;
                        });
                      }
                    }}
                    className={`flex min-h-[54px] w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {/* STATUS COLOR CIRCLE */}
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${color}18`,
                        color: color,
                      }}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>

                    {/* STATUS NAME */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-semibold text-[#0b1d48]">
                          {title}
                        </p>
                        {isCurrent && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-medium text-slate-500">
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CHECKMARK */}
                    {isSelected ? (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    ) : (
                      <ChevronRight size={15} className="shrink-0 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {errors.lead_status_id && (
              <p className="mt-2 text-[10px] text-red-500">
                {errors.lead_status_id}
              </p>
            )}
          </section>

          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}
          <div className="space-y-5">
            {/* ================================================
                2. FOLLOW-UP DATE & TIME
            ================================================ */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="2" title="Follow-up Date & Time" />

              <div className="mt-4 grid grid-cols-2 gap-3">
                {/* DATE */}
                <div className="min-w-0">
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
                      className="h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-[10px] font-medium text-[#0b1d48] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* TIME */}
                <div className="min-w-0">
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
                      className="h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-[10px] font-medium text-[#0b1d48] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================
                3. REMARKS / NOTE
            ================================================ */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="3" title="Remarks / Note" required />

              <div className="relative mt-4">
                <textarea
                  value={remarks}
                  maxLength={500}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    if (errors.remarks) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.remarks;
                        return next;
                      });
                    }
                  }}
                  placeholder="Contacted client. Showing interest; scheduled follow-up..."
                  className={`min-h-[120px] w-full resize-none rounded-xl border p-3 pb-8 text-[11px] leading-[1.6] text-[#0b1d48] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    errors.remarks
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />

                <span className="pointer-events-none absolute bottom-3 right-3 text-[8px] text-slate-400">
                  {remarks.length}/500
                </span>
              </div>

              {errors.remarks && (
                <p className="mt-1.5 text-[10px] text-red-500">{errors.remarks}</p>
              )}
            </section>

            {/* ================================================
                SUMMARY
            ================================================ */}
            <section className="hidden rounded-2xl border border-blue-100 bg-blue-50/50 p-4 lg:block">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <CheckCircle2 size={15} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-[#0b1d48]">
                    Update Summary
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px]">
                    <span className="text-slate-500">{currentStatusName}</span>
                    <ChevronRight size={12} className="text-slate-400" />
                    <span
                      className="font-semibold"
                      style={{ color: selectedStatusColor }}
                    >
                      {selectedStatusName}
                    </span>
                  </div>

                  <p className="mt-2 text-[9px] leading-4 text-slate-500">
                    This update will be recorded in the lead history timeline.
                  </p>
                </div>
              </div>
            </section>

            {/* ================================================
                DESKTOP SUBMIT
            ================================================ */}
            <button
              type="submit"
              disabled={isSaving || !remarks.trim()}
              className="hidden h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.18)] transition hover:bg-[#005de2] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >
              <Send size={16} />
              {isSaving ? "Updating Status..." : "Save Update"}
            </button>
          </div>
        </div>

        {/* ====================================================
            MOBILE SUBMIT
        ==================================================== */}
        <div className="mt-5 block w-full lg:hidden">
          <button
            type="submit"
            disabled={isSaving || !remarks.trim()}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.18)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            {isSaving ? "Updating Status..." : "Save Update"}
          </button>
        </div>

        <div aria-hidden="true" className="h-[24px] lg:hidden" />
      </form>
    </div>
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

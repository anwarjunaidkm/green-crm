"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Save,
  UserRound,
  Waypoints,
} from "lucide-react";

import { useUpdateLead } from "@/hooks/useLeads";
import type { LeadBasicDetails, LeadFilterChannelOption } from "@/types/lead";

// ============================================================
// TYPES
// ============================================================

interface EditLeadProps {
  lead: LeadBasicDetails;
  channels: LeadFilterChannelOption[];
}

interface LeadEditFormData {
  customer_name: string;
  phone: string;
  email: string;
  lead_channel_id: string;
  remarks: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function EditLead({ lead, channels }: EditLeadProps) {
  const router = useRouter();
  const updateLeadMutation = useUpdateLead();

  const [form, setForm] = useState<LeadEditFormData>({
    customer_name: lead.customer_name || lead.name || "",
    phone: lead.phone || "",
    email: lead.email || "",
    lead_channel_id: lead.lead_channel_id ? String(lead.lead_channel_id) : "",
    remarks: lead.remarks || "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSaving = updateLeadMutation.isPending;
  const leadId = lead.id;
  const leadCode = lead.lead_code || `#${leadId}`;

  /* -------------------------------------------------------
     CHANGE HANDLER
  ------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        delete next.form;
        return next;
      });
    }
  };

  /* -------------------------------------------------------
     VALIDATE
  ------------------------------------------------------- */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------------------------------------------
     SUBMIT
  ------------------------------------------------------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;
    setErrors({});

    try {
      await updateLeadMutation.mutateAsync({
        id: leadId,
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        lead_channel_id: form.lead_channel_id
          ? Number(form.lead_channel_id)
          : null,
        remarks: form.remarks.trim(),
        email: form.email.trim() || undefined,
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
            "Failed to update lead. Please try again.",
        });
      }
    }
  };

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */
  return (
    <div className="min-h-full bg-[#f6f8fc]">
      {/* ======================================================
          HEADER
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
                Edit Lead Details
              </h1>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600">
                {leadCode}
              </span>
            </div>

            <p className="mt-0.5 hidden text-[9px] text-slate-400 lg:block">
              Update contact details and source for this lead
            </p>
          </div>
        </div>
      </header>

      {/* ======================================================
          FORM
      ====================================================== */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 lg:py-6"
      >
        {/* SUCCESS ALERT */}
        {isSuccess && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <p className="text-xs font-medium">
              Lead updated successfully! Redirecting...
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

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ==================================================
              LEFT COLUMN — CONTACT DETAILS
          ================================================== */}
          <section className="space-y-5">
            {/* 1. CONTACT INFORMATION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="1" title="Contact Information" required />

              <div className="mt-4 space-y-4">
                <Field
                  icon={UserRound}
                  label="Customer Name"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Ahmed Ali"
                  required
                  error={errors.customer_name}
                />

                <Field
                  icon={Phone}
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +971 50 123 4567"
                  required
                  error={errors.phone}
                />

                <Field
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. ahmed@example.com"
                  error={errors.email}
                />
              </div>
            </div>
          </section>

          {/* ==================================================
              RIGHT COLUMN — CHANNEL & REMARKS
          ================================================== */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="2" title="Lead Source & Remarks" />

              <div className="mt-4 space-y-4">
                {/* CHANNEL DROPDOWN */}
                <div>
                  <label className="mb-1.5 block text-[9px] font-medium text-slate-500">
                    Lead Channel / Source
                  </label>
                  <div className="relative">
                    <Waypoints
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                    />
                    <select
                      name="lead_channel_id"
                      value={form.lead_channel_id}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[11px] font-medium text-[#0b1d48] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select Channel</option>
                      {channels.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.channel_name || ch.name || ch.title || `Channel ${ch.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* REMARKS */}
                <div>
                  <label className="mb-1.5 block text-[9px] font-medium text-slate-500">
                    Remarks / Notes
                  </label>
                  <div className="relative">
                    <textarea
                      name="remarks"
                      value={form.remarks}
                      maxLength={500}
                      onChange={handleChange}
                      placeholder="Updated contact details or requirements..."
                      className="min-h-[110px] w-full resize-none rounded-xl border border-slate-200 bg-white p-3 pb-7 text-[11px] leading-[1.6] text-[#0b1d48] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="pointer-events-none absolute bottom-2.5 right-3 text-[8px] text-slate-400">
                      {form.remarks.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DESKTOP SAVE BUTTON */}
            <button
              type="submit"
              disabled={isSaving}
              className="hidden h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#176b32] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(23,107,50,0.18)] transition hover:bg-[#125727] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* ====================================================
            MOBILE SAVE BUTTON
        ==================================================== */}
        <div className="mt-5 block w-full lg:hidden">
          <button
            type="submit"
            disabled={isSaving}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#176b32] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(23,107,50,0.18)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Mobile bottom nav clearance */}
        <div aria-hidden="true" className="h-6 lg:hidden" />
      </form>
    </div>
  );
}

// ============================================================
// TEXT FIELD COMPONENT
// ============================================================

function Field({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error,
}: {
  icon: React.ElementType;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <Icon
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
        />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-[11px] font-medium text-[#0b1d48] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />
      </div>

      {error && <p className="mt-1 text-[9px] text-red-500">{error}</p>}
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

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Sparkles,
  Tag,
  UserRound,
  Waypoints,
} from "lucide-react";

import { LEAD_STATUS, LEAD_STATUS_STYLES, type LeadStatus } from "@/config/leadConfig";
import { saveNewLead, type CreateLeadInput } from "@/lib/leadStorage";

// ============================================================
// OPTIONS
// ============================================================

const SOURCE_OPTIONS = [
  "Website",
  "Website Form",
  "Social Media",
  "Meta Ads",
  "LinkedIn",
  "Cold Call",
  "Referral",
  "Walk-in",
  "Other",
];

const STATUS_OPTIONS: LeadStatus[] = [
  LEAD_STATUS.NEW_LEAD,
  LEAD_STATUS.CONTACTED,
  LEAD_STATUS.INTERESTED,
  LEAD_STATUS.FOLLOW_UP,
  LEAD_STATUS.PROPOSAL_SENT,
  LEAD_STATUS.CLOSED_WON,
  LEAD_STATUS.NOT_INTERESTED,
];

// ============================================================
// COMPONENT
// ============================================================

export default function AddLead() {
  const router = useRouter();

  const [form, setForm] = useState<CreateLeadInput>({
    name: "",
    phone: "",
    email: "",
    company: "",
    location: "",
    source: "Website Form",
    status: LEAD_STATUS.NEW_LEAD,
    note: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateLeadInput, string>>>({});

  /* -------------------------------------------------------
     CHANGE HANDLER
  ------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof CreateLeadInput]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* -------------------------------------------------------
     VALIDATE
  ------------------------------------------------------- */
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateLeadInput, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
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
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSaving(true);

    try {
      const created = saveNewLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || "",
        company: form.company?.trim() || "",
        location: form.location?.trim() || "",
        source: form.source,
        assignedTo: "Unassigned",
        status: form.status || LEAD_STATUS.NEW_LEAD,
        note: form.note?.trim() || "",
      });

      setIsSuccess(true);

      setTimeout(() => {
        router.push(`/lead-view/${created.id}`);
      }, 700);
    } catch (err) {
      console.error("Failed to create lead:", err);
      setIsSaving(false);
    }
  };

  const initial = form.name.trim().charAt(0).toUpperCase() || "L";

  return (
    <div className="min-h-full bg-[#f6f8fc]">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between px-4 sm:px-6 lg:h-[68px]">
          <div className="flex items-center">
            <Link
              href="/leads"
              aria-label="Back to leads"
              className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-semibold text-[#0b1d48] lg:text-[17px]">
                Add New Lead
              </h1>
              <p className="mt-0.5 hidden text-[9px] text-slate-400 lg:block">
                Enter contact and business details to register a new lead
              </p>
            </div>
          </div>

          <Link
            href="/leads"
            className="text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Cancel
          </Link>
        </div>
      </header>

      {/* ======================================================
          SUCCESS ALERT
      ====================================================== */}
      <main className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 lg:py-6">
        {isSuccess && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold">Lead Added Successfully!</p>
              <p className="text-xs text-emerald-600">Redirecting to lead view...</p>
            </div>
          </div>
        )}

        {/* ======================================================
            FORM
        ====================================================== */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* ==================================================
                LEFT COLUMN — CONTACT & BUSINESS DETAILS
            ================================================== */}
            <section className="space-y-5">
              {/* 1. CONTACT INFORMATION */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionTitle number="1" title="Contact Information" required />

                <div className="mt-4 space-y-4">
                  <Field
                    icon={UserRound}
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ahmed Ali"
                    required
                    error={errors.name}
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
                    value={form.email || ""}
                    onChange={handleChange}
                    placeholder="e.g. ahmed@example.com"
                    error={errors.email}
                  />
                </div>
              </div>

              {/* 2. BUSINESS INFORMATION */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionTitle number="2" title="Business Information" />

                <div className="mt-4 space-y-4">
                  <Field
                    icon={Building2}
                    label="Company"
                    name="company"
                    value={form.company || ""}
                    onChange={handleChange}
                    placeholder="e.g. Equal Infotech"
                  />

                  <Field
                    icon={MapPin}
                    label="Location"
                    name="location"
                    value={form.location || ""}
                    onChange={handleChange}
                    placeholder="e.g. Dubai, UAE"
                  />
                </div>
              </div>

              {/* 3. INITIAL NOTE / REMARK */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionTitle number="3" title="Initial Requirement / Note" />

                <div className="mt-4">
                  <label
                    htmlFor="note"
                    className="mb-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500"
                  >
                    Requirement / Call Note (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare
                      size={14}
                      className="pointer-events-none absolute left-3 top-3 text-[#58709d]"
                    />
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      value={form.note || ""}
                      onChange={handleChange}
                      placeholder="e.g. Client inquired about Ayurvedic medicines and asked for pricing demo."
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 pt-2.5 text-[11px] font-medium text-[#0b1d48] outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ==================================================
                RIGHT COLUMN — LEAD DETAILS & ACTIONS
            ================================================== */}
            <div className="space-y-5">
              {/* 4. LEAD DETAILS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionTitle number="4" title="Lead Details" />

                <div className="mt-4 space-y-4">
                  {/* SOURCE */}
                  <SelectField
                    icon={Waypoints}
                    label="Lead Source"
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    options={SOURCE_OPTIONS}
                  />

                  {/* STATUS */}
                  <SelectField
                    icon={Tag}
                    label="Initial Status"
                    name="status"
                    value={form.status || LEAD_STATUS.NEW_LEAD}
                    onChange={handleChange}
                    options={STATUS_OPTIONS}
                  />
                </div>
              </div>

              {/* LIVE SUMMARY PREVIEW CARD */}
              <div className="rounded-2xl border border-blue-100 bg-[#f6f9ff] p-5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                  <Sparkles size={14} /> Live Lead Preview
                </div>

                <div className="mt-3.5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dce9ff] text-base font-semibold text-[#0968f7]">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0b1d48]">
                      {form.name.trim() || "New Lead"}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {form.phone.trim() || "No phone added"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-medium ${
                          LEAD_STATUS_STYLES[form.status || LEAD_STATUS.NEW_LEAD]
                        }`}
                      >
                        {form.status || LEAD_STATUS.NEW_LEAD}
                      </span>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[9px] font-medium text-slate-600 shadow-sm">
                        {form.source}
                      </span>
                    </div>
                  </div>
                </div>

                {(form.company || form.location || form.email) && (
                  <div className="mt-4 border-t border-blue-100/70 pt-3 text-[11px] text-slate-600 space-y-1">
                    {form.company && (
                      <p className="truncate">
                        Company: <strong className="text-slate-800">{form.company}</strong>
                      </p>
                    )}
                    {form.location && (
                      <p className="truncate">
                        Location: <strong className="text-slate-800">{form.location}</strong>
                      </p>
                    )}
                    {form.email && (
                      <p className="truncate">
                        Email: <strong className="text-slate-800">{form.email}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* DESKTOP SAVE BUTTON */}
              <button
                type="submit"
                disabled={isSaving || isSuccess}
                className="hidden h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.18)] transition hover:bg-[#005de2] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
              >
                <Plus size={16} />
                {isSaving ? "Saving Lead..." : "Save Lead"}
              </button>
            </div>
          </div>

          {/* ====================================================
              MOBILE SAVE BUTTON
          ==================================================== */}
          <div className="mt-5 block w-full lg:hidden">
            <button
              type="submit"
              disabled={isSaving || isSuccess}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.18)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
              {isSaving ? "Saving Lead..." : "Save Lead"}
            </button>
          </div>

          {/* Mobile bottom clearance */}
          <div aria-hidden="true" className="h-6 lg:hidden" />
        </form>
      </main>
    </div>
  );
}

// ============================================================
// TEXT FIELD
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
      <label
        htmlFor={name}
        className="mb-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <Icon
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
        />

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border pl-9 pr-3 text-[11px] font-medium text-[#0b1d48] outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:ring-2 ${
            error
              ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1 text-[9px] font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

// ============================================================
// SELECT FIELD
// ============================================================

function SelectField({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  options,
}: {
  icon: React.ElementType;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
        />

        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-[11px] font-medium text-[#0b1d48] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
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

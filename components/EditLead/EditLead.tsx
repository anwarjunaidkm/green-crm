"use client";

import { useState, type FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  Waypoints,
} from "lucide-react";

import type { LeadViewData } from "@/Containers/LeadViewContainer/LeadViewContainer";

// ============================================================
// TYPES
// ============================================================

interface EditLeadProps {
  lead: LeadViewData;
}

// Lead fields the user can edit
interface LeadEditFields {
  name: string;
  phone: string;
  email: string;
  company: string;
  location: string;
  source: string;
  assignedTo: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function EditLead({ lead }: EditLeadProps) {
  const router = useRouter();

  const [form, setForm] = useState<LeadEditFields>({
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    company: lead.company,
    location: lead.location,
    source: lead.source,
    assignedTo: lead.assignedTo,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadEditFields>>({});

  /* -------------------------------------------------------
     CHANGE HANDLER
  ------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LeadEditFields]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* -------------------------------------------------------
     VALIDATE
  ------------------------------------------------------- */
  const validate = (): boolean => {
    const newErrors: Partial<LeadEditFields> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
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
      const storageKey = `greenveda_lead_${lead.id}`;
      const existing = window.localStorage.getItem(storageKey);
      const previous = existing ? JSON.parse(existing) : {};

      const updated = {
        ...previous,
        // Store edited details separately so LeadViewContainer can merge them
        editedDetails: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          location: form.location.trim(),
          source: form.source.trim(),
          assignedTo: form.assignedTo.trim(),
        },
      };

      window.localStorage.setItem(storageKey, JSON.stringify(updated));

      router.push(`/lead-view/${lead.id}`);
    } catch (err) {
      console.error("Failed to save lead edits:", err);
      setIsSaving(false);
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
            href={`/lead-view/${lead.id}`}
            aria-label="Back to lead"
            className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold text-[#0b1d48] lg:text-[17px]">
              Edit Lead Details
            </h1>

            <p className="mt-0.5 hidden text-[9px] text-slate-400 lg:block">
              Update contact and business information
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
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ==================================================
              LEFT — CONTACT DETAILS
          ================================================== */}

          <section className="space-y-5">
            {/* CONTACT */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle
                number="1"
                title="Contact Information"
                required
              />

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
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. ahmed@example.com"
                  error={errors.email}
                />
              </div>
            </div>

            {/* BUSINESS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="2" title="Business Information" />

              <div className="mt-4 space-y-4">
                <Field
                  icon={Building2}
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Equal Infotech"
                />

                <Field
                  icon={MapPin}
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Dubai, UAE"
                />
              </div>
            </div>
          </section>

          {/* ==================================================
              RIGHT — LEAD META
          ================================================== */}

          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="3" title="Lead Details" />

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

                {/* ASSIGNED TO */}

                <SelectField
                  icon={UserRound}
                  label="Assigned To"
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  options={STAFF_OPTIONS}
                />
              </div>
            </div>

            {/* DESKTOP SAVE */}

            <button
              type="submit"
              disabled={isSaving}
              className="hidden h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.18)] transition hover:bg-[#005de2] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* ====================================================
            MOBILE SAVE

            IMPORTANT:
            - OUTSIDE GRID
            - INSIDE FORM
            - NORMAL FLOW — NO FIXED / STICKY / ABSOLUTE
        ==================================================== */}

        <div className="mt-5 block w-full lg:hidden">
          <button
            type="submit"
            disabled={isSaving}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0868f7] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(8,104,247,0.18)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
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

const STAFF_OPTIONS = [
  "Anwar",
  "Fatima",
  "Ali",
  "John",
  "Sara",
  "Omar",
];

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
  options: string[];
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
          {/* Keep current value even if not in list */}
          {!options.includes(value) && value && (
            <option value={value}>{value}</option>
          )}
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

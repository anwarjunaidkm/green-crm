"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Sparkles,
  Tag,
  UserRound,
  Waypoints,
} from "lucide-react";

import { useCreateLead, useLeadFilters } from "@/hooks/useLeads";
import type { LeadFiltersData } from "@/types/lead";

interface LeadFormData {
  customer_name: string;
  phone: string;
  email: string;
  company: string;
  location: string;
  lead_channel_id: string | number;
  lead_status_id: string | number;
  product_id: string | number;
  remarks: string;
}

const initialFormData: LeadFormData = {
  customer_name: "",
  phone: "",
  email: "",
  company: "",
  location: "",
  lead_channel_id: "",
  lead_status_id: "",
  product_id: "",
  remarks: "",
};

export default function AddLead() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState<LeadFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Fetch dynamic filter options from API (statuses, channels, products)
  const { data: filtersData, isLoading: isLoadingFilters } = useLeadFilters();
  const filters: LeadFiltersData = filtersData || {
    lead_statuses: [],
    lead_channels: [],
    products: [],
  };

  // 2. React Query mutation for creating lead
  const createLeadMutation = useCreateLead();
  const isSaving = createLeadMutation.isPending;

  // Cleanup pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Auto-set default status to "New" when lead_statuses are available and form has no status selected yet
  useEffect(() => {
    if (filtersData?.lead_statuses && filtersData.lead_statuses.length > 0) {
      setForm((prev) => {
        if (!prev.lead_status_id) {
          const newStatus =
            filtersData.lead_statuses.find((st) => {
              const name = (st.status_name || st.name || st.title || "")
                .toLowerCase()
                .trim();
              return name === "new" || name.startsWith("new");
            }) ||
            filtersData.lead_statuses.find((st) => {
              const name = (
                st.status_name ||
                st.name ||
                st.title ||
                ""
              ).toLowerCase();
              return name.includes("new");
            });

          if (newStatus) {
            return { ...prev, lead_status_id: String(newStatus.id) };
          }
        }
        return prev;
      });
    }
  }, [filtersData?.lead_statuses]);

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
     VALIDATION
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
      await createLeadMutation.mutateAsync({
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        lead_channel_id: form.lead_channel_id
          ? Number(form.lead_channel_id)
          : undefined,
        lead_status_id: form.lead_status_id
          ? Number(form.lead_status_id)
          : undefined,
        product_id: form.product_id ? Number(form.product_id) : undefined,
        remarks: form.remarks.trim() || undefined,
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        location: form.location.trim() || undefined,
      });

      setIsSuccess(true);

      timeoutRef.current = setTimeout(() => {
        router.push("/leads");
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
          "Validation failed. Please verify the input fields.";
        mappedErrors.form = firstMessage;
        setErrors(mappedErrors);
      } else {
        const errorMsg =
          errorObj.response?.data?.message ||
          errorObj.message ||
          "Failed to create lead. Please check details and try again.";
        setErrors({ form: errorMsg });
      }
    }
  };

  const initial = form.customer_name.trim().charAt(0).toUpperCase() || "L";

  // Selected names for live preview
  const selectedChannelName =
    filters.lead_channels.find(
      (c) => String(c.id) === String(form.lead_channel_id),
    )?.channel_name ||
    filters.lead_channels.find(
      (c) => String(c.id) === String(form.lead_channel_id),
    )?.name ||
    filters.lead_channels.find(
      (c) => String(c.id) === String(form.lead_channel_id),
    )?.title ||
    "";

  const selectedStatusName =
    filters.lead_statuses.find(
      (s) => String(s.id) === String(form.lead_status_id),
    )?.status_name ||
    filters.lead_statuses.find(
      (s) => String(s.id) === String(form.lead_status_id),
    )?.name ||
    filters.lead_statuses.find(
      (s) => String(s.id) === String(form.lead_status_id),
    )?.title ||
    "";

  const selectedProduct = filters.products.find(
    (p) => String(p.id) === String(form.product_id),
  );

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
                Enter contact, business, and product details to register a new
                lead
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
          MAIN CONTENT
      ====================================================== */}
      <main className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 lg:py-6">
        {/* SUCCESS ALERT */}
        {isSuccess && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold">Lead Added Successfully!</p>
              <p className="text-xs text-emerald-600">
                Redirecting to lead directory...
              </p>
            </div>
          </div>
        )}

        {/* ERROR ALERT */}
        {errors.form && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle size={20} className="shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold">Failed to save lead</p>
              <p className="text-xs text-red-600">{errors.form}</p>
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
                    label="Customer Name"
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                    error={errors.customer_name}
                  />

                  <Field
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
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
                    placeholder="Enter email address"
                    error={errors.email}
                  />
                </div>
              </div>

              {/* 2. BUSINESS INFORMATION */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionTitle
                  number="2"
                  title="Business Information (Optional)"
                />

                <div className="mt-4 space-y-4">
                  <Field
                    icon={Building2}
                    label="Company Name"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />

                  <Field
                    icon={MapPin}
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              {/* 3. PRODUCT INTEREST (OPTIONAL) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionTitle number="3" title="Product Interest (Optional)" />

                <div className="mt-4">
                  <label
                    htmlFor="product_id"
                    className="mb-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500"
                  >
                    Select Product (Optional)
                  </label>

                  <div className="relative">
                    <Package
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                    />

                    <select
                      id="product_id"
                      name="product_id"
                      value={form.product_id}
                      onChange={handleChange}
                      disabled={isLoadingFilters}
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-[11px] font-medium text-[#0b1d48] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        {isLoadingFilters
                          ? "Loading products..."
                          : filters.products.length === 0
                            ? "No products available"
                            : "Select product (Optional)"}
                      </option>
                      {filters.products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} ({prod.item_code}) - ₹{prod.selling_price}
                        </option>
                      ))}
                    </select>

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
                  {errors.product_id && (
                    <p className="mt-1 text-[9px] font-medium text-red-500">
                      {errors.product_id}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. REMARKS / NOTES */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionTitle number="4" title="Remarks / Requirement Note" />

                <div className="mt-4">
                  <label
                    htmlFor="remarks"
                    className="mb-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500"
                  >
                    Requirement / Call Remarks (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare
                      size={14}
                      className="pointer-events-none absolute left-3 top-3 text-[#58709d]"
                    />
                    <textarea
                      id="remarks"
                      name="remarks"
                      rows={3}
                      value={form.remarks}
                      onChange={handleChange}
                      placeholder="Enter remarks or requirements"
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
              {/* 5. LEAD CHANNEL & STATUS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <SectionTitle
                  number="5"
                  title="Lead Source & Status (Optional)"
                />

                <div className="mt-4 space-y-4">
                  {/* LEAD CHANNEL */}
                  <div>
                    <label
                      htmlFor="lead_channel_id"
                      className="mb-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500"
                    >
                      Lead Channel / Source (Optional)
                    </label>

                    <div className="relative">
                      <Waypoints
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                      />

                      <select
                        id="lead_channel_id"
                        name="lead_channel_id"
                        value={form.lead_channel_id}
                        onChange={handleChange}
                        disabled={isLoadingFilters}
                        className={`h-11 w-full appearance-none rounded-lg border pl-9 pr-8 text-[11px] font-medium text-[#0b1d48] outline-none transition focus:ring-2 ${
                          errors.lead_channel_id
                            ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      >
                        <option value="">
                          {isLoadingFilters
                            ? "Loading channels..."
                            : filters.lead_channels.length === 0
                              ? "No channels available"
                              : "Select lead channel (Optional)"}
                        </option>
                        {filters.lead_channels.map((ch) => (
                          <option key={ch.id} value={ch.id}>
                            {ch.channel_name || ch.name || ch.title}
                          </option>
                        ))}
                      </select>

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
                    {errors.lead_channel_id && (
                      <p className="mt-1 text-[9px] font-medium text-red-500">
                        {errors.lead_channel_id}
                      </p>
                    )}
                  </div>

                  {/* LEAD STATUS */}
                  <div>
                    <label
                      htmlFor="lead_status_id"
                      className="mb-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500"
                    >
                      Initial Lead Status (Optional)
                    </label>

                    <div className="relative">
                      <Tag
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                      />

                      <select
                        id="lead_status_id"
                        name="lead_status_id"
                        value={form.lead_status_id}
                        onChange={handleChange}
                        disabled={isLoadingFilters}
                        className={`h-11 w-full appearance-none rounded-lg border pl-9 pr-8 text-[11px] font-medium text-[#0b1d48] outline-none transition focus:ring-2 ${
                          errors.lead_status_id
                            ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      >
                        <option value="">
                          {isLoadingFilters
                            ? "Loading statuses..."
                            : filters.lead_statuses.length === 0
                              ? "No statuses available"
                              : "Select lead status (Optional)"}
                        </option>
                        {filters.lead_statuses.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.status_name || st.name || st.title}
                          </option>
                        ))}
                      </select>

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
                    {errors.lead_status_id && (
                      <p className="mt-1 text-[9px] font-medium text-red-500">
                        {errors.lead_status_id}
                      </p>
                    )}
                  </div>
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
                      {form.customer_name.trim() || "-"}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {form.phone.trim() || "-"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-medium text-blue-700">
                        {selectedStatusName}
                      </span>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[9px] font-medium text-slate-600 shadow-sm">
                        {selectedChannelName}
                      </span>
                    </div>

                    {selectedProduct && (
                      <div className="mt-2.5 rounded-lg border border-blue-200/80 bg-white p-2 text-[10px]">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {selectedProduct.name}
                        </p>
                        <p className="text-slate-400 font-mono">
                          {selectedProduct.item_code} • ₹
                          {selectedProduct.selling_price}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {(form.company || form.location || form.email) && (
                  <div className="mt-4 border-t border-blue-100/70 pt-3 text-[11px] text-slate-600 space-y-1">
                    {form.company && (
                      <p className="truncate">
                        Company:{" "}
                        <strong className="text-slate-800">
                          {form.company}
                        </strong>
                      </p>
                    )}
                    {form.location && (
                      <p className="truncate">
                        Location:{" "}
                        <strong className="text-slate-800">
                          {form.location}
                        </strong>
                      </p>
                    )}
                    {form.email && (
                      <p className="truncate">
                        Email:{" "}
                        <strong className="text-slate-800">{form.email}</strong>
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
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Saving Lead...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Save Lead
                  </>
                )}
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
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving Lead...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Save Lead
                </>
              )}
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

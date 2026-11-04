"use client";

import { startTransition, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

import {
  createStaff,
  findStaffDuplicate,
  getStaffById,
  updateStaff,
} from "@/lib/staffStorage";
import type { StaffInput } from "@/types/staff";

const ROLE_OPTIONS = ["Sales Executive", "Manager", "Staff", "Admin"];
const CUSTOM_ROLE = "__custom__";

const emptyForm: StaffInput = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  salary: undefined,
  joiningDate: "",
  designation: ROLE_OPTIONS[0],
  status: "Active",
};

export default function StaffForm({ staffId }: { staffId?: string }) {
  const router = useRouter();
  const isEditing = Boolean(staffId);
  const [form, setForm] = useState<StaffInput>(emptyForm);
  const [customRole, setCustomRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StaffInput | "form", string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If editing, load staff details into form
  useEffect(() => {
    if (!staffId) return;
    const staff = getStaffById(staffId);
    if (!staff) {
      router.replace("/staff");
      return;
    }

    startTransition(() => {
      setForm({ ...staff });
      if (!ROLE_OPTIONS.includes(staff.designation)) {
        setCustomRole(staff.designation);
      }
    });
  }, [router, staffId]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "salary" ? (value === "" ? undefined : Number(value)) : value,
    }));
    setErrors((current) => ({ ...current, [name]: "", form: "" }));
  };

  // Simplified Validation (No international phone requirement, salary optional)
  const validate = () => {
    const nextErrors: Partial<Record<keyof StaffInput | "form", string>> = {};
    const phoneDigits = form.phone.replace(/\D/g, "");
    const role =
      form.designation === CUSTOM_ROLE ? customRole.trim() : form.designation;

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }

    // 10-digit mobile number validation (no international code needed)
    if (!form.phone.trim()) {
      nextErrors.phone = "Mobile number is required";
    } else if (phoneDigits.length !== 10) {
      nextErrors.phone = "Mobile number must be 10 digits";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required";
    } else if (!form.email.includes("@")) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!isEditing && !form.password) {
      nextErrors.password = "Password is required";
    }

    if (!form.joiningDate) {
      nextErrors.joiningDate = "Joining date is required";
    }

    if (!role) {
      nextErrors.designation = "Designation is required";
    }

    // Duplicate check
    const duplicate = findStaffDuplicate(
      { ...form, designation: role, password: form.password },
      staffId
    );
    if (duplicate) {
      nextErrors.form =
        duplicate.email.toLowerCase() === form.email.trim().toLowerCase()
          ? "A staff member with this email already exists"
          : "A staff member with this mobile number already exists";
    }

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, role };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validate();
    if (!result.valid) return;

    setIsSaving(true);
    const existing = staffId ? getStaffById(staffId) : undefined;
    const input: StaffInput = {
      ...form,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password || existing?.password || "",
      salary: form.salary ? Number(form.salary) : undefined,
      designation: result.role,
    };

    if (staffId) {
      updateStaff(staffId, input);
    } else {
      createStaff(input);
    }

    setIsSuccess(true);
    window.setTimeout(() => router.push("/staff"), 600);
  };

  const roleIsCustom =
    form.designation === CUSTOM_ROLE ||
    (!ROLE_OPTIONS.includes(form.designation) && Boolean(form.designation));
  const title = isEditing ? "Edit Staff" : "Add New Staff";

  return (
    <div className="min-h-full bg-[#f7faf7]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between px-4 sm:px-6 lg:h-[68px]">
          <div className="flex items-center">
            <Link
              href="/staff"
              aria-label="Back to staff"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-[#176b32] hover:bg-green-50"
            >
              <ArrowLeft size={19} />
            </Link>
            <div>
              <h1 className="text-[15px] font-semibold text-[#16391f] lg:text-[17px]">
                {title}
              </h1>
              <p className="mt-0.5 hidden text-[9px] text-slate-400 lg:block">
                Add and manage staff access for your CRM
              </p>
            </div>
          </div>
          <Link
            href="/staff"
            className="text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Cancel
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 lg:py-6">
        {isSuccess && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <div>
              <p className="text-sm font-semibold">
                Staff {isEditing ? "updated" : "added"} successfully
              </p>
              <p className="text-xs text-emerald-600">
                Returning to staff list...
              </p>
            </div>
          </div>
        )}

        {errors.form && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
            {errors.form}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="1" title="Personal Information" required />
              <div className="mt-4 space-y-4">
                <Field
                  icon={UserRound}
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Anwar Sadath"
                  required
                  error={errors.fullName}
                />
                <Field
                  icon={Phone}
                  label="Mobile Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
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
                  placeholder="e.g. staff@greenvedha.com"
                  required
                  error={errors.email}
                />
                <Field
                  icon={ShieldCheck}
                  label={`Password${
                    isEditing ? " (leave blank to keep current)" : ""
                  }`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    isEditing
                      ? "Leave blank to keep current password"
                      : "Enter login password"
                  }
                  required={!isEditing}
                  error={errors.password}
                  trailing={
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle number="2" title="Employment Details" required />
              <div className="mt-4 space-y-4">
                <Field
                  icon={Wallet}
                  label="Monthly Salary (Optional)"
                  name="salary"
                  type="number"
                  value={form.salary !== undefined ? String(form.salary) : ""}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  error={errors.salary}
                  min="0"
                />
                <Field
                  icon={CalendarDays}
                  label="Joining Date"
                  name="joiningDate"
                  type="date"
                  value={form.joiningDate}
                  onChange={handleChange}
                  required
                  error={errors.joiningDate}
                />
                <div>
                  <label
                    htmlFor="designation"
                    className="mb-1.5 block text-[9px] font-medium text-slate-500"
                  >
                    Designation / Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BriefcaseBusiness
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                    />
                    <select
                      id="designation"
                      name="designation"
                      value={roleIsCustom ? CUSTOM_ROLE : form.designation}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] font-medium text-[#16391f] outline-none focus:border-[#176b32] focus:ring-2 focus:ring-green-100"
                    >
                      <option value="">Select role</option>
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                      <option value={CUSTOM_ROLE}>Custom role</option>
                    </select>
                  </div>
                  {roleIsCustom && (
                    <input
                      value={
                        customRole ||
                        (form.designation !== CUSTOM_ROLE
                          ? form.designation
                          : "")
                      }
                      onChange={(event) => {
                        setCustomRole(event.target.value);
                        setForm((current) => ({
                          ...current,
                          designation: CUSTOM_ROLE,
                        }));
                      }}
                      placeholder="Enter custom role"
                      className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-[11px] outline-none focus:border-[#176b32] focus:ring-2 focus:ring-green-100"
                    />
                  )}
                  {errors.designation && (
                    <p className="mt-1 text-[9px] font-medium text-red-500">
                      {errors.designation}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#fafcfa] px-3 py-3">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">
                      Account Status
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      Allow this staff member to access the CRM
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.status === "Active"}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        status:
                          current.status === "Active" ? "Inactive" : "Active",
                      }))
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      form.status === "Active" ? "bg-[#176b32]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        form.status === "Active" ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[#dceade] bg-gradient-to-br from-[#edf8ef] to-white p-5 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#588064]">
                Staff Preview
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dff1e2] text-lg font-semibold text-[#176b32]">
                  {form.fullName.trim().charAt(0).toUpperCase() || "S"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#16391f]">
                    {form.fullName.trim() || "New Staff Member"}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {form.email || "No email added"}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-[#dceade] pt-3 text-[11px] text-slate-600">
                <p>
                  Role:{" "}
                  <strong className="text-slate-800">
                    {roleIsCustom
                      ? customRole || "Custom role"
                      : form.designation || "Not selected"}
                  </strong>
                </p>
                {form.salary ? (
                  <p>
                    Salary:{" "}
                    <strong className="text-slate-800">
                      AED {Number(form.salary).toLocaleString()}
                    </strong>
                  </p>
                ) : null}
                <p>
                  Status:{" "}
                  <strong
                    className={
                      form.status === "Active"
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }
                  >
                    {form.status}
                  </strong>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || isSuccess}
              className="hidden h-[52px] w-full items-center justify-center rounded-xl bg-[#176b32] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(23,107,50,0.18)] transition hover:bg-[#125727] disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >
              {isSaving
                ? "Saving Staff..."
                : isEditing
                ? "Update Staff"
                : "Add Staff"}
            </button>
          </aside>

          <button
            type="submit"
            disabled={isSaving || isSuccess}
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#176b32] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(23,107,50,0.18)] disabled:opacity-50 lg:hidden"
          >
            {isSaving
              ? "Saving Staff..."
              : isEditing
              ? "Update Staff"
              : "Add Staff"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
  trailing,
  min,
}: {
  icon: typeof UserRound;
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  trailing?: React.ReactNode;
  min?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[9px] font-medium text-slate-500"
      >
        {label} {required && <span className="text-red-500">*</span>}
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
          min={min}
          className={`h-11 w-full rounded-lg border bg-white pl-9 ${
            trailing ? "pr-10" : "pr-3"
          } text-[11px] font-medium text-[#16391f] outline-none placeholder:font-normal placeholder:text-slate-400 focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-[#176b32] focus:ring-green-100"
          }`}
        />
        {trailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {trailing}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-[9px] font-medium text-red-500">{error}</p>}
    </div>
  );
}

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
      <span className="text-[11px] font-semibold text-[#16391f]">{number}.</span>
      <h2 className="text-[11px] font-semibold text-[#16391f]">{title}</h2>
      {required && <span className="text-red-500">*</span>}
    </div>
  );
}

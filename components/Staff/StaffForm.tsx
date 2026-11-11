"use client";

import {
  startTransition,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Hash,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  UserRound,
  Wallet,
  RefreshCw,
} from "lucide-react";

import {
  useCreateEmployee,
  useEmployeeFilters,
  useUpdateEmployee,
  useViewEmployee,
} from "@/hooks/useStaff";
import type { EmployeeFiltersData } from "@/types/staff";

interface FormFields {
  employee_name: string;
  user_name: string;
  email: string;
  phone: string;
  department: number | string;
  designation: number | string;
  role: number | string;
  status: "1" | "0";
  password: string;
  current_password?: string;
  salary: string;
  joiningDate: string;
}

const emptyForm: FormFields = {
  employee_name: "",
  user_name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  role: "",
  status: "1",
  password: "",
  current_password: "",
  salary: "",
  joiningDate: "",
};

export default function StaffForm({
  staffId: propStaffId,
}: {
  staffId?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const routeParamId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  const staffId = propStaffId || routeParamId;
  const isEditing = Boolean(staffId) || Boolean(pathname?.includes("/edit"));

  const [form, setForm] = useState<FormFields>(emptyForm);
  const [hasManuallyEditedUsername, setHasManuallyEditedUsername] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormFields | "form", string>>
  >({});
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Fetch dropdown options dynamically using React Query
  const { data: filtersData, isLoading: isLoadingFilters } =
    useEmployeeFilters();
  const filters: EmployeeFiltersData = filtersData || {
    departments: [],
    designations: [],
    roles: [],
  };

  // 2. Prefetch employee details using POST /view-employee when in edit mode
  const {
    data: employeeDetail,
    isLoading: isLoadingEmployee,
    isError: isErrorEmployee,
    error: errorEmployee,
  } = useViewEmployee(staffId);

  // 3. React Query Mutations for create & update
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const isSaving = isEditing
    ? updateEmployeeMutation.isPending
    : createEmployeeMutation.isPending;

  // 4. Prepopulate form when employee detail is fetched from API
  useEffect(() => {
    if (!employeeDetail) return;

    startTransition(() => {
      setForm({
        employee_name:
          employeeDetail.employee_name || employeeDetail.name || "",
        user_name:
          employeeDetail.user_name || employeeDetail.username || "",
        email: employeeDetail.email || "",
        phone:
          employeeDetail.phone || employeeDetail.phone_number || "",
        department: employeeDetail.department_id
          ? String(employeeDetail.department_id)
          : "",
        designation: employeeDetail.designation_id
          ? String(employeeDetail.designation_id)
          : "",
        role: employeeDetail.role_id
          ? String(employeeDetail.role_id)
          : "",
        status:
          String(employeeDetail.status) === "1" ||
          employeeDetail.status_text?.toLowerCase() === "active"
            ? "1"
            : "0",
        password: "",
        current_password: "",
        salary:
          employeeDetail.salary !== null && employeeDetail.salary !== undefined
            ? String(employeeDetail.salary)
            : "",
        joiningDate: employeeDetail.joining_date || "",
      });
      setHasManuallyEditedUsername(true);
    });
  }, [employeeDetail]);

  // Handle Input Changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-suggest username as user types employee_name if not manually edited
      if (
        name === "employee_name" &&
        !hasManuallyEditedUsername &&
        !isEditing
      ) {
        updated.user_name = value
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
      }

      return updated;
    });

    if (name === "user_name") {
      setHasManuallyEditedUsername(true);
    }

    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };

  // Form Validation
  const validate = () => {
    const nextErrors: Partial<Record<keyof FormFields | "form", string>> = {};
    const phoneDigits = form.phone.replace(/\D/g, "");

    if (!form.employee_name.trim()) {
      nextErrors.employee_name = "Employee name is required";
    }

    if (!form.user_name.trim()) {
      nextErrors.user_name = "Username is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required";
    } else if (!form.email.includes("@")) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (phoneDigits.length < 10) {
      nextErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!form.department) {
      nextErrors.department = "Please select a department";
    }

    if (!form.designation) {
      nextErrors.designation = "Please select a designation";
    }

    if (!form.role) {
      nextErrors.role = "Please select a role";
    }

    if (!isEditing && !form.password) {
      nextErrors.password = "Password is required";
    }

    if (isEditing && form.password && !form.current_password) {
      nextErrors.current_password =
        "Current password is required to change password";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Handle Form Submission using React Query Mutation
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors((prev) => ({ ...prev, form: "" }));

    try {
      const targetUpdateId = staffId || routeParamId || employeeDetail?.id;

      if (isEditing) {
        if (!targetUpdateId) {
          throw new Error("Unable to identify employee ID for update.");
        }

        // PUT /update-employee
        await updateEmployeeMutation.mutateAsync({
          id: targetUpdateId,
          employee_name: form.employee_name,
          department: Number(form.department),
          designation: Number(form.designation),
          user_name: form.user_name,
          email: form.email,
          phone: form.phone,
          role: Number(form.role),
          status: Number(form.status),
          salary: form.salary ? Number(form.salary) : null,
          joining_date: form.joiningDate || null,
          current_password: form.current_password || undefined,
          password: form.password || undefined,
        });
      } else {
        // POST /create-employee
        await createEmployeeMutation.mutateAsync({
          employee_name: form.employee_name,
          department: Number(form.department),
          designation: Number(form.designation),
          user_name: form.user_name,
          email: form.email,
          phone: form.phone,
          role: Number(form.role),
          status: form.status,
          password: form.password,
          joining_date: form.joiningDate || undefined,
          salary: form.salary ? Number(form.salary) : undefined,
        });
      }


      setIsSuccess(true);
      setTimeout(() => {
        router.push("/staff");
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
        const mappedErrors: Partial<Record<keyof FormFields | "form", string>> =
          {};
        if (backendErrors.email?.[0]) {
          mappedErrors.email = backendErrors.email[0];
        }
        if (backendErrors.phone?.[0]) {
          mappedErrors.phone = backendErrors.phone[0];
        }
        if (backendErrors.user_name?.[0]) {
          mappedErrors.user_name = backendErrors.user_name[0];
        }
        if (backendErrors.employee_name?.[0]) {
          mappedErrors.employee_name = backendErrors.employee_name[0];
        }
        if (backendErrors.department?.[0]) {
          mappedErrors.department = backendErrors.department[0];
        }
        if (backendErrors.designation?.[0]) {
          mappedErrors.designation = backendErrors.designation[0];
        }
        if (backendErrors.role?.[0]) {
          mappedErrors.role = backendErrors.role[0];
        }
        if (backendErrors.password?.[0]) {
          mappedErrors.password = backendErrors.password[0];
        }
        if (backendErrors.current_password?.[0]) {
          mappedErrors.current_password = backendErrors.current_password[0];
        }

        const firstMessage =
          errorObj.response?.data?.message ||
          Object.values(backendErrors).flat()[0] ||
          "Validation error. Please verify input fields.";
        mappedErrors.form = firstMessage;

        setErrors((prev) => ({ ...prev, ...mappedErrors }));
      } else {
        const errorMsg =
          errorObj.response?.data?.message ||
          errorObj.message ||
          (isEditing
            ? "Failed to update staff member. Please check details and try again."
            : "Failed to create staff member. Please check details and try again.");
        setErrors((prev) => ({ ...prev, form: errorMsg }));
      }
    }
  };

  const title = isEditing ? "Edit Staff" : "Add New Staff";
  const selectedDept = filters.departments.find(
    (d) => String(d.id) === String(form.department)
  )?.department_name;
  const selectedDesig = filters.designations.find(
    (d) => String(d.id) === String(form.designation)
  )?.designation_name;
  const selectedRole = filters.roles.find(
    (r) => String(r.id) === String(form.role)
  )?.display_name;

  if (isEditing && isLoadingEmployee) {
    return (
      <main className="mx-auto w-full max-w-[1100px] px-4 py-12">
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <RefreshCw size={28} className="animate-spin text-[#176b32]" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            Loading employee details...
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Fetching profile information from server.
          </p>
        </div>
      </main>
    );
  }

  if (isEditing && isErrorEmployee) {
    return (
      <main className="mx-auto w-full max-w-[1100px] px-4 py-12">
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-600">
            Failed to load employee details
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {(errorEmployee as Error)?.message ||
              "Employee not found or server error."}
          </p>
          <Link
            href="/staff"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#176b32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#125727]"
          >
            Back to Staff List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-full bg-[#f7faf7]">
      {/* Header */}
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

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 lg:py-6">
        {isSuccess && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <div>
              <p className="text-sm font-semibold">
                Staff member {isEditing ? "updated" : "created"} successfully!
              </p>
              <p className="text-xs text-emerald-600">
                Redirecting to staff list...
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
            {/* Section 1: Personal & Login Credentials */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle
                number="1"
                title="Personal & Login Information"
                required
              />
              <div className="mt-4 space-y-4">
                <Field
                  icon={UserRound}
                  label="Employee Name"
                  name="employee_name"
                  value={form.employee_name}
                  onChange={handleChange}
                  placeholder="Enter employee full name"
                  required
                  error={errors.employee_name}
                />

                <Field
                  icon={Hash}
                  label="Username"
                  name="user_name"
                  value={form.user_name}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                  error={errors.user_name}
                />

                <Field
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  error={errors.email}
                />

                <Field
                  icon={Phone}
                  label="Phone / Mobile Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone or mobile number"
                  required
                  error={errors.phone}
                />

                {isEditing && (
                  <Field
                    icon={ShieldCheck}
                    label="Current Password (Required only if changing password)"
                    name="current_password"
                    type={showPassword ? "text" : "password"}
                    value={form.current_password || ""}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    error={errors.current_password}
                  />
                )}

                <Field
                  icon={ShieldCheck}
                  label={
                    isEditing
                      ? "New Password (Leave blank to keep current)"
                      : "Password"
                  }
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    isEditing
                      ? "Enter new password"
                      : "Enter password"
                  }
                  required={!isEditing}
                  error={errors.password}
                  trailing={
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </div>
            </div>

            {/* Section 2: Department, Designation & Role */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle
                number="2"
                title="Department, Designation & Role"
                required
              />
              <div className="mt-4 space-y-4">
                {/* Department Dropdown */}
                <div>
                  <label
                    htmlFor="department"
                    className="mb-1.5 block text-[9px] font-medium text-slate-500"
                  >
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                    />
                    <select
                      id="department"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      disabled={isLoadingFilters}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] font-medium text-[#16391f] outline-none focus:border-[#176b32] focus:ring-2 focus:ring-green-100 disabled:bg-slate-50"
                    >
                      <option value="">
                        {isLoadingFilters
                          ? "Loading departments..."
                          : "Select department"}
                      </option>
                      {filters.departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <p className="mt-1 text-[9px] font-medium text-red-500">
                      {errors.department}
                    </p>
                  )}
                </div>

                {/* Designation Dropdown */}
                <div>
                  <label
                    htmlFor="designation"
                    className="mb-1.5 block text-[9px] font-medium text-slate-500"
                  >
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BriefcaseBusiness
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                    />
                    <select
                      id="designation"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      disabled={isLoadingFilters}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] font-medium text-[#16391f] outline-none focus:border-[#176b32] focus:ring-2 focus:ring-green-100 disabled:bg-slate-50"
                    >
                      <option value="">
                        {isLoadingFilters
                          ? "Loading designations..."
                          : "Select designation"}
                      </option>
                      {filters.designations.map((desig) => (
                        <option key={desig.id} value={desig.id}>
                          {desig.designation_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.designation && (
                    <p className="mt-1 text-[9px] font-medium text-red-500">
                      {errors.designation}
                    </p>
                  )}
                </div>

                {/* Role Dropdown */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-[9px] font-medium text-slate-500"
                  >
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#58709d]"
                    />
                    <select
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      disabled={isLoadingFilters}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] font-medium text-[#16391f] outline-none focus:border-[#176b32] focus:ring-2 focus:ring-green-100 disabled:bg-slate-50"
                    >
                      <option value="">
                        {isLoadingFilters
                          ? "Loading roles..."
                          : "Select role"}
                      </option>
                      {filters.roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.display_name} ({r.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-[9px] font-medium text-red-500">
                      {errors.role}
                    </p>
                  )}
                </div>

                {/* Account Status Switch */}
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#fafcfa] px-3 py-3">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">
                      Account Status
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      Allow this employee to log into the CRM
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.status === "1"}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        status: prev.status === "1" ? "0" : "1",
                      }))
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      form.status === "1" ? "bg-[#176b32]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        form.status === "1" ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Optional Salary & Joining Date */}
                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  <Field
                    icon={Wallet}
                    label="Monthly Salary (Optional)"
                    name="salary"
                    type="number"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="Enter salary"
                    min="0"
                  />
                  <Field
                    icon={CalendarDays}
                    label="Joining Date (Optional)"
                    name="joiningDate"
                    type="date"
                    value={form.joiningDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right Sidebar: Live Preview & Submit */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-[#dceade] bg-gradient-to-br from-[#edf8ef] to-white p-5 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#588064]">
                Staff Preview
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dff1e2] text-lg font-semibold text-[#176b32]">
                  {form.employee_name.trim().charAt(0).toUpperCase() || "S"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#16391f]">
                    {form.employee_name.trim() || "New Employee"}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {form.email || "No email added"}
                  </p>
                  {form.user_name && (
                    <p className="truncate text-[10px] text-slate-400">
                      @{form.user_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#dceade] pt-3 text-[11px] text-slate-600">
                <p>
                  Department:{" "}
                  <strong className="text-slate-800">
                    {selectedDept || "Not selected"}
                  </strong>
                </p>
                <p>
                  Designation:{" "}
                  <strong className="text-slate-800">
                    {selectedDesig || "Not selected"}
                  </strong>
                </p>
                <p>
                  Role:{" "}
                  <strong className="text-slate-800">
                    {selectedRole || "Not selected"}
                  </strong>
                </p>
                <p>
                  Status:{" "}
                  <strong
                    className={
                      form.status === "1"
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }
                  >
                    {form.status === "1" ? "Active" : "Inactive"}
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
                ? "Creating Staff..."
                : isEditing
                ? "Update Staff"
                : "Create Staff Member"}
            </button>
          </aside>

          <button
            type="submit"
            disabled={isSaving || isSuccess}
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#176b32] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(23,107,50,0.18)] disabled:opacity-50 lg:hidden"
          >
            {isSaving
              ? "Creating Staff..."
              : isEditing
              ? "Update Staff"
              : "Create Staff Member"}
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
      {error && (
        <p className="mt-1 text-[9px] font-medium text-red-500">{error}</p>
      )}
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
      <span className="text-[11px] font-semibold text-[#16391f]">
        {number}.
      </span>
      <h2 className="text-[11px] font-semibold text-[#16391f]">{title}</h2>
      {required && <span className="text-red-500">*</span>}
    </div>
  );
}


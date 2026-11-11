"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";

import { useDeleteEmployee, useEmployeeList } from "@/hooks/useStaff";
import type { EmployeeListItem } from "@/types/staff";

const PER_PAGE = 20;

function formatDate(date?: string | null) {
  if (!date) return "-";
  try {
    const d = new Date(date.includes("T") ? date : `${date}T00:00:00`);
    if (isNaN(d.getTime())) return date;
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return date;
  }
}

export default function StaffList() {
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch employee list via React Query (always 20 per page)
  const { data, isLoading, isFetching, isError, error, refetch } =
    useEmployeeList({
      page,
      per_page: PER_PAGE,
    });

  const deleteEmployeeMutation = useDeleteEmployee();

  const staffList: EmployeeListItem[] = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.last_page ?? 1;
  const totalRecords = pagination?.total ?? 0;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  const handleDelete = async (member: EmployeeListItem) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${member.name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(member.id);
      await deleteEmployeeMutation.mutateAsync(member.id);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete employee.";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium text-[#588064]">Team management</p>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-[#16391f]">
              Staff
            </h2>
            {pagination && (
              <span className="inline-flex items-center rounded-full bg-[#e5f2e7] px-2.5 py-0.5 text-xs font-semibold text-[#176b32]">
                {totalRecords} {totalRecords === 1 ? "member" : "members"}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Manage team members, roles, salary, and CRM access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh list"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin text-[#176b32]" : ""}
            />
          </button>
          <Link
            href="/staff/add"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#176b32] px-4 text-xs font-medium text-white transition hover:bg-[#125727] shadow-sm"
          >
            <Plus size={16} />
            Add Staff
          </Link>
        </div>
      </div>

      {/* Main Content Table Area */}
      <section className="mt-5 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,40,20,0.03)]">
        {isLoading ? (
          <StateMessage
            title="Loading staff..."
            description="Fetching team members from the server..."
            loading
          />
        ) : isError ? (
          <StateMessage
            title="Failed to load staff"
            description={
              (error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ||
              (error as Error)?.message ||
              "An unexpected error occurred while fetching staff records."
            }
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#176b32] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#125727]"
              >
                <RefreshCw size={13} />
                Try again
              </button>
            }
          />
        ) : staffList.length === 0 ? (
          <StateMessage
            title="No staff members yet"
            description="Add your first staff member to get started."
            action={
              <Link
                href="/staff/add"
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#176b32] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#125727]"
              >
                <Plus size={14} />
                Add Staff
              </Link>
            }
          />
        ) : (
          <>
            <div className="relative overflow-x-auto">
              {isFetching && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-[#e5f2e7] overflow-hidden">
                  <div className="h-full w-1/3 bg-[#176b32] animate-[indeterminate_1.5s_infinite_linear]" />
                </div>
              )}
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-slate-100 bg-[#fafcfa]">
                  <tr>
                    {[
                      "Staff member",
                      "Contact",
                      "Designation & Dept",
                      "Salary",
                      "Joining date",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffList.map((member) => {
                    const isActive =
                      String(member.status) === "1" ||
                      member.status_text?.toLowerCase() === "active";

                    return (
                      <tr
                        key={member.id}
                        className="transition hover:bg-[#fbfefb]"
                      >
                        {/* Staff Name & Role */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f2e7] text-sm font-semibold text-[#287b3a]">
                              {member.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">
                                {member.name}
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {member.role || "Staff Member"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <p className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Phone size={12} className="text-slate-400" />
                            {member.phone || member.contact || "-"}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Mail size={12} className="text-slate-400" />
                            {member.email || "-"}
                          </p>
                        </td>

                        {/* Designation & Department */}
                        <td className="px-5 py-4">
                          <p className="text-xs font-medium text-slate-700 capitalize">
                            {member.designation || "-"}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400 capitalize">
                            {member.department || "-"}
                          </p>
                        </td>

                        {/* Salary */}
                        <td className="px-5 py-4 text-xs font-medium text-slate-700">
                          {member.salary
                            ? Number(member.salary).toLocaleString()
                            : "-"}
                        </td>

                        {/* Joining Date */}
                        <td className="px-5 py-4 text-xs text-slate-600">
                          {member.joining_date_formatted ||
                            formatDate(member.joining_date)}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                          >
                            {member.status_text ||
                              (isActive ? "Active" : "Inactive")}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/staff/${member.id}/edit`}
                              aria-label={`Edit ${member.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-green-50 hover:text-[#176b32] transition"
                            >
                              <Edit3 size={15} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(member)}
                              disabled={deletingId === member.id}
                              aria-label={`Delete ${member.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-40"
                            >
                              {deletingId === member.id ? (
                                <RefreshCw
                                  size={14}
                                  className="animate-spin text-red-500"
                                />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-[#fafcfa] px-5 py-3.5 sm:flex-row">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {pagination.from ?? (totalRecords > 0 ? 1 : 0)}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {pagination.to ?? totalRecords}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {pagination.total}
                  </span>{" "}
                  employees
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || isFetching}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        return (
                          p === 1 || p === totalPages || Math.abs(p - page) <= 1
                        );
                      })
                      .map((p, idx, arr) => {
                        const showEllipsisBefore =
                          idx > 0 && p - arr[idx - 1] > 1;

                        return (
                          <div key={p} className="flex items-center gap-1">
                            {showEllipsisBefore && (
                              <span className="px-1 text-xs text-slate-400">
                                ...
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handlePageChange(p)}
                              disabled={isFetching}
                              className={`h-8 min-w-[32px] rounded-lg px-2 text-xs font-medium transition ${
                                p === page
                                  ? "bg-[#176b32] text-white shadow-sm"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {p}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages || isFetching}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function StateMessage({
  title,
  description,
  action,
  loading = false,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f3e9] text-[#237638]">
        {loading ? (
          <RefreshCw size={22} className="animate-spin text-[#176b32]" />
        ) : (
          <Users size={22} />
        )}
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-700">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-slate-400">{description}</p>
      )}
      {action}
    </div>
  );
}

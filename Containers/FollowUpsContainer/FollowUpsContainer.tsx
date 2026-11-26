"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Pencil,
  Phone,
  PhoneCall,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  UserRound,
  Users,
  UserX,
  X,
} from "lucide-react";

import { useDeleteLead, useLeadList } from "@/hooks/useLeads";
import type { LeadListItem } from "@/types/lead";

const PER_PAGE = 15;

function getInitials(name?: string): string {
  if (!name || !name.trim()) return "-";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getProductDisplay(product: any): string {
  if (!product) return "-";
  if (typeof product === "string") return product;
  if (typeof product === "object") {
    return product.name || product.item_code || "-";
  }
  return String(product);
}

const AVATAR_BG_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
];

/** Format today's date as YYYY-MM-DD */
function getCurrentDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Format today's date as a readable subtitle */
function getTodayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function FollowUpsContainer() {
  const router = useRouter();
  const deleteLeadMutation = useDeleteLead();
  const [leadToDelete, setLeadToDelete] = useState<LeadListItem | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const currentDate = getCurrentDateString();

  // Debounce search input by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch today's follow-up leads passing current date as follow_up_date
  const { data, isLoading, isFetching, isError, error, refetch } = useLeadList({
    follow_up_date: currentDate,
    page,
    per_page: PER_PAGE,
    search: debouncedSearch,
  });

  const leads: LeadListItem[] = data?.data ?? [];
  const pagination = data?.pagination;

  const totalPages = pagination?.last_page ?? 1;
  const totalRecords = pagination?.total ?? leads.length;
  const fromRecord =
    pagination?.from ?? (leads.length > 0 ? (page - 1) * PER_PAGE + 1 : 0);
  const toRecord =
    pagination?.to ??
    (leads.length > 0 ? (page - 1) * PER_PAGE + leads.length : 0);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page || isFetching)
      return;
    setPage(newPage);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(debouncedSearch);

  return (
    <div className="min-h-full bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* ====================================================
            PAGE HEADER
        ==================================================== */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] font-bold tracking-[-0.3px] text-slate-900 sm:text-[24px]">
                Follow-ups
              </h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                {totalRecords} {totalRecords === 1 ? "lead" : "leads"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{getTodayLabel()}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh follow-ups"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin text-blue-600" : ""}
              />
            </button>
          </div>
        </div>

        {/* ====================================================
            MOBILE SEARCH BAR (< lg)
        ==================================================== */}
        <div className="mb-4 lg:hidden">
          <div className="relative">
            <Search
              size={16}
              strokeWidth={2}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8090ae]"
            />
            <input
              type="text"
              placeholder="Search by name, phone, or lead code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe3ef] bg-white pl-10 pr-9 text-[11px] text-[#172554] outline-none placeholder:text-[#8090ae] focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ====================================================
            DESKTOP SEARCH BAR (lg+)
        ==================================================== */}
        <div className="mb-4 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex lg:items-center lg:justify-between">
          <div className="relative w-80">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, phone, or lead code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-95"
            >
              <X size={14} />
              Reset Filter
            </button>
          )}
        </div>

        {/* ====================================================
            ERROR STATE
        ==================================================== */}
        {isError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            <p className="font-semibold">
              Failed to load follow-ups from the server.
            </p>
            <p className="mt-0.5 text-red-600">
              {(error as { message?: string })?.message ||
                "Please verify your authorization token or network connection."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* ====================================================
            LOADING SKELETON (Initial load only)
        ==================================================== */}
        {isLoading && !data && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center justify-between border-b border-slate-100 pb-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-20 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="h-4 w-24 rounded bg-slate-100" />
                  <div className="h-6 w-20 rounded-full bg-slate-200" />
                  <div className="h-4 w-28 rounded bg-slate-100" />
                  <div className="h-8 w-16 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}
        {!isLoading && !isFetching && !isError && leads.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={28} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No follow-ups found
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {hasActiveFilters
                ? "Try adjusting your search query or clear your active filters."
                : "No leads are scheduled for follow-up today."}
            </p>
            {hasActiveFilters && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            DESKTOP TABLE VIEW (lg+)
        ==================================================== */}
        {!isError && leads.length > 0 && (
          <div
            className={`hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity duration-150 lg:block ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#fbfcfd] text-[11px] font-semibold text-slate-500">
                    <th className="px-4 py-3.5">Lead Details</th>
                    <th className="px-4 py-3.5">Phone</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Next Follow-up</th>
                    <th className="px-4 py-3.5">Source</th>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Assigned To</th>
                    <th className="px-4 py-3.5">Remarks</th>
                    <th className="w-[100px] px-4 py-3.5 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {leads.map((lead, idx) => {
                    const initials = getInitials(lead.name);
                    const avatarBg =
                      AVATAR_BG_COLORS[idx % AVATAR_BG_COLORS.length];
                    const statusColor = lead.status_color || "#3B82F6";
                    const productName = getProductDisplay(lead.product);

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => router.push(`/lead-view/${lead.id}`)}
                        className="cursor-pointer transition hover:bg-slate-50/70"
                      >
                        {/* LEAD DETAILS */}
                        <td className="px-4 py-3">
                          <div className="group flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarBg}`}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900 transition group-hover:text-blue-600">
                                {lead.name}
                              </p>
                              <span className="font-mono text-[10px] text-slate-400">
                                {lead.lead_code}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* PHONE */}
                        <td className="px-4 py-3">
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="whitespace-nowrap text-slate-600 transition hover:text-blue-600 hover:underline"
                          >
                            {lead.phone}
                          </a>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                            style={{
                              backgroundColor: `${statusColor}14`,
                              color: statusColor,
                              borderColor: `${statusColor}30`,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: statusColor }}
                            />
                            {lead.status}
                          </span>
                        </td>

                        {/* NEXT FOLLOW-UP */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 whitespace-nowrap text-slate-600">
                            <CalendarDays size={13} className="text-blue-500" />
                            <span>{lead.next_follow_up || "-"}</span>
                          </div>
                          {lead.follow_up_day !== undefined && (
                            <span className="text-[10px] text-slate-400">
                              Day {lead.follow_up_day}
                            </span>
                          )}
                        </td>

                        {/* SOURCE */}
                        <td className="px-4 py-3">
                          <span className="inline-block whitespace-nowrap rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {lead.source || "-"}
                          </span>
                        </td>

                        {/* PRODUCT */}
                        <td className="px-4 py-3 text-slate-600">
                          <span
                            className="line-clamp-1 max-w-[130px]"
                            title={productName}
                          >
                            {productName}
                          </span>
                        </td>

                        {/* ASSIGNED TO */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 whitespace-nowrap text-slate-700">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                              {getInitials(lead.assigned_to)}
                            </div>
                            <span className="text-xs">
                              {lead.assigned_to || "-"}
                            </span>
                          </div>
                        </td>

                        {/* REMARKS */}
                        <td className="px-4 py-3 text-slate-500">
                          <p
                            className="line-clamp-2 max-w-[180px] text-[11px]"
                            title={lead.remarks || ""}
                          >
                            {lead.remarks || "-"}
                          </p>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link
                              href={`/lead-view/${lead.id}/edit`}
                              onClick={(e) => e.stopPropagation()}
                              title="Edit Lead"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#176b32]/40 hover:bg-green-50 hover:text-[#176b32]"
                            >
                              <Pencil size={13} />
                            </Link>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteError("");
                                setLeadToDelete(lead);
                              }}
                              title="Delete Lead"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* DESKTOP PAGINATION */}
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3.5">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold">{fromRecord}</span> –{" "}
                <span className="font-semibold">{toRecord}</span> of{" "}
                <span className="font-semibold">{totalRecords}</span> leads
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isFetching}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const showEllipsis = prevP && p - prevP > 1;

                    return (
                      <div key={p} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-1 text-xs text-slate-400">
                            ...
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handlePageChange(p)}
                          disabled={isFetching}
                          className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                            p === page
                              ? "bg-blue-600 text-white shadow-sm"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    );
                  })}

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isFetching}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            MOBILE CARDS VIEW (< lg)
        ==================================================== */}
        {!isError && leads.length > 0 && (
          <div
            className={`space-y-3 transition-opacity duration-150 lg:hidden ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              {leads.map((lead, idx) => {
                const initials = getInitials(lead.name);
                const avatarBg =
                  AVATAR_BG_COLORS[idx % AVATAR_BG_COLORS.length];
                const statusColor = lead.status_color || "#3B82F6";

                return (
                  <div
                    key={lead.id}
                    className="relative border-b border-slate-100 bg-white last:border-b-0"
                  >
                    {/* CLICKABLE ROW TO VIEW DETAILS */}
                    <Link
                      href={`/lead-view/${lead.id}`}
                      className="block px-3 py-3 pr-[76px] transition hover:bg-slate-50 active:bg-slate-50"
                    >
                      <div className="grid grid-cols-[40px_minmax(85px,0.9fr)_minmax(110px,1.25fr)] items-start gap-2">
                        {/* AVATAR */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarBg}`}
                        >
                          {initials}
                        </div>

                        {/* NAME / PHONE / SOURCE */}
                        <div className="min-w-0 pt-0.5">
                          <h3 className="truncate text-[10px] font-semibold leading-tight text-[#081b4b]">
                            {lead.name}
                          </h3>

                          <p className="mt-1 truncate text-[8px] font-medium text-[#58709d]">
                            {lead.phone}
                          </p>

                          <div className="mt-1.5 flex min-w-0 items-center gap-1 text-[8px] text-[#65799f]">
                            <Building2
                              size={10}
                              strokeWidth={2}
                              className="shrink-0"
                            />
                            <span className="truncate">
                              {lead.source || "-"}
                            </span>
                          </div>
                        </div>

                        {/* STATUS / FOLLOW-UP / REMARKS */}
                        <div className="min-w-0">
                          <span
                            className="inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[8px] font-medium"
                            style={{
                              backgroundColor: `${statusColor}14`,
                              color: statusColor,
                              borderColor: `${statusColor}30`,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: statusColor }}
                            />
                            <span className="truncate">{lead.status}</span>
                          </span>

                          <div className="mt-1.5 flex items-center gap-1">
                            <CalendarDays
                              size={11}
                              strokeWidth={2.3}
                              className="shrink-0 text-[#0968f7]"
                            />
                            <p className="truncate text-[8px] font-medium text-[#58709d]">
                              {lead.next_follow_up || "-"}
                            </p>
                          </div>

                          {lead.remarks && (
                            <p className="mt-1.5 line-clamp-2 text-[8px] leading-[1.35] text-[#58709d]">
                              {lead.remarks}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* MOBILE ACTIONS: CALL, SMS & DELETE */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <a
                        href={`tel:${lead.phone}`}
                        aria-label={`Call ${lead.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dce8fb] bg-[#f2f7ff] text-[#0066f5] transition hover:bg-blue-100 active:scale-95"
                      >
                        <Phone size={12} />
                      </a>

                      <a
                        href={`sms:${lead.phone}`}
                        aria-label={`Message ${lead.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dce8fb] bg-[#f2f7ff] text-[#0066f5] transition hover:bg-blue-100 active:scale-95"
                      >
                        <MessageSquare size={12} />
                      </a>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteError("");
                          setLeadToDelete(lead);
                        }}
                        aria-label={`Delete ${lead.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 active:scale-95"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* VIEW ARROW */}
                    <Link
                      href={`/lead-view/${lead.id}`}
                      aria-label={`Open ${lead.name}`}
                      className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[#8090ae] transition hover:bg-slate-100"
                    >
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* MOBILE COUNT & PAGINATION */}
            <div className="flex items-center justify-between px-1 text-[10px] text-slate-500">
              <p>
                Showing {fromRecord}–{toRecord} of {totalRecords} leads
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isFetching}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="font-semibold text-slate-700">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isFetching}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          DELETE CONFIRMATION MODAL
      ==================================================== */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() =>
              !deleteLeadMutation.isPending && setLeadToDelete(null)
            }
          />

          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setLeadToDelete(null)}
              disabled={deleteLeadMutation.isPending}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
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
              Are you sure you want to delete lead{" "}
              <strong className="text-[#0b1d48]">{leadToDelete.name}</strong> (
              {leadToDelete.lead_code})?
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
                onClick={() => setLeadToDelete(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLeadMutation.isPending}
                onClick={async () => {
                  try {
                    setDeleteError("");
                    await deleteLeadMutation.mutateAsync(leadToDelete.id);
                    setLeadToDelete(null);
                  } catch (err: unknown) {
                    const errorObj = err as {
                      response?: { data?: { message?: string } };
                      message?: string;
                    };
                    setDeleteError(
                      errorObj.response?.data?.message ||
                        errorObj.message ||
                        "Failed to delete lead. Please try again.",
                    );
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-50"
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Pencil,
  Phone,
  PhoneCall,
  Plus,
  RefreshCw,
  Search,
  Tag,
  UserRound,
  Users,
  UserX,
  X,
} from "lucide-react";

import { useLeadList } from "@/hooks/useLeads";
import type { LeadListItem, LeadStatusCard } from "@/types/lead";

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

function getStatusIcon(slug?: string) {
  switch (slug) {
    case "new":
      return UserRound;
    case "contacted":
      return Phone;
    case "interested":
      return Users;
    case "follow_up":
      return CalendarDays;
    case "call_back":
      return PhoneCall;
    case "order_confirmed":
      return CheckCircle2;
    case "not_interested":
    case "lost":
    case "invalid":
      return UserX;
    case "dormant":
    case "no_response":
      return Clock;
    default:
      return Tag;
  }
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

export default function LeadContainer() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState<string | number>("");

  // 1. Debounce search input by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // 2. Fetch lead list from API via React Query
  // Exactly matching params: ?search=&lead_status_id=&page=1&per_page=15
  const { data, isLoading, isFetching, isError, error, refetch } = useLeadList({
    page,
    per_page: PER_PAGE,
    search: debouncedSearch,
    lead_status_id: selectedStatusId,
  });

  const leads: LeadListItem[] = data?.data ?? [];
  const pagination = data?.pagination;
  const summary = data?.summary ?? {
    total_leads: 0,
    status_cards: [],
  };

  const totalPages = pagination?.last_page ?? 1;
  const totalRecords = pagination?.total ?? 0;
  const fromRecord =
    pagination?.from ??
    (leads.length > 0 ? (page - 1) * PER_PAGE + 1 : 0);
  const toRecord =
    pagination?.to ??
    (leads.length > 0 ? (page - 1) * PER_PAGE + leads.length : 0);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page || isFetching) return;
    setPage(newPage);
  };

  // Toggle status filter
  const handleStatusChange = (statusId: number | string) => {
    if (String(selectedStatusId) === String(statusId)) {
      setSelectedStatusId(""); // Toggle off to show all
    } else {
      setSelectedStatusId(statusId);
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedStatusId("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(debouncedSearch) || Boolean(selectedStatusId);

  // Active status card name if any
  const activeStatusCard = summary.status_cards.find(
    (card) => String(card.status_id) === String(selectedStatusId)
  );

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
                Leads
              </h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                {summary.total_leads} {summary.total_leads === 1 ? "lead" : "leads"}
              </span>
              {activeStatusCard && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    backgroundColor: `${activeStatusCard.color}18`,
                    color: activeStatusCard.color,
                  }}
                >
                  Filtered: {activeStatusCard.name}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Manage and track all your leads across your sales pipeline
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh lead list"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin text-blue-600" : ""}
              />
            </button>

            <Link
              href="/leads/add"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
            >
              <Plus size={16} />
              Add Lead
            </Link>
          </div>
        </div>

        {/* ====================================================
            DESKTOP STATUS FILTER (SUMMARY CARDS STYLE)
            Shown on lg+ screens: multi-card grid with icons & counts
        ==================================================== */}
        <div className="mb-5 hidden lg:block">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
            {/* ALL LEADS CARD */}
            <button
              type="button"
              onClick={() => handleStatusChange("")}
              className={`flex items-start gap-3 rounded-xl border bg-white p-3.5 text-left transition ${
                selectedStatusId === ""
                  ? "border-blue-600 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                  selectedStatusId === ""
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <UserRound size={16} />
              </div>

              <div className="min-w-0">
                <p className="text-lg font-bold leading-none text-slate-800">
                  {summary.total_leads}
                </p>
                <p
                  className={`mt-2 truncate text-[11px] font-semibold ${
                    selectedStatusId === "" ? "text-blue-600" : "text-slate-500"
                  }`}
                >
                  All Leads
                </p>
              </div>
            </button>

            {/* DYNAMIC STATUS CARDS FROM API SUMMARY */}
            {summary.status_cards.map((card: LeadStatusCard) => {
              const isActive = String(selectedStatusId) === String(card.status_id);
              const Icon = getStatusIcon(card.slug);

              return (
                <button
                  key={card.status_id}
                  type="button"
                  onClick={() => handleStatusChange(card.status_id)}
                  className={`flex items-start gap-3 rounded-xl border bg-white p-3.5 text-left transition ${
                    isActive
                      ? "border-blue-600 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition"
                    style={{
                      backgroundColor: `${card.color}20`,
                      color: card.color,
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-none text-slate-800">
                      {card.count}
                    </p>
                    <p
                      className={`mt-2 truncate text-[11px] font-semibold ${
                        isActive ? "text-blue-600" : "text-slate-500"
                      }`}
                    >
                      {card.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            MOBILE VIEW STATUS FILTER (HORIZONTAL TABS STYLE)
            Shown on < lg screens: smooth scrollable pill tabs
        ==================================================== */}
        <div className="mb-4 lg:hidden">
          {/* HORIZONTAL STATUS TABS */}
          <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2 py-0.5">
              <MobileTab
                label="All"
                count={summary.total_leads}
                active={selectedStatusId === ""}
                onClick={() => handleStatusChange("")}
              />
              {summary.status_cards.map((card) => (
                <MobileTab
                  key={card.status_id}
                  label={card.name}
                  count={card.count}
                  active={String(selectedStatusId) === String(card.status_id)}
                  hexColor={card.color}
                  onClick={() => handleStatusChange(card.status_id)}
                />
              ))}
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          <div className="relative mt-3">
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
                onClick={() => {
                  setSearchInput("");
                  setDebouncedSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ====================================================
            DESKTOP SEARCH BAR
            Shown on lg+ screens
        ==================================================== */}
        <div className="mb-4 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex lg:items-center lg:justify-between">
          {/* SEARCH INPUT */}
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
                onClick={() => {
                  setSearchInput("");
                  setDebouncedSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* ACTIVE FILTER RESET BUTTON */}
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
            <p className="font-semibold">Failed to load leads from the server.</p>
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
            LOADING SKELETON
        ==================================================== */}
        {isLoading && (
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
        {!isLoading && !isError && leads.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserRound size={28} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No leads found
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {hasActiveFilters
                ? "Try adjusting your search query or clear your active filters."
                : "No leads currently available. Click Add Lead to register a new one."}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              )}
              <Link
                href="/leads/add"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Add New Lead
              </Link>
            </div>
          </div>
        )}

        {/* ====================================================
            DESKTOP TABLE VIEW
        ==================================================== */}
        {!isLoading && !isError && leads.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
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
                    <th className="w-[100px] px-4 py-3.5 text-center">Actions</th>
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
                        {/* LEAD DETAILS (NAME & CODE) */}
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
                          <span className="line-clamp-1 max-w-[130px]" title={productName}>
                            {productName}
                          </span>
                        </td>

                        {/* ASSIGNED TO */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 whitespace-nowrap text-slate-700">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                              {getInitials(lead.assigned_to)}
                            </div>
                            <span className="text-xs">{lead.assigned_to || "-"}</span>
                          </div>
                        </td>

                        {/* REMARKS */}
                        <td className="px-4 py-3 text-slate-500">
                          <p className="line-clamp-2 max-w-[180px] text-[11px]" title={lead.remarks || ""}>
                            {lead.remarks || "-"}
                          </p>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <Link
                              href={`/lead-view/${lead.id}/edit`}
                              onClick={(e) => e.stopPropagation()}
                              title="Edit Lead"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil size={13} />
                            </Link>
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
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const showEllipsis = prevP && p - prevP > 1;

                    return (
                      <div key={p} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-1 text-xs text-slate-400">...</span>
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
            MOBILE CARDS VIEW
            Shown on < lg screens: original mobile layout matching LeadTable
        ==================================================== */}
        {!isLoading && !isError && leads.length > 0 && (
          <div className="space-y-3 lg:hidden">
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              {leads.map((lead, idx) => {
                const initials = getInitials(lead.name);
                const avatarBg = AVATAR_BG_COLORS[idx % AVATAR_BG_COLORS.length];
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
                            <Building2 size={10} strokeWidth={2} className="shrink-0" />
                            <span className="truncate">{lead.source || "-"}</span>
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

                    {/* MOBILE ACTIONS: CALL & SMS (OUTSIDE LINK) */}
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
    </div>
  );
}

// ============================================================
// MOBILE STATUS TAB COMPONENT
// Matching the exact mobile status tab style from LeadTable
// ============================================================

function MobileTab({
  label,
  count,
  active = false,
  hexColor,
  onClick,
}: {
  label: string;
  count: number;
  active?: boolean;
  hexColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-10 items-center gap-2 rounded-xl border px-3 text-[10px] font-medium transition ${
        active
          ? "border-blue-100 bg-[#f5f8ff] text-[#06245c]"
          : "border-slate-100 bg-white text-[#162a55] hover:bg-slate-50"
      }`}
    >
      <span>{label}</span>

      <span
        className="flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
        style={
          hexColor
            ? {
                backgroundColor: `${hexColor}18`,
                color: hexColor,
              }
            : {
                backgroundColor: "#f1f5f9",
                color: "#475569",
              }
        }
      >
        {count}
      </span>

      {active && (
        <span
          className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
          style={{ backgroundColor: hexColor || "#1769f6" }}
        />
      )}
    </button>
  );
}

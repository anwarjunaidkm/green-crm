"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

import EditLead from "@/components/EditLead/EditLead";
import { useLeadFilters, useViewLead } from "@/hooks/useLeads";

// ============================================================
// TYPES
// ============================================================

interface EditLeadContainerProps {
  leadId: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function EditLeadContainer({
  leadId,
}: EditLeadContainerProps) {
  const {
    data: viewData,
    isLoading: isLoadingLead,
    isError: isLeadError,
    error: leadError,
    refetch: refetchLead,
  } = useViewLead(leadId);

  const {
    data: filtersData,
    isLoading: isLoadingFilters,
    isError: isFiltersError,
    refetch: refetchFilters,
  } = useLeadFilters();

  const isLoading = isLoadingLead || isLoadingFilters;
  const isError = isLeadError || isFiltersError || !viewData?.data?.basic_details;

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-full bg-[#f6f8fc] pb-8 animate-pulse">
        {/* Header Skeleton */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[60px] max-w-[1100px] items-center px-4 sm:px-6 lg:h-[68px]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-100" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-2.5 w-48 rounded bg-slate-100 hidden lg:block" />
              </div>
            </div>
          </div>
        </header>

        {/* Form Skeleton */}
        <main className="mx-auto max-w-[1100px] px-4 py-5 sm:px-6 lg:py-6">
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left Column Skeleton */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="h-4 w-36 rounded bg-slate-200" />
                <div className="h-11 w-full rounded-xl bg-slate-100" />
                <div className="h-11 w-full rounded-xl bg-slate-100" />
                <div className="h-11 w-full rounded-xl bg-slate-100" />
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="h-11 w-full rounded-xl bg-slate-100" />
                <div className="h-24 w-full rounded-xl bg-slate-100" />
              </div>
              <div className="h-12 w-full rounded-xl bg-slate-200 hidden lg:block" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    const errorMessage =
      (leadError as Error)?.message ||
      viewData?.message ||
      "Failed to load lead details. Please try again.";

    return (
      <div className="min-h-full bg-[#f6f8fc] pb-8">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[60px] max-w-[1100px] items-center px-4 sm:px-6">
            <Link
              href={`/lead-view/${leadId}`}
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-[15px] font-semibold text-[#0b1d48]">
              Edit Lead Details
            </h1>
          </div>
        </header>

        <main className="mx-auto max-w-[500px] px-4 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Unable to Load Lead
          </h2>
          <p className="mt-1 text-xs text-slate-500">{errorMessage}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                refetchLead();
                refetchFilters();
              }}
              className="flex items-center gap-2 rounded-xl bg-[#176b32] px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#125727] transition"
            >
              <RefreshCw size={14} />
              Retry
            </button>
            <Link
              href={`/lead-view/${leadId}`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Back to Lead
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <EditLead
      lead={viewData.data.basic_details}
      channels={filtersData?.lead_channels ?? []}
    />
  );
}

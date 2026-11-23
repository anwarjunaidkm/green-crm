"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

import LeadView from "@/components/LeadView/LeadView";
import { useViewLead } from "@/hooks/useLeads";
import type { LeadTimelineItem } from "@/types/lead";
import type { LeadStatus } from "@/config/leadConfig";

// ============================================================
// TYPES
// ============================================================

interface LeadViewContainerProps {
  leadId: string;
}

// Keep export for backward compatibility with EditLeadContainer / leadStorage
export interface LeadViewData {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  company: string;
  location: string;
  assignedTo: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  createdTime: string;
  followUpDate: string;
  followUpTime: string;
  followUpNote: string;
  timeline: LeadTimelineItem[];
}

// ============================================================
// COMPONENT
// ============================================================

export default function LeadViewContainer({ leadId }: LeadViewContainerProps) {
  const { data, isLoading, isError, error, refetch } = useViewLead(leadId);

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-full bg-[#f6f8fc] pb-8 animate-pulse">
        {/* Header Skeleton */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:h-[68px]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-100" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="h-2.5 w-44 rounded bg-slate-100 hidden sm:block" />
              </div>
            </div>
            <div className="h-9 w-20 rounded-xl bg-slate-100" />
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:py-6 space-y-5">
          {/* Profile Card Skeleton */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 rounded bg-slate-200" />
                <div className="h-3 w-64 rounded bg-slate-100" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-3 border-t border-slate-100 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-slate-100" />
                  <div className="h-2 w-10 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Grid Layout Skeleton */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-5">
              <div className="h-64 rounded-2xl border border-slate-200 bg-white p-5" />
              <div className="h-48 rounded-2xl border border-slate-200 bg-white p-5" />
            </div>
            <div className="space-y-5">
              <div className="h-44 rounded-2xl border border-slate-200 bg-white p-5" />
              <div className="h-40 rounded-2xl border border-slate-200 bg-white p-5" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. Error State
  if (isError || !data?.status || !data?.data) {
    const errorMessage =
      (error as Error)?.message ||
      data?.message ||
      "Failed to load lead details. Please try again.";

    return (
      <div className="min-h-full bg-[#f6f8fc] pb-8">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[60px] max-w-[1200px] items-center px-4 sm:px-6">
            <Link
              href="/leads"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl text-blue-600 hover:bg-blue-50 transition"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-[15px] font-semibold text-[#0b1d48]">Lead Details</h1>
          </div>
        </header>

        <main className="mx-auto max-w-[600px] px-4 py-16 text-center">
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
              onClick={() => refetch()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition"
            >
              <RefreshCw size={14} />
              Retry
            </button>
            <Link
              href="/leads"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Back to Leads
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 3. Render Lead View with dynamic API response
  return <LeadView data={data.data} />;
}

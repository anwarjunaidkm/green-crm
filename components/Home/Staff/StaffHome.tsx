"use client";

import type { ElementType } from "react";
import Link from "next/link";

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Phone,
  Plus,
  Target,
  Users,
} from "lucide-react";

import { useLeadList } from "@/hooks/useLeads";
import type { LeadListItem } from "@/types/lead";
import type { User } from "@/types/auth";

interface StaffHomeProps {
  user: User;
}

const stats = [
  {
    label: "New Leads",
    value: "12",
    today: "+2 today",
    icon: Users,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    label: "Follow-ups",
    value: "8",
    today: "+1 today",
    icon: Phone,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Confirmed",
    value: "6",
    today: "+1 today",
    icon: CheckCircle2,
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    label: "Closed",
    value: "4",
    today: "+0 today",
    icon: Target,
    iconClass: "bg-orange-100 text-orange-600",
  },
];

function getCurrentDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const leadStatus = [
  {
    label: "New Leads",
    value: 12,
    percentage: 75,
  },
  {
    label: "Follow-ups",
    value: 8,
    percentage: 55,
  },
  {
    label: "Confirmed",
    value: 6,
    percentage: 40,
  },
  {
    label: "Closed",
    value: 4,
    percentage: 25,
  },
];

export default function StaffHome({ user }: StaffHomeProps) {
  const currentDate = getCurrentDateString();
  const { data: followUpsData, isLoading: isFollowUpsLoading } = useLeadList({
    follow_up_date: currentDate,
    per_page: 4,
  });

  const todayFollowUps: LeadListItem[] = followUpsData?.data?.slice(0, 4) ?? [];
  const totalFollowUps =
    followUpsData?.pagination?.total ?? followUpsData?.data?.length ?? 0;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      {/* ================= WELCOME ================= */}

      <section className="relative overflow-hidden rounded-[22px] border border-[#dceade] bg-gradient-to-r from-[#edf8ef] via-[#f4faf5] to-white p-5 sm:p-6 lg:p-7">
        <div className="relative z-10">
          <p className="text-xs font-medium text-[#588064]">
            Good morning, {user.name} 👋
          </p>

          <h2 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.5px] text-[#173820] sm:text-[28px] lg:text-[32px]">
            Stay on top of your leads
          </h2>

          <p className="mt-2 text-xs leading-5 text-[#718b77] sm:text-sm">
            Track your leads, follow up on time and close more deals.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 hidden h-[120px] w-[120px] -translate-y-1/2 items-center justify-center rounded-full bg-[#dcefe0] md:flex">
          <Target size={55} strokeWidth={1.5} className="text-[#338546]" />
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:mt-5 lg:gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-[18px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,40,20,0.03)] sm:p-5"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
              >
                <Icon size={19} />
              </div>

              <p className="mt-4 text-[11px] font-medium text-slate-500 sm:text-xs">
                {item.label}
              </p>

              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-[25px] font-semibold leading-none text-[#173820]">
                  {item.value}
                </p>

                <span className="text-[9px] font-medium text-emerald-600 sm:text-[10px]">
                  {item.today}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* ================= QUICK ACTIONS ================= */}

      <section className="mt-4 grid grid-cols-4 gap-2 sm:gap-3 lg:mt-5">
        <QuickAction icon={Plus} title="Add Lead" href="/leads/add" />

        <QuickAction icon={Phone} title="Log Call" />

        <QuickAction icon={CalendarDays} title="Follow-up" href="/leads/follow-ups" />

        <QuickAction icon={Users} title="View Leads" href="/leads" />
      </section>

      {/* ================= MAIN GRID ================= */}

      <section className="mt-4 grid grid-cols-1 gap-4 lg:mt-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] xl:gap-5">
        {/* FOLLOW UPS */}

        <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,40,20,0.03)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f2e7] text-[#287b3a]">
                <CalendarDays size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Today&apos;s Follow-ups
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  {isFollowUpsLoading
                    ? "Loading follow-ups..."
                    : `${totalFollowUps} follow-up${totalFollowUps !== 1 ? "s" : ""} scheduled`}
                </p>
              </div>
            </div>

            <Link
              href="/leads/follow-ups"
              className="flex items-center gap-1 text-[10px] font-medium text-[#237738] transition hover:underline"
            >
              View All
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="px-4 sm:px-5">
            {isFollowUpsLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex animate-pulse items-center gap-3 py-2"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-28 rounded bg-slate-100" />
                      <div className="h-2.5 w-16 rounded bg-slate-100" />
                    </div>
                    <div className="h-3 w-12 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : todayFollowUps.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No follow-ups scheduled for today
              </div>
            ) : (
              todayFollowUps.map((item) => (
                <FollowUpItem key={item.id} lead={item} />
              ))
            )}
          </div>
        </div>

        {/* LEAD STATUS */}

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,40,20,0.03)] sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold">My Lead Status</h3>

              <p className="mt-1 text-[10px] text-slate-400">
                Current lead overview
              </p>
            </div>

            <button
              type="button"
              className="text-[10px] font-medium text-[#237738]"
            >
              Details
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {leadStatus.map((item) => (
              <LeadStatus key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  href,
}: {
  icon: ElementType;
  title: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f3e9] text-[#237638]">
        <Icon size={18} />
      </div>

      <span className="text-center text-[9px] font-medium text-slate-700 sm:text-[11px]">
        {title}
      </span>
    </>
  );

  const className = "flex min-h-[85px] flex-col items-center justify-center gap-2 rounded-[16px] border border-slate-200/80 bg-white px-1 transition hover:border-green-200 hover:bg-green-50/40 sm:min-h-[90px]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
}

function FollowUpItem({ lead }: { lead: LeadListItem }) {
  const initials = lead.name
    ? lead.name.trim().split(/\s+/).length >= 2
      ? `${lead.name.trim().split(/\s+/)[0][0]}${lead.name.trim().split(/\s+/)[1][0]}`.toUpperCase()
      : lead.name.slice(0, 2).toUpperCase()
    : "?";

  const statusColor = lead.status_color || "#3B82F6";

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-3.5 last:border-0">
      <Link
        href={`/lead-view/${lead.id}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: statusColor }}
      >
        {initials}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/lead-view/${lead.id}`}
          className="truncate text-xs font-semibold text-slate-900 transition hover:text-[#176b32]"
        >
          {lead.name}
        </Link>

        <div className="mt-1 flex items-center gap-2">
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="text-[10px] text-slate-400 transition hover:text-[#176b32]"
            >
              {lead.phone}
            </a>
          )}
          {lead.status && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
              style={{
                backgroundColor: `${statusColor}18`,
                color: statusColor,
              }}
            >
              {lead.status}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
          <Clock3 size={12} className="text-slate-400" />
          <span>{lead.next_follow_up || "-"}</span>
        </div>

        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            aria-label={`Call ${lead.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5f2e7] text-[#287b3a] transition hover:bg-[#287b3a] hover:text-white"
          >
            <Phone size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

function LeadStatus({
  label,
  value,
  percentage,
}: {
  label: string;
  value: number;
  percentage: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">{label}</span>

        <span className="text-xs font-semibold text-slate-900">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#32924a]"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

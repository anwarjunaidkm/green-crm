"use client";

import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Phone,
  Plus,
  Target,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import type { User } from "@/types/auth";

interface SuperAdminHomeProps {
  user: User;
}

// ============================================================
// DATA
// ============================================================

const stats = [
  {
    title: "Total Leads",
    value: 248,
    today: 14,
    icon: Users,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Staff",
    value: 12,
    today: 1,
    icon: CircleUserRound,
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    title: "Follow-ups",
    value: 84,
    today: 18,
    icon: Phone,
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    title: "Closed Leads",
    value: 32,
    today: 4,
    icon: CheckCircle2,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
];

const teamPerformance = [
  {
    id: 1,
    name: "Anwar",
    leads: 42,
    closed: 12,
    followUps: 8,
  },
  {
    id: 2,
    name: "Fatima",
    leads: 38,
    closed: 10,
    followUps: 6,
  },
  {
    id: 3,
    name: "Ali",
    leads: 31,
    closed: 8,
    followUps: 9,
  },
  {
    id: 4,
    name: "John",
    leads: 27,
    closed: 6,
    followUps: 4,
  },
];

const recentActivities = [
  {
    id: 1,
    title: "New lead added",
    description: "Ahmed Ali was added by Anwar",
    time: "10 min ago",
    icon: UserPlus,
  },
  {
    id: 2,
    title: "Follow-up completed",
    description: "Fatima completed follow-up with Sarah Khan",
    time: "24 min ago",
    icon: CheckCircle2,
  },
  {
    id: 3,
    title: "Lead status updated",
    description: "Mohammed Raza moved to Interested",
    time: "45 min ago",
    icon: Activity,
  },
  {
    id: 4,
    title: "Lead closed",
    description: "Ali closed Green Valley Trading lead",
    time: "1 hr ago",
    icon: Target,
  },
];

const leadStatus = [
  {
    label: "New",
    value: 126,
    percentage: 82,
    className: "bg-blue-500",
  },
  {
    label: "Contacted",
    value: 94,
    percentage: 66,
    className: "bg-cyan-500",
  },
  {
    label: "Interested",
    value: 68,
    percentage: 52,
    className: "bg-amber-500",
  },
  {
    label: "Follow-up",
    value: 84,
    percentage: 61,
    className: "bg-violet-500",
  },
  {
    label: "Closed",
    value: 32,
    percentage: 30,
    className: "bg-emerald-500",
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function SuperAdminHome({ user }: SuperAdminHomeProps) {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[22px] border border-[#dceade] bg-gradient-to-r from-[#edf8ef] via-[#f4faf5] to-white p-5 sm:p-6 lg:p-7">
        <div className="relative z-10">
          <p className="text-xs font-medium text-[#588064]">
            Good morning, {user.name} 👋
          </p>

          <h2 className="mt-2 max-w-[600px] text-[23px] font-semibold leading-tight tracking-[-0.5px] text-[#16391f] sm:text-[28px] lg:text-[32px]">
            Here&apos;s what&apos;s happening with your business
          </h2>

          <p className="mt-2 max-w-[550px] text-xs leading-5 text-[#718b77] sm:text-sm">
            Monitor leads, follow-ups, staff activity and overall CRM
            performance.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#176b32] px-4 text-xs font-medium text-white transition hover:bg-[#125727]"
            >
              <Plus size={16} />
              Add Lead
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cfe0d2] bg-white px-4 text-xs font-medium text-[#245d32] transition hover:bg-[#f6faf7]"
            >
              <UserPlus size={16} />
              Add Staff
            </button>
          </div>
        </div>

        <div className="absolute right-6 top-1/2 hidden h-[120px] w-[120px] -translate-y-1/2 items-center justify-center rounded-full bg-[#dff1e2] md:flex lg:right-12 lg:h-[145px] lg:w-[145px]">
          <BarChart3 size={64} strokeWidth={1.3} className="text-[#398a49]" />
        </div>
      </section>

      {/* STATS */}

      <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:mt-5 lg:gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              className="group rounded-[18px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_4px_18px_rgba(15,40,20,0.03)] transition hover:-translate-y-0.5 hover:border-[#cce2d0] hover:shadow-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                >
                  <Icon size={19} />
                </div>

                <ChevronRight size={16} className="text-slate-300" />
              </div>

              <p className="mt-4 text-[11px] font-medium text-slate-500 sm:text-xs">
                {item.title}
              </p>

              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-[24px] font-semibold leading-none text-[#173820] sm:text-[27px]">
                  {item.value}
                </p>

                <span className="flex items-center gap-0.5 text-[9px] font-medium text-emerald-600 sm:text-[10px]">
                  <TrendingUp size={11} />
                  {item.today} today
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* QUICK ACTIONS */}

      <section className="mt-4 grid grid-cols-4 gap-2 sm:gap-3 lg:mt-5 lg:grid-cols-6">
        <QuickAction icon={Plus} title="Add Lead" />

        <QuickAction icon={UserPlus} title="Add Staff" />

        <QuickAction icon={Users} title="All Leads" />

        <QuickAction icon={Phone} title="Follow-ups" />

        <QuickAction icon={BarChart3} title="Reports" hideOnMobile />

        <QuickAction icon={Activity} title="Activity" hideOnMobile />
      </section>

      {/* PERFORMANCE */}

      <section className="mt-4 grid grid-cols-1 gap-4 lg:mt-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(330px,1fr)] xl:gap-5">
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,40,20,0.03)] sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Lead Performance</h3>

              <p className="mt-1 text-[10px] text-slate-400">
                Current lead status across the business
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-[11px] font-medium text-[#27823b]"
            >
              View Report
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {leadStatus.map((item) => (
              <LeadPerformanceRow key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* TODAY */}

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,40,20,0.03)] sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Today&apos;s Overview</h3>

              <p className="mt-1 text-[10px] text-slate-400">
                CRM activity today
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f3e9] text-[#237638]">
              <CalendarDays size={18} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <TodayCard value={14} label="New Leads" />

            <TodayCard value={18} label="Follow-ups" />

            <TodayCard value={6} label="Confirmed" />

            <TodayCard value={4} label="Closed" />
          </div>
        </div>
      </section>

      {/* TEAM + ACTIVITY */}

      <section className="mt-4 grid grid-cols-1 gap-4 lg:mt-5 lg:grid-cols-2 lg:gap-5">
        <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold">Team Performance</h3>

            <p className="mt-1 text-[10px] text-slate-400">
              Staff lead performance
            </p>
          </div>

          <div className="px-4 sm:px-5">
            {teamPerformance.map((member) => (
              <TeamMember key={member.id} {...member} />
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold">Recent Activity</h3>

            <p className="mt-1 text-[10px] text-slate-400">
              Latest actions from your team
            </p>
          </div>

          <div className="px-4 sm:px-5">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  icon: Icon,
  title,
  hideOnMobile = false,
}: {
  icon: React.ElementType;
  title: string;
  hideOnMobile?: boolean;
}) {
  return (
    <button
      type="button"
      className={`min-h-[82px] flex-col items-center justify-center gap-2 rounded-[16px] border border-slate-200/80 bg-white px-1 transition hover:border-green-200 hover:bg-green-50/40 sm:min-h-[90px] ${
        hideOnMobile ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f3e9] text-[#237638]">
        <Icon size={18} />
      </div>

      <span className="text-center text-[9px] font-medium text-slate-700 sm:text-[11px]">
        {title}
      </span>
    </button>
  );
}

// ============================================================
// LEAD PERFORMANCE
// ============================================================

function LeadPerformanceRow({
  label,
  value,
  percentage,
  className,
}: {
  label: string;
  value: number;
  percentage: number;
  className: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-600">{label}</span>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400">{percentage}%</span>

          <span className="min-w-[28px] text-right text-xs font-semibold">
            {value}
          </span>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function TodayCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fafcfa] p-4">
      <p className="text-xl font-semibold text-[#173820] sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">{label}</p>
    </div>
  );
}

function TeamMember({
  name,
  leads,
  closed,
  followUps,
}: {
  name: string;
  leads: number;
  closed: number;
  followUps: number;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5f2e7] text-sm font-semibold text-[#287b3a]">
        {name.charAt(0)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">{name}</p>

        <p className="mt-1 text-[10px] text-slate-400">
          {leads} Leads · {closed} Closed · {followUps} Follow-ups
        </p>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
  icon: Icon,
}: {
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-4 last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e7f3e9] text-[#237638]">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">{title}</p>

        <p className="mt-1 truncate text-[10px] text-slate-400">
          {description}
        </p>
      </div>

      <div className="flex shrink-0 items-start gap-1 text-[9px] text-slate-400">
        <Clock3 size={11} />
        {time}
      </div>
    </div>
  );
}

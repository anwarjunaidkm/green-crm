"use client";

import type { ElementType } from "react";

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

const followUps = [
  {
    name: "Ahmed Ali",
    company: "Green Star Trading",
    time: "10:30 AM",
  },
  {
    name: "Sarah Khan",
    company: "Blue Wave LLC",
    time: "12:00 PM",
  },
  {
    name: "Mohammed Raza",
    company: "Prime Solutions",
    time: "3:30 PM",
  },
];

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
        <QuickAction icon={Plus} title="Add Lead" />

        <QuickAction icon={Phone} title="Log Call" />

        <QuickAction icon={CalendarDays} title="Follow-up" />

        <QuickAction icon={Users} title="View Leads" />
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
                  3 follow-ups scheduled
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-[10px] font-medium text-[#237738]"
            >
              View All
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="px-4 sm:px-5">
            {followUps.map((item) => (
              <FollowUpItem key={`${item.name}-${item.time}`} {...item} />
            ))}
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
}: {
  icon: ElementType;
  title: string;
}) {
  return (
    <button
      type="button"
      className="flex min-h-[85px] flex-col items-center justify-center gap-2 rounded-[16px] border border-slate-200/80 bg-white px-1 transition hover:border-green-200 hover:bg-green-50/40 sm:min-h-[90px]"
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

function FollowUpItem({
  name,
  company,
  time,
}: {
  name: string;
  company: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f2e7] text-xs font-semibold text-[#287b3a]">
        {name.charAt(0)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-900">{name}</p>

        <p className="mt-1 truncate text-[10px] text-slate-400">{company}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-500">
        <Clock3 size={12} />
        {time}
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

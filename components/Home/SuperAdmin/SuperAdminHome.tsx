"use client";

import React from "react";
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  FileText,
  Home,
  Menu,
  Phone,
  Plus,
  Search,
  Settings,
  Target,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

interface SuperAdminHomeProps {
  user: {
    id: number;
    name: string;
    role: string;
  };
}

/* ============================================================
   DUMMY DATA
   Later replace this with API data
============================================================ */

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

/* ============================================================
   MAIN COMPONENT
============================================================ */

function SuperAdminHome({ user }: SuperAdminHomeProps) {
  return (
    <div className="min-h-screen bg-[#f7faf7] text-slate-900">
      <div className="flex min-h-screen">
        {/* =====================================================
            DESKTOP SIDEBAR
        ====================================================== */}

        <aside className="sticky top-0 hidden h-screen w-[255px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          {/* Logo */}

          <div className="flex h-[76px] items-center border-b border-slate-100 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176b32] text-base font-semibold text-white">
                G
              </div>

              <div>
                <h1 className="text-lg font-semibold tracking-tight text-[#176b32]">
                  GreenVedha
                </h1>

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  CRM
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Main
            </p>

            <nav className="space-y-1">
              <SidebarItem icon={Home} label="Dashboard" active />

              <SidebarItem icon={Users} label="All Leads" />

              <SidebarItem icon={CircleUserRound} label="Staff" />

              <SidebarItem icon={CalendarDays} label="Follow-ups" />
            </nav>

            <p className="mb-2 mt-7 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Management
            </p>

            <nav className="space-y-1">
              <SidebarItem icon={BarChart3} label="Reports" />

              <SidebarItem icon={FileText} label="Activity" />

              <SidebarItem icon={Settings} label="Settings" />
            </nav>
          </div>

          {/* Admin Profile */}

          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-[#f5f9f5] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcefe0] text-sm font-semibold text-[#176b32]">
                {user.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{user.name}</p>

                <p className="mt-0.5 text-[10px] text-slate-400">Super Admin</p>
              </div>

              <ChevronRight size={15} className="text-slate-300" />
            </div>
          </div>
        </aside>

        {/* =====================================================
            MAIN AREA
        ====================================================== */}

        <div className="min-w-0 flex-1">
          {/* ===================================================
              HEADER
          ==================================================== */}

          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
              {/* Mobile Title */}

              <div className="lg:hidden">
                <h1 className="text-[17px] font-semibold tracking-tight text-[#176b32]">
                  GreenVedha CRM
                </h1>

                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  Super Admin
                </p>
              </div>

              {/* Desktop Title */}

              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold">Business Overview</h1>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Monitor your CRM and team performance
                </p>
              </div>

              {/* Header Actions */}

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Search"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                >
                  <Search size={19} />
                </button>

                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                >
                  <Bell size={19} />

                  <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                </button>

                <button
                  type="button"
                  className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#e1f1e4] text-sm font-semibold text-[#176b32]"
                >
                  {user.name.charAt(0)}
                </button>
              </div>
            </div>
          </header>

          {/* ===================================================
              PAGE CONTENT
          ==================================================== */}

          <main className="mx-auto w-full max-w-[1600px] px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:py-7 lg:pb-8">
            {/* =================================================
                WELCOME / HERO
            ================================================== */}

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
                <BarChart3
                  size={64}
                  strokeWidth={1.3}
                  className="text-[#398a49]"
                />
              </div>
            </section>

            {/* =================================================
                STATS
            ================================================== */}

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

                      <ChevronRight
                        size={16}
                        className="text-slate-300 transition group-hover:translate-x-0.5"
                      />
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

            {/* =================================================
                QUICK ACTIONS
            ================================================== */}

            <section className="mt-4 grid grid-cols-4 gap-2 sm:gap-3 lg:mt-5 lg:grid-cols-6">
              <QuickAction icon={Plus} title="Add Lead" />

              <QuickAction icon={UserPlus} title="Add Staff" />

              <QuickAction icon={Users} title="All Leads" />

              <QuickAction icon={Phone} title="Follow-ups" />

              <QuickAction icon={BarChart3} title="Reports" hideOnMobile />

              <QuickAction icon={Activity} title="Activity" hideOnMobile />
            </section>

            {/* =================================================
                MAIN DASHBOARD GRID
            ================================================== */}

            <section className="mt-4 grid grid-cols-1 gap-4 lg:mt-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(330px,1fr)] xl:gap-5">
              {/* ===============================================
                  LEAD PERFORMANCE
              ================================================ */}

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

              {/* ===============================================
                  TODAY OVERVIEW
              ================================================ */}

              <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,40,20,0.03)] sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Today&apos;s Overview
                    </h3>

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

                <button
                  type="button"
                  className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#f3f8f4] text-[11px] font-medium text-[#237638] transition hover:bg-[#eaf4ec]"
                >
                  View Today&apos;s Activity
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>

            {/* =================================================
                TEAM + ACTIVITY
            ================================================== */}

            <section className="mt-4 grid grid-cols-1 gap-4 lg:mt-5 lg:grid-cols-2 lg:gap-5">
              {/* TEAM PERFORMANCE */}

              <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,40,20,0.03)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
                  <div>
                    <h3 className="text-sm font-semibold">Team Performance</h3>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Staff lead performance
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-1 text-[11px] font-medium text-[#27823b]"
                  >
                    View Staff
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Desktop/Tablet Table Header */}

                <div className="hidden grid-cols-[1fr_80px_80px_90px] border-b border-slate-100 bg-slate-50/60 px-5 py-2.5 text-[9px] font-medium uppercase tracking-wider text-slate-400 sm:grid">
                  <span>Staff</span>
                  <span className="text-center">Leads</span>
                  <span className="text-center">Closed</span>
                  <span className="text-center">Follow-ups</span>
                </div>

                <div className="px-4 sm:px-5">
                  {teamPerformance.map((member) => (
                    <TeamMember key={member.id} {...member} />
                  ))}
                </div>
              </div>

              {/* RECENT ACTIVITY */}

              <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,40,20,0.03)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
                  <div>
                    <h3 className="text-sm font-semibold">Recent Activity</h3>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Latest actions from your team
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-1 text-[11px] font-medium text-[#27823b]"
                  >
                    View All
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="px-4 sm:px-5">
                  {recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} {...activity} />
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAV
      ====================================================== */}

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid h-[72px] max-w-[600px] grid-cols-5">
          <BottomNavItem icon={Home} label="Home" active />

          <BottomNavItem icon={Users} label="Leads" />

          <BottomNavItem icon={CircleUserRound} label="Staff" />

          <BottomNavItem icon={BarChart3} label="Reports" />

          <BottomNavItem icon={Menu} label="More" />
        </div>
      </nav>
    </div>
  );
}

export default SuperAdminHome;

/* ============================================================
   SIDEBAR
============================================================ */

function SidebarItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        active
          ? "bg-[#edf7ef] font-medium text-[#176b32]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={18} />

      <span>{label}</span>
    </button>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

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

/* ============================================================
   LEAD PERFORMANCE
============================================================ */

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

          <span className="min-w-[28px] text-right text-xs font-semibold text-slate-800">
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

/* ============================================================
   TODAY CARD
============================================================ */

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

/* ============================================================
   TEAM MEMBER
============================================================ */

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
    <button
      type="button"
      className="w-full border-b border-slate-100 py-4 text-left last:border-b-0"
    >
      {/* Mobile */}

      <div className="flex items-center gap-3 sm:hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f2e7] text-sm font-semibold text-[#287b3a]">
          {name.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{name}</p>

          <div className="mt-1 flex items-center gap-3 text-[9px] text-slate-400">
            <span>{leads} Leads</span>
            <span>{closed} Closed</span>
            <span>{followUps} Follow-ups</span>
          </div>
        </div>

        <ChevronRight size={15} className="text-slate-300" />
      </div>

      {/* Tablet/Desktop */}

      <div className="hidden grid-cols-[1fr_80px_80px_90px] items-center sm:grid">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f2e7] text-xs font-semibold text-[#287b3a]">
            {name.charAt(0)}
          </div>

          <p className="truncate text-xs font-semibold">{name}</p>
        </div>

        <span className="text-center text-xs font-medium">{leads}</span>

        <span className="text-center text-xs font-medium text-emerald-600">
          {closed}
        </span>

        <span className="text-center text-xs font-medium">{followUps}</span>
      </div>
    </button>
  );
}

/* ============================================================
   ACTIVITY ITEM
============================================================ */

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
    <div className="flex gap-3 border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e7f3e9] text-[#237638]">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">{title}</p>

        <p className="mt-1 line-clamp-1 text-[10px] text-slate-400">
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

/* ============================================================
   MOBILE NAV
============================================================ */

function BottomNavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`relative flex flex-col items-center justify-center gap-1 ${
        active ? "text-[#237738]" : "text-slate-400"
      }`}
    >
      <Icon size={19} strokeWidth={active ? 2.5 : 2} />

      <span className="text-[9px] font-medium">{label}</span>

      {active && (
        <span className="absolute bottom-1 h-[3px] w-5 rounded-full bg-[#237738]" />
      )}
    </button>
  );
}

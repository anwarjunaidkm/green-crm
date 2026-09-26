"use client";

import React from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Home,
  Menu,
  Phone,
  Plus,
  Search,
  Target,
  Users,
} from "lucide-react";

interface StaffHomeProps {
  user: {
    id: number;
    name: string;
    role: string;
  };
}

const stats = [
  {
    title: "New Leads",
    value: 12,
    today: 2,
    icon: Users,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    title: "Follow-ups",
    value: 8,
    today: 1,
    icon: Phone,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Confirmed",
    value: 6,
    today: 1,
    icon: CheckCircle2,
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    title: "Closed",
    value: 4,
    today: 0,
    icon: Target,
    iconClass: "bg-orange-100 text-orange-600",
  },
];

const followUps = [
  {
    id: 1,
    name: "Ahmed Ali",
    phone: "+971 50 123 4567",
    time: "10:30 AM",
    status: "New Lead",
    note: "Call regarding product enquiry",
  },
  {
    id: 2,
    name: "Sarah Khan",
    phone: "+971 50 987 6543",
    time: "02:00 PM",
    status: "Interested",
    note: "Send proposal and follow up",
  },
  {
    id: 3,
    name: "Mohammed Raza",
    phone: "+971 56 222 3344",
    time: "04:30 PM",
    status: "Proposal Sent",
    note: "Waiting for customer response",
  },
];

function StaffHome({ user }: StaffHomeProps) {
  return (
    <div className="min-h-screen bg-[#f7faf7] text-slate-900">
      <div className="flex min-h-screen">
        {/* =====================================================
            DESKTOP SIDEBAR
        ====================================================== */}

        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-[76px] items-center border-b border-slate-100 px-6">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#176b32]">
                GreenVedha
              </h1>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                CRM
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            <SidebarItem icon={Home} label="Dashboard" active />

            <SidebarItem icon={Users} label="Leads" />

            <SidebarItem icon={Phone} label="Follow-ups" />

            <SidebarItem icon={CalendarDays} label="Calendar" />

            <SidebarItem icon={CircleUserRound} label="Contacts" />
          </nav>

          {/* User */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-[#f5f9f5] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dcefe0] text-sm font-semibold text-[#176b32]">
                {user.name.charAt(0)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>

                <p className="text-[11px] text-slate-400">Staff</p>
              </div>
            </div>
          </div>
        </aside>

        {/* =====================================================
            MAIN
        ====================================================== */}

        <div className="min-w-0 flex-1">
          {/* ===================================================
              HEADER
          ==================================================== */}

          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
              {/* Mobile */}
              <div className="lg:hidden">
                <h1 className="text-[18px] font-semibold tracking-tight text-[#176b32]">
                  GreenVedha CRM
                </h1>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Staff Dashboard
                </p>
              </div>

              {/* Desktop */}
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold">Dashboard</h1>

                <p className="mt-0.5 text-xs text-slate-400">
                  Welcome back, {user.name}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                >
                  <Search size={19} />
                </button>

                <button
                  type="button"
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
                WELCOME BANNER
            ================================================== */}

            <section className="relative overflow-hidden rounded-[22px] border border-[#dceade] bg-gradient-to-r from-[#edf8ef] to-[#f8fbf8] p-5 sm:p-6 lg:p-7">
              <div className="relative z-10">
                <p className="text-xs font-medium text-[#588064]">
                  Good morning, {user.name} 👋
                </p>

                <h2 className="mt-2 max-w-[500px] text-[23px] font-semibold leading-tight tracking-[-0.5px] text-[#16391f] sm:text-[28px] lg:text-[32px]">
                  Stay on top of your leads
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#718b77] sm:text-sm">
                  Track your leads, follow up on time and close more deals.
                </p>
              </div>

              <div className="absolute right-5 top-1/2 hidden h-[100px] w-[100px] -translate-y-1/2 items-center justify-center rounded-full bg-[#dff1e2] sm:flex lg:right-10 lg:h-[120px] lg:w-[120px]">
                <Target
                  className="text-[#398a49]"
                  size={52}
                  strokeWidth={1.4}
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
                    className="rounded-[18px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_4px_18px_rgba(15,40,20,0.03)] transition hover:border-[#cce2d0] hover:shadow-sm sm:p-5"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                    >
                      <Icon size={19} />
                    </div>

                    <p className="mt-4 text-[11px] font-medium text-slate-500 sm:text-xs">
                      {item.title}
                    </p>

                    <div className="mt-1 flex items-end justify-between gap-2">
                      <p className="text-[24px] font-semibold leading-none text-[#173820] sm:text-[27px]">
                        {item.value}
                      </p>

                      <span className="text-[9px] font-medium text-emerald-600 sm:text-[10px]">
                        +{item.today} today
                      </span>
                    </div>
                  </button>
                );
              })}
            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================== */}

            <section className="mt-4 grid grid-cols-4 gap-2 sm:gap-3 lg:mt-5">
              <QuickAction icon={Plus} title="Add Lead" />

              <QuickAction icon={Phone} title="Log Call" />

              <QuickAction icon={CalendarDays} title="Follow-up" />

              <QuickAction icon={Users} title="View Leads" />
            </section>

            {/* =================================================
                DESKTOP / TABLET CONTENT
            ================================================== */}

            <section className="mt-4 grid grid-cols-1 gap-4 lg:mt-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)] lg:gap-5">
              {/* TODAY FOLLOW UPS */}

              <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,40,20,0.03)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f3e8] text-[#27823b]">
                      <CalendarDays size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Today s Follow-ups
                      </h3>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {followUps.length} follow-ups scheduled
                      </p>
                    </div>
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
                  {followUps.map((item) => (
                    <FollowUpItem key={item.id} {...item} />
                  ))}
                </div>
              </div>

              {/* LEAD STATUS */}

              <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,40,20,0.03)] sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">My Lead Status</h3>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Current lead overview
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-[11px] font-medium text-[#27823b]"
                  >
                    Details
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  <LeadStatus title="New Leads" value={12} total={30} />

                  <LeadStatus title="Contacted" value={8} total={30} />

                  <LeadStatus title="Interested" value={6} total={30} />

                  <LeadStatus title="Follow-up" value={4} total={30} />
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid h-[72px] max-w-[600px] grid-cols-5">
          <BottomNavItem icon={Home} label="Home" active />

          <BottomNavItem icon={Users} label="Leads" />

          <BottomNavItem icon={CalendarDays} label="Calendar" />

          <BottomNavItem icon={CircleUserRound} label="Contacts" />

          <BottomNavItem icon={Menu} label="More" />
        </div>
      </nav>
    </div>
  );
}

export default StaffHome;

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <button
      type="button"
      className="flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-[16px] border border-slate-200/80 bg-white px-1 transition hover:border-green-200 hover:bg-green-50/40 sm:min-h-[90px]"
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
   FOLLOW UP ITEM
============================================================ */

function FollowUpItem({
  name,
  phone,
  time,
  status,
  note,
}: {
  name: string;
  phone: string;
  time: string;
  status: string;
  note: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 border-b border-slate-100 py-4 text-left last:border-b-0"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f2e7] text-sm font-semibold text-[#287b3a] sm:h-11 sm:w-11">
        {name.charAt(0)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold sm:text-sm">{name}</p>

        <p className="mt-0.5 truncate text-[10px] text-slate-400 sm:text-[11px]">
          {phone}
        </p>

        <span className="mt-2 inline-flex rounded-full bg-[#edf7ef] px-2 py-1 text-[8px] font-medium text-[#27823b] sm:text-[9px]">
          {status}
        </span>
      </div>

      <div className="hidden max-w-[180px] sm:block">
        <p className="truncate text-[10px] text-slate-400">{note}</p>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1 text-[10px] font-medium text-slate-600 sm:text-[11px]">
          <Clock3 size={13} />
          {time}
        </div>

        <ChevronRight size={15} className="ml-auto mt-2 text-slate-300" />
      </div>
    </button>
  );
}

/* ============================================================
   LEAD STATUS
============================================================ */

function LeadStatus({
  title,
  value,
  total,
}: {
  title: string;
  value: number;
  total: number;
}) {
  const percentage = (value / total) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-500">{title}</span>

        <span className="text-xs font-semibold text-slate-800">{value}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#39914b]"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   SIDEBAR ITEM
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

"use client";

import Link from "next/link";
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
  ShoppingCart,
  Target,
  UserPlus,
  Users,
} from "lucide-react";

import type { User } from "@/types/auth";
import type { LeadListItem } from "@/types/lead";
import type { EmployeeListItem } from "@/types/staff";
import { useLeadList } from "@/hooks/useLeads";
import { useEmployeeList } from "@/hooks/useStaff";

interface SuperAdminHomeProps {
  user: User;
}

function getCurrentDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SuperAdminHome({ user }: SuperAdminHomeProps) {
  const currentDate = getCurrentDateString();

  // 1. Fetch real lead summary & stats (and leads list)
  const { data: leadsData, isLoading: isLeadsLoading } = useLeadList({
    per_page: 50,
  });

  // 2. Fetch today's follow-ups count
  const { data: followUpsData, isLoading: isFollowUpsLoading } = useLeadList({
    follow_up_date: currentDate,
    per_page: 1,
  });

  // 3. Fetch real staff
  const { data: staffData, isLoading: isStaffLoading } = useEmployeeList({
    page: 1,
    per_page: 5,
  });

  const staffCount = staffData?.pagination?.total ?? 0;
  const staffMembers: EmployeeListItem[] = staffData?.data ?? [];

  const summary = leadsData?.summary;
  const allLeads: LeadListItem[] = leadsData?.data ?? [];
  const totalLeads = summary?.total_leads ?? leadsData?.pagination?.total ?? allLeads.length;
  const statusCards = summary?.status_cards ?? [];
  const recentLeads: LeadListItem[] = allLeads.slice(0, 4);

  const todayFollowUpsTotal =
    followUpsData?.pagination?.total ?? followUpsData?.data?.length ?? 0;

  const isToday = (dateStr?: string | null): boolean => {
    if (!dateStr) return false;
    if (dateStr.startsWith(currentDate)) return true;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    } catch {
      return false;
    }
  };

  const newLeadsStatusCount =
    statusCards.find(
      (c) => c.slug === "new" || c.name.toLowerCase().includes("new"),
    )?.count ?? 0;

  const confirmedStatusCount =
    statusCards.find(
      (c) =>
        c.slug.includes("confirm") || c.name.toLowerCase().includes("confirm"),
    )?.count ?? 0;

  // 1. Today Created Leads
  const createdTodayLeads = allLeads.filter((l) => isToday(l.created_at));
  const todayCreatedCount =
    createdTodayLeads.length > 0 ? createdTodayLeads.length : newLeadsStatusCount;

  // 2. Today Updated Leads
  const updatedTodayLeads = allLeads.filter(
    (l) =>
      isToday(l.updated_at) ||
      isToday(l.created_at) ||
      l.follow_up_day === 0,
  );
  const todayUpdatedCount =
    updatedTodayLeads.length > 0
      ? updatedTodayLeads.length
      : todayFollowUpsTotal || todayCreatedCount;

  // 3. Today Order Confirmed Leads
  const confirmedTodayLeads = allLeads.filter(
    (l) =>
      (l.status?.toLowerCase().includes("confirm") ||
        l.status_slug === "order_confirmed") &&
      (isToday(l.updated_at) || isToday(l.created_at)),
  );
  const todayConfirmedCount =
    confirmedTodayLeads.length > 0
      ? confirmedTodayLeads.length
      : confirmedStatusCount;

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      today: todayCreatedCount,
      todayLabel: "new",
      icon: Users,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Staff",
      value: staffCount,
      today: staffCount,
      todayLabel: "active",
      icon: CircleUserRound,
      iconClass: "bg-violet-100 text-violet-600",
    },
    {
      title: "Follow-ups",
      value: todayFollowUpsTotal,
      today: todayFollowUpsTotal,
      todayLabel: "today",
      icon: Phone,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Confirmed Leads",
      value: todayConfirmedCount,
      today: todayConfirmedCount,
      todayLabel: "orders",
      icon: CheckCircle2,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
  ];

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
            <Link
              href="/leads/add"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#176b32] px-4 text-xs font-medium text-white transition hover:bg-[#125727]"
            >
              <Plus size={16} />
              Add Lead
            </Link>

            <Link
              href="/staff/add"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cfe0d2] bg-white px-4 text-xs font-medium text-[#245d32] transition hover:bg-[#f6faf7]"
            >
              <UserPlus size={16} />
              Add Staff
            </Link>
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
            <div
              key={item.title}
              className="rounded-[18px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,40,20,0.03)] sm:p-5"
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
                <p className="text-[25px] font-semibold leading-none text-[#173820]">
                  {isLeadsLoading ? "..." : item.value}
                </p>

                <span className="text-[9px] font-medium text-emerald-600 sm:text-[10px]">
                  +{item.today} {item.todayLabel}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* QUICK ACTIONS */}

      <section className="mt-4 grid grid-cols-4 gap-2 sm:gap-3 lg:mt-5 lg:grid-cols-6">
        <QuickAction icon={Plus} title="Add Lead" href="/leads/add" />

        <QuickAction icon={UserPlus} title="Add Staff" href="/staff/add" />

        <QuickAction icon={ShoppingCart} title="Products" href="/products" />

        <QuickAction icon={Users} title="All Leads" href="/leads" />

        <QuickAction
          icon={Phone}
          title="Follow-ups"
          href="/leads/follow-ups"
        />

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

            <Link
              href="/leads"
              className="flex items-center gap-1 text-[11px] font-medium text-[#27823b] transition hover:underline"
            >
              View Leads
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {isLeadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-3 w-24 rounded bg-slate-100" />
                      <div className="h-3 w-12 rounded bg-slate-100" />
                    </div>
                    <div className="h-2 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : statusCards.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                No status data available
              </p>
            ) : (
              statusCards.map((card) => {
                const percentage =
                  totalLeads > 0
                    ? Math.round((card.count / totalLeads) * 100)
                    : 0;
                return (
                  <LeadPerformanceRow
                    key={card.status_id}
                    label={card.name}
                    value={card.count}
                    percentage={percentage}
                    color={card.color}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* TODAY'S OVERVIEW */}

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
            <TodayCard
              value={isLeadsLoading ? "..." : todayCreatedCount}
              label="Today Created"
              subtext="Leads registered today"
              icon={UserPlus}
              colorClass="bg-blue-50 text-blue-600"
            />

            <TodayCard
              value={isLeadsLoading ? "..." : todayUpdatedCount}
              label="Today Updated"
              subtext="Leads active today"
              icon={Activity}
              colorClass="bg-amber-50 text-amber-600"
            />

            <TodayCard
              value={isLeadsLoading ? "..." : todayConfirmedCount}
              label="Today Order Confirmed"
              subtext="Orders confirmed"
              icon={CheckCircle2}
              colorClass="bg-emerald-50 text-emerald-600"
            />

            <TodayCard
              value={isLeadsLoading ? "..." : totalLeads}
              label="Total Leads"
              subtext="All pipeline leads"
              icon={Users}
              colorClass="bg-[#e7f3e9] text-[#237638]"
            />
          </div>
        </div>
      </section>

      {/* TEAM + ACTIVITY */}

      <section className="mt-4 grid grid-cols-1 gap-4 lg:mt-5 lg:grid-cols-2 lg:gap-5">
        <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold">Team Members</h3>

              <p className="mt-1 text-[10px] text-slate-400">
                Staff member directory
              </p>
            </div>

            <Link
              href="/staff"
              className="text-[10px] font-medium text-[#237738] transition hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="px-4 sm:px-5">
            {isStaffLoading ? (
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
                  </div>
                ))}
              </div>
            ) : staffMembers.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No staff members found
              </p>
            ) : (
              staffMembers.map((member) => (
                <TeamMember key={member.id} member={member} />
              ))
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold">Recent Leads</h3>

              <p className="mt-1 text-[10px] text-slate-400">
                Latest leads added to pipeline
              </p>
            </div>

            <Link
              href="/leads"
              className="text-[10px] font-medium text-[#237738] transition hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="px-4 sm:px-5">
            {isLeadsLoading ? (
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
                  </div>
                ))}
              </div>
            ) : recentLeads.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No recent leads available
              </p>
            ) : (
              recentLeads.map((lead) => (
                <RecentLeadItem key={lead.id} lead={lead} />
              ))
            )}
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
  href,
  hideOnMobile = false,
}: {
  icon: React.ElementType;
  title: string;
  href?: string;
  hideOnMobile?: boolean;
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

  const className = `min-h-[82px] flex-col items-center justify-center gap-2 rounded-[16px] border border-slate-200/80 bg-white px-1 transition hover:border-green-200 hover:bg-green-50/40 sm:min-h-[90px] ${
    hideOnMobile ? "hidden lg:flex" : "flex"
  }`;

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

// ============================================================
// LEAD PERFORMANCE
// ============================================================

function LeadPerformanceRow({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: number;
  percentage: number;
  color?: string;
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
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color || "#3B82F6",
          }}
        />
      </div>
    </div>
  );
}

function TodayCard({
  value,
  label,
  subtext,
  icon: Icon,
  colorClass = "bg-[#fafcfa] text-[#173820]",
}: {
  value: number | string;
  label: string;
  subtext?: string;
  icon?: React.ElementType;
  colorClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fafcfa] p-4 transition hover:border-slate-200 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-[#173820] sm:text-2xl">
          {value}
        </p>

        {Icon && (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${colorClass}`}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      <p className="mt-2 text-xs font-semibold text-slate-800">{label}</p>
      {subtext && (
        <p className="mt-0.5 text-[10px] text-slate-400">{subtext}</p>
      )}
    </div>
  );
}

function TeamMember({ member }: { member: EmployeeListItem }) {
  return (
    <Link
      href="/staff"
      className="flex items-center gap-3 border-b border-slate-100 py-3.5 transition hover:bg-slate-50/60 last:border-0"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f2e7] text-sm font-semibold text-[#287b3a]">
        {member.name.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-900">
          {member.name}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {member.designation || member.department || member.role || "Staff Member"}
        </p>
      </div>

      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
        {member.status_text || "Active"}
      </span>
    </Link>
  );
}

function RecentLeadItem({ lead }: { lead: LeadListItem }) {
  const statusColor = lead.status_color || "#3B82F6";

  const initials = lead.name
    ? lead.name.trim().split(/\s+/).length >= 2
      ? `${lead.name.trim().split(/\s+/)[0][0]}${lead.name.trim().split(/\s+/)[1][0]}`.toUpperCase()
      : lead.name.slice(0, 2).toUpperCase()
    : "?";

  return (
    <Link
      href={`/lead-view/${lead.id}`}
      className="flex items-center gap-3 border-b border-slate-100 py-3.5 transition hover:bg-slate-50/60 last:border-0"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white transition hover:opacity-90"
        style={{ backgroundColor: statusColor }}
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-900">
          {lead.name}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {lead.lead_code} • {lead.source || "Direct"}
        </p>
      </div>

      <span
        className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
        style={{
          backgroundColor: `${statusColor}18`,
          color: statusColor,
        }}
      >
        {lead.status}
      </span>
    </Link>
  );
}

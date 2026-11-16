"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  FileText,
  Home,
  Menu,
  Package,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";

import type { UserRole } from "@/types/auth";

interface MobileBottomNavProps {
  role: UserRole;
}

export default function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Primary 4 tabs in bottom navigation
  const items =
    role === "super_admin"
      ? [
          {
            label: "Home",
            href: "/home",
            icon: Home,
          },
          {
            label: "Leads",
            href: "/leads",
            icon: Users,
          },
          {
            label: "Staff",
            href: "/staff",
            icon: CircleUserRound,
          },
          {
            label: "Products",
            href: "/products",
            icon: Package,
          },
        ]
      : [
          {
            label: "Home",
            href: "/home",
            icon: Home,
          },
          {
            label: "Leads",
            href: "/leads",
            icon: Users,
          },
          {
            label: "Follow-ups",
            href: "/leads/follow-ups",
            icon: CalendarDays,
          },
          {
            label: "Customers",
            href: "/customers",
            icon: UserRound,
          },
        ];

  // Secondary items shown in the "More" bottom sheet
  const moreItems =
    role === "super_admin"
      ? [
          {
            label: "Reports",
            href: "/reports",
            icon: BarChart3,
            description: "Analytics, sales & performance summaries",
          },
          {
            label: "Customers",
            href: "/customers",
            icon: UserRound,
            description: "Client directory & customer management",
          },
          {
            label: "Activity",
            href: "/activity",
            icon: FileText,
            description: "Audit trail & system logs",
          },
          {
            label: "Settings",
            href: "/settings",
            icon: Settings,
            description: "Preferences & system settings",
          },
        ]
      : [
          {
            label: "Products",
            href: "/products",
            icon: Package,
            description: "Catalog & product list",
          },
          {
            label: "Settings",
            href: "/settings",
            icon: Settings,
            description: "Account settings",
          },
        ];

  const isActive = (href: string) => {
    if (href === "/home") {
      return pathname === "/home";
    }

    if (href === "/leads" && pathname !== "/leads") {
      return false;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isMoreActive = moreItems.some((item) => isActive(item.href));

  return (
    <>
      {/* ================= MORE BOTTOM SHEET / DRAWER ================= */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-slate-200 bg-white p-5 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-2xl">
            {/* Sheet Handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  More Options
                </h3>
                <p className="text-[11px] text-slate-400">
                  Quick access to additional modules
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="space-y-1.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center justify-between rounded-2xl p-3 transition ${
                      active
                        ? "bg-[#eaf4ec] text-[#176b32]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? "bg-[#176b32] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold">{item.label}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className={active ? "text-[#176b32]" : "text-slate-300"}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= FIXED BOTTOM NAV BAR ================= */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid h-[72px] max-w-[600px] grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-1 transition ${
                  active ? "text-[#237738]" : "text-slate-400"
                }`}
              >
                <Icon size={19} strokeWidth={active ? 2.5 : 2} />

                <span className="text-[9px] font-medium">{item.label}</span>

                {active && (
                  <span className="absolute bottom-1 h-[3px] w-5 rounded-full bg-[#237738]" />
                )}
              </Link>
            );
          })}

          {/* "More" Trigger */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={`relative flex flex-col items-center justify-center gap-1 transition ${
              isMoreActive || isMoreOpen ? "text-[#237738]" : "text-slate-400"
            }`}
          >
            <Menu
              size={19}
              strokeWidth={isMoreActive || isMoreOpen ? 2.5 : 2}
            />

            <span className="text-[9px] font-medium">More</span>

            {isMoreActive && (
              <span className="absolute bottom-1 h-[3px] w-5 rounded-full bg-[#237738]" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  CalendarDays,
  CircleUserRound,
  Home,
  Menu,
  UserRound,
  Users,
} from "lucide-react";

import type { UserRole } from "@/types/auth";

interface MobileBottomNavProps {
  role: UserRole;
}

export default function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname();

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
            label: "Reports",
            href: "/reports",
            icon: BarChart3,
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

  const isActive = (href: string) => {
    if (href === "/home") {
      return pathname === "/home";
    }

    /*
     * Special case:
     *
     * /leads/follow-ups should activate Follow-ups,
     * not both Leads and Follow-ups.
     */
    if (href === "/leads" && pathname !== "/leads") {
      return false;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
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

        <button
          type="button"
          className="relative flex flex-col items-center justify-center gap-1 text-slate-400"
        >
          <Menu size={19} />

          <span className="text-[9px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}

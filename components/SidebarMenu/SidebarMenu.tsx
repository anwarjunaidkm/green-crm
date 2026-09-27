"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

import { menuItems, type MenuItem } from "@/config/menuConfig";

import type { UserRole } from "@/types/auth";

interface SidebarMenuProps {
  role: UserRole;
}

export default function SidebarMenu({ role }: SidebarMenuProps) {
  const pathname = usePathname();

  const visibleMenus = menuItems.filter((item) => item.roles.includes(role));

  return (
    <nav className="space-y-1">
      {visibleMenus.map((item) => (
        <SidebarMenuItem
          key={item.label}
          item={item}
          role={role}
          pathname={pathname}
        />
      ))}
    </nav>
  );
}

function SidebarMenuItem({
  item,
  role,
  pathname,
}: {
  item: MenuItem;
  role: UserRole;
  pathname: string;
}) {
  const Icon = item.icon;

  const children =
    item.children?.filter((child) => child.roles.includes(role)) ?? [];

  const hasChildren = children.length > 0;

  const childActive = children.some(
    (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
  );

  const itemActive =
    !!item.href &&
    (pathname === item.href ||
      (item.href !== "/home" && pathname.startsWith(`${item.href}/`)));

  const [manualOpen, setManualOpen] = useState<boolean | null>(null);

  const isOpen = manualOpen !== null ? manualOpen : childActive;

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setManualOpen((current) =>
              current === null ? !childActive : !current,
            );
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
            childActive
              ? "bg-[#edf7ef] font-medium text-[#176b32]"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Icon size={18} />

          <span className="flex-1 text-left">{item.label}</span>

          {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>

        {isOpen && (
          <div className="ml-7 mt-1 space-y-1 border-l border-slate-200 pl-3">
            {children.map((child) => {
              const active = pathname === child.href;

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`block rounded-lg px-3 py-2.5 text-xs transition ${
                    active
                      ? "bg-[#edf7ef] font-medium text-[#176b32]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href ?? "#"}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        itemActive
          ? "bg-[#edf7ef] font-medium text-[#176b32]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={18} />

      <span>{item.label}</span>
    </Link>
  );
}

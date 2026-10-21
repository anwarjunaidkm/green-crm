"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronRight, LogOut, Search, User } from "lucide-react";

import SidebarMenu from "@/components/SidebarMenu/SidebarMenu";
import MobileBottomNav from "@/components/MobileBottomNav/MobileBottomNav";

import type { User as UserType } from "@/types/auth";

interface DashboardLayoutProps {
  user: UserType;
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardLayout({
  user,
  children,
  title = "Dashboard",
  description = "Welcome back",
}: DashboardLayoutProps) {
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = user.role === "super_admin";
  const roleLabel = isSuperAdmin ? "Super Admin" : "Staff";
  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  /* -------------------------------------------------------
     Close dropdown when clicking outside
  ------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------------------------------------------
     Logout
  ------------------------------------------------------- */
  const handleLogout = () => {
    sessionStorage.removeItem("greenvedha_user");
    router.push("/");
  };

  return (
    <div className="min-h-dvh bg-[#f7faf7] text-slate-900">
      <div className="flex min-h-dvh">
        {/* ====================================================
            DESKTOP SIDEBAR
        ==================================================== */}

        <aside className="sticky top-0 hidden h-dvh w-[255px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          {/* LOGO */}

          <div className="flex h-[76px] shrink-0 items-center border-b border-slate-100 px-6">
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

          {/* SIDEBAR MENU */}

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <SidebarMenu role={user.role} />
          </div>

          {/* USER */}

          <div className="shrink-0 border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-[#f5f9f5] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dcefe0] text-sm font-semibold text-[#176b32]">
                {initial}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {user.name}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">{roleLabel}</p>
              </div>

              <ChevronRight size={15} className="shrink-0 text-slate-300" />
            </div>
          </div>
        </aside>

        {/* ====================================================
            MAIN AREA
        ==================================================== */}

        <div className="min-w-0 flex-1">
          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
              {/* MOBILE */}

              <div className="lg:hidden">
                <h1 className="text-[17px] font-semibold tracking-tight text-[#176b32]">
                  GreenVedha CRM
                </h1>

                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  {roleLabel}
                </p>
              </div>

              {/* DESKTOP */}

              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-slate-900">
                  {title}
                </h1>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {description}
                </p>
              </div>

              {/* HEADER ACTIONS */}

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

                {/* ============================================
                    AVATAR DROPDOWN
                ============================================ */}

                <div className="relative ml-1" ref={dropdownRef}>
                  {/* Avatar trigger */}
                  <button
                    type="button"
                    aria-label="Profile menu"
                    aria-expanded={dropdownOpen}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e1f1e4] text-sm font-semibold text-[#176b32] transition hover:ring-2 hover:ring-[#176b32]/20"
                  >
                    {initial}
                  </button>

                  {/* Dropdown panel */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60">
                      {/* User info */}
                      <div className="px-4 py-3.5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcefe0] text-sm font-semibold text-[#176b32]">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {roleLabel}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                          <User size={15} className="shrink-0" />
                          Profile
                        </button>
                      </div>

                      {/* Divider + Logout */}
                      <div className="border-t border-slate-100 p-1.5">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-500 transition hover:bg-red-50"
                        >
                          <LogOut size={15} className="shrink-0" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* ==================================================
              PAGE CONTENT

              IMPORTANT:
              Mobile bottom nav = 72px.
              We reserve enough space below the page so the
              last form element can scroll completely above it.
          ================================================== */}

          <main className="min-h-0 pb-[calc(72px+env(safe-area-inset-bottom))] lg:pb-0">
            {children}
          </main>
        </div>
      </div>

      {/* ====================================================
          MOBILE NAV
      ==================================================== */}

      <MobileBottomNav role={user.role} />
    </div>
  );
}

"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/Layout/DashboardLayout";

import type { User } from "@/types/auth";

interface LayoutProps {
  children: ReactNode;
}

function subscribe() {
  return () => {};
}

function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = sessionStorage.getItem("greenvedha_user");

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser) as User;

    if (user.role !== "staff" && user.role !== "super_admin") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const hydrated = useHydrated();

  const user = hydrated ? getStoredUser() : null;

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoadingScreen />;
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-200 border-t-green-700" />

        <p className="mt-3 text-xs text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

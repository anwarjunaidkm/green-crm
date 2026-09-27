"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SuperAdminHome from "@/components/Home/SuperAdmin/SuperAdminHome";
import StaffHome from "@/components/Home/Staff/StaffHome";

import type { User } from "@/types/auth";

function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = sessionStorage.getItem("greenvedha_user");

    if (!storedUser) {
      return null;
    }

    const parsedUser = JSON.parse(storedUser) as User;

    if (parsedUser.role !== "staff" && parsedUser.role !== "super_admin") {
      sessionStorage.removeItem("greenvedha_user");

      return null;
    }

    return parsedUser;
  } catch {
    sessionStorage.removeItem("greenvedha_user");

    return null;
  }
}

export default function HomeContainer() {
  const router = useRouter();

  const [user] = useState<User | null>(getStoredUser);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-200 border-t-green-700" />

          <p className="mt-3 text-xs text-slate-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  // SUPER ADMIN
  if (user.role === "super_admin") {
    return <SuperAdminHome user={user} />;
  }

  // STAFF
  return <StaffHome user={user} />;
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SuperAdminHome from "@/components/Home/SuperAdmin/SuperAdminHome";
import StaffHome from "@/components/Home/Staff/StaffHome";

type UserRole = "staff" | "super_admin";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

/* ============================================================
   GET USER FROM SESSION STORAGE
============================================================ */

function getStoredUser(): User | null {
  // Next.js also renders on the server,
  // so window/sessionStorage is not available there.
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = sessionStorage.getItem("greenvedha_user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser) as User;

    // Validate role
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

/* ============================================================
   HOME CONTAINER
============================================================ */

function HomeContainer() {
  const router = useRouter();

  const [user] = useState<User | null>(() => getStoredUser());

  /* ==========================================================
     REDIRECT IF USER IS NOT LOGGED IN
  ========================================================== */

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  /* ==========================================================
     LOADING / REDIRECT SCREEN
  ========================================================== */

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-200 border-t-green-700" />

          <p className="mt-3 text-xs text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     SUPER ADMIN DASHBOARD
  ========================================================== */

  if (user.role === "super_admin") {
    return <SuperAdminHome user={user} />;
  }

  /* ==========================================================
     STAFF DASHBOARD
  ========================================================== */

  return <StaffHome user={user} />;
}

export default HomeContainer;

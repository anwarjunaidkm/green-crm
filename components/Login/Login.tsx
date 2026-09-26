"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  EyeOff,
  Leaf,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     LOGIN
     
     TEMPORARY FRONTEND LOGIN

     Super Admin:
     admin@gmail.com
     admin

     Staff:
     staff@gmail.com
     staff

     Later replace this with your real login API.
  ========================================================= */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    /* -------------------------
       SUPER ADMIN
    -------------------------- */

    if (email === "admin@gmail.com" && password === "admin") {
      const user = {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        role: "super_admin",
      };

      sessionStorage.setItem("greenvedha_user", JSON.stringify(user));

      router.push("/home");

      return;
    }

    /* -------------------------
       STAFF
    -------------------------- */

    if (email === "staff@gmail.com" && password === "staff") {
      const user = {
        id: 2,
        name: "Staff",
        email: "staff@gmail.com",
        role: "staff",
      };

      sessionStorage.setItem("greenvedha_user", JSON.stringify(user));

      router.push("/home");

      return;
    }

    /* -------------------------
       INVALID LOGIN
    -------------------------- */

    setError("Invalid email or password.");
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] lg:grid lg:grid-cols-[50%_50%]">
      {/* =========================================================
          LEFT SIDE - DESKTOP
      ========================================================= */}

      <section className="relative hidden min-h-screen overflow-hidden bg-[#0d2f19] lg:flex lg:flex-col">
        {/* Background glow */}

        <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#2f8f46]/20 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-52 right-[-150px] h-[550px] w-[550px] rounded-full bg-[#47a85d]/20 blur-[130px]" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#174d27]/30 via-transparent to-[#071d10]/50" />

        {/* =====================================================
            LOGO
        ====================================================== */}

        <div className="relative z-10 px-10 pt-10 xl:px-14 xl:pt-12">
          <div className="flex items-center gap-2 text-white">
            <h1 className="text-[32px] font-semibold tracking-[-1px] xl:text-[38px]">
              GreenVedha
            </h1>

            <Leaf className="mb-4 h-5 w-5 text-[#8fd49a]" strokeWidth={2} />
          </div>

          <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-white/45">
            CRM
          </p>
        </div>

        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <div className="relative z-10 flex flex-1 items-center px-10 xl:px-14">
          <div className="max-w-[520px]">
            {/* Badge */}

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#69c979]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/65">
                Leads · Follow-ups · Growth
              </span>
            </div>

            {/* Heading */}

            <h2 className="text-[42px] font-medium leading-[1.18] tracking-[-1.5px] text-white xl:text-[52px]">
              Your leads,
              <br />
              <span className="font-medium italic text-[#62c477]">
                all in one place.
              </span>
            </h2>

            <p className="mt-7 max-w-[440px] text-[15px] leading-7 text-white/55">
              Manage leads, track follow-ups, update customer status and keep
              your sales team connected with GreenVedha CRM.
            </p>

            {/* =================================================
                MINI STATS
            ================================================== */}

            <div className="mt-10 grid max-w-[460px] grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
                <p className="text-xl font-semibold text-white">24</p>

                <p className="mt-1 text-xs text-white/45">New Leads</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
                <p className="text-xl font-semibold text-white">12</p>

                <p className="mt-1 text-xs text-white/45">Follow-ups</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
                <p className="text-xl font-semibold text-white">08</p>

                <p className="mt-1 text-xs text-white/45">Confirmed</p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            LEFT FOOTER
        ====================================================== */}

        <div className="relative z-10 flex items-center gap-7 px-10 pb-10 text-[11px] text-white/50 xl:px-14">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#65c778]" />
            Secure Access
          </div>

          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#65c778]" />
            Smart Tracking
          </div>

          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#65c778]" />
            Sales Insights
          </div>
        </div>
      </section>

      {/* =========================================================
          RIGHT SIDE - LOGIN
      ========================================================= */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:px-12">
        {/* Background effects */}

        <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-[#dceedd]/50 blur-[100px]" />

        <div className="pointer-events-none absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-[#e5f2e6]/60 blur-[100px]" />

        <div className="relative z-10 w-full max-w-[470px]">
          {/* =====================================================
              MOBILE LOGO
          ====================================================== */}

          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[28px] font-semibold tracking-[-1px] text-[#153d20]">
                GreenVedha
              </h1>

              <Leaf className="mb-3 h-5 w-5 text-[#328b45]" />
            </div>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64866b]">
              CRM
            </p>
          </div>

          {/* =====================================================
              HEADING
          ====================================================== */}

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[2px] w-5 bg-[#3d984d]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3d984d]">
                CRM Access
              </span>
            </div>

            <h2 className="text-[32px] font-semibold tracking-[-1px] text-[#132f1b] sm:text-[38px]">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-[#729078] sm:text-[15px]">
              Sign in to continue to your GreenVedha CRM.
            </p>
          </div>

          {/* =====================================================
              LOGIN FORM
          ====================================================== */}

          <form onSubmit={handleSubmit}>
            <div className="rounded-[24px] border border-white bg-white/80 p-5 shadow-[0_20px_60px_rgba(24,65,34,0.08)] backdrop-blur-sm sm:p-7">
              {/* =================================================
                  EMAIL
              ================================================== */}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[12px] font-medium text-[#315e3b]"
                >
                  Email address
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@greenvedha.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="h-[54px] rounded-xl border-[#dce8de] bg-[#fbfcfb] px-4 text-sm text-[#17351f] shadow-none placeholder:text-[#9aafa0] focus-visible:border-[#4a9c59] focus-visible:ring-2 focus-visible:ring-[#4a9c59]/15"
                />
              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div className="mt-5 space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[12px] font-medium text-[#315e3b]"
                >
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="h-[54px] rounded-xl border-[#dce8de] bg-[#fbfcfb] px-4 pr-12 text-sm text-[#17351f] shadow-none placeholder:text-[#9aafa0] focus-visible:border-[#4a9c59] focus-visible:ring-2 focus-visible:ring-[#4a9c59]/15"
                  />

                  {/* Show / Hide Password */}

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#75a17d] transition hover:text-[#276f36]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* =================================================
                  ERROR MESSAGE
              ================================================== */}

              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3"
                >
                  <p className="text-[12px] font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                FORGOT PASSWORD
            ================================================== */}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="text-[13px] font-medium text-[#709277] transition hover:text-[#276f36]"
              >
                Forgot password?
              </button>
            </div>

            {/* =================================================
                SIGN IN BUTTON
            ================================================== */}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-6 h-[54px] w-full rounded-xl bg-gradient-to-r from-[#174b25] to-[#3b944a] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(36,105,51,0.18)] transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* =====================================================
              AUTHORIZED ACCESS
          ====================================================== */}

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-[#91a895]">
            <Users className="h-3.5 w-3.5" />
            Authorized GreenVedha staff access only
          </div>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <p className="mt-8 text-center text-[11px] text-[#a1b2a4]">
            © {new Date().getFullYear()} GreenVedha CRM. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;

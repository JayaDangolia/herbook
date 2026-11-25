"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";

  const { login, showNotification } = useApp();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login(identifier.trim(), password);
      if (res.success) {
        showNotification("Welcome back to HerBook!");
        router.replace(nextUrl);
      } else {
        setErrorMsg(res.error || "Invalid email, username, or password.");
      }
    } catch {
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-8 max-w-md mx-auto animate-fadeIn">
      {/* Top / Header */}
      <div className="pt-6 sm:pt-12 text-center space-y-4">
        {/* Beautiful HerBook Logo */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-rose via-brand-lavender to-brand-plum flex items-center justify-center shadow-soft mx-auto group hover:scale-105 transition-transform duration-300">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>

        {/* Brand Name & Taglines */}
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-brand-plum dark:text-brand-rose-light">
            herbook.
          </h1>
          <p className="text-xs font-bold text-brand-rose uppercase tracking-widest mt-1">
            Her Body. Her Health. Her World.
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
            Your space for health, wellness and connection.
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="my-8 bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 animate-shake">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
              Email or Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@domain.com or @username"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-rose transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-brand-plum dark:text-brand-rose hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-rose transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-rose via-brand-plum to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
          >
            <span>{isLoading ? "Signing In..." : "Log In"}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Secondary Option */}
        <div className="pt-3 text-center border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            New to HerBook?{" "}
            <Link
              href="/register"
              className="font-bold text-brand-plum dark:text-brand-rose hover:underline inline-flex items-center gap-0.5"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Quick Test Demo Pilot Logins for Instant Testing */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block text-center tracking-wider">
            Quick Test Pilot Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo("rhea@example.com", "Rhea@HerBook2026")}
              className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition-colors"
            >
              <div className="font-bold text-brand-plum dark:text-brand-rose flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-rose" />
                @rhea_d
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Regular User Demo</div>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo("admin@herbook.in", "Admin@HerBook2026")}
              className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition-colors"
            >
              <div className="font-bold text-brand-plum dark:text-brand-rose flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-plum" />
                @admin
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Compliance Admin</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <footer className="text-center space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
          <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white hover:underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white hover:underline">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/help" className="hover:text-zinc-900 dark:hover:text-white hover:underline">
            Help
          </Link>
          <span>•</span>
          <Link href="/safety" className="hover:text-zinc-900 dark:hover:text-white hover:underline">
            Emergency &amp; Safety
          </Link>
        </div>
        <p className="text-[10px] text-zinc-400">
          &copy; 2026 HerBook. Her Body. Her Health. Her World.
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFAFC] dark:bg-[#09080B]">
          <div className="w-8 h-8 rounded-full border-2 border-brand-rose border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

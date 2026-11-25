"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(data.message || data.error || "Unable to send recovery link.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-8 max-w-md mx-auto animate-fadeIn">
      {/* Header */}
      <div className="pt-6 sm:pt-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-rose via-brand-lavender to-brand-plum flex items-center justify-center shadow-soft mx-auto">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight text-brand-plum dark:text-brand-rose-light">
            Reset Password
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="my-8 bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Recovery Link Dispatched
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                If an account exists for <span className="font-bold text-zinc-800 dark:text-zinc-200">{email}</span>, you will receive an encrypted reset link shortly.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-plum dark:text-brand-rose hover:underline pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-rose transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-rose via-brand-plum to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              <span>{isLoading ? "Sending Link..." : "Send Recovery Instructions"}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-brand-rose hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-zinc-400 pb-4">
        &copy; 2026 HerBook. Her Body. Her Health. Her World.
      </footer>
    </div>
  );
}

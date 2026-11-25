"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, AtSign, Eye, EyeOff, ShieldCheck, HeartPulse } from "lucide-react";
import { Portal } from "@/components/ui/Portal";
import { useApp } from "@/context/AppContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const { login, register, showNotification } = useApp();

  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (res.success) {
          showNotification("Welcome back to HerBook! 🌸");
          onClose();
        } else {
          setErrorMessage(res.error || "Invalid email or password.");
        }
      } else if (mode === "register") {
        const res = await register(name, username, email, password);
        if (res.success) {
          showNotification("Account created! Welcome to your safe health space.");
          onClose();
        } else {
          setErrorMessage(res.error || "Registration failed. Please check inputs.");
        }
      } else if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        showNotification(data.message || "Reset link dispatched.");
        setMode("login");
      }
    } catch (err: any) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setMode("login");
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="HerBook Authentication"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-[2.5rem] sm:rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-rose to-brand-plum flex items-center justify-center text-white shadow-soft">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-brand-plum dark:text-brand-rose font-display tracking-tight">
                herbook.
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== "forgot" && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-white dark:bg-zinc-900 text-brand-plum dark:text-brand-rose shadow-soft font-extrabold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-white dark:bg-zinc-900 text-brand-plum dark:text-brand-rose shadow-soft font-extrabold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Title & Tagline */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-display">
              {mode === "login"
                ? "Welcome to HerBook"
                : mode === "register"
                ? "Join Your Private Health Circle"
                : "Reset Your Password"}
            </h3>
            <p className="text-xs text-zinc-500">
              {mode === "login"
                ? "Access your private cycle logs, doctor consultations & community."
                : mode === "register"
                ? "Independent, encrypted and protected under the DPDP Act 2023."
                : "Enter your registered email to receive a recovery link."}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "register" && (
              <>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Patel"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Unique Username
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="e.g. ananya_wellness"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[11px] font-semibold text-brand-plum dark:text-brand-rose hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters (at least 1 digit)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>
                {isSubmitting
                  ? "Processing..."
                  : mode === "login"
                  ? "Sign In to HerBook"
                  : mode === "register"
                  ? "Create Free Account"
                  : "Send Recovery Link"}
              </span>
            </button>
          </form>

          {/* Quick Demo Pilot Accounts for Instant Testing */}
          {mode === "login" && (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block text-center">
                Quick Test Pilot Logins
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("rhea@example.com", "Rhea@HerBook2026")}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition-colors"
                >
                  <div className="font-bold text-brand-plum dark:text-brand-rose">@rhea_d</div>
                  <div className="text-[10px] text-zinc-400">Regular User Demo</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin@herbook.in", "Admin@HerBook2026")}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition-colors"
                >
                  <div className="font-bold text-brand-plum dark:text-brand-rose">@admin</div>
                  <div className="text-[10px] text-zinc-400">Compliance Admin</div>
                </button>
              </div>
            </div>
          )}

          {mode === "forgot" && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs font-semibold text-brand-plum dark:text-brand-rose hover:underline"
              >
                Return to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

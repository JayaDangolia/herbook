"use client";

import React, { useState } from "react";
import {
  Crown,
  Check,
  Sparkles,
  Download,
  BarChart3,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";

export default function PremiumPage() {
  const { user, togglePremium, showNotification } = useApp();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const workshops = [
    {
      id: "ws-1",
      title: "Mastering the PCOS Metabolic Axis: Insulin, Diet & Hormones",
      expert: "Dr. Ananya Sharma (OBGYN) & Dr. Tanvi Banerjee",
      date: "Saturday, 24 October 2026",
      time: "05:00 PM IST (Zoom Live)",
      price: 299,
      seatsLeft: 14,
    },
    {
      id: "ws-2",
      title: "Ayurvedic Ritucharya & Hormonal Wellness Workshop",
      expert: "Dr. Vaidya Gayatri Nambiar",
      date: "Sunday, 1 November 2026",
      time: "11:00 AM IST (Zoom Live)",
      price: 249,
      seatsLeft: 22,
    },
  ];

  const handleSubscribe = () => {
    togglePremium();
    showNotification(
      user.isPremium
        ? "Switched to standard free tier."
        : `Subscribed to HerBook PLUS (${billingCycle === "annual" ? "₹799/yr" : "₹99/mo"})!`
    );
  };

  const handleRegisterWorkshop = (title: string, price: number) => {
    showNotification(`Registered for '${title}'! Ticket receipt generated.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-300/40">
          <Crown className="w-3.5 h-3.5" />
          <span>HerBook PLUS Membership</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white font-display">
          Elevate Your Hormonal &amp; Reproductive Wellness
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Deep cycle diagnostics, PDF clinical export reports, and direct clinician masterclasses. Essential cycle tracking remains free forever.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center pt-2">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl flex items-center border border-zinc-200 dark:border-zinc-700 text-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Monthly (₹99)
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-white dark:bg-zinc-900 text-brand-plum dark:text-brand-rose shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <span>Annual (₹799)</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md font-extrabold">
                Save 33%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Essential Tracking (Free Forever)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Fundamental reproductive health and community access
              </p>
            </div>

            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              ₹0 <span className="text-xs font-normal text-zinc-500">/ forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>HerCycle menstrual calendar &amp; symptom logging</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Explainable next period &amp; cycle length estimates</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>HerCare doctor discovery &amp; consultation bookings</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>HerCircle moderated community &amp; Anonymous Sister mode</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>HerReels health education short video feed</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-center text-xs font-bold text-zinc-500">
            Current Base Plan
          </div>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-brand-blush/80 via-white to-brand-lavender/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-brand-plum/30 border-2 border-brand-rose rounded-3xl p-7 shadow-2xl space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-xs">
            Most Popular
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-brand-plum dark:text-brand-rose-light flex items-center gap-1.5">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                HerBook PLUS
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Advanced clinical diagnostics, PDF reports &amp; priority access
              </p>
            </div>

            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {billingCycle === "annual" ? "₹799" : "₹99"}
              <span className="text-xs font-normal text-zinc-500">
                {billingCycle === "annual" ? " / year (₹66/mo)" : " / month"}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-zinc-800 dark:text-zinc-200">
              <li className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-rose shrink-0" />
                <strong>Comprehensive Clinical PDF Export:</strong> Shareable report for doctors
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-rose shrink-0" />
                <strong>12-Month Hormonal Wave Trend Analysis:</strong> Extended historical graph
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-rose shrink-0" />
                <strong>Basal Temperature (BBT) &amp; Ovulation Wave Charts:</strong> Luteal insights
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-rose shrink-0" />
                <strong>VIP Workshop Discount:</strong> 50% discount on all clinician masterclasses
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-rose shrink-0" />
                <strong>HerWell AI Assistant Unlimited Usage:</strong> Instant clinical term explanations
              </li>
            </ul>
          </div>

          <button
            onClick={handleSubscribe}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-rose via-brand-plum to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {user.isPremium
                ? "Manage / Downgrade Subscription"
                : `Subscribe for ${billingCycle === "annual" ? "₹799/yr" : "₹99/mo"} (Sandbox)`}
            </span>
          </button>
        </div>
      </div>

      {/* Expert Workshops Section */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-display flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-rose" />
              Live Expert Workshops &amp; Masterclasses
            </h2>
            <p className="text-xs text-zinc-500">
              Interactive clinical webinars with leading Indian gynecologists &amp; Ayurvedic experts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workshops.map((ws) => (
            <div
              key={ws.id}
              className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-brand-rose uppercase tracking-wider">
                  Live Interactive Webinar
                </span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                  {ws.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Speaker: {ws.expert}
                </p>
                <div className="text-[11px] text-zinc-500 pt-1">
                  📅 {ws.date} • ⏰ {ws.time}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <div>
                  <div className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {formatINR(ws.price)}
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold">
                    {ws.seatsLeft} seats remaining
                  </span>
                </div>

                <button
                  onClick={() => handleRegisterWorkshop(ws.title, ws.price)}
                  className="px-4 py-2 rounded-xl bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-xs shadow-soft transition-all"
                >
                  Book Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* College and Corporate Wellness Module */}
      <section className="bg-gradient-to-r from-brand-plum to-brand-plum-dark text-white rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6 text-brand-rose-light" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              HerBook for Colleges &amp; Corporate Workplaces
            </h3>
            <p className="text-xs text-zinc-300">
              Menstrual hygiene workshops, workplace wellness leaves, and group telemedicine access.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-200 leading-relaxed space-y-1">
          <strong>Strict Confidentiality Guarantee:</strong> Individual cycle history and reproductive health data are <strong>NEVER</strong> disclosed to employers, universities, or third parties under organizational wellness arrangements.
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={() => showNotification("Institutional wellness prospectus requested!")}
            className="px-5 py-2.5 rounded-xl bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-xs shadow-soft transition-all"
          >
            Request Institutional Partnership
          </button>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Heart, ShieldCheck, ArrowRight, Droplet, Clock } from "lucide-react";
import { useCycle } from "@/context/CycleContext";
import { useApp } from "@/context/AppContext";
import { formatISODate, addDays } from "@/lib/cycleMath";

interface OnboardingCardProps {
  onOpenLogModal: () => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({ onOpenLogModal }) => {
  const { addPeriod } = useCycle();
  const { showNotification } = useApp();

  const [lastPeriodDate, setLastPeriodDate] = useState("2026-09-25");
  const [typicalCycleLength, setTypicalCycleLength] = useState("28");
  const [typicalPeriodDuration, setTypicalPeriodDuration] = useState("5");
  const [isIrregular, setIsIrregular] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(typicalPeriodDuration, 10) || 5;
    const startDate = new Date(lastPeriodDate);
    const endDate = addDays(startDate, duration - 1);

    addPeriod({
      startDate: formatISODate(startDate),
      endDate: formatISODate(endDate),
      flowIntensity: "medium",
      symptoms: ["Cramps"],
      notes: isIrregular ? "Self-reported irregular cycle preference enabled." : "First onboarding period record.",
    });

    showNotification("Welcome to HerCycle! Your personalized dashboard is now live.");
  };

  return (
    <div className="bg-gradient-to-br from-brand-blush/80 via-white to-brand-lavender/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-brand-plum/20 border-2 border-brand-rose/30 rounded-3xl p-6 sm:p-8 shadow-card space-y-6 animate-fadeIn">
      {/* Onboarding Header */}
      <div className="flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-rose to-brand-plum text-white flex items-center justify-center shadow-soft shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-rose/15 text-brand-plum dark:text-brand-rose text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <span>First-Time Setup</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-display">
            Welcome to HerCycle
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Let&apos;s understand your cycle together.
          </p>
        </div>
      </div>

      {/* Value props bullets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
          <Droplet className="w-4 h-4 text-brand-rose" />
          <div className="text-xs font-bold text-zinc-900 dark:text-white">Explainable Predictions</div>
          <div className="text-[11px] text-zinc-500">Accurate estimates based on your true cycle history</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <div className="text-xs font-bold text-zinc-900 dark:text-white">Absolute Privacy</div>
          <div className="text-[11px] text-zinc-500">Cycle data is private and never exposed to feeds</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1">
          <Clock className="w-4 h-4 text-brand-lavender-dark" />
          <div className="text-xs font-bold text-zinc-900 dark:text-white">Discreet Reminders</div>
          <div className="text-[11px] text-zinc-500">Lock-screen notifications with masked privacy terms</div>
        </div>
      </div>

      {/* Setup Form or Quick Buttons */}
      {!showQuickSetup ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenLogModal}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2"
          >
            <Droplet className="w-4 h-4" />
            <span>Log Your First Period</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQuickSetup(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Quick 1-Minute Calibration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleQuickSave} className="p-4 rounded-2xl bg-white dark:bg-zinc-800/70 border border-brand-rose/20 space-y-4 animate-fadeIn">
          <div className="text-xs font-bold text-zinc-900 dark:text-white">
            Quick Baseline Calibration (Optional Setup)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Last Period Start Date
              </label>
              <input
                type="date"
                required
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Typical Cycle Length (Days)
              </label>
              <input
                type="number"
                min="21"
                max="45"
                value={typicalCycleLength}
                onChange={(e) => setTypicalCycleLength(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Typical Bleeding (Days)
              </label>
              <input
                type="number"
                min="2"
                max="10"
                value={typicalPeriodDuration}
                onChange={(e) => setTypicalPeriodDuration(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="irregularCycle"
              checked={isIrregular}
              onChange={(e) => setIsIrregular(e.target.checked)}
              className="w-4 h-4 accent-brand-rose rounded cursor-pointer"
            />
            <label htmlFor="irregularCycle" className="text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
              My cycles are typically irregular or vary significantly (PCOS / Hormonal)
            </label>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setShowQuickSetup(false)}
              className="px-4 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft"
            >
              Save &amp; Generate Dashboard
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

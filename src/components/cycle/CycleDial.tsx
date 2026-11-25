"use client";

import React from "react";
import { Droplet, Sparkles, AlertCircle, Heart } from "lucide-react";
import { useCycle } from "@/context/CycleContext";
import { useApp } from "@/context/AppContext";
import { formatISODate } from "@/lib/cycleMath";
import { formatDate } from "@/lib/utils";

interface CycleDialProps {
  onOpenLogModal: () => void;
}

export const CycleDial: React.FC<CycleDialProps> = ({ onOpenLogModal }) => {
  const { predictions, dailyLogs, periods } = useCycle();
  const { t } = useApp();

  const todayStr = formatISODate(new Date(2026, 9, 16));
  const todayLog = dailyLogs[todayStr];

  // Calculate percentage of cycle completed
  const cycleProgress = Math.min(
    100,
    Math.round((predictions.currentCycleDay / predictions.averageCycleLength) * 100)
  );

  const daysUntilNext = Math.max(
    0,
    Math.round(
      (predictions.nextPeriodStart.getTime() - new Date(2026, 9, 16).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // SVG parameters for circular meter
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cycleProgress / 100) * circumference;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden transition-colors">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-rose/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-lavender/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        {/* Circular Progress Dial */}
        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-zinc-100 dark:text-zinc-800"
            />
            {/* Progress Arc */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="url(#cycleGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="cycleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E98CA8" />
                <stop offset="50%" stopColor="#B69ADD" />
                <stop offset="100%" stopColor="#60436E" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Info in Dial */}
          <div className="absolute flex flex-col items-center text-center px-4">
            <span className="text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-semibold mb-0.5">
              Cycle Day
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-brand-plum dark:text-brand-rose font-display">
              {predictions.currentCycleDay}
            </div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-blush dark:bg-brand-plum/30 text-brand-plum dark:text-brand-rose-light mt-1.5">
              <Sparkles className="w-3 h-3 mr-1 text-brand-rose" />
              {predictions.currentPhase} Phase
            </div>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
              Next period in ~<strong className="text-zinc-900 dark:text-white">{daysUntilNext} days</strong>
            </span>
          </div>
        </div>

        {/* Phase Details & Clinical Guidance */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {predictions.currentPhase} Phase Health Insights
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-rose/15 text-brand-plum dark:text-brand-rose-light">
                Day {predictions.currentCycleDay} of {predictions.averageCycleLength}
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
              {predictions.phaseDescription}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 font-semibold uppercase">Last Period</div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5 truncate">
                {periods.length > 0 ? formatDate(periods[0].startDate) : "None Logged"}
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 font-semibold uppercase">Est. Next Period</div>
              <div className="text-xs font-bold text-brand-plum dark:text-brand-rose mt-0.5 truncate">
                {formatDate(predictions.nextPeriodStart)}
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 font-semibold uppercase">Cycle Length</div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">
                {predictions.averageCycleLength} Days
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 font-semibold uppercase">Uncertainty</div>
              <div className="text-xs font-bold text-brand-success mt-0.5 flex items-center gap-1">
                <span>±{predictions.variabilityDays}d</span>
                <span className="text-[10px] text-zinc-400 font-normal">({predictions.confidence})</span>
              </div>
            </div>
          </div>

          {/* Today's Logged Symptoms Pill */}
          {todayLog && todayLog.symptoms.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mr-1">Logged today:</span>
              {todayLog.symptoms.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-xl text-xs bg-brand-blush dark:bg-zinc-800 text-brand-plum dark:text-brand-rose font-medium border border-brand-rose/20"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={onOpenLogModal}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all flex items-center space-x-2"
            >
              <Droplet className="w-4 h-4" />
              <span>{t.cycle.logPeriod} & Symptoms</span>
            </button>

            <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>Discreet Notifications Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Info, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp } from "lucide-react";
import { useCycle } from "@/context/CycleContext";
import { formatDate } from "@/lib/utils";

export const PredictionExplainer = () => {
  const { predictions, periods } = useCycle();

  const getConfidenceBadge = () => {
    switch (predictions.confidence) {
      case "High":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
          icon: CheckCircle2,
          text: "High Precision (Consistent Logs)",
        };
      case "Medium":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
          icon: Info,
          text: "Medium Confidence",
        };
      default:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
          icon: AlertTriangle,
          text: "Low / Initial Prediction",
        };
    }
  };

  const badge = getConfidenceBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-display">
            <TrendingUp className="w-5 h-5 text-brand-rose" />
            Explainable Prediction Model
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Transparent mathematical calculations with medical safety boundaries
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 self-start sm:self-auto ${badge.bg}`}>
          <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{badge.text}</span>
        </div>
      </div>

      {/* Primary Mathematical Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Estimated Next Period</div>
          <div className="text-base font-bold text-brand-plum dark:text-brand-rose-light mt-0.5">
            {formatDate(predictions.nextPeriodStart)}
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1">
            Expected duration: ~{predictions.averagePeriodLength} days
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Cycle Length & Variability</div>
          <div className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
            {predictions.averageCycleLength} ± {predictions.variabilityDays} Days
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1">
            Calculated across {periods.length} logged periods
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Approximate Fertile Window</div>
          <div className="text-base font-bold text-brand-lavender-dark mt-0.5">
            {formatDate(predictions.fertileWindowStart)} – {formatDate(predictions.fertileWindowEnd)}
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1">
            Estimated ovulation: {formatDate(predictions.estimatedOvulation)}
          </div>
        </div>
      </div>

      {/* Confidence explanation text */}
      <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <strong className="text-zinc-900 dark:text-white block mb-1">How This Was Calculated:</strong>
        {predictions.confidenceExplanation}
      </div>

      {/* Irregular Cycle Warning (If triggered) */}
      {predictions.isIrregular && predictions.irregularWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Noticeable Cycle Irregularity Detected</span>
            <p className="leading-relaxed">{predictions.irregularWarning}</p>
          </div>
        </div>
      )}

      {/* Non-Contraceptive Legal & Medical Safety Banner */}
      <div className="p-4 rounded-2xl bg-brand-blush/60 dark:bg-brand-plum/20 border border-brand-rose/25 text-xs text-brand-plum dark:text-brand-rose-light flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-brand-rose shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Clinical Accuracy & Contraception Notice:</span>
          <p className="leading-relaxed text-[11px] text-zinc-700 dark:text-zinc-300">
            Fertility estimates are educational mathematical projections (calculated assuming an average 14-day luteal phase). Ovulation dates naturally shift due to illness, stress, travel, or hormone dynamics. <strong>NEVER rely on estimated fertile windows as contraception or family planning guarantees.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Video,
  Activity,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Droplet,
  HeartPulse,
} from "lucide-react";
import { useCycle } from "@/context/CycleContext";

interface QuickCareStripProps {
  onOpenCycleModal?: () => void;
}

export const QuickCareStrip: React.FC<QuickCareStripProps> = ({ onOpenCycleModal }) => {
  const { predictions } = useCycle();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-rose" />
          <span>Quick Care Access</span>
        </span>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[10px] font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center transition-colors"
        >
          {isCollapsed ? "Show" : "Hide"}
          {isCollapsed ? (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          ) : (
            <ChevronUp className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none snap-x snap-mandatory">
          {/* Card 1: Track Cycle */}
          <Link
            href="/track"
            className="snap-start shrink-0 w-36 sm:w-40 p-3 rounded-2xl bg-gradient-to-br from-[#FFF1F5] to-[#F7CAD8]/40 dark:from-zinc-900 dark:to-brand-plum/30 border border-brand-rose/25 text-left hover:scale-[1.02] active:scale-[0.98] transition-all shadow-card group block"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-brand-rose/20 text-brand-plum dark:text-brand-rose flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-brand-rose bg-white/80 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                D{predictions.currentCycleDay}
              </span>
            </div>
            <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-tight">
              Track Cycle
            </div>
            <div className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
              {predictions.currentPhase} • Dashboard
            </div>
          </Link>

          {/* Card 2: Find Doctors */}
          <Link
            href="/consult"
            className="snap-start shrink-0 w-36 sm:w-40 p-3 rounded-2xl bg-gradient-to-br from-[#F3EBF9] to-[#DECFF7]/40 dark:from-zinc-900 dark:to-brand-plum/30 border border-brand-lavender/30 text-left hover:scale-[1.02] active:scale-[0.98] transition-all shadow-card group block"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-brand-lavender/25 text-brand-plum dark:text-brand-rose flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-brand-lavender-dark bg-white/80 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                ₹550
              </span>
            </div>
            <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-tight">
              Find Doctors
            </div>
            <div className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
              15 Verified • Video
            </div>
          </Link>

          {/* Card 3: PCOS Support */}
          <Link
            href="/pcos"
            className="snap-start shrink-0 w-36 sm:w-40 p-3 rounded-2xl bg-gradient-to-br from-[#FFF8EE] to-[#FFE2C2]/40 dark:from-zinc-900 dark:to-brand-plum/30 border border-amber-200/60 dark:border-amber-900/40 text-left hover:scale-[1.02] active:scale-[0.98] transition-all shadow-card group block"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-white/80 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                Screener
              </span>
            </div>
            <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-tight">
              PCOS Support
            </div>
            <div className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
              Rotterdam Checklist
            </div>
          </Link>

          {/* Card 4: Wellness Tips */}
          <Link
            href="/learn"
            className="snap-start shrink-0 w-36 sm:w-40 p-3 rounded-2xl bg-gradient-to-br from-[#F0FBF7] to-[#C9F3E4]/40 dark:from-zinc-900 dark:to-brand-plum/30 border border-emerald-200/60 dark:border-emerald-900/40 text-left hover:scale-[1.02] active:scale-[0.98] transition-all shadow-card group block"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-white/80 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                Daily
              </span>
            </div>
            <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-tight">
              Wellness Tips
            </div>
            <div className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
              Iron &amp; Energy Guide
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

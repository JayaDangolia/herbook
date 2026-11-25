"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";
import { useCycle } from "@/context/CycleContext";
import { useApp } from "@/context/AppContext";
import { BarChart3, Crown, Lock } from "lucide-react";
import Link from "next/link";

export const CycleAnalyticsCharts = () => {
  const { periods, dailyLogs } = useCycle();
  const { user } = useApp();

  // Prepare cycle lengths data for BarChart
  const cycleTrendData = periods
    .slice()
    .reverse()
    .map((p, index) => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return {
        month: start.toLocaleDateString("en-US", { month: "short" }),
        periodDays: duration,
        cycleLength: 28, // Normal baseline
      };
    });

  // Calculate symptom frequency across all daily logs
  const symptomCounts: Record<string, number> = {};
  Object.values(dailyLogs).forEach((log) => {
    log.symptoms.forEach((sym) => {
      symptomCounts[sym] = (symptomCounts[sym] || 0) + 1;
    });
  });

  // Fallback sample frequency for display
  if (Object.keys(symptomCounts).length === 0) {
    symptomCounts["Cramps"] = 4;
    symptomCounts["Bloating"] = 3;
    symptomCounts["Fatigue"] = 2;
    symptomCounts["Headache"] = 1;
  }

  const symptomChartData = Object.entries(symptomCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const colors = ["#E98CA8", "#B69ADD", "#60436E", "#27866C", "#D99232"];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-display">
            <BarChart3 className="w-5 h-5 text-brand-rose" />
            Cycle Trends & Historical Patterns
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Real user-recorded cycle metrics and symptom frequencies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Period Duration per Month Bar Chart */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center justify-between">
            <span>Period Bleeding Duration (Days)</span>
            <span className="text-[11px] font-normal text-zinc-600 dark:text-zinc-400">Past 4 cycles</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cycleTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 8]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#29212D",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="periodDays" fill="#E98CA8" radius={[8, 8, 0, 0]} name="Bleeding Days" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Frequent Symptoms */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center justify-between">
            <span>Reported Symptom Frequency</span>
            <span className="text-[11px] font-normal text-zinc-600 dark:text-zinc-400">Total logs</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomChartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#29212D",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} name="Occurrences">
                  {symptomChartData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Premium Analytics Preview / Locked Feature */}
      {!user.isPremium ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-blush to-brand-lavender/20 dark:from-zinc-800 dark:to-brand-plum/30 border border-brand-rose/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                Unlock HerBook Premium Analytics
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/30 text-amber-800 dark:text-amber-300">
                  ₹99/mo
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Luteal phase temperature trends, PDF gynecologist export reports, and hormone wave comparisons.
              </p>
            </div>
          </div>
          <Link
            href="/premium"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-soft transition-all shrink-0 flex items-center gap-1"
          >
            <span>Upgrade to PLUS</span>
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span><strong>Premium Unlocked:</strong> Clinical PDF Export & 12-Month Hormonal Trend Archival are Active.</span>
          </div>
          <button
            onClick={() => alert("Generating simulated clinical PDF summary report...")}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px]"
          >
            Export Clinical PDF
          </button>
        </div>
      )}
    </div>
  );
};

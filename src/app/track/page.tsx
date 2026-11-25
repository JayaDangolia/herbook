"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Droplet,
  Bell,
  Clock,
  Plus,
  ShieldCheck,
  TrendingUp,
  History,
  Settings,
  HeartPulse,
  Sparkles,
  Edit3,
  Trash2,
  Smile,
  Coffee,
  Moon,
  ChevronRight,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";
import { useCycle, PeriodEntry } from "@/context/CycleContext";
import { useApp } from "@/context/AppContext";
import { CycleDial } from "@/components/cycle/CycleDial";
import { CycleCalendar } from "@/components/cycle/CycleCalendar";
import { SymptomModal } from "@/components/cycle/SymptomModal";
import { LogPeriodModal } from "@/components/cycle/LogPeriodModal";
import { CycleSettingsModal } from "@/components/cycle/CycleSettingsModal";
import { OnboardingCard } from "@/components/cycle/OnboardingCard";
import { PredictionExplainer } from "@/components/cycle/PredictionExplainer";
import { CycleAnalyticsCharts } from "@/components/cycle/CycleAnalyticsCharts";
import { formatDate } from "@/lib/utils";
import { formatISODate } from "@/lib/cycleMath";

export default function TrackPage() {
  const router = useRouter();
  const { periods, dailyLogs, reminders, toggleReminder, addReminder, deletePeriod } = useCycle();
  const { t, showNotification } = useApp();

  // Active dashboard tab (Calendar • Symptoms • Predictions • History)
  const [activeTab, setActiveTab] = useState<"calendar" | "symptoms" | "predictions" | "history">(
    "calendar"
  );

  // Modal states
  const [isLogPeriodModalOpen, setIsLogPeriodModalOpen] = useState(false);
  const [periodToEdit, setPeriodToEdit] = useState<PeriodEntry | null>(null);
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    formatISODate(new Date(2026, 9, 16))
  );

  // New reminder form state
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00 AM");

  const todayStr = formatISODate(new Date(2026, 9, 16));
  const activeLog = dailyLogs[selectedCalendarDate] || dailyLogs[todayStr];

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleOpenAddPeriod = (date?: string) => {
    setPeriodToEdit(null);
    if (date) setSelectedCalendarDate(date);
    setIsLogPeriodModalOpen(true);
  };

  const handleOpenEditPeriod = (period: PeriodEntry) => {
    setPeriodToEdit(period);
    setIsLogPeriodModalOpen(true);
  };

  const handleCalendarDateSelect = (dateStr: string) => {
    setSelectedCalendarDate(dateStr);
    // Find if a recorded period starts/ends on this date
    const matchingPeriod = periods.find(
      (p) => dateStr >= p.startDate && dateStr <= p.endDate
    );
    if (matchingPeriod) {
      // User can edit or view that period
      setPeriodToEdit(matchingPeriod);
    }
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;
    addReminder({
      title: reminderTitle.trim(),
      type: "symptom",
      time: reminderTime,
      enabled: true,
    });
    setReminderTitle("");
    setShowAddReminder(false);
    showNotification("Custom reminder saved!");
  };

  const handleDeletePeriodRecord = (id: string) => {
    if (confirm("Delete this period record? Your prediction estimates will automatically recalibrate.")) {
      deletePeriod(id);
      showNotification("Period record removed.");
    }
  };

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-3 sm:px-4 py-3 space-y-4 pb-28 animate-fadeIn">
      {/* 1. Header with Back Navigation, Title & Quick Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 -ml-1 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white font-display">
                HerCycle
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
                Private Vault
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              Your cycle, your health.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setIsRemindersOpen(true)}
            className="p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 relative transition-colors"
            title="Discreet Reminders"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-brand-rose absolute top-1.5 right-1.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
            title="Cycle Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Prominent Quick Action Bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleOpenAddPeriod()}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2"
        >
          <Droplet className="w-4 h-4 fill-white" />
          <span>Log Period</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSymptomModalOpen(true)}
          className="py-3 px-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-brand-rose text-zinc-800 dark:text-zinc-200 font-bold text-xs shadow-card flex items-center justify-center space-x-1.5 transition-colors"
        >
          <HeartPulse className="w-4 h-4 text-brand-rose" />
          <span>Log Symptoms</span>
        </button>
      </div>

      {/* 3. First-Time User Experience (Zero Records) OR Cycle Overview Card */}
      {periods.length === 0 ? (
        <OnboardingCard onOpenLogModal={() => handleOpenAddPeriod()} />
      ) : (
        <CycleDial onOpenLogModal={() => handleOpenAddPeriod()} />
      )}

      {/* 4. Dashboard Four Compact Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        {[
          { id: "calendar", label: "Calendar", icon: Calendar },
          { id: "symptoms", label: "Symptoms", icon: HeartPulse },
          { id: "predictions", label: "Predictions", icon: TrendingUp },
          { id: "history", label: "History", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                isActive
                  ? "bg-white dark:bg-zinc-800 text-brand-plum dark:text-brand-rose shadow-soft"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Tab Content Panes */}

      {/* TAB 1: CALENDAR */}
      {activeTab === "calendar" && (
        <div className="space-y-4 animate-fadeIn">
          <CycleCalendar onSelectDate={handleCalendarDateSelect} />
        </div>
      )}

      {/* TAB 2: SYMPTOMS */}
      {activeTab === "symptoms" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Daily Symptoms Overview Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-rose/20 text-brand-plum dark:text-brand-rose flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white font-display">
                    Daily Wellness &amp; Symptoms
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Record for Date: <strong className="text-brand-plum dark:text-brand-rose">{selectedCalendarDate}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSymptomModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-brand-rose hover:bg-brand-rose-dark text-white text-xs font-bold shadow-soft transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Today</span>
              </button>
            </div>

            {/* Metrics Breakdown for the date */}
            {activeLog ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                      <Smile className="w-3.5 h-3.5 text-amber-500" /> Dominant Mood
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white mt-1 block">
                      {activeLog.mood || "Balanced"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-brand-rose" /> Bleeding Flow
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white mt-1 block capitalize">
                      {activeLog.flow || "None recorded"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-blue-500" /> Hydration
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white mt-1 block">
                      {activeLog.waterIntakeGlasses || 8} Glasses
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-400" /> Sleep Duration
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white mt-1 block">
                      {activeLog.sleepHours || 7.5} Hours
                    </span>
                  </div>
                </div>

                {/* Logged Symptoms List */}
                <div>
                  <span className="text-[11px] font-bold uppercase text-zinc-500 block mb-1.5">
                    Logged Physical Sensations:
                  </span>
                  {activeLog.symptoms.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {activeLog.symptoms.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-xl text-xs bg-brand-blush dark:bg-zinc-800 text-brand-plum dark:text-brand-rose font-medium border border-brand-rose/25"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No physical symptoms flagged for this day.</p>
                  )}
                </div>

                {activeLog.notes && (
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 text-xs">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-0.5">
                      Personal Note:
                    </span>
                    <p className="text-zinc-700 dark:text-zinc-300 italic">
                      &quot;{activeLog.notes}&quot;
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-zinc-500">
                  No symptom entry recorded for {selectedCalendarDate} yet.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSymptomModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-rose text-white text-xs font-bold"
                >
                  Record Symptoms for {selectedCalendarDate}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PREDICTIONS */}
      {activeTab === "predictions" && (
        <div className="space-y-4 animate-fadeIn">
          <PredictionExplainer />
        </div>
      )}

      {/* TAB 4: HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Previous Periods List with Edit and Delete */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-rose/15 text-brand-rose flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white font-display">
                    Period History &amp; Audited Logs
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {periods.length} recorded cycles used for mathematical predictions
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAddPeriod()}
                className="px-3.5 py-1.5 rounded-xl bg-brand-plum text-white text-xs font-bold hover:bg-brand-plum-dark transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            </div>

            {periods.length > 0 ? (
              <div className="space-y-2.5">
                {periods.map((p) => {
                  const start = new Date(p.startDate);
                  const end = new Date(p.endDate);
                  const durationDays =
                    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-white">
                            {formatDate(p.startDate)} – {formatDate(p.endDate)}
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-2">
                            <span className="capitalize">Flow: <strong>{p.flowIntensity}</strong></span>
                            <span>•</span>
                            <span className="font-semibold text-brand-plum dark:text-brand-rose">
                              {durationDays} Days Duration
                            </span>
                          </div>
                        </div>

                        {/* Edit and Delete Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPeriod(p)}
                            className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
                            title="Edit Period"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePeriodRecord(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-brand-error transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {p.symptoms && p.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.symptoms.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {p.notes && (
                        <p className="text-[11px] text-zinc-500 italic">
                          &quot;{p.notes}&quot;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-500 text-xs">
                No past periods logged yet.
              </div>
            )}
          </div>

          {/* Historical Analytics Charts */}
          <CycleAnalyticsCharts />
        </div>
      )}

      {/* 6. Discreet Reminders Drawer / Modal */}
      {isRemindersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-[2rem] sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-lavender/20 text-brand-lavender-dark flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white font-display">
                    Discreet Reminders &amp; Alerts
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Masked wording protects privacy on mobile lock screens
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRemindersOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">Active Notifications</span>
              <button
                type="button"
                onClick={() => setShowAddReminder(!showAddReminder)}
                className="text-xs font-bold text-brand-rose flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom</span>
              </button>
            </div>

            {showAddReminder && (
              <form onSubmit={handleCreateReminder} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2.5 animate-fadeIn text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    required
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    placeholder="e.g. Evening Spearmint Tea or Hydration Alert"
                    className="w-full p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    placeholder="e.g. 08:30 PM"
                    className="w-full p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddReminder(false)}
                    className="px-3 py-1.5 rounded-lg border text-zinc-600 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-brand-rose text-white font-bold"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">
                      {rem.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{rem.time}</span>
                      {rem.notes && <span>• {rem.notes}</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      rem.enabled ? "bg-brand-rose" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                    aria-label="Toggle Reminder"
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        rem.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Comprehensive Period Logging Modal */}
      <LogPeriodModal
        isOpen={isLogPeriodModalOpen}
        onClose={() => {
          setIsLogPeriodModalOpen(false);
          setPeriodToEdit(null);
        }}
        periodToEdit={periodToEdit}
        initialDate={selectedCalendarDate}
      />

      {/* 8. Daily Symptom Logging Modal */}
      <SymptomModal
        isOpen={isSymptomModalOpen}
        onClose={() => setIsSymptomModalOpen(false)}
        selectedDate={selectedCalendarDate}
      />

      {/* 9. Cycle Settings Modal */}
      <CycleSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

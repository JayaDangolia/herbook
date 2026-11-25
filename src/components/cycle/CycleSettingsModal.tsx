"use client";

import React, { useState, useEffect } from "react";
import { X, Settings, ShieldCheck, Bell, Download, Trash2, CheckCircle2, Lock } from "lucide-react";
import { useCycle } from "@/context/CycleContext";
import { useApp } from "@/context/AppContext";
import { Portal } from "@/components/ui/Portal";

interface CycleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CycleSettingsModal: React.FC<CycleSettingsModalProps> = ({ isOpen, onClose }) => {
  const { periods, deletePeriod } = useCycle();
  const { showNotification } = useApp();

  const [discreetMode, setDiscreetMode] = useState(true);
  const [cycleLengthPreference, setCycleLengthPreference] = useState(28);
  const [lutealPhase, setLutealPhase] = useState(14);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    showNotification("Cycle calculation parameters and discreet notification settings saved!");
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 400);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all menstrual records? This cannot be undone.")) {
      periods.forEach((p) => deletePeriod(p.id));
      showNotification("All menstrual records deleted. Onboarding state activated.");
      onClose();
    }
  };

  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(periods, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `hercycle_records_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("HerCycle records exported as secure JSON!");
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cycle Settings & Privacy"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-[2rem] sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5"
        >
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-2 mb-2 sm:hidden" />

          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-rose/20 text-brand-plum dark:text-brand-rose flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-display">
                  Cycle Settings &amp; Privacy
                </h3>
                <p className="text-xs text-zinc-500">Fine-tune calculations and discreet alerts</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            {/* Calculation Parameters */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-zinc-500 text-[10px]">
                Calculation Parameters
              </h4>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Default Cycle Length (Days)
                  </label>
                  <span className="font-bold text-brand-plum dark:text-brand-rose">
                    {cycleLengthPreference} days
                  </span>
                </div>
                <input
                  type="range"
                  min="21"
                  max="45"
                  value={cycleLengthPreference}
                  onChange={(e) => setCycleLengthPreference(Number(e.target.value))}
                  className="w-full accent-brand-rose cursor-pointer"
                />
                <span className="text-[10px] text-zinc-400">
                  Clinical normal range: 21 to 35 days (ACOG Guidelines)
                </span>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Luteal Phase Duration (Days)
                  </label>
                  <span className="font-bold text-brand-plum dark:text-brand-rose">
                    {lutealPhase} days
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="16"
                  value={lutealPhase}
                  onChange={(e) => setLutealPhase(Number(e.target.value))}
                  className="w-full accent-brand-rose cursor-pointer"
                />
                <span className="text-[10px] text-zinc-400">
                  Days between ovulation and subsequent menstruation (typically 12–14 days)
                </span>
              </div>
            </div>

            {/* Notification Discretion */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-zinc-500 text-[10px]">
                Discreet Indian Privacy
              </h4>

              <label className="flex items-start space-x-2.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={discreetMode}
                  onChange={(e) => setDiscreetMode(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-rose accent-brand-rose mt-0.5"
                />
                <div>
                  <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
                    <span>Discreet Notification Wording</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                    Uses subtle wording like &quot;Personal Wellness Update&quot; instead of &quot;Your period is expected tomorrow&quot; on your device lock screen.
                  </p>
                </div>
              </label>
            </div>

            {/* Data Management */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportData}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-brand-rose" />
                <span>Export Cycle Data</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold shadow-soft hover:shadow-glow transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

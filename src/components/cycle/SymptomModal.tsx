"use client";

import React, { useState } from "react";
import { X, Check, Droplet, Smile, Moon, Coffee, HeartPulse } from "lucide-react";
import { useCycle, DailySymptomLog } from "@/context/CycleContext";
import { useApp } from "@/context/AppContext";
import { formatISODate } from "@/lib/cycleMath";
import { Portal } from "@/components/ui/Portal";

interface SymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
}

export const SymptomModal: React.FC<SymptomModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
}) => {
  const { addPeriod, saveDailyLog, dailyLogs, periods } = useCycle();
  const { t, showNotification } = useApp();

  const activeDate = selectedDate || formatISODate(new Date(2026, 9, 16));
  const existingLog = dailyLogs[activeDate];

  const [isPeriodActive, setIsPeriodActive] = useState<boolean>(false);
  const [flow, setFlow] = useState<"spotting" | "light" | "medium" | "heavy">(
    existingLog?.flow || "medium"
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    existingLog?.symptoms || []
  );
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">(
    existingLog?.severity || "moderate"
  );
  const [mood, setMood] = useState<string>(existingLog?.mood || "Balanced");
  const [notes, setNotes] = useState<string>(existingLog?.notes || "");
  const [waterGlasses, setWaterGlasses] = useState<number>(
    existingLog?.waterIntakeGlasses || 8
  );
  const [sleepHours, setSleepHours] = useState<number>(
    existingLog?.sleepHours || 7.5
  );

  React.useEffect(() => {
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

  const symptomOptions = [
    { label: t.cycle.cramps, id: "Cramps" },
    { label: t.cycle.headache, id: "Headache" },
    { label: t.cycle.bloating, id: "Bloating" },
    { label: t.cycle.moodSwings, id: "Mood Swings" },
    { label: t.cycle.fatigue, id: "Fatigue" },
    { label: t.cycle.acne, id: "Acne" },
    { label: t.cycle.breastTenderness, id: "Breast Tenderness" },
    { label: t.cycle.backPain, id: "Back Pain" },
    { label: t.cycle.digestive, id: "Digestive Discomfort" },
    { label: t.cycle.sleepIssues, id: "Sleep Disturbance" },
  ];

  const moods = ["Energized", "Happy", "Balanced", "Anxious", "Sensitive", "Exhausted"];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSave = () => {
    // Save daily log
    const log: DailySymptomLog = {
      date: activeDate,
      flow: isPeriodActive ? flow : undefined,
      symptoms: selectedSymptoms,
      severity,
      mood,
      notes,
      waterIntakeGlasses: waterGlasses,
      sleepHours,
    };
    saveDailyLog(log);

    // If period is marked active, also ensure period record is created
    if (isPeriodActive) {
      addPeriod({
        startDate: activeDate,
        endDate: activeDate,
        flowIntensity: flow,
        symptoms: selectedSymptoms,
        notes,
      });
      showNotification("Period record and symptoms saved successfully!");
    } else {
      showNotification("Daily symptoms and wellness metrics updated!");
    }

    onClose();
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Log Symptoms & Sensations"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-brand-rose" />
            Log Symptoms & Sensations
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
            Record for Date: <strong className="text-brand-plum dark:text-brand-rose-light">{activeDate}</strong>
          </p>
        </div>

        <div className="space-y-5">
          {/* Period Flow Switcher */}
          <div className="bg-brand-blush/60 dark:bg-zinc-800/60 p-4 rounded-2xl border border-brand-rose/20">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Droplet className="w-4 h-4 text-brand-rose" />
                Are you bleeding today?
              </label>
              <input
                type="checkbox"
                checked={isPeriodActive}
                onChange={(e) => setIsPeriodActive(e.target.checked)}
                className="w-5 h-5 accent-brand-rose rounded cursor-pointer"
              />
            </div>

            {isPeriodActive && (
              <div className="pt-2 border-t border-brand-rose/20 animate-fadeIn">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 block mb-2">
                  Select Bleeding Intensity:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {(["spotting", "light", "medium", "heavy"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFlow(level)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        flow === level
                          ? "bg-brand-rose text-white border-brand-rose shadow-soft"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-brand-rose"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Symptoms Checklist */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2.5">
              Symptoms & Physical Sensations
            </label>
            <div className="grid grid-cols-2 gap-2">
              {symptomOptions.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between border transition-all ${
                      isSelected
                        ? "bg-brand-plum/10 dark:bg-brand-rose/15 border-brand-plum dark:border-brand-rose text-brand-plum dark:text-brand-rose-light font-bold"
                        : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200/80 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                    }`}
                  >
                    <span>{sym.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-rose shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Symptom Severity */}
          {selectedSymptoms.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                Overall Severity
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(["mild", "moderate", "severe"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                      severity === s
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900"
                        : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mood Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mb-2">
              <Smile className="w-3.5 h-3.5" /> Dominant Mood
            </label>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    mood === m
                      ? "bg-brand-lavender/30 border-brand-lavender text-brand-plum dark:text-brand-rose-light font-bold"
                      : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Wellness Habits: Water & Sleep */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <div className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-blue-500" /> Water Intake
              </div>
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white font-bold"
                >
                  -
                </button>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {waterGlasses} glasses
                </span>
                <button
                  type="button"
                  onClick={() => setWaterGlasses(waterGlasses + 1)}
                  className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <div className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-indigo-400" /> Sleep Hours
              </div>
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setSleepHours(Math.max(0, sleepHours - 0.5))}
                  className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white font-bold"
                >
                  -
                </button>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {sleepHours}h
                </span>
                <button
                  type="button"
                  onClick={() => setSleepHours(sleepHours + 0.5)}
                  className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Notes textarea */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1">
              Personal Clinical Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mild cramping after workout, spearmint tea helped with bloating..."
              className="w-full p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose resize-none h-20"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum text-white text-xs font-bold shadow-soft hover:shadow-glow transition-all"
            >
              Save Record
            </button>
          </div>
        </div>
      </div>
    </div>
  </Portal>
);
};

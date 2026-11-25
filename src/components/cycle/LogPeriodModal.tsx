"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Droplet, Heart, Check, Trash2, ShieldCheck, Sparkles } from "lucide-react";
import { useCycle, PeriodEntry } from "@/context/CycleContext";
import { useApp } from "@/context/AppContext";
import { formatISODate } from "@/lib/cycleMath";
import { Portal } from "@/components/ui/Portal";

interface LogPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodToEdit?: PeriodEntry | null;
  initialDate?: string;
}

export const LogPeriodModal: React.FC<LogPeriodModalProps> = ({
  isOpen,
  onClose,
  periodToEdit,
  initialDate,
}) => {
  const { addPeriod, updatePeriod, deletePeriod } = useCycle();
  const { showNotification } = useApp();

  const defaultDate = initialDate || formatISODate(new Date(2026, 9, 16));

  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [flow, setFlow] = useState<"spotting" | "light" | "medium" | "heavy">("medium");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string>("Balanced");
  const [notes, setNotes] = useState<string>("");

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

  useEffect(() => {
    if (periodToEdit) {
      setStartDate(periodToEdit.startDate);
      setEndDate(periodToEdit.endDate);
      setFlow(periodToEdit.flowIntensity);
      setSelectedSymptoms(periodToEdit.symptoms || []);
      setNotes(periodToEdit.notes || "");
    } else if (initialDate) {
      setStartDate(initialDate);
      setEndDate(initialDate);
      setFlow("medium");
      setSelectedSymptoms([]);
      setNotes("");
    } else {
      setStartDate(defaultDate);
      setEndDate(defaultDate);
      setFlow("medium");
      setSelectedSymptoms([]);
      setNotes("");
    }
  }, [periodToEdit, initialDate, defaultDate, isOpen]);

  if (!isOpen) return null;

  const symptomOptions = [
    "Cramps",
    "Headache",
    "Fatigue",
    "Bloating",
    "Acne",
    "Mood Swings",
    "Breast Tenderness",
    "Back Pain",
    "Spotting",
    "Digestive Discomfort",
  ];

  const moodOptions = ["Energized", "Happy", "Balanced", "Anxious", "Sensitive", "Exhausted"];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (new Date(startDate) > new Date(endDate)) {
      showNotification("End date cannot be earlier than start date.");
      return;
    }

    if (periodToEdit) {
      updatePeriod(periodToEdit.id, {
        startDate,
        endDate,
        flowIntensity: flow,
        symptoms: selectedSymptoms,
        notes: notes.trim(),
      });
      showNotification("Period record updated successfully!");
    } else {
      addPeriod({
        startDate,
        endDate,
        flowIntensity: flow,
        symptoms: selectedSymptoms,
        notes: notes.trim(),
      });
      showNotification("New period recorded to HerCycle!");
    }

    onClose();
  };

  const handleDelete = () => {
    if (periodToEdit) {
      deletePeriod(periodToEdit.id);
      showNotification("Period record deleted.");
      onClose();
    }
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Log Period & Flow"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-[2rem] sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5"
        >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-2 mb-2 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-rose/20 text-brand-plum dark:text-brand-rose flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-display">
                {periodToEdit ? "Edit Period Entry" : "Log Period & Flow"}
              </h3>
              <p className="text-xs text-zinc-500">
                Encrypted &amp; private to your HerCycle account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start and End Date Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1">
                Period Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-rose focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1">
                Period End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-rose focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Flow Intensity Buttons */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1.5">
              Flow Intensity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["spotting", "light", "medium", "heavy"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFlow(lvl)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                    flow === lvl
                      ? "bg-brand-rose text-white border-brand-rose shadow-soft"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-brand-rose/50"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1.5">
              Symptoms &amp; Sensations
            </label>
            <div className="grid grid-cols-2 gap-2">
              {symptomOptions.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between border transition-all ${
                      isSelected
                        ? "bg-brand-plum/10 dark:bg-brand-rose/15 border-brand-plum dark:border-brand-rose text-brand-plum dark:text-brand-rose-light font-bold"
                        : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/80 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                    }`}
                  >
                    <span>{sym}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-rose shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1.5">
              Emotional State &amp; Mood
            </label>
            <div className="flex flex-wrap gap-1.5">
              {moodOptions.map((m) => (
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

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1">
              Personal Notes &amp; Observations
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mild cramps day 1, warm water bag provided relief, spearmint tea in the evening..."
              className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose resize-none h-16"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            {periodToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl text-brand-error hover:bg-brand-error/10 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum text-white text-xs font-bold shadow-soft hover:shadow-glow transition-all"
              >
                {periodToEdit ? "Update Period" : "Save Period Record"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Portal>
);
};

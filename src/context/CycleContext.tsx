"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import {
  PeriodEntry,
  calculateCyclePredictions,
  PredictionResult,
} from "@/lib/cycleMath";

export type { PeriodEntry, PredictionResult };

export interface DailySymptomLog {
  date: string; // YYYY-MM-DD
  flow?: "spotting" | "light" | "medium" | "heavy";
  symptoms: string[];
  severity: "mild" | "moderate" | "severe";
  mood?: string;
  notes?: string;
  waterIntakeGlasses?: number;
  sleepHours?: number;
}

export interface ReminderSetting {
  id: string;
  title: string;
  type: "period" | "ovulation" | "medication" | "symptom";
  time: string;
  enabled: boolean;
  notes?: string;
}

interface CycleContextType {
  periods: PeriodEntry[];
  addPeriod: (entry: Omit<PeriodEntry, "id">) => void;
  updatePeriod: (id: string, entry: Partial<PeriodEntry>) => void;
  deletePeriod: (id: string) => void;
  predictions: PredictionResult;
  dailyLogs: Record<string, DailySymptomLog>;
  saveDailyLog: (log: DailySymptomLog) => void;
  reminders: ReminderSetting[];
  toggleReminder: (id: string) => void;
  addReminder: (rem: Omit<ReminderSetting, "id">) => void;
}

// Realistic initial sample periods for Indian user demo
const initialPeriods: PeriodEntry[] = [
  {
    id: "p-1",
    startDate: "2026-09-20",
    endDate: "2026-09-24",
    flowIntensity: "medium",
    symptoms: ["Cramps", "Bloating"],
    notes: "Day 2 cramps relieved with warm herbal tea.",
  },
  {
    id: "p-2",
    startDate: "2026-08-23",
    endDate: "2026-08-27",
    flowIntensity: "medium",
    symptoms: ["Headache", "Fatigue"],
    notes: "Slight headache on day 1.",
  },
  {
    id: "p-3",
    startDate: "2026-07-26",
    endDate: "2026-07-30",
    flowIntensity: "heavy",
    symptoms: ["Cramps", "Mood Swings"],
  },
  {
    id: "p-4",
    startDate: "2026-06-28",
    endDate: "2026-07-02",
    flowIntensity: "medium",
    symptoms: ["Bloating"],
  },
];

const initialDailyLogs: Record<string, DailySymptomLog> = {
  "2026-10-15": {
    date: "2026-10-15",
    symptoms: ["Mild Cramps", "Bloating"],
    severity: "mild",
    mood: "Reflective",
    notes: "Luteal phase energy dip. Took a gentle walk.",
    waterIntakeGlasses: 8,
    sleepHours: 7.5,
  },
};

const initialReminders: ReminderSetting[] = [
  {
    id: "rem-1",
    title: "Upcoming Period Alert (Discreet)",
    type: "period",
    time: "09:00 AM",
    enabled: true,
    notes: "Notification: 'Your personal wellness cycle update is ready'",
  },
  {
    id: "rem-2",
    title: "Daily Evening Symptom Check-in",
    type: "symptom",
    time: "08:30 PM",
    enabled: true,
  },
  {
    id: "rem-3",
    title: "Myo-Inositol & Vitamin D3 Reminder",
    type: "medication",
    time: "10:00 AM",
    enabled: false,
    notes: "Post-breakfast supplement",
  },
];

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export const CycleProvider = ({ children }: { children: ReactNode }) => {
  const [periods, setPeriods] = useState<PeriodEntry[]>(initialPeriods);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailySymptomLog>>(initialDailyLogs);
  const [reminders, setReminders] = useState<ReminderSetting[]>(initialReminders);

  useEffect(() => {
    try {
      const savedPeriods = localStorage.getItem("herbook_periods");
      if (savedPeriods) setPeriods(JSON.parse(savedPeriods));

      const savedLogs = localStorage.getItem("herbook_daily_logs");
      if (savedLogs) setDailyLogs(JSON.parse(savedLogs));

      const savedReminders = localStorage.getItem("herbook_reminders");
      if (savedReminders) setReminders(JSON.parse(savedReminders));
    } catch {}
  }, []);

  const savePeriodsToStorage = (newPeriods: PeriodEntry[]) => {
    setPeriods(newPeriods);
    try {
      localStorage.setItem("herbook_periods", JSON.stringify(newPeriods));
    } catch {}
  };

  const addPeriod = (entry: Omit<PeriodEntry, "id">) => {
    const newEntry: PeriodEntry = {
      ...entry,
      id: `period-${Date.now()}`,
    };
    const updated = [newEntry, ...periods];
    savePeriodsToStorage(updated);
  };

  const updatePeriod = (id: string, entry: Partial<PeriodEntry>) => {
    const updated = periods.map((p) => (p.id === id ? { ...p, ...entry } : p));
    savePeriodsToStorage(updated);
  };

  const deletePeriod = (id: string) => {
    const updated = periods.filter((p) => p.id !== id);
    savePeriodsToStorage(updated);
  };

  const saveDailyLog = (log: DailySymptomLog) => {
    setDailyLogs((prev) => {
      const next = { ...prev, [log.date]: log };
      try {
        localStorage.setItem("herbook_daily_logs", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
      try {
        localStorage.setItem("herbook_reminders", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addReminder = (rem: Omit<ReminderSetting, "id">) => {
    const nextItem: ReminderSetting = { ...rem, id: `rem-${Date.now()}` };
    setReminders((prev) => {
      const next = [...prev, nextItem];
      try {
        localStorage.setItem("herbook_reminders", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Recalculate predictions whenever periods change
  const predictions = useMemo(() => {
    return calculateCyclePredictions(periods, new Date(2026, 9, 16));
  }, [periods]);

  return (
    <CycleContext.Provider
      value={{
        periods,
        addPeriod,
        updatePeriod,
        deletePeriod,
        predictions,
        dailyLogs,
        saveDailyLog,
        reminders,
        toggleReminder,
        addReminder,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
};

export const useCycle = () => {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error("useCycle must be used within a CycleProvider");
  }
  return context;
};

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import {
  PeriodEntry,
  calculateCyclePredictions,
  PredictionResult,
} from "@/lib/cycleMath";
import { useApp } from "./AppContext";

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
  addPeriod: (entry: Omit<PeriodEntry, "id">) => Promise<void>;
  updatePeriod: (id: string, entry: Partial<PeriodEntry>) => void;
  deletePeriod: (id: string) => Promise<void>;
  predictions: PredictionResult;
  dailyLogs: Record<string, DailySymptomLog>;
  saveDailyLog: (log: DailySymptomLog) => void;
  reminders: ReminderSetting[];
  toggleReminder: (id: string) => void;
  addReminder: (rem: Omit<ReminderSetting, "id">) => void;
  isLoadingPeriods: boolean;
}

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
];

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export const CycleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useApp();
  const [periods, setPeriods] = useState<PeriodEntry[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailySymptomLog>>({});
  const [reminders, setReminders] = useState<ReminderSetting[]>(initialReminders);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState<boolean>(true);

  // Sync periods with persistent database based on authenticated user
  useEffect(() => {
    async function loadUserPeriods() {
      setIsLoadingPeriods(true);
      if (!user) {
        setPeriods([]);
        setIsLoadingPeriods(false);
        return;
      }

      try {
        const res = await fetch("/api/cycle/periods");
        if (res.ok) {
          const data = await res.json();
          if (data.periods) {
            const formatted = data.periods.map((p: any) => ({
              id: p.id,
              startDate: p.startDate,
              endDate: p.endDate,
              flowIntensity: p.flow,
              symptoms: p.symptoms || [],
              notes: p.notes,
            }));
            setPeriods(formatted);
            setIsLoadingPeriods(false);
            return;
          }
        }
      } catch (err) {
        console.error("Error loading periods from API:", err);
      }

      setPeriods([]);
      setIsLoadingPeriods(false);
    }

    loadUserPeriods();
  }, [user]);

  const addPeriod = async (entry: Omit<PeriodEntry, "id">) => {
    // Optimistic local update
    const tempId = `temp-${Date.now()}`;
    const newEntry: PeriodEntry = { ...entry, id: tempId };
    setPeriods((prev) => [newEntry, ...prev]);

    if (user) {
      try {
        const res = await fetch("/api/cycle/periods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate: entry.startDate,
            endDate: entry.endDate,
            flow: entry.flowIntensity,
            symptoms: entry.symptoms,
            notes: entry.notes,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.period) {
            setPeriods((prev) =>
              prev.map((p) => (p.id === tempId ? { ...p, id: data.period.id } : p))
            );
          }
        }
      } catch (e) {
        console.error("Failed to save period to database:", e);
      }
    }
  };

  const updatePeriod = (id: string, entry: Partial<PeriodEntry>) => {
    setPeriods((prev) => prev.map((p) => (p.id === id ? { ...p, ...entry } : p)));
  };

  const deletePeriod = async (id: string) => {
    setPeriods((prev) => prev.filter((p) => p.id !== id));
    if (user) {
      try {
        await fetch(`/api/cycle/periods?id=${id}`, { method: "DELETE" });
      } catch (e) {
        console.error("Failed to delete period from database:", e);
      }
    }
  };

  const saveDailyLog = (log: DailySymptomLog) => {
    setDailyLogs((prev) => ({ ...prev, [log.date]: log }));
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const addReminder = (rem: Omit<ReminderSetting, "id">) => {
    const newRem: ReminderSetting = { ...rem, id: `rem-${Date.now()}` };
    setReminders((prev) => [...prev, newRem]);
  };

  // Run scientific cycle calculations with clinical uncertainty
  const predictions: PredictionResult = useMemo(() => {
    return calculateCyclePredictions(periods);
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
        isLoadingPeriods,
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

"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Droplet, Sparkles, Calendar as CalendarIcon } from "lucide-react";
import { useCycle } from "@/context/CycleContext";
import { formatISODate, parseISODate } from "@/lib/cycleMath";

interface CycleCalendarProps {
  onSelectDate: (dateStr: string) => void;
}

export const CycleCalendar: React.FC<CycleCalendarProps> = ({ onSelectDate }) => {
  const { periods, predictions, dailyLogs } = useCycle();

  // Current calendar viewing month
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 9, 1)); // October 2026
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-16");

  const monthYearStr = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Calendar matrix calculation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Pre-calculate date string lookups
  const isPeriodDay = (dateStr: string) => {
    return periods.some((p) => {
      return dateStr >= p.startDate && dateStr <= p.endDate;
    });
  };

  const isPredictedPeriodDay = (dateStr: string) => {
    const pStart = formatISODate(predictions.nextPeriodStart);
    const pEnd = formatISODate(predictions.nextPeriodEnd);
    return dateStr >= pStart && dateStr <= pEnd;
  };

  const isPredictedFertileDay = (dateStr: string) => {
    const fStart = formatISODate(predictions.fertileWindowStart);
    const fEnd = formatISODate(predictions.fertileWindowEnd);
    return dateStr >= fStart && dateStr <= fEnd;
  };

  const isOvulationDay = (dateStr: string) => {
    return dateStr === formatISODate(predictions.estimatedOvulation);
  };

  const hasSymptomsLogged = (dateStr: string) => {
    return dailyLogs[dateStr] && dailyLogs[dateStr].symptoms.length > 0;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card transition-colors">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-blush dark:bg-brand-plum/30 flex items-center justify-center text-brand-plum dark:text-brand-rose">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-display">
              {monthYearStr}
            </h3>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
              Click any date to log bleeding or daily symptoms
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd, i) => (
          <div
            key={wd}
            className={`text-[11px] font-bold uppercase tracking-wider py-1 ${
              i === 0 || i === 6 ? "text-zinc-500" : "text-zinc-700 dark:text-zinc-300"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-12 sm:h-14" />;
          }

          const dayDate = new Date(year, month, day);
          const dateStr = formatISODate(dayDate);
          const isToday = dateStr === "2026-10-16";
          const inPeriod = isPeriodDay(dateStr);
          const inPredictedPeriod = isPredictedPeriodDay(dateStr);
          const inFertile = isPredictedFertileDay(dateStr);
          const isOvulation = isOvulationDay(dateStr);
          const hasSymptom = hasSymptomsLogged(dateStr);
          const isSelected = selectedDate === dateStr;

          let cellClass =
            "bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-brand-rose border border-zinc-100 dark:border-zinc-800";

          if (inPeriod) {
            cellClass =
              "bg-gradient-to-tr from-brand-rose to-brand-rose-dark text-white font-bold shadow-soft border-brand-rose";
          } else if (inPredictedPeriod) {
            cellClass =
              "bg-brand-blush dark:bg-brand-plum/30 border-2 border-dashed border-brand-rose text-brand-plum dark:text-brand-rose-light font-bold";
          } else if (isOvulation) {
            cellClass =
              "bg-brand-lavender/30 dark:bg-brand-lavender/20 border-2 border-brand-lavender text-brand-plum dark:text-brand-rose-light font-bold";
          } else if (inFertile) {
            cellClass =
              "bg-brand-lavender/15 dark:bg-zinc-800 border border-brand-lavender/40 text-brand-plum dark:text-brand-lavender-light";
          }

          return (
            <button
              key={`day-${day}`}
              onClick={() => {
                setSelectedDate(dateStr);
                onSelectDate(dateStr);
              }}
              className={`h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all relative group cursor-pointer ${cellClass} ${
                isSelected
                  ? "ring-2 ring-brand-plum dark:ring-brand-rose ring-offset-2 dark:ring-offset-zinc-900 scale-105 z-10"
                  : isToday
                  ? "ring-1 ring-zinc-400 dark:ring-zinc-600"
                  : ""
              }`}
            >
              <div className="w-full flex items-center justify-between text-[11px] leading-none">
                <span className={isToday ? "font-extrabold underline" : ""}>{day}</span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-ping" />
                )}
              </div>

              {/* Badges / indicators inside cell */}
              <div className="flex items-center gap-0.5 mt-auto">
                {inPeriod && <Droplet className="w-3 h-3 text-white fill-white" />}
                {isOvulation && <Sparkles className="w-3 h-3 text-brand-lavender-dark" />}
                {hasSymptom && !inPeriod && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Symptoms logged" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Legend */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-brand-rose" />
          <span>Recorded Period</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-dashed border-brand-rose bg-brand-blush dark:bg-zinc-800" />
          <span>Predicted Period</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full border border-brand-lavender bg-brand-lavender/30" />
          <span>Fertile Window (Approx)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Symptoms Logged</span>
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDate && (
        <div className="mt-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
                Selected Day Details
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                {parseISODate(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => onSelectDate(selectedDate)}
              className="px-3 py-1.5 rounded-xl bg-brand-rose hover:bg-brand-rose-dark text-white text-xs font-bold shadow-soft flex items-center gap-1 transition-colors"
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>Log / Edit Day</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {isPeriodDay(selectedDate) && (
              <span className="px-2.5 py-1 rounded-xl bg-brand-rose text-white font-bold flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 fill-white" />
                <span>Recorded Period Day</span>
              </span>
            )}
            {isPredictedPeriodDay(selectedDate) && (
              <span className="px-2.5 py-1 rounded-xl bg-brand-blush dark:bg-zinc-800 text-brand-plum dark:text-brand-rose border border-brand-rose/40 font-bold">
                Predicted Period Window
              </span>
            )}
            {isOvulationDay(selectedDate) && (
              <span className="px-2.5 py-1 rounded-xl bg-brand-lavender/30 text-brand-plum dark:text-brand-rose-light border border-brand-lavender font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-rose" />
                <span>Estimated Ovulation Day</span>
              </span>
            )}
            {isPredictedFertileDay(selectedDate) && !isOvulationDay(selectedDate) && (
              <span className="px-2.5 py-1 rounded-xl bg-brand-lavender/20 text-brand-plum dark:text-brand-lavender-light border border-brand-lavender/40 font-semibold">
                Fertile Window (Approx)
              </span>
            )}
            {!isPeriodDay(selectedDate) && !isPredictedPeriodDay(selectedDate) && !isPredictedFertileDay(selectedDate) && (
              <span className="px-2.5 py-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 font-medium">
                Standard Phase Day
              </span>
            )}
          </div>

          {dailyLogs[selectedDate] && dailyLogs[selectedDate].symptoms.length > 0 && (
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
              <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                Symptoms Logged ({dailyLogs[selectedDate].symptoms.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {dailyLogs[selectedDate].symptoms.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium">
                    {s}
                  </span>
                ))}
              </div>
              {dailyLogs[selectedDate].notes && (
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic mt-1.5">
                  &quot;{dailyLogs[selectedDate].notes}&quot;
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

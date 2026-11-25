import { describe, it, expect } from "vitest";
import {
  calculateCyclePredictions,
  diffDays,
  parseISODate,
  formatISODate,
  addDays,
  PeriodEntry,
} from "../lib/cycleMath";

describe("Cycle Math & Prediction Engine", () => {
  it("should handle empty periods gracefully with clinical fallback defaults", () => {
    const today = new Date(2026, 9, 16);
    const result = calculateCyclePredictions([], today);
    expect(result.averageCycleLength).toBe(28);
    expect(result.averagePeriodLength).toBe(5);
    expect(result.confidence).toBe("Low");
    expect(result.isIrregular).toBe(false);
  });

  it("should accurately calculate cycle length and predictions from historical logs", () => {
    const mockPeriods: PeriodEntry[] = [
      {
        id: "p1",
        startDate: "2026-09-15",
        endDate: "2026-09-19",
        flowIntensity: "medium",
      },
      {
        id: "p2",
        startDate: "2026-08-18",
        endDate: "2026-08-22",
        flowIntensity: "medium",
      },
      {
        id: "p3",
        startDate: "2026-07-21",
        endDate: "2026-07-25",
        flowIntensity: "medium",
      },
      {
        id: "p4",
        startDate: "2026-06-23",
        endDate: "2026-06-27",
        flowIntensity: "medium",
      },
    ];

    const today = new Date(2026, 8, 20); // Sept 20, 2026
    const result = calculateCyclePredictions(mockPeriods, today);

    // Each cycle interval: 28 days (06-23 to 07-21 = 28, 07-21 to 08-18 = 28, 08-18 to 09-15 = 28)
    expect(result.averageCycleLength).toBe(28);
    expect(result.averagePeriodLength).toBe(5);
    expect(result.confidence).toBe("High");
    expect(result.isIrregular).toBe(false);

    // Next period should be 2026-09-15 + 28 days = 2026-10-13
    const nextStartStr = formatISODate(result.nextPeriodStart);
    expect(nextStartStr).toBe("2026-10-13");
  });

  it("should flag irregular cycles and provide safety warnings", () => {
    const irregularPeriods: PeriodEntry[] = [
      {
        id: "p1",
        startDate: "2026-09-01",
        endDate: "2026-09-06",
        flowIntensity: "heavy",
      },
      {
        id: "p2",
        startDate: "2026-07-20", // 43 days cycle
        endDate: "2026-07-25",
        flowIntensity: "medium",
      },
      {
        id: "p3",
        startDate: "2026-07-01", // 19 days cycle
        endDate: "2026-07-05",
        flowIntensity: "light",
      },
    ];

    const result = calculateCyclePredictions(irregularPeriods, new Date(2026, 8, 10));
    expect(result.isIrregular).toBe(true);
    expect(result.confidence).toBe("Low");
    expect(result.irregularWarning).toBeDefined();
    expect(result.irregularWarning).toContain("Noticeable cycle variation detected");
  });

  it("should calculate date differences properly", () => {
    const d1 = new Date(2026, 9, 1);
    const d2 = new Date(2026, 9, 15);
    expect(diffDays(d1, d2)).toBe(14);
  });
});

/**
 * Cycle Prediction & Menstrual Health Mathematics Engine
 * Designed for HerBook with explainable predictions and medical safety boundaries.
 */

export interface PeriodEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  flowIntensity: "spotting" | "light" | "medium" | "heavy";
  notes?: string;
  symptoms?: string[];
}

export interface PredictionResult {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  estimatedOvulation: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  averageCycleLength: number;
  averagePeriodLength: number;
  variabilityDays: number;
  confidence: "High" | "Medium" | "Low";
  confidenceExplanation: string;
  isIrregular: boolean;
  irregularWarning?: string;
  currentCycleDay: number;
  currentPhase: "Menstrual" | "Follicular" | "Ovulatory" | "Luteal";
  phaseDescription: string;
}

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function diffDays(d1: Date, d2: Date): number {
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates cycle analytics and explainable predictions
 */
export function calculateCyclePredictions(
  periods: PeriodEntry[],
  currentDate: Date = new Date()
): PredictionResult {
  // Sort descending by startDate (latest first)
  const sorted = [...periods].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const defaultCycleLength = 28;
  const defaultPeriodLength = 5;

  if (sorted.length === 0) {
    const nextStart = addDays(currentDate, 14);
    return {
      nextPeriodStart: nextStart,
      nextPeriodEnd: addDays(nextStart, defaultPeriodLength - 1),
      estimatedOvulation: addDays(nextStart, -14),
      fertileWindowStart: addDays(nextStart, -19),
      fertileWindowEnd: addDays(nextStart, -13),
      averageCycleLength: defaultCycleLength,
      averagePeriodLength: defaultPeriodLength,
      variabilityDays: 0,
      confidence: "Low",
      confidenceExplanation:
        "No historical cycle logs found yet. Prediction is based on the global clinical average (28-day cycle). Log at least 2 consecutive periods for personalized calculations.",
      isIrregular: false,
      currentCycleDay: 1,
      currentPhase: "Follicular",
      phaseDescription: "Log your period to personalize your daily phase insights.",
    };
  }

  // Calculate past cycle lengths
  const cycleLengths: number[] = [];
  const periodLengths: number[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const currentStart = parseISODate(sorted[i].startDate);
    const prevStart = parseISODate(sorted[i + 1].startDate);
    const cLength = diffDays(prevStart, currentStart);
    if (cLength >= 15 && cLength <= 90) {
      cycleLengths.push(cLength);
    }
  }

  for (const entry of sorted) {
    const start = parseISODate(entry.startDate);
    const end = parseISODate(entry.endDate);
    const pLength = diffDays(start, end) + 1;
    if (pLength >= 1 && pLength <= 14) {
      periodLengths.push(pLength);
    }
  }

  const avgCycle =
    cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : defaultCycleLength;

  const avgPeriod =
    periodLengths.length > 0
      ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
      : defaultPeriodLength;

  // Variability (standard deviation)
  let variability = 0;
  if (cycleLengths.length >= 2) {
    const variance =
      cycleLengths.reduce((acc, val) => acc + Math.pow(val - avgCycle, 2), 0) /
      cycleLengths.length;
    variability = Math.round(Math.sqrt(variance) * 10) / 10;
  }

  // Irregularity check
  const isIrregular =
    variability > 6 ||
    cycleLengths.some((len) => len < 21 || len > 35) ||
    (cycleLengths.length >= 2 && Math.max(...cycleLengths) - Math.min(...cycleLengths) >= 9);

  let confidence: "High" | "Medium" | "Low" = "Low";
  let confidenceExplanation = "";

  if (cycleLengths.length >= 3 && variability <= 3 && !isIrregular) {
    confidence = "High";
    confidenceExplanation = `Calculated with high precision using ${cycleLengths.length} consistent recorded cycles with very low variability (±${variability} days).`;
  } else if (cycleLengths.length >= 1 && !isIrregular) {
    confidence = "Medium";
    confidenceExplanation = `Based on ${cycleLengths.length} cycle history records. Prediction will become more precise as you record upcoming cycles.`;
  } else if (isIrregular) {
    confidence = "Low";
    confidenceExplanation = `Cycle lengths have varied between ${Math.min(...cycleLengths, avgCycle)} and ${Math.max(...cycleLengths, avgCycle)} days. Estimated dates are approximate due to natural variations.`;
  } else {
    confidence = "Low";
    confidenceExplanation = "Based on limited recorded periods. Log your next period to increase prediction accuracy.";
  }

  // Latest period start
  const latestStart = parseISODate(sorted[0].startDate);
  const nextPeriodStart = addDays(latestStart, avgCycle);
  const nextPeriodEnd = addDays(nextPeriodStart, avgPeriod - 1);

  // Luteal phase estimation (standard ~14 days before next period)
  const estimatedOvulation = addDays(nextPeriodStart, -14);
  const fertileWindowStart = addDays(estimatedOvulation, -5);
  const fertileWindowEnd = addDays(estimatedOvulation, 1);

  // Current cycle day
  const todayNormalized = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const daysSinceLatestStart = Math.max(
    1,
    Math.floor((todayNormalized.getTime() - latestStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
  const currentCycleDay = daysSinceLatestStart;

  // Determine current phase
  let currentPhase: "Menstrual" | "Follicular" | "Ovulatory" | "Luteal" = "Follicular";
  let phaseDescription = "";

  if (currentCycleDay <= avgPeriod) {
    currentPhase = "Menstrual";
    phaseDescription = "Energy levels may be lower as estrogen and progesterone dip. Rest, hydration, and gentle stretches are beneficial.";
  } else if (currentCycleDay < avgCycle - 16) {
    currentPhase = "Follicular";
    phaseDescription = "Estrogen is rising. Focus, creativity, and stamina are naturally peaking.";
  } else if (currentCycleDay >= avgCycle - 16 && currentCycleDay <= avgCycle - 12) {
    currentPhase = "Ovulatory";
    phaseDescription = "Luteinizing hormone surge triggers ovulation. High energy and peak communication skills.";
  } else {
    currentPhase = "Luteal";
    phaseDescription = "Progesterone rises. Prepare for possible PMS sensations. Prioritize magnesium-rich foods and balanced sleep.";
  }

  const irregularWarning = isIrregular
    ? "Noticeable cycle variation detected (variability > 6 days). While occasional fluctuations are common due to stress, travel, or hormonal shifts, consult a gynecologist if irregularities persist or cycles exceed 35 days."
    : undefined;

  return {
    nextPeriodStart,
    nextPeriodEnd,
    estimatedOvulation,
    fertileWindowStart,
    fertileWindowEnd,
    averageCycleLength: avgCycle,
    averagePeriodLength: avgPeriod,
    variabilityDays: variability,
    confidence,
    confidenceExplanation,
    isIrregular,
    irregularWarning,
    currentCycleDay,
    currentPhase,
    phaseDescription,
  };
}

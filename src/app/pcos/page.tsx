"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Video,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Sparkles,
  Info,
} from "lucide-react";
import { pcosFaqs } from "@/data/educationalArticles";
import { useApp } from "@/context/AppContext";

export default function PCOSPage() {
  const { setShowEmergencyModal, showNotification } = useApp();

  // Interactive Rotterdam Criteria self-screener (Educational Only)
  const [rotterdamChecks, setRotterdamChecks] = useState<{
    irregularPeriods: boolean;
    androgenSymptoms: boolean;
    polycysticUltrasound: boolean;
  }>({
    irregularPeriods: false,
    androgenSymptoms: false,
    polycysticUltrasound: false,
  });

  // Basal Body Temp & Ovulation log simulation
  const [bbtTemp, setBbtTemp] = useState("97.8");
  const [ovulationTestResult, setOvulationTestResult] = useState<"positive" | "negative" | "faint">("negative");
  const [cervicalMucus, setCervicalMucus] = useState<"dry" | "sticky" | "creamy" | "egg-white">("creamy");

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const rotterdamCount = Object.values(rotterdamChecks).filter(Boolean).length;

  const handleSaveFertilityLog = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("BBT and ovulation test metrics recorded to your fertility log!");
  };

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-6 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
            Reproductive Health Hub
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
          <span className="text-xs text-zinc-500 font-medium">Evidence-Based PCOS &amp; Fertility Care</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
          PCOS, PCOD &amp; Fertility Support
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Clinical screening frameworks, symptom monitoring, ovulation awareness, and verified gynecologist discovery.
        </p>
      </div>

      {/* Red Flag Emergency Escalation Box */}
      <div className="p-5 rounded-3xl bg-brand-error/10 border border-brand-error/25 text-xs text-zinc-800 dark:text-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-brand-error shrink-0 mt-0.5" />
          <div>
            <strong className="text-brand-error block mb-0.5">
              Emergency Medical Escalation Protocol:
            </strong>
            <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
              If experiencing sudden severe pelvic pain, continuous heavy bleeding (soaking 2+ pads/hr), or fainting, please contact emergency medical care immediately (dial 112 / 108).
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowEmergencyModal(true)}
          className="px-4 py-2 rounded-xl bg-brand-error hover:bg-red-700 text-white font-bold text-xs shrink-0 transition-colors shadow-soft"
        >
          View Emergency Steps
        </button>
      </div>

      {/* Rotterdam Criteria Educational Screener */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white font-display flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-rose" />
              Rotterdam Consensus Criteria Screener
            </h2>
            <p className="text-xs text-zinc-500">
              International clinical benchmark for PCOS diagnosis (requires 2 out of 3 features)
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blush dark:bg-brand-plum/40 text-brand-plum dark:text-brand-rose">
            {rotterdamCount} of 3 Checked
          </span>
        </div>

        <div className="space-y-3">
          {/* Item 1 */}
          <label className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-start space-x-3 cursor-pointer hover:border-brand-rose transition-colors">
            <input
              type="checkbox"
              checked={rotterdamChecks.irregularPeriods}
              onChange={(e) =>
                setRotterdamChecks({ ...rotterdamChecks, irregularPeriods: e.target.checked })
              }
              className="w-5 h-5 mt-0.5 accent-brand-rose rounded shrink-0 cursor-pointer"
            />
            <div className="text-xs">
              <strong className="text-zinc-900 dark:text-white block">
                1. Oligo- or Anovulation (Infrequent or Absent Cycles)
              </strong>
              <span className="text-[11px] text-zinc-500">
                Cycles consistently longer than 35 days, fewer than 8 periods a year, or missing periods for 3+ months.
              </span>
            </div>
          </label>

          {/* Item 2 */}
          <label className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-start space-x-3 cursor-pointer hover:border-brand-rose transition-colors">
            <input
              type="checkbox"
              checked={rotterdamChecks.androgenSymptoms}
              onChange={(e) =>
                setRotterdamChecks({ ...rotterdamChecks, androgenSymptoms: e.target.checked })
              }
              className="w-5 h-5 mt-0.5 accent-brand-rose rounded shrink-0 cursor-pointer"
            />
            <div className="text-xs">
              <strong className="text-zinc-900 dark:text-white block">
                2. Clinical or Biochemical Hyperandrogenism
              </strong>
              <span className="text-[11px] text-zinc-500">
                Persistent cystic hormonal acne along the jawline, excess facial/chin hair (hirsutism), androgenic scalp thinning, or elevated blood testosterone in lab tests.
              </span>
            </div>
          </label>

          {/* Item 3 */}
          <label className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-start space-x-3 cursor-pointer hover:border-brand-rose transition-colors">
            <input
              type="checkbox"
              checked={rotterdamChecks.polycysticUltrasound}
              onChange={(e) =>
                setRotterdamChecks({ ...rotterdamChecks, polycysticUltrasound: e.target.checked })
              }
              className="w-5 h-5 mt-0.5 accent-brand-rose rounded shrink-0 cursor-pointer"
            />
            <div className="text-xs">
              <strong className="text-zinc-900 dark:text-white block">
                3. Polycystic Ovarian Morphology on Pelvic Ultrasound
              </strong>
              <span className="text-[11px] text-zinc-500">
                Ultrasound scan revealing 12+ peripheral follicles (2–9mm) per ovary or ovarian volume &gt; 10ml.
              </span>
            </div>
          </label>
        </div>

        {/* Screener Outcome & Clinical Disclaimer */}
        <div className="p-4 rounded-2xl bg-brand-blush/60 dark:bg-brand-plum/20 border border-brand-rose/25 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-brand-plum dark:text-brand-rose">
            <Info className="w-4 h-4" />
            <span>Screener Interpretation:</span>
          </div>
          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {rotterdamCount >= 2
              ? "You have checked 2 or more clinical indicators. In clinical practice, this meets the criteria to warrant a comprehensive formal evaluation by a gynecologist. A doctor will typically perform blood tests to rule out thyroid disorders, hyperprolactinemia, and congenital adrenal hyperplasia before confirming PCOS."
              : "You have checked fewer than 2 criteria. Isolated symptoms like temporary cycle delays or occasional acne breakouts do not automatically indicate PCOS. Continue monitoring your cycle."}
          </p>
          <p className="text-[10px] text-zinc-500 italic">
            *Strict Clinical Boundary: This screener is strictly educational and does NOT constitute an automated medical diagnosis. Do not start prescription medications without consulting a licensed physician.
          </p>
        </div>

        <div className="flex justify-end">
          <Link
            href="/consult"
            className="px-5 py-2.5 rounded-2xl bg-brand-plum hover:bg-brand-plum-dark text-white font-bold text-xs shadow-soft transition-all flex items-center space-x-1.5"
          >
            <Video className="w-4 h-4 text-brand-rose" />
            <span>Consult a PCOS Gynecologist</span>
          </Link>
        </div>
      </section>

      {/* Fertility Awareness & BBT Tracking Module */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-5">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white font-display flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-brand-lavender-dark" />
            Fertility Awareness &amp; Ovulation Indicators
          </h2>
          <p className="text-xs text-zinc-500">
            Log basal body temperature (BBT), LH ovulation test strips, and cervical fluid
          </p>
        </div>

        {/* Fertility Unreliability Warning */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Important Clinical Fertility Notice:</strong> Ovulation estimates can be significantly unreliable in women with irregular cycles or PCOS. Predicted fertile windows are educational guidelines only and must <strong>NEVER</strong> be used as a contraceptive method.
        </div>

        <form onSubmit={handleSaveFertilityLog} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
            <label className="text-xs font-bold text-zinc-900 dark:text-white block">
              Morning Basal Temp (°F)
            </label>
            <input
              type="text"
              value={bbtTemp}
              onChange={(e) => setBbtTemp(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
            />
            <span className="text-[10px] text-zinc-500 block">Take immediately upon waking</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
            <label className="text-xs font-bold text-zinc-900 dark:text-white block">
              LH Ovulation Test Strip
            </label>
            <select
              value={ovulationTestResult}
              onChange={(e) => setOvulationTestResult(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
            >
              <option value="negative">Negative (Single Line)</option>
              <option value="faint">Faint Test Line</option>
              <option value="positive">Positive LH Surge (Peak)</option>
            </select>
            <span className="text-[10px] text-zinc-500 block">Urine strip biomarker</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
            <label className="text-xs font-bold text-zinc-900 dark:text-white block">
              Cervical Mucus Texture
            </label>
            <select
              value={cervicalMucus}
              onChange={(e) => setCervicalMucus(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
            >
              <option value="dry">Dry / Minimal</option>
              <option value="sticky">Sticky / Tacky</option>
              <option value="creamy">Creamy (Lotion-like)</option>
              <option value="egg-white">Egg-white (Clear &amp; Stretchy)</option>
            </select>
            <span className="text-[10px] text-zinc-500 block">Fertile estrogen indicator</span>
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-xs shadow-soft transition-all"
            >
              Save Biomarkers
            </button>
          </div>
        </form>
      </section>

      {/* Clinician-Reviewed PCOS & Fertility FAQs Accordion */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white font-display flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-rose" />
            Clinician-Reviewed Reproductive FAQs
          </h2>
          <p className="text-xs text-zinc-500">
            Debunking myths regarding PCOS cures, fertility outcomes, and diet
          </p>
        </div>

        <div className="space-y-2.5">
          {pcosFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-brand-rose shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

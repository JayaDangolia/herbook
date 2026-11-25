"use client";

import React, { useEffect } from "react";
import { AlertTriangle, PhoneCall, X, ShieldAlert, HeartPulse } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Portal } from "@/components/ui/Portal";

export const EmergencyModal = () => {
  const { showEmergencyModal, setShowEmergencyModal } = useApp();

  useEffect(() => {
    if (!showEmergencyModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEmergencyModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [showEmergencyModal, setShowEmergencyModal]);

  if (!showEmergencyModal) return null;

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Clinical Red Flag Escalation"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowEmergencyModal(false);
        }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-brand-error/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={() => setShowEmergencyModal(false)}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-error/15 text-brand-error flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                Clinical Red Flag Escalation
              </h2>
              <p className="text-xs text-brand-error font-medium">
                Immediate Emergency Hospital Guidance (India)
              </p>
            </div>
          </div>

          <div className="bg-brand-error/10 border border-brand-error/20 rounded-2xl p-4 mb-5">
            <h3 className="font-semibold text-brand-error text-sm mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Seek Emergency In-Person Medical Care Immediately If:
            </h3>
            <ul className="text-xs text-zinc-800 dark:text-zinc-200 space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong>Severe Menorrhagia:</strong> Soaking completely through 2 or more large sanitary pads/tampons every hour for 2 or more consecutive hours.
              </li>
              <li>
                <strong>Acute Severe Pelvic Pain:</strong> Sudden, sharp, unbearable abdominal or unilateral pelvic pain (risk of ectopic pregnancy rupture or ovarian torsion).
              </li>
              <li>
                <strong>Hemodynamic Collapse:</strong> Severe dizziness, cold clammy extremities, rapid pulse, or fainting (syncope).
              </li>
              <li>
                <strong>Severe Infection:</strong> High fever (&gt;101°F / 38.3°C) accompanied by foul-smelling vaginal discharge or severe pelvic tenderness.
              </li>
              <li>
                <strong>Pregnancy Complications:</strong> Any heavy vaginal bleeding or severe abdominal cramping during known or suspected pregnancy.
              </li>
            </ul>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              National Emergency Contacts (India)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:112"
                className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-brand-rose transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <PhoneCall className="w-4 h-4 text-brand-error" />
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">
                      National Helpline
                    </div>
                    <div className="text-[10px] text-zinc-500">All Emergencies</div>
                  </div>
                </div>
                <span className="text-base font-bold text-brand-error">112</span>
              </a>

              <a
                href="tel:108"
                className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-brand-rose transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <HeartPulse className="w-4 h-4 text-brand-rose" />
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">
                      Ambulance Service
                    </div>
                    <div className="text-[10px] text-zinc-500">Government Medical</div>
                  </div>
                </div>
                <span className="text-base font-bold text-brand-rose">108</span>
              </a>

              <a
                href="tel:1091"
                className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-brand-rose transition-colors group sm:col-span-2"
              >
                <div className="flex items-center space-x-2.5">
                  <PhoneCall className="w-4 h-4 text-brand-lavender-dark" />
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">
                      Women in Distress Helpline
                    </div>
                    <div className="text-[10px] text-zinc-500">24/7 National Safety Call</div>
                  </div>
                </div>
                <span className="text-base font-bold text-brand-lavender-dark">1091</span>
              </a>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 p-3 rounded-xl mb-4 leading-normal">
            <strong>Important Clinical Boundary:</strong> HerBook is an informational, cycle tracking, and outpatient telemedicine marketplace. It is NOT equipped to manage medical emergencies. Please proceed to the nearest hospital casualty department if experiencing red flag symptoms.
          </div>

          <button
            onClick={() => setShowEmergencyModal(false)}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl font-medium text-sm transition-colors cursor-pointer"
          >
            Understood, Close
          </button>
        </div>
      </div>
    </Portal>
  );
};

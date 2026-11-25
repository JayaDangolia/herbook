"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Video, Calendar, Clock, Download, X, ShieldCheck } from "lucide-react";
import { Appointment } from "@/context/CareContext";
import { formatINR, formatDate } from "@/lib/utils";
import { Portal } from "@/components/ui/Portal";

interface BookingReceiptModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingReceiptModal: React.FC<BookingReceiptModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
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

  if (!isOpen || !appointment) return null;

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Booking Confirmed"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-soft">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Booking Confirmed!
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Appointment Ref: <strong className="font-mono text-brand-plum dark:text-brand-rose">{appointment.id}</strong>
            </p>
          </div>

          {/* Receipt Slip Container */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3 text-xs mb-5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">Doctor</span>
                <div className="font-bold text-zinc-900 dark:text-white">{appointment.doctorName}</div>
                <div className="text-[11px] text-brand-plum dark:text-brand-rose-light">{appointment.doctorSpecialty}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">Mode</span>
                <div className="font-bold text-zinc-900 dark:text-white capitalize flex items-center gap-1 justify-end">
                  <Video className="w-3.5 h-3.5 text-brand-rose" />
                  <span>{appointment.mode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">Date</span>
                <div className="font-semibold text-zinc-800 dark:text-zinc-200">{formatDate(appointment.date)}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">Time</span>
                <div className="font-semibold text-zinc-800 dark:text-zinc-200">{appointment.time}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between font-bold">
              <span>Amount Paid (Sandbox):</span>
              <span className="text-brand-plum dark:text-brand-rose">{formatINR(appointment.totalPaid)}</span>
            </div>
          </div>

          {/* Call to action */}
          <div className="space-y-2">
            <Link
              href={`/consult/video/${appointment.id}`}
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:shadow-glow flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Enter Private Video Room</span>
            </Link>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download / Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

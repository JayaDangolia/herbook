"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Video, MapPin, ShieldCheck, FileText, CheckCircle2, CreditCard } from "lucide-react";
import { Doctor } from "@/data/doctorsData";
import { useCare, Appointment } from "@/context/CareContext";
import { useApp } from "@/context/AppContext";
import { formatINR, formatDate } from "@/lib/utils";
import { Portal } from "@/components/ui/Portal";

interface BookingModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const { bookAppointment, records } = useCare();
  const { showNotification } = useApp();

  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [mode, setMode] = useState<"video" | "in-person">("video");
  const [patientNotes, setPatientNotes] = useState<string>("");
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [telemedicineConsent, setTelemedicineConsent] = useState<boolean>(false);

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

  if (!isOpen || !doctor) return null;

  const availableSlots = doctor.availableSlots.filter((s) => !s.isBooked);

  const toggleRecord = (recId: string) => {
    setSelectedRecordIds((prev) =>
      prev.includes(recId) ? prev.filter((id) => id !== recId) : [...prev, recId]
    );
  };

  const handleConfirmAndPay = () => {
    if (!selectedSlotId) {
      setBookingError("Please select an available consultation time slot.");
      return;
    }

    if (!telemedicineConsent) {
      setBookingError("Mandatory Telemedicine Practice Guidelines consent must be acknowledged before booking.");
      return;
    }

    setIsProcessing(true);
    setBookingError(null);

    // Simulate Razorpay sandbox payment delay
    setTimeout(() => {
      const result = bookAppointment(
        doctor.id,
        selectedSlotId,
        mode,
        patientNotes,
        selectedRecordIds
      );

      setIsProcessing(false);

      if (result.success && result.appointment) {
        showNotification("Payment verified (Razorpay Sandbox)! Consultation booked.");
        onBookingSuccess(result.appointment);
        onClose();
      } else {
        setBookingError(result.error || "Booking failed. Please choose another slot.");
      }
    }, 1200);
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Doctor Consultation Booking"
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

        {/* Doctor Header */}
        <div className="flex items-center space-x-3.5 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="w-14 h-14 rounded-2xl object-cover border border-brand-rose/40"
          />
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {doctor.name}
            </h3>
            <p className="text-xs text-brand-plum dark:text-brand-rose font-medium">
              {doctor.specialty}
            </p>
            <p className="text-[11px] text-zinc-500">{doctor.systemLabel}</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Consultation Mode */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
              Select Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("video")}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  mode === "video"
                    ? "bg-brand-rose/10 border-brand-rose text-brand-plum dark:text-brand-rose-light"
                    : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Video className="w-4 h-4 text-brand-rose" />
                <span>Encrypted Video Call</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("in-person")}
                disabled={!doctor.consultationModes.includes("in-person")}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  mode === "in-person"
                    ? "bg-brand-rose/10 border-brand-rose text-brand-plum dark:text-brand-rose-light"
                    : doctor.consultationModes.includes("in-person")
                    ? "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    : "opacity-40 border-dashed cursor-not-allowed text-zinc-400"
                }`}
              >
                <MapPin className="w-4 h-4 text-brand-lavender-dark" />
                <span>In-Clinic Visit</span>
              </button>
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
              Select Available Slot (20 Mins)
            </label>
            {availableSlots.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No slots available currently.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? "bg-brand-plum text-white border-brand-plum font-bold shadow-soft"
                          : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-brand-rose"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-rose" />
                        <span>{formatDate(slot.date)}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold mt-0.5">
                        <Clock className="w-3 h-3 text-brand-lavender" />
                        <span>{slot.time}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Consent-Based Health Records Sharing */}
          {records.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                Share Prior Medical Records (Optional)
              </label>
              <div className="space-y-1.5">
                {records.map((rec) => {
                  const isSelected = selectedRecordIds.includes(rec.id);
                  return (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => toggleRecord(rec.id)}
                      className={`w-full p-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-brand-blush dark:bg-brand-plum/30 border-brand-rose text-brand-plum dark:text-brand-rose-light"
                          : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-brand-plum dark:text-brand-rose shrink-0" />
                        <span className="truncate max-w-[240px] font-medium">{rec.title}</span>
                      </div>
                      <span className="text-[10px] font-bold">
                        {isSelected ? "Shared" : "+ Share"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Records are shared strictly for this consultation under patient consent.
              </p>
            </div>
          )}

          {/* Patient Chief Complaint / Symptoms Note */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">
              Chief Symptoms / Questions for Doctor
            </label>
            <textarea
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="e.g. Experiencing 45-day delayed cycle, severe lower back cramps..."
              className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose resize-none h-16"
            />
          </div>

          {/* Transparent Fee Breakdown */}
          <div className="bg-zinc-50 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-1.5 text-xs">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center justify-between">
              <span>Doctor Consultation Fee</span>
              <span>{formatINR(doctor.consultationFee)}</span>
            </div>
            <div className="text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
              <span>HerBook Platform Booking Fee</span>
              <span>{formatINR(doctor.platformFee)}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between font-extrabold text-sm text-brand-plum dark:text-brand-rose-light">
              <span>Total Payable</span>
              <span>{formatINR(doctor.consultationFee + doctor.platformFee)}</span>
            </div>
          </div>

          {/* Statutory Telemedicine Consent & Limitations */}
          <div className="p-3.5 rounded-2xl bg-brand-blush/60 dark:bg-brand-plum/20 border border-brand-rose/30 space-y-2 text-xs">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-rose" />
              <span>Telemedicine Informed Consent (v1.2-IN-TELEMED)</span>
            </div>
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={telemedicineConsent}
                onChange={(e) => setTelemedicineConsent(e.target.checked)}
                className="w-4 h-4 accent-brand-rose rounded mt-0.5 shrink-0"
              />
              <span className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                I give informed consent for remote teleconsultation under the <strong>Telemedicine Practice Guidelines, 2020</strong>. I understand video consultations cannot replace physical pelvic examinations or palpation, and the practitioner holds full authority to recommend in-person hospital care.
              </span>
            </label>
            <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
              ⚠️ In case of acute pelvic hemorrhage or severe unbearable pain, do NOT book teleconsultation. Use the SOS button to contact emergency hospital care immediately.
            </div>
          </div>

          {/* Synthetic Demo Doctor Notice */}
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
            <strong>Demonstration Practitioner:</strong> Real clinical appointments and live monetary collection remain restricted behind release gates (<code>realPayments: false</code>) until final council approvals.
          </div>

          {bookingError && (
            <div className="text-xs text-brand-error font-medium p-2.5 bg-brand-error/10 rounded-xl border border-brand-error/20">
              {bookingError}
            </div>
          )}

          {/* Sandbox Payment Confirmation */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirmAndPay}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-rose via-brand-plum to-brand-plum-dark text-white font-bold text-sm shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {isProcessing
                ? "Simulating Secure Payment..."
                : `Confirm Booking (Pilot Sandbox • ${formatINR(doctor.consultationFee + doctor.platformFee)})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  </Portal>
);
};

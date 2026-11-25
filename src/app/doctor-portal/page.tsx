"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Video,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  User,
  ArrowRight,
} from "lucide-react";
import { useCare } from "@/context/CareContext";
import { useApp } from "@/context/AppContext";
import { formatINR, formatDate } from "@/lib/utils";

export default function DoctorPortalPage() {
  const { doctors, appointments, records, addDoctorConsultationNote } = useCare();
  const { user, showNotification } = useApp();

  // Pick Dr. Ananya Sharma as the active logged-in doctor persona
  const activeDoctor = doctors[0];

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    appointments[0]?.id || null
  );
  const [consultNote, setConsultNote] = useState("");
  const [prescriptionNote, setPrescriptionNote] = useState("");

  const doctorAppointments = appointments.filter((a) => a.doctorId === activeDoctor.id);

  // Settlement calculations
  const completedConsults = doctorAppointments.filter((a) => a.status === "completed").length;
  const totalEarned = (completedConsults + 3) * activeDoctor.consultationFee; // ₹500 * (count + seed)
  const pendingSettlement = activeDoctor.consultationFee; // ₹500

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId || !consultNote.trim()) return;

    addDoctorConsultationNote(selectedAppointmentId, consultNote.trim(), prescriptionNote.trim());
    setConsultNote("");
    setPrescriptionNote("");
    showNotification("Clinical consultation notes & electronic advice dispatched to patient!");
  };

  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 text-white p-6 rounded-3xl shadow-card">
        <div className="flex items-center space-x-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeDoctor.avatarUrl}
            alt={activeDoctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-rose"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-rose-light">
                HerCare Doctor Portal
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified Practitioner
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
              {activeDoctor.name}
            </h1>
            <p className="text-xs text-zinc-300">
              {activeDoctor.specialty} • Reg: {activeDoctor.regNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/consult"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Preview Public Listing
          </Link>
        </div>
      </div>

      {/* Doctor Performance & Settlement KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            Consultation Fee
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
            {formatINR(activeDoctor.consultationFee)}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Net to Doctor / 20 min</div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            Total Consultations
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
            {completedConsults + 3}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            100% On-Time Completion
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            Gross Earnings
          </div>
          <div className="text-2xl font-extrabold text-brand-success mt-1">
            {formatINR(totalEarned)}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Razorpay Escrow Settled</div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            Next Payout Due
          </div>
          <div className="text-2xl font-extrabold text-brand-plum dark:text-brand-rose mt-1">
            {formatINR(pendingSettlement)}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">NEFT Friday Cycle</div>
        </div>
      </div>

      {/* Main Grid: Scheduled Consultations & Clinical Note Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Queue */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-rose" />
              Patient Schedule ({doctorAppointments.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {doctorAppointments.map((apt) => {
              const isSelected = selectedAppointmentId === apt.id;
              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAppointmentId(apt.id)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "bg-brand-blush/60 dark:bg-brand-plum/30 border-brand-rose font-medium shadow-soft"
                      : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {apt.patientName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        apt.status === "upcoming"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-1">
                    <span>{apt.date}</span>
                    <span>•</span>
                    <span>{apt.time}</span>
                  </div>

                  {apt.status === "upcoming" && (
                    <Link
                      href={`/consult/video/${apt.id}`}
                      className="mt-2.5 w-full py-1.5 rounded-xl bg-brand-plum text-white font-bold text-[11px] flex items-center justify-center space-x-1"
                    >
                      <Video className="w-3.5 h-3.5 text-brand-rose" />
                      <span>Start Video Consultation</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Patient Case Record & Clinical Prescriptions */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-5">
          {selectedApt ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Patient Case: {selectedApt.patientName}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Appointment #{selectedApt.id} • {selectedApt.date} ({selectedApt.time})
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-success/15 text-brand-success">
                  Fee Paid: {formatINR(selectedApt.doctorFee)}
                </span>
              </div>

              {/* Patient complaint */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                  Patient Reported Symptoms / Reason for Visit:
                </span>
                <p className="text-zinc-600 dark:text-zinc-300">
                  {selectedApt.patientNotes || "Discussion regarding cycle irregularities and diet."}
                </p>
              </div>

              {/* Patient-Shared Medical Records */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Patient-Shared Clinical Records ({selectedApt.sharedRecordIds.length})
                </h4>
                {selectedApt.sharedRecordIds.length > 0 ? (
                  <div className="space-y-2">
                    {records
                      .filter((r) => selectedApt.sharedRecordIds.includes(r.id))
                      .map((r) => (
                        <div
                          key={r.id}
                          className="p-3 rounded-2xl bg-brand-blush/40 dark:bg-zinc-800 border border-brand-rose/20 text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white">
                              {r.title}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {r.type} • {r.date}
                            </div>
                            {r.notes && (
                              <p className="text-[11px] text-brand-plum dark:text-brand-rose-light mt-0.5">
                                {r.notes}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-brand-success bg-brand-success/10 px-2 py-1 rounded">
                            Consent Active
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">No records shared for this session.</p>
                )}
              </div>

              {/* Add Consultation Notes Form */}
              <form onSubmit={handleSaveNotes} className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Telemedicine Consultation Notes &amp; Follow-up Advice
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Clinical Assessment &amp; Lifestyle Recommendations
                  </label>
                  <textarea
                    required
                    value={consultNote}
                    onChange={(e) => setConsultNote(e.target.value)}
                    placeholder="e.g. Advised fasting insulin + HOMA-IR test, increase dietary protein, follow-up in 14 days..."
                    className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose resize-none h-20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Electronic Prescription / Supplements (If applicable under Telemedicine Guidelines)
                  </label>
                  <input
                    type="text"
                    value={prescriptionNote}
                    onChange={(e) => setPrescriptionNote(e.target.value)}
                    placeholder="e.g. Myo-Inositol 2g BD with water, Vitamin D3 60,000 IU once weekly"
                    className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all"
                  >
                    Save &amp; Complete Consultation
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 text-center py-12">
              Select an appointment from the queue to review patient details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

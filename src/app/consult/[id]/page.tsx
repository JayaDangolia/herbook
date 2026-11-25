"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  Clock,
  Video,
  MapPin,
  Languages,
  Calendar,
  ArrowLeft,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useCare } from "@/context/CareContext";
import { BookingModal } from "@/components/care/BookingModal";
import { BookingReceiptModal } from "@/components/care/BookingReceiptModal";
import { Appointment } from "@/context/CareContext";
import { formatINR } from "@/lib/utils";

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { doctors } = useCare();

  const doctorId = params.id as string;
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-3 sm:px-4 py-3 space-y-4 pb-24 animate-fadeIn">
      {/* Back button */}
      <Link
        href="/consult"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-brand-plum dark:hover:text-brand-rose transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Doctors</span>
      </Link>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="w-24 h-24 rounded-3xl object-cover border-2 border-brand-rose/40 shadow-soft"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white font-display">
                {doctor.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-blush dark:bg-brand-plum/40 text-brand-plum dark:text-brand-rose border border-brand-rose/30">
                {doctor.systemLabel}
              </span>
            </div>

            <p className="text-sm font-semibold text-brand-plum dark:text-brand-rose-light">
              {doctor.specialty}
            </p>
            <p className="text-xs text-zinc-500 font-medium">
              {doctor.qualification}
            </p>

            <div className="flex items-center space-x-3 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-500 mr-1" />
                {doctor.rating} ({doctor.reviewsCount} verified reviews)
              </span>
              <span>•</span>
              <span className="font-semibold">{doctor.experienceYears} Years Clinical Practice</span>
            </div>
          </div>
        </div>

        {/* Credentials and Statutory Disclaimer */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 space-y-2 text-xs">
          <div className="flex items-center space-x-2 font-bold text-zinc-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-brand-success" />
            <span>Licensing Credentials &amp; Registration:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-600 dark:text-zinc-300">
            <div>Registration ID: <strong className="font-mono text-zinc-900 dark:text-white">{doctor.regNumber}</strong></div>
            <div>Statutory Board: <strong>{doctor.regAuthority}</strong></div>
          </div>
          <p className="text-[11px] text-zinc-500 italic pt-1">
            *Demo Notice: Professional registration numbers in this demonstration are synthetic representations for product evaluation.
          </p>
        </div>

        {/* Bio */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
            Clinical Focus &amp; Background
          </h3>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {doctor.bio}
          </p>
        </div>

        {/* Evidence-Based Scope Note */}
        <div className="p-4 rounded-2xl bg-brand-blush/60 dark:bg-brand-plum/20 border border-brand-rose/25 text-xs text-brand-plum dark:text-brand-rose-light flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-rose shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Permitted Scope &amp; Medical Evidence:</span>
            <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {doctor.evidenceScopeNote}
            </p>
          </div>
        </div>

        {/* Details: Languages, Clinic, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 text-xs">
            <div className="text-zinc-500 text-[11px] flex items-center gap-1">
              <Languages className="w-3.5 h-3.5" /> Languages
            </div>
            <div className="font-bold text-zinc-900 dark:text-white mt-1">
              {doctor.languagesSpoken.join(", ")}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 text-xs">
            <div className="text-zinc-500 text-[11px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Clinic Location
            </div>
            <div className="font-bold text-zinc-900 dark:text-white mt-1 truncate">
              {doctor.clinicLocation}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 text-xs">
            <div className="text-zinc-500 text-[11px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Consultation Duration
            </div>
            <div className="font-bold text-zinc-900 dark:text-white mt-1">
              {doctor.scheduledDurationMinutes} Minutes
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div>• <strong>Cancellation:</strong> {doctor.cancellationPolicy}</div>
          <div>• <strong>Follow-up Policy:</strong> {doctor.followUpPolicy}</div>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-blush to-white dark:from-zinc-800 dark:to-zinc-900 border border-brand-rose/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl font-extrabold text-zinc-900 dark:text-white">
              {formatINR(doctor.consultationFee + doctor.platformFee)}
            </div>
            <div className="text-xs text-zinc-500">
              Doctor Fee {formatINR(doctor.consultationFee)} + Platform Fee {formatINR(doctor.platformFee)}
            </div>
          </div>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span>Select Slot &amp; Book (Sandbox)</span>
          </button>
        </div>
      </div>

      <BookingModal
        doctor={doctor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={(apt) => setConfirmedAppointment(apt)}
      />

      <BookingReceiptModal
        appointment={confirmedAppointment}
        isOpen={!!confirmedAppointment}
        onClose={() => setConfirmedAppointment(null)}
      />
    </div>
  );
}

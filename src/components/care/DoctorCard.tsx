"use client";

import React from "react";
import {
  ShieldCheck,
  Star,
  Clock,
  Video,
  MapPin,
  Languages,
  Info,
  CheckCircle,
} from "lucide-react";
import { Doctor } from "@/data/doctorsData";
import { formatINR } from "@/lib/utils";

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const getSystemBadge = () => {
    switch (doctor.system) {
      case "allopathy":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "ayurveda":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "homeopathy":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    }
  };

  const availableSlotsCount = doctor.availableSlots.filter((s) => !s.isBooked).length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top Header: Avatar, Name, Verification, System */}
        <div className="flex items-start space-x-3.5">
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-rose/30"
            />
            {doctor.verified && (
              <span
                className="absolute -bottom-1 -right-1 p-0.5 bg-brand-success text-white rounded-full shadow-xs"
                title="Verified Practitioner (Synthetic Demo Verification)"
              >
                <CheckCircle className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white truncate">
                {doctor.name}
              </h3>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSystemBadge()}`}>
                {doctor.systemLabel.split(" ")[0]}
              </span>
            </div>

            <p className="text-xs font-semibold text-brand-plum dark:text-brand-rose-light truncate">
              {doctor.specialty}
            </p>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate">
              {doctor.qualification}
            </p>

            {/* Rating & Experience */}
            <div className="flex items-center space-x-3 mt-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                {doctor.rating} ({doctor.reviewsCount})
              </span>
              <span>•</span>
              <span className="font-medium">{doctor.experienceYears} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
          {doctor.bio}
        </p>

        {/* Scope Note */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2">{doctor.evidenceScopeNote}</p>
        </div>

        {/* Meta details: Languages & Clinic */}
        <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
          <div className="flex items-center space-x-2">
            <Languages className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{doctor.languagesSpoken.join(", ")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{doctor.clinicLocation}</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-zinc-600 dark:text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>Reg: {doctor.regNumber} ({doctor.regAuthority})</span>
          </div>
        </div>
      </div>

      {/* Pricing & Booking Footer */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-extrabold text-zinc-900 dark:text-white">
              {formatINR(doctor.consultationFee + doctor.platformFee)}
            </span>
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400">/ 20 min</span>
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
            (Doctor ₹{doctor.consultationFee} + Fee ₹{doctor.platformFee})
          </div>
        </div>

        <button
          onClick={() => onBook(doctor)}
          disabled={availableSlotsCount === 0}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs shadow-soft transition-all flex items-center space-x-1.5 ${
            availableSlotsCount > 0
              ? "bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white hover:shadow-glow cursor-pointer"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>{availableSlotsCount > 0 ? "Book Slot" : "No Slots"}</span>
        </button>
      </div>
    </div>
  );
};

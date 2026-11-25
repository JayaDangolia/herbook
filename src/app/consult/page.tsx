"use client";

import React, { useState, useMemo } from "react";
import {
  Video,
  Search,
  Filter,
  ShieldAlert,
  Info,
  CheckCircle,
  Calendar,
  Sparkles,
  ChevronRight,
  Star,
  Clock,
  Languages,
} from "lucide-react";
import { useCare } from "@/context/CareContext";
import { useApp } from "@/context/AppContext";
import { BookingModal } from "@/components/care/BookingModal";
import { BookingReceiptModal } from "@/components/care/BookingReceiptModal";
import { Doctor, MedicalSystem, SYNTHETIC_DISCLAIMER_NOTICE } from "@/data/doctorsData";
import { Appointment } from "@/context/CareContext";
import { formatINR } from "@/lib/utils";

export default function ConsultPage() {
  const { doctors } = useCare();
  const { t } = useApp();

  const [selectedSystem, setSelectedSystem] = useState<"all" | MedicalSystem>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => d.languagesSpoken.forEach((l) => set.add(l)));
    return Array.from(set);
  }, [doctors]);

  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => set.add(d.specialty));
    return Array.from(set);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (selectedSystem !== "all" && doc.system !== selectedSystem) return false;
      if (selectedLanguage !== "all" && !doc.languagesSpoken.includes(selectedLanguage))
        return false;
      if (selectedSpecialty !== "all" && doc.specialty !== selectedSpecialty) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(q);
        const matchSpec = doc.specialty.toLowerCase().includes(q);
        const matchBio = doc.bio.toLowerCase().includes(q);
        if (!matchName && !matchSpec && !matchBio) return false;
      }
      return true;
    });
  }, [doctors, selectedSystem, selectedLanguage, selectedSpecialty, searchQuery]);

  const getSystemBadge = (sys: MedicalSystem) => {
    switch (sys) {
      case "allopathy":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "ayurveda":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "homeopathy":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    }
  };

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 py-4 space-y-5 animate-fadeIn">
      {/* 1. Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
            HerCare Outpatient Telemedicine
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
          <span className="text-[10px] text-zinc-500 font-medium">Pan-India Doctors</span>
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white font-display">
          Find Your Doctor
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Expert care, made simple. Transparent ₹550 consultation fee.
        </p>
      </div>

      {/* 2. Demonstration Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong>Demonstration Profiles:</strong> Synthetic practitioner listings with simulated licenses for testing. Allopathy prioritizes clinical diagnostics; Ayurveda &amp; Homeopathy provide complementary wellness.
        </div>
      </div>

      {/* 3. Horizontally Scrollable System Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: `All (${doctors.length})` },
          { id: "allopathy", label: "Modern Medicine (5)" },
          { id: "ayurveda", label: "Ayurveda (5)" },
          { id: "homeopathy", label: "Homeopathy (5)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedSystem(tab.id as any)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedSystem === tab.id
                ? "bg-brand-plum text-white border-brand-plum shadow-soft"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-brand-rose"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Compact Search & Filters Toolbar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors, PCOS, fertility..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose shadow-card"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-rose"
          >
            <option value="all">Language: All</option>
            {allLanguages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-rose"
          >
            <option value="all">Specialty: All</option>
            {allSpecialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Compact Mobile Doctor Cards */}
      <div className="space-y-3">
        {filteredDoctors.map((doc) => {
          const availableCount = doc.availableSlots.filter((s) => !s.isBooked).length;
          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-card hover:shadow-soft transition-all space-y-3"
            >
              <div className="flex items-start space-x-3">
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-brand-rose/30 shadow-xs"
                  />
                  {doc.verified && (
                    <span
                      className="absolute -bottom-1 -right-1 p-0.5 bg-brand-success text-white rounded-full"
                      title="Verified Practitioner"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white truncate">
                      {doc.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${getSystemBadge(
                        doc.system
                      )}`}
                    >
                      {doc.systemLabel.split(" ")[0]}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-brand-plum dark:text-brand-rose-light truncate mt-0.5">
                    {doc.specialty}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">{doc.qualification}</p>

                  <div className="flex items-center space-x-2 text-[11px] text-zinc-500 mt-1">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                      {doc.rating}
                    </span>
                    <span>•</span>
                    <span>{doc.experienceYears} yrs</span>
                    <span>•</span>
                    <span className="truncate">{doc.languagesSpoken.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {doc.bio}
              </p>

              {/* Card Footer: Transparent Fee & Quick Book Button */}
              <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    {formatINR(doc.consultationFee + doc.platformFee)}
                  </div>
                  <div className="text-[9px] text-zinc-400">
                    (Doc ₹{doc.consultationFee} + Fee ₹{doc.platformFee} • 20 min)
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctorForBooking(doc)}
                  disabled={availableCount === 0}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold shadow-soft transition-all flex items-center space-x-1.5 ${
                    availableCount > 0
                      ? "bg-gradient-to-r from-brand-rose to-brand-plum text-white hover:scale-105 active:scale-95"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{availableCount > 0 ? "Book Consult" : "Full"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking and Receipt Modals */}
      <BookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
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

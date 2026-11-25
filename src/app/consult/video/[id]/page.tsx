"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  ShieldCheck,
  Clock,
  FileText,
  MessageSquare,
  AlertTriangle,
  User,
  Settings,
  X,
} from "lucide-react";
import { useCare } from "@/context/CareContext";
import { useApp } from "@/context/AppContext";

export default function VideoConsultationRoom() {
  const params = useParams();
  const router = useRouter();
  const { appointments, records } = useCare();
  const { showNotification } = useApp();

  const appointmentId = params.id as string;
  const appointment =
    appointments.find((a) => a.id === appointmentId) || appointments[0];

  // Call states
  const [isJoined, setIsJoined] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showRecordsDrawer, setShowRecordsDrawer] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(20 * 60); // 20 minutes countdown
  const [isCallEnded, setIsCallEnded] = useState(false);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isJoined && !isCallEnded && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isJoined, isCallEnded, secondsRemaining]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setIsCallEnded(true);
    showNotification("Consultation session ended. Summary saved to history.");
  };

  const sharedRecords = records.filter(
    (r) => appointment && appointment.sharedRecordIds.includes(r.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 animate-fadeIn">
      {/* Top Telehealth Security Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 text-white px-5 py-3 rounded-2xl text-xs">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">
            HerCare End-to-End Encrypted Consultation Room
          </span>
          <span className="hidden sm:inline text-zinc-400">•</span>
          <span className="hidden sm:inline text-zinc-400 font-mono">
            Room: {appointment?.meetingRoomId || "HB-TELE-ROOM"}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono text-emerald-400 font-bold bg-black/40 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)} remaining</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Main Video Interface Layout */}
      {!isJoined ? (
        /* Waiting Room Interface */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-brand-rose/15 text-brand-rose flex items-center justify-center mx-auto">
            <Video className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              HerCare Private Waiting Room
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Consulting with <strong className="text-brand-plum dark:text-brand-rose-light">{appointment?.doctorName}</strong>
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {appointment?.doctorSpecialty} • {appointment?.medicalSystem}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left space-y-2 text-xs">
            <div className="font-bold text-zinc-800 dark:text-zinc-200">
              Pre-Call Device Check:
            </div>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-[11px]">
              <span>Camera Stream:</span>
              <span className="text-brand-success font-semibold">Active &amp; Ready</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-[11px]">
              <span>Microphone Input:</span>
              <span className="text-brand-success font-semibold">Optimized (Noise Cancelled)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-[11px]">
              <span>Shared Medical Records:</span>
              <span>{appointment?.sharedRecordIds.length || 0} document(s) linked</span>
            </div>
          </div>

          <button
            onClick={() => setIsJoined(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-bold text-sm shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span>Join Secure Consultation Room</span>
          </button>
        </div>
      ) : isCallEnded ? (
        /* Call Ended Summary */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Consultation Completed
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Your 20-minute telehealth session with {appointment?.doctorName} has concluded.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-left space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
            <div>• Follow-up policy: 1 complimentary text follow-up within 5 days.</div>
            <div>• Any electronic advice or prescriptions will appear in your Health Vault.</div>
          </div>

          <div className="space-y-2">
            <Link
              href="/consult"
              className="w-full py-3 rounded-2xl bg-brand-plum text-white font-bold text-xs block text-center"
            >
              Return to Consultations
            </Link>
          </div>
        </div>
      ) : (
        /* Active Video Call Screen */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Video Tile */}
          <div className="lg:col-span-3 bg-zinc-950 rounded-3xl aspect-[16/10] sm:aspect-[16/9] relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl border border-zinc-800">
            {/* Doctor Video Feed Simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={appointment?.doctorAvatar}
                alt={appointment?.doctorName}
                className="w-full h-full object-cover opacity-90 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* Doctor Name Overlay (Top Left) */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold">{appointment?.doctorName}</span>
                <span className="text-[10px] text-zinc-300 font-normal">
                  ({appointment?.doctorSpecialty})
                </span>
              </div>

              <button
                onClick={() => setShowRecordsDrawer(!showRecordsDrawer)}
                className="bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-brand-rose" />
                <span>Patient Records ({sharedRecords.length})</span>
              </button>
            </div>

            {/* Self Video PiP Thumbnail (Bottom Right) */}
            <div className="relative z-10 self-end w-32 sm:w-44 aspect-[4/3] rounded-2xl bg-zinc-900 border-2 border-white/20 overflow-hidden shadow-xl">
              {isCameraOn ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-[10px]">
                  <VideoOff className="w-5 h-5 mb-1" />
                  <span>Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                You (Rhea)
              </div>
            </div>

            {/* Media Control Toolbar (Bottom Center) */}
            <div className="relative z-10 flex items-center justify-center space-x-3 pt-2">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-2xl backdrop-blur-md transition-colors ${
                  isMicOn ? "bg-white/20 text-white hover:bg-white/30" : "bg-brand-error text-white"
                }`}
                aria-label="Toggle Microphone"
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-3 rounded-2xl backdrop-blur-md transition-colors ${
                  isCameraOn ? "bg-white/20 text-white hover:bg-white/30" : "bg-brand-error text-white"
                }`}
                aria-label="Toggle Camera"
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="px-5 py-3 rounded-2xl bg-brand-error hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Consultation</span>
              </button>
            </div>
          </div>

          {/* Side Drawer: Shared Records & Notes */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-rose" />
                  Shared Records Vault
                </h3>
              </div>

              {sharedRecords.length > 0 ? (
                <div className="space-y-2">
                  {sharedRecords.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs space-y-1"
                    >
                      <div className="font-bold text-zinc-900 dark:text-white truncate">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {r.type} • {r.date}
                      </div>
                      {r.notes && (
                        <p className="text-[11px] text-brand-plum dark:text-brand-rose-light">
                          {r.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">
                  No previous records attached to this appointment.
                </p>
              )}

              <div className="p-3 rounded-2xl bg-brand-blush/60 dark:bg-zinc-800/60 border border-brand-rose/20 text-xs space-y-1">
                <span className="font-bold text-brand-plum dark:text-brand-rose-light block">
                  Patient Complaint Note:
                </span>
                <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
                  {appointment?.patientNotes || "Discussion regarding cycle irregularities and diet."}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
              🔒 Session is encrypted. Recordings or third-party access are prohibited without explicit mutual consent.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

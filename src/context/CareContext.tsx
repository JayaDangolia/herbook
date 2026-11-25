"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Doctor, initialDoctors, TimeSlot } from "@/data/doctorsData";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  doctorSpecialty: string;
  medicalSystem: string;
  date: string;
  time: string;
  mode: "video" | "in-person";
  doctorFee: number;
  platformFee: number;
  totalPaid: number;
  paymentStatus: "paid_sandbox" | "refunded";
  status: "upcoming" | "completed" | "cancelled";
  meetingRoomId: string;
  patientName: string;
  patientNotes?: string;
  consultationNotes?: string;
  doctorPrescription?: string;
  sharedRecordIds: string[];
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: "Lab Report" | "Ultrasound Scan" | "Prescription" | "Clinical Note";
  date: string;
  fileUrl: string;
  fileSize: string;
  sharedWithDoctorIds: string[];
  notes?: string;
}

interface CareContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  records: MedicalRecord[];
  bookAppointment: (
    doctorId: string,
    slotId: string,
    mode: "video" | "in-person",
    patientNotes?: string,
    sharedRecordIds?: string[]
  ) => { success: boolean; appointment?: Appointment; error?: string };
  cancelAppointment: (appointmentId: string) => void;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => void;
  addDoctorConsultationNote: (appointmentId: string, note: string, prescription?: string) => void;
  uploadRecord: (record: Omit<MedicalRecord, "id">) => void;
  toggleRecordSharing: (recordId: string, doctorId: string) => void;
  deleteRecord: (recordId: string) => void;
}

const initialAppointments: Appointment[] = [
  {
    id: "apt-101",
    doctorId: "doc-allo-1",
    doctorName: "Dr. Ananya Sharma",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    doctorSpecialty: "Gynecology & PCOS Management",
    medicalSystem: "Modern Medicine (Allopathy)",
    date: "2026-10-16",
    time: "04:00 PM",
    mode: "video",
    doctorFee: 500,
    platformFee: 50,
    totalPaid: 550,
    paymentStatus: "paid_sandbox",
    status: "upcoming",
    meetingRoomId: "room-hb-ananya-400pm",
    patientName: "Rhea Deshmukh",
    patientNotes: "Discussion regarding irregular cycle tracking and ultrasound report.",
    sharedRecordIds: ["rec-1"],
    createdAt: "2026-10-15T14:30:00Z",
  },
];

const initialRecords: MedicalRecord[] = [
  {
    id: "rec-1",
    title: "Pelvic Ultrasound Report - Bilateral Ovaries",
    type: "Ultrasound Scan",
    date: "2026-09-28",
    fileUrl: "#",
    fileSize: "2.4 MB (PDF)",
    sharedWithDoctorIds: ["doc-allo-1"],
    notes: "Normal endometrial thickness. 8-10 peripheral follicles noted.",
  },
  {
    id: "rec-2",
    title: "Thyroid & Lipid Profile Panel (HOMA-IR)",
    type: "Lab Report",
    date: "2026-09-10",
    fileUrl: "#",
    fileSize: "1.1 MB (PDF)",
    sharedWithDoctorIds: [],
    notes: "TSH 2.4 mIU/L, Fasting Insulin 9.8 uIU/ml.",
  },
];

const CareContext = createContext<CareContextType | undefined>(undefined);

export const CareProvider = ({ children }: { children: ReactNode }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);

  useEffect(() => {
    try {
      const savedApts = localStorage.getItem("herbook_appointments");
      if (savedApts) setAppointments(JSON.parse(savedApts));

      const savedRecs = localStorage.getItem("herbook_records");
      if (savedRecs) setRecords(JSON.parse(savedRecs));
    } catch {}
  }, []);

  const saveAppointments = (apts: Appointment[]) => {
    setAppointments(apts);
    try {
      localStorage.setItem("herbook_appointments", JSON.stringify(apts));
    } catch {}
  };

  const saveRecords = (recs: MedicalRecord[]) => {
    setRecords(recs);
    try {
      localStorage.setItem("herbook_records", JSON.stringify(recs));
    } catch {}
  };

  const bookAppointment = (
    doctorId: string,
    slotId: string,
    mode: "video" | "in-person",
    patientNotes?: string,
    sharedRecordIds: string[] = []
  ) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return { success: false, error: "Doctor not found" };

    const slot = doctor.availableSlots.find((s) => s.id === slotId);
    if (!slot) return { success: false, error: "Time slot not found" };
    if (slot.isBooked) return { success: false, error: "This time slot was just booked by another user." };

    // Mark slot as booked (transactional simulation)
    const updatedDoctors = doctors.map((d) => {
      if (d.id === doctorId) {
        return {
          ...d,
          availableSlots: d.availableSlots.map((s) =>
            s.id === slotId ? { ...s, isBooked: true } : s
          ),
        };
      }
      return d;
    });
    setDoctors(updatedDoctors);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatarUrl,
      doctorSpecialty: doctor.specialty,
      medicalSystem: doctor.systemLabel,
      date: slot.date,
      time: slot.time,
      mode,
      doctorFee: doctor.consultationFee,
      platformFee: doctor.platformFee,
      totalPaid: doctor.consultationFee + doctor.platformFee,
      paymentStatus: "paid_sandbox",
      status: "upcoming",
      meetingRoomId: `room-${doctor.id}-${Date.now().toString().slice(-4)}`,
      patientName: "Rhea Deshmukh",
      patientNotes: patientNotes || "General consultation.",
      sharedRecordIds,
      createdAt: new Date().toISOString(),
    };

    const nextApts = [newAppointment, ...appointments];
    saveAppointments(nextApts);
    return { success: true, appointment: newAppointment };
  };

  const cancelAppointment = (appointmentId: string) => {
    const updated = appointments.map((apt) => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          status: "cancelled" as const,
          paymentStatus: "refunded" as const,
        };
      }
      return apt;
    });
    saveAppointments(updated);
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string) => {
    const updated = appointments.map((apt) => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          date: newDate,
          time: newTime,
        };
      }
      return apt;
    });
    saveAppointments(updated);
  };

  const addDoctorConsultationNote = (
    appointmentId: string,
    note: string,
    prescription?: string
  ) => {
    const updated = appointments.map((apt) => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          consultationNotes: note,
          doctorPrescription: prescription,
          status: "completed" as const,
        };
      }
      return apt;
    });
    saveAppointments(updated);
  };

  const uploadRecord = (record: Omit<MedicalRecord, "id">) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: `rec-${Date.now()}`,
    };
    const nextRecs = [newRecord, ...records];
    saveRecords(nextRecs);
  };

  const toggleRecordSharing = (recordId: string, doctorId: string) => {
    const updated = records.map((rec) => {
      if (rec.id === recordId) {
        const isShared = rec.sharedWithDoctorIds.includes(doctorId);
        const updatedDocs = isShared
          ? rec.sharedWithDoctorIds.filter((id) => id !== doctorId)
          : [...rec.sharedWithDoctorIds, doctorId];
        return { ...rec, sharedWithDoctorIds: updatedDocs };
      }
      return rec;
    });
    saveRecords(updated);
  };

  const deleteRecord = (recordId: string) => {
    const updated = records.filter((r) => r.id !== recordId);
    saveRecords(updated);
  };

  return (
    <CareContext.Provider
      value={{
        doctors,
        appointments,
        records,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        addDoctorConsultationNote,
        uploadRecord,
        toggleRecordSharing,
        deleteRecord,
      }}
    >
      {children}
    </CareContext.Provider>
  );
};

export const useCare = () => {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error("useCare must be used within a CareProvider");
  }
  return context;
};

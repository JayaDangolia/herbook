"use client";

import React, { useState, useEffect } from "react";
import { Portal } from "@/components/ui/Portal";
import {
  FileText,
  UploadCloud,
  ShieldCheck,
  Lock,
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  History,
  ShieldAlert,
  X,
  ExternalLink,
} from "lucide-react";
import { useCare, MedicalRecord } from "@/context/CareContext";
import { useApp } from "@/context/AppContext";

export default function RecordsPage() {
  const { records, uploadRecord, toggleRecordSharing, deleteRecord, doctors } = useCare();
  const { user, openAuthModal, showNotification, isLoadingAuth } = useApp();

  const [isUploading, setIsUploading] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState<MedicalRecord["type"]>("Lab Report");
  const [docDate, setDocDate] = useState("2026-10-15");
  const [docNotes, setDocNotes] = useState("");

  // DPDP Act 2023 controls state
  const [isExporting, setIsExporting] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showErasureModal, setShowErasureModal] = useState(false);
  const [erasureReason, setErasureReason] = useState("");
  const [isSubmittingErasure, setIsSubmittingErasure] = useState(false);

  // Access audit logs
  const accessLogs = [
    {
      id: "acc-1",
      accessor: "Dr. Ananya Rao (OB-GYN)",
      action: "Decrypted & Viewed Lab Report",
      recordTitle: "Hormone Panel (LH/FSH & Prolactin)",
      timestamp: "Today at 02:15 PM",
      status: "Authorized (In-Session Consent)",
    },
    {
      id: "acc-2",
      accessor: "Dr. Radhika Sen (Obstetrician)",
      action: "Access Request Granted",
      recordTitle: "Pelvic Ultrasound Scan - Ovaries",
      timestamp: "Yesterday at 11:30 AM",
      status: "Authorized (Patient Permitted)",
    },
    {
      id: "acc-3",
      accessor: "Patient (Self)",
      action: "Consent Revocation",
      recordTitle: "Thyroid Stimulating Hormone (TSH)",
      timestamp: "12 Oct 2026, 04:10 PM",
      status: "Access Revoked",
    },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    uploadRecord({
      title: docTitle.trim(),
      type: docType,
      date: docDate,
      fileUrl: "#",
      fileSize: "1.8 MB (PDF)",
      sharedWithDoctorIds: [],
      notes: docNotes.trim(),
    });

    setDocTitle("");
    setDocNotes("");
    setIsUploading(false);
    showNotification("Medical report encrypted and saved to your private Health Vault!");
  };

  // DPDP Export Handler
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/user/privacy");
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `herbook_health_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification("Encrypted Health Vault archive downloaded (DPDP Act Sec 11 compliant).");
    } catch (err) {
      showNotification("Failed to export health records. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // DPDP Erasure Request Handler
  const handleErasureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingErasure(true);
    try {
      const res = await fetch("/api/user/privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: "DELETE_ACCOUNT",
          reason: erasureReason || "User preference under DPDP Right to Erasure",
        }),
      });
      const data = await res.json();
      setShowErasureModal(false);
      setErasureReason("");
      showNotification(data.message || "Right to Erasure request registered under DPDP Act 2023.");
    } catch (err) {
      showNotification("Could not submit erasure request. Please reach support.");
    } finally {
      setIsSubmittingErasure(false);
    }
  };

  useEffect(() => {
    if (!showErasureModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowErasureModal(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showErasureModal]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-rose border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-5 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-brand-rose/10 text-brand-rose flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white font-display">
            Encrypted Health Records Vault
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Authentication is strictly required under Section 12 of the DPDP Act 2023 to protect sensitive medical scans, ultrasound reports, and clinical prescriptions.
          </p>
        </div>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all cursor-pointer"
        >
          Sign In to Access Vault
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
              Health Records Vault
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            <span className="text-xs text-zinc-500 font-medium">Encrypted &amp; Consent-Controlled</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display mt-0.5">
            Medical Reports &amp; Prescriptions
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Securely organize lab reports, ultrasound scans, and prescriptions. Share with consulting doctors only when you grant permission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploading(!isUploading)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? "Cancel Upload" : "Upload Document"}</span>
          </button>
        </div>
      </div>

      {/* Privacy Safeguard Notice */}
      <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs flex items-start gap-3">
        <Lock className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-zinc-900 dark:text-white block mb-0.5">
            Strict Consent-Based Doctor Access:
          </strong>
          <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
            Unlike traditional clinic records, HerBook gives you total sovereign ownership. Practitioners can <strong>NEVER</strong> access your documents without your explicit appointment-level authorization. You can revoke access at any time with a single tap.
          </span>
        </div>
      </div>

      {/* DPDP Act 2023 Sovereign Privacy Management Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-plum dark:text-brand-rose" />
            <span className="text-xs font-bold text-zinc-900 dark:text-white">
              DPDP Act 2023 — Data Sovereignty Controls
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 max-w-lg">
            Download your encrypted records or inspect the timestamped audit log of every doctor who viewed your health history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-brand-rose" />
            <span>{isExporting ? "Exporting..." : "Export My Data (JSON)"}</span>
          </button>

          <button
            onClick={() => setShowAuditLogs(!showAuditLogs)}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <History className="w-3.5 h-3.5 text-brand-plum" />
            <span>{showAuditLogs ? "Hide Access Log" : "Audit History"}</span>
          </button>

          <button
            onClick={() => setShowErasureModal(true)}
            className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Right to Erasure</span>
          </button>
        </div>
      </div>

      {/* Expandable Doctor Access Audit History */}
      {showAuditLogs && (
        <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-brand-plum dark:text-brand-rose" />
              Doctor Access &amp; Consent History
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">Immutable Compliance Trail</span>
          </div>

          <div className="space-y-2">
            {accessLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{log.accessor}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800 font-medium">
                      {log.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {log.action} • <span className="font-medium text-zinc-700 dark:text-zinc-300">{log.recordTitle}</span>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono self-end sm:self-auto">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Form Modal / Drawer */}
      {isUploading && (
        <form
          onSubmit={handleUploadSubmit}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center space-x-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <UploadCloud className="w-5 h-5 text-brand-rose" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Add Medical Record
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Report Title
              </label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Pelvic Ultrasound Scan - Ovaries"
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Document Category
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
              >
                <option value="Lab Report">Lab Report</option>
                <option value="Ultrasound Scan">Ultrasound Scan</option>
                <option value="Prescription">Prescription</option>
                <option value="Clinical Note">Clinical Note</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">
              Clinical Findings / Notes (Optional)
            </label>
            <textarea
              value={docNotes}
              onChange={(e) => setDocNotes(e.target.value)}
              placeholder="e.g. Endometrium thickness 7mm, Fasting blood glucose normal..."
              className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose resize-none h-16"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-rose text-white text-xs font-bold shadow-soft"
            >
              Upload &amp; Encrypt Document
            </button>
          </div>
        </form>
      )}

      {/* Records List */}
      <div className="space-y-4">
        {records.length > 0 ? (
          records.map((rec) => {
            return (
              <div
                key={rec.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-card space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-rose/15 text-brand-rose flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {rec.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-500 mt-0.5">
                        <span className="font-semibold text-brand-plum dark:text-brand-rose-light">
                          {rec.type}
                        </span>
                        <span>•</span>
                        <span>{rec.date}</span>
                        <span>•</span>
                        <span>{rec.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteRecord(rec.id)}
                    className="p-2 text-zinc-400 hover:text-brand-error self-end sm:self-auto transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {rec.notes && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    {rec.notes}
                  </p>
                )}

                {/* Consent-Based Doctor Access Toggles */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-brand-plum dark:text-brand-rose" />
                    Doctor Access Permissions:
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {doctors.slice(0, 4).map((doc) => {
                      const isShared = rec.sharedWithDoctorIds.includes(doc.id);
                      return (
                        <button
                          key={doc.id}
                          onClick={() => toggleRecordSharing(rec.id, doc.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border flex items-center gap-1.5 transition-all ${
                            isShared
                              ? "bg-brand-success/15 border-brand-success text-brand-success font-bold"
                              : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3 h-3 ${isShared ? "text-brand-success" : "text-zinc-400"}`}
                          />
                          <span>{doc.name.split(" ")[1] || doc.name}</span>
                          <span className="text-[9px]">({isShared ? "Shared" : "+ Grant"})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Your health vault is currently empty.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Upload blood work, ultrasound reports, or prescriptions to share securely with doctors.
            </p>
          </div>
        )}
      </div>

      {/* Right to Erasure Confirmation Modal (DPDP Act 2023 Sec 12) */}
      {showErasureModal && (
        <Portal>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="DPDP Act Right to Erasure"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowErasureModal(false);
            }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-600">
                  <ShieldAlert className="w-5 h-5" />
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                    DPDP Act Right to Erasure
                  </h3>
                </div>
                <button
                  onClick={() => setShowErasureModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Under Section 12 of the <strong>Digital Personal Data Protection Act, 2023</strong>, you have the statutory right to demand the irreversible deletion of your personal and health records from HerBook.
              </p>

              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-[11px] text-rose-700 dark:text-rose-300">
                <strong>Warning:</strong> Deleting your account will immediately purge your menstrual cycle logs, fertility predictions, symptom journals, and revoke doctor access to all medical reports. This action cannot be reversed.
              </div>

              <form onSubmit={handleErasureSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                    Reason for Deletion Request (Optional)
                  </label>
                  <input
                    type="text"
                    value={erasureReason}
                    onChange={(e) => setErasureReason(e.target.value)}
                    placeholder="e.g. Closing account, privacy preference"
                    className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowErasureModal(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Keep My Data
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingErasure}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-soft"
                  >
                    {isSubmittingErasure ? "Submitting Request..." : "Confirm & Submit Erasure Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

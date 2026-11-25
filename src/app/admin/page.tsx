"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Video,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Check,
  X,
  PlaySquare,
  FileText,
  Sliders,
  Building,
  History,
  Lock,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  Flag,
} from "lucide-react";
import { useCare } from "@/context/CareContext";
import { useCommunity } from "@/context/CommunityContext";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import { DEFAULT_FEATURE_FLAGS, FeatureFlags } from "@/lib/featureFlags";
import { Portal } from "@/components/ui/Portal";

interface DoctorAppItem {
  id: string;
  legalName: string;
  email: string;
  phone: string;
  gender: string;
  medicalSystem: string;
  registeringCouncil: string;
  registrationNumber: string;
  registrationYear: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  clinicLocation: string;
  languages: string[];
  certificateFileName: string;
  identityFileName: string;
  status: string;
  submittedAt: string;
  verificationSource?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

interface AuditLogItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details: string;
  ipAddress?: string;
}

export default function AdminPage() {
  const { doctors, appointments } = useCare();
  const { posts, reportedPostIds } = useCommunity();
  const { showNotification } = useApp();

  const [activeTab, setActiveTab] = useState<
    "overview" | "doctors" | "moderation" | "audit" | "flags" | "fees"
  >("overview");

  // Platform fee configuration
  const [platformFeeInput, setPlatformFeeInput] = useState(50);
  const [doctorFeeInput, setDoctorFeeInput] = useState(500);

  // Doctor applications queue
  const [doctorApps, setDoctorApps] = useState<DoctorAppItem[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DoctorAppItem | null>(null);
  const [verificationSource, setVerificationSource] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // Simulated metrics
  const totalUsers = 48200;
  const mau = 28400;
  const dau = 9800;
  const totalBookings = appointments.length + 184;
  const grossPlatformRevenue = totalBookings * (doctorFeeInput + platformFeeInput);
  const netPlatformFees = totalBookings * platformFeeInput;
  const premiumUsers = 3420;

  // Fetch doctor applications
  const fetchDoctorApplications = async () => {
    setIsLoadingDocs(true);
    try {
      const res = await fetch("/api/doctors/register");
      const data = await res.json();
      if (data.applications) {
        setDoctorApps(data.applications);
      }
    } catch (err) {
      console.error("Error fetching doctor applications:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    setIsLoadingAudit(true);
    try {
      const res = await fetch("/api/audit-logs");
      const data = await res.json();
      if (data.logs) {
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  useEffect(() => {
    fetchDoctorApplications();
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    if (!selectedDoc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedDoc(null);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDoc]);

  // Handle doctor approval / state transition
  const handleReviewDecision = async (
    targetStatus: "Verified" | "Rejected" | "More Information Required" | "Active"
  ) => {
    if (!selectedDoc) return;

    if (
      (targetStatus === "Verified" || targetStatus === "Active") &&
      !verificationSource.trim()
    ) {
      showNotification(
        "Statutory Requirement: Official Verification Source (NMC/NCISM Registry URL or Ref) is mandatory before approval."
      );
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/admin/doctors/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedDoc.id,
          status: targetStatus,
          verificationSource: verificationSource.trim(),
          reviewNotes: reviewNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.message || "Failed to update practitioner verification.");
      } else {
        showNotification(
          `Practitioner ${selectedDoc.legalName} verification status updated to '${targetStatus}'.`
        );
        setSelectedDoc(null);
        setVerificationSource("");
        setReviewNotes("");
        fetchDoctorApplications();
        fetchAuditLogs();
      }
    } catch (err) {
      showNotification("Error communicating with clinical verification gateway.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleUpdateFees = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification(
      `Platform fee updated to ₹${platformFeeInput} & Default doctor fee to ₹${doctorFeeInput}!`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
              Platform Governance Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            <span className="text-xs text-zinc-500 font-medium">
              Statutory Compliance &amp; Operational Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display mt-0.5">
            HerBook Administration
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Audit doctor credentials, enforce Indian Telemedicine Guidelines 2020, monitor DPDP compliance trails, and govern release gates.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-200 dark:border-zinc-800">
        {[
          { id: "overview", label: "Executive Analytics" },
          {
            id: "doctors",
            label: `Doctor Verification Queue (${doctorApps.filter((d) => d.status !== "Verified").length})`,
          },
          { id: "moderation", label: `Community Moderation (${reportedPostIds.length})` },
          { id: "audit", label: `Security & Statutory Audit Trail (${auditLogs.length})` },
          { id: "flags", label: "Release Gates & Safety Flags" },
          { id: "fees", label: "Revenue & Platform Fee Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-brand-rose text-brand-plum dark:text-brand-rose bg-brand-blush/40 dark:bg-brand-plum/20"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Total Registered Users
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {(totalUsers / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                +14.2% MoM growth
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Monthly Active Users (MAU)
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {(mau / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">DAU / MAU: 34.5%</div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Gross Telehealth Volume
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {formatINR(grossPlatformRevenue)}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{totalBookings} Total Bookings</div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Platform Booking Net Fee
              </div>
              <div className="text-2xl font-extrabold text-brand-success mt-1">
                {formatINR(netPlatformFees)}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">₹50 / booking margin</div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Practitioner Network Mix
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Modern Medicine (Allopathy)</span>
                  <span className="font-bold text-blue-600">5 Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Ayurveda (AYUSH)</span>
                  <span className="font-bold text-emerald-600">5 Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Homeopathy (AYUSH)</span>
                  <span className="font-bold text-purple-600">5 Active</span>
                </div>
                <div className="flex justify-between text-amber-600 font-semibold pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Pending Credential Verification</span>
                  <span>{doctorApps.filter((d) => d.status !== "Verified").length} In Queue</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                HerBook PLUS Subscriptions
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Active PLUS Subscribers</span>
                  <span className="font-bold">{premiumUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Tier (₹99/mo)</span>
                  <span>2,410 users</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Tier (₹799/yr)</span>
                  <span>1,010 users</span>
                </div>
                <div className="flex justify-between text-brand-success font-semibold pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Annual Recurring Run-Rate</span>
                  <span>{formatINR(premiumUsers * 799)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Content &amp; Community Health
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Total Reel Views</span>
                  <span className="font-bold">642,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Clinician-Reviewed Reels</span>
                  <span className="text-emerald-600 font-bold">100% of Medical Claims</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Posts Audited</span>
                  <span>1,890</span>
                </div>
                <div className="flex justify-between text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Spam Flag Rate</span>
                  <span>0.04% (Under threshold)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR VERIFICATION QUEUE */}
      {activeTab === "doctors" && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 dark:text-amber-200 block">
                Statutory Telemedicine Practice Verification Protocol (India):
              </strong>
              <span className="text-amber-800 dark:text-amber-300 text-[11px]">
                Under the Telemedicine Practice Guidelines 2020, only Registered Medical Practitioners (RMPs) with active council registration (NMC / State Medical Council / NCISM / NCH) can be activated for virtual consultations. Administrative reviewers must cross-verify records against the official National or State register and record the verification source.
              </span>
            </div>
          </div>

          {isLoadingDocs ? (
            <div className="text-center py-12 text-xs text-zinc-500">
              Loading practitioner credentials queue...
            </div>
          ) : doctorApps.length > 0 ? (
            <div className="space-y-3">
              {doctorApps.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {doc.legalName}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          doc.status === "Verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : doc.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}
                      >
                        {doc.status}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {doc.medicalSystem}
                      </span>
                    </div>

                    <p className="text-xs text-brand-plum dark:text-brand-rose-light font-medium">
                      {doc.qualification} • {doc.specialty} ({doc.experienceYears} Years Exp)
                    </p>

                    <p className="text-[11px] text-zinc-500 font-mono">
                      Reg No: <span className="text-zinc-800 dark:text-zinc-200 font-bold">{doc.registrationNumber}</span> | Council: {doc.registeringCouncil} (Year: {doc.registrationYear})
                    </p>

                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <span>Clinic: {doc.clinicLocation}</span>
                      <span>•</span>
                      <span>Files: {doc.certificateFileName}, {doc.identityFileName}</span>
                    </div>

                    {doc.verificationSource && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        Verified via: {doc.verificationSource} {doc.reviewedBy ? `by ${doc.reviewedBy}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => {
                        setSelectedDoc(doc);
                        setVerificationSource(doc.verificationSource || "");
                        setReviewNotes(doc.reviewNotes || "");
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-bold text-xs shadow-soft transition-all"
                    >
                      Audit &amp; Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Verification Queue Clean
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                No doctor onboarding applications are currently awaiting clinical review.
              </p>
            </div>
          )}

          {/* Review Modal */}
          {selectedDoc && (
            <Portal>
              <div
                role="dialog"
                aria-modal="true"
                aria-label="RMP Credential Verification Audit"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedDoc(null);
                }}
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-zinc-900 rounded-3xl max-w-xl w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        RMP Credential Verification Audit
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Applicant: {selectedDoc.legalName} ({selectedDoc.registrationNumber})
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs space-y-1.5 font-mono">
                    <div>Council: <span className="font-bold">{selectedDoc.registeringCouncil}</span></div>
                    <div>System: <span className="font-bold uppercase">{selectedDoc.medicalSystem}</span></div>
                    <div>Qualification: <span className="font-bold">{selectedDoc.qualification}</span></div>
                    <div>Contact: {selectedDoc.email} | {selectedDoc.phone}</div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                        Statutory Verification Source <span className="text-rose-500">* (Mandatory for Approval)</span>
                      </label>
                      <input
                        type="text"
                        value={verificationSource}
                        onChange={(e) => setVerificationSource(e.target.value)}
                        placeholder="e.g. NMC National Medical Register (Doc Ref #IMR-2015-998) or State Council Portal"
                        className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
                      />
                      <span className="text-[10px] text-zinc-500">
                        Must record exact state council or IMR entry URL / verification reference.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                        Reviewer Notes / Compliance Findings
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="e.g. Identity documents match MMC public registry; primary degree confirmed."
                        className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white h-16 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleReviewDecision("More Information Required")}
                      disabled={isSubmittingReview}
                      className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Request Documents
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReviewDecision("Rejected")}
                      disabled={isSubmittingReview}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReviewDecision("Verified")}
                      disabled={isSubmittingReview}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve &amp; Activate RMP</span>
                    </button>
                  </div>
                </div>
              </div>
            </Portal>
          )}
        </div>
      )}

      {/* TAB 3: COMMUNITY MODERATION QUEUE */}
      {activeTab === "moderation" && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
            <strong>IT Rules 2021 Intermediary Moderation:</strong> Reported posts must be audited for unproven medical cures, harassment, or commercial spam. Non-consensual imagery is subjected to mandatory 24-hour grievance takedown priority.
          </div>

          {reportedPostIds.length > 0 ? (
            <div className="space-y-3">
              {posts
                .filter((p) => reportedPostIds.includes(p.id) || p.isReported)
                .map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-brand-error/30 shadow-card space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        Author: {p.authorName} ({p.topic})
                      </span>
                      <span className="text-brand-error font-bold text-[10px] bg-brand-error/10 px-2 py-0.5 rounded">
                        Flagged for Review
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{p.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{p.content}</p>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => showNotification("Post cleared and reinstated.")}
                        className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() =>
                          showNotification("Content removed and author issued guideline reminder.")
                        }
                        className="px-4 py-1.5 rounded-xl bg-brand-error text-white font-bold text-xs"
                      >
                        Remove Content
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
              <Check className="w-8 h-8 text-brand-success mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Moderation Queue Clear
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                No active flagged posts or misinformation alerts currently require review.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs flex items-center justify-between">
            <div>
              <strong>DPDP &amp; IT Act Statutory Audit Trail:</strong> Immutable security event log recording privilege escalations, consent modifications, doctor status changes, and data export requests.
            </div>
            <button
              onClick={fetchAuditLogs}
              className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-xs font-bold"
            >
              Refresh Logs
            </button>
          </div>

          {isLoadingAudit ? (
            <div className="text-center py-12 text-xs text-zinc-500">Loading audit trail...</div>
          ) : auditLogs.length > 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Actor</th>
                      <th className="p-3.5">Action Code</th>
                      <th className="p-3.5">Event Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                        <td className="p-3.5 whitespace-nowrap text-zinc-400">
                          {new Date(log.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                        </td>
                        <td className="p-3.5 whitespace-nowrap font-sans font-semibold">
                          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {log.actorRole}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap font-bold text-brand-plum dark:text-brand-rose">
                          {log.action}
                        </td>
                        <td className="p-3.5 font-sans text-zinc-600 dark:text-zinc-300 max-w-md truncate">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-zinc-500">
              No audit log entries recorded yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RELEASE GATES & SAFETY FLAGS */}
      {activeTab === "flags" && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
            <strong>Launch Gatekeeping Status:</strong> Central safety controls ensuring high-risk capabilities remain locked during controlled testing.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-rose" />
                Payment &amp; Booking Gates
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                  <div>
                    <div className="font-bold">Real Payments (`realPayments`)</div>
                    <div className="text-[10px] text-zinc-500">Real UPI / Card Gateways</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    DISABLED (Safe Sandbox)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                  <div>
                    <div className="font-bold">Live Clinical Bookings (`liveDoctorBookings`)</div>
                    <div className="text-[10px] text-zinc-500">Real Patient Scheduling</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    DISABLED (Demo RMPs Only)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                  <div>
                    <div className="font-bold">Public Registration (`publicRegistration`)</div>
                    <div className="text-[10px] text-zinc-500">Unrestricted User Sign-ups</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    DISABLED (Invite Pilot)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Statutory Prohibitions &amp; Active Vault
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                  <div>
                    <div className="font-bold">Autonomous AI Prescriptions</div>
                    <div className="text-[10px] text-zinc-500">Statutory Prohibition (India)</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                    LOCKED FALSE (Permanent)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                  <div>
                    <div className="font-bold">Health Record Vault Sharing</div>
                    <div className="text-[10px] text-zinc-500">Consent-Gated Patient Vault</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    ACTIVE (Consent Gated)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                  <div>
                    <div className="font-bold">Doctor Verification Intake</div>
                    <div className="text-[10px] text-zinc-500">Clinician Onboarding Portal</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    ACTIVE (Verification Review)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: REVENUE & PLATFORM FEES SETTINGS */}
      {activeTab === "fees" && (
        <form
          onSubmit={handleUpdateFees}
          className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card max-w-xl space-y-4"
        >
          <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Consultation Fee Structure
            </h3>
            <p className="text-xs text-zinc-500">
              Configure marketplace platform splits and default patient pricing
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                HerBook Platform Booking Fee (INR)
              </label>
              <input
                type="number"
                value={platformFeeInput}
                onChange={(e) => setPlatformFeeInput(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
              />
              <span className="text-[10px] text-zinc-500">Default: ₹50 per 20-min session</span>
            </div>

            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Standard Doctor Remuneration (INR)
              </label>
              <input
                type="number"
                value={doctorFeeInput}
                onChange={(e) => setDoctorFeeInput(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
              />
              <span className="text-[10px] text-zinc-500">Default: ₹500 to practitioner</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold flex justify-between text-sm">
              <span>Total Patient Payment:</span>
              <span className="text-brand-plum dark:text-brand-rose">
                {formatINR(platformFeeInput + doctorFeeInput)}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-xs shadow-soft transition-all"
            >
              Update Pricing Rules
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

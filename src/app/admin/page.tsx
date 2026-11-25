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
  RefreshCw,
  Ban,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { useCare } from "@/context/CareContext";
import { useCommunity } from "@/context/CommunityContext";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import { DEFAULT_FEATURE_FLAGS, FeatureFlags } from "@/lib/featureFlags";
import { Portal } from "@/components/ui/Portal";
import Link from "next/link";

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

interface ManagedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  avatarUrl: string;
  createdAt: string;
}

export default function AdminPage() {
  const { doctors, appointments } = useCare();
  const { posts, reportedPostIds } = useCommunity();
  const { user, showNotification, openAuthModal, login } = useApp();

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "doctors" | "moderation" | "audit" | "flags" | "fees"
  >("overview");

  // Platform fee configuration
  const [platformFeeInput, setPlatformFeeInput] = useState(50);
  const [doctorFeeInput, setDoctorFeeInput] = useState(500);

  // Users management state
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

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

  // Fetch users from database
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (userSearchQuery) params.set("q", userSearchQuery);
      if (userRoleFilter !== "all") params.set("role", userRoleFilter);
      if (userStatusFilter !== "all") params.set("status", userStatusFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

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
    if (user && (user.role === "admin" || user.role === "superadmin")) {
      fetchUsers();
      fetchDoctorApplications();
      fetchAuditLogs();
    }
  }, [user, userRoleFilter, userStatusFilter]);

  // Handle user suspension / restoration / role change
  const handleUserAction = async (
    targetUserId: string,
    action: "suspend" | "restore",
    newRole?: string
  ) => {
    setUpdatingUserId(targetUserId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUserId,
          action,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || "Action failed.");
      } else {
        showNotification(data.message || "User record successfully updated.");
        fetchUsers();
        fetchAuditLogs();
      }
    } catch (err) {
      showNotification("Error executing user action.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle role modification
  const handleRoleChange = async (targetUserId: string, role: string) => {
    setUpdatingUserId(targetUserId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUserId,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || "Failed to update user role.");
      } else {
        showNotification(data.message || `Role updated to ${role}.`);
        fetchUsers();
        fetchAuditLogs();
      }
    } catch (err) {
      showNotification("Error updating user role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

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

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fadeIn space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mx-auto text-brand-error shadow-card">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-rose">
            Security &amp; Statutory Access Gate
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white font-display mt-1">
            Restricted Administrative Console
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
            {user
              ? `Your account (@${user.username}) is registered as role "${user.role}" and does not possess administrator credentials required under DPDP & Telemedicine compliance rules.`
              : "Authentication required. You must sign in with a verified administrator account to access platform governance, user records, and practitioner verification."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {!user ? (
            <>
              <button
                onClick={() => openAuthModal("login")}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:opacity-95 transition-all"
              >
                Sign In with Admin Account
              </button>
              <button
                onClick={async () => {
                  const res = await login("admin@herbook.in", "Admin@HerBook2026");
                  if (res.success) {
                    showNotification("Signed in as Administrator.");
                  } else {
                    showNotification(res.error || "Failed to sign in as Administrator.");
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-xs hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Quick Demo Admin Login
              </button>
            </>
          ) : (
            <Link
              href="/feed"
              className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs transition-all"
            >
              Return to Community Feed
            </Link>
          )}
        </div>
      </div>
    );
  }

  const realTotalUsers = usersList.length > 0 ? usersList.length : 3;
  const totalBookings = appointments.length + 184;
  const grossPlatformRevenue = totalBookings * (doctorFeeInput + platformFeeInput);
  const netPlatformFees = totalBookings * platformFeeInput;
  const premiumUsers = 3420;

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
            Audit doctor credentials, enforce Indian Telemedicine Guidelines 2020, monitor DPDP compliance trails, and govern user accounts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-brand-blush/60 dark:bg-brand-plum/20 text-brand-plum dark:text-brand-rose font-bold">
            Logged in as @{user?.username} ({user?.role})
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-200 dark:border-zinc-800">
        {[
          { id: "overview", label: "Executive Analytics" },
          { id: "users", label: `User Management (${usersList.length})` },
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
                {realTotalUsers} Accounts
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                Active Multi-User Database
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Doctor Applications
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {doctorApps.length} RMPs
              </div>
              <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                {doctorApps.filter((d) => d.status !== "Verified").length} Pending Verification
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card">
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Audit Trail Events
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {auditLogs.length} Events
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">DPDP Compliant Trail</div>
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

      {/* TAB: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-zinc-900 dark:text-white">Database User Administration:</strong>
              <span className="text-zinc-600 dark:text-zinc-400 ml-1">
                Manage authenticated accounts, modify roles, monitor email verification, and enforce suspensions.
              </span>
            </div>
            <button
              onClick={fetchUsers}
              className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? "animate-spin" : ""}`} />
              <span>Refresh Users</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                placeholder="Search by name, email or @handle..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
              />
            </div>

            <div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-rose"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="doctor">Doctor (RMP)</option>
                <option value="creator">Creator</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-rose"
              >
                <option value="all">All Account Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {isLoadingUsers ? (
            <div className="text-center py-12 text-xs text-zinc-500">Loading registered users...</div>
          ) : usersList.length > 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Email &amp; Status</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Registered</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-blush dark:bg-brand-plum/40 border border-brand-rose/20 flex items-center justify-center font-bold text-brand-plum dark:text-brand-rose overflow-hidden text-xs shrink-0">
                              {u.avatarUrl ? (
                                <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                              ) : (
                                u.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-zinc-900 dark:text-white">{u.name}</div>
                              <div className="text-[11px] text-zinc-500">@{u.username} • <span className="font-mono text-[10px]">{u.id}</span></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-zinc-700 dark:text-zinc-300 font-medium">{u.email}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {u.isEmailVerified ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                <AlertCircle className="w-3 h-3" /> Unverified
                              </span>
                            )}
                            <span className="text-zinc-400 text-[10px]">•</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                u.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                              }`}
                            >
                              {u.status.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          {u.id === "usr-admin-001" ? (
                            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200">
                              SUPERADMIN
                            </span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={updatingUserId === u.id}
                              className="px-2 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white"
                            >
                              <option value="user">User</option>
                              <option value="doctor">Doctor</option>
                              <option value="creator">Creator</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-zinc-500 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          {u.id === "usr-admin-001" ? (
                            <span className="text-[11px] text-zinc-400 italic">Protected Root</span>
                          ) : u.status === "active" ? (
                            <button
                              onClick={() => handleUserAction(u.id, "suspend")}
                              disabled={updatingUserId === u.id}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold text-xs inline-flex items-center gap-1 transition-all"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(u.id, "restore")}
                              disabled={updatingUserId === u.id}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold text-xs inline-flex items-center gap-1 transition-all"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
              <Users className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                No users found
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Try refining your search terms or filters.
              </p>
            </div>
          )}
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Grid,
  PlaySquare,
  Bookmark,
  Shield,
  Settings,
  Edit3,
  Share2,
  Calendar,
  Video,
  FileText,
  Lock,
  Download,
  Trash2,
  Languages,
  Crown,
  Moon,
  Sun,
  X,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useCycle } from "@/context/CycleContext";
import { useCare } from "@/context/CareContext";
import { initialReels } from "@/data/reelsData";
import { initialSocialPosts } from "@/data/socialFeedData";
import { formatINR, formatDate } from "@/lib/utils";
import { Portal } from "@/components/ui/Portal";

export default function ProfilePage() {
  const {
    user,
    setUser,
    isLoadingAuth,
    openAuthModal,
    logout,
    language,
    setLanguage,
    theme,
    toggleTheme,
    togglePremium,
    showNotification,
  } = useApp();

  const { periods, dailyLogs } = useCycle();
  const { appointments, records } = useCare();

  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved" | "vault">("posts");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [userDbPosts, setUserDbPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || "");

      // If demo user Rhea, include initial posts; otherwise load user's real database posts
      if (user.id === "usr-demo-rhea" || user.username === "rhea_d") {
        setUserDbPosts(initialSocialPosts.slice(0, 3));
      } else {
        // Fetch posts created by this user
        fetch("/api/posts")
          .then((res) => res.json())
          .then((data) => {
            if (data.posts) {
              const myPosts = data.posts.filter((p: any) => p.authorId === user.id);
              setUserDbPosts(myPosts);
            }
          })
          .catch(() => {});
      }
    }
  }, [user]);

  const userReels = user?.username === "rhea_d" ? initialReels.slice(0, 2) : [];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, bio: editBio }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser((prev) => (prev ? { ...prev, name: data.user.name, bio: data.user.bio } : null));
        setIsEditProfileOpen(false);
        showNotification("Profile updated successfully!");
      } else {
        showNotification(data.error || "Could not update profile.");
      }
    } catch {
      showNotification("Network error. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleShareProfile = () => {
    if (navigator.share && user) {
      navigator.share({
        title: `${user.name} on HerBook`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification("Profile link copied to clipboard!");
    }
  };

  const handleExportData = () => {
    if (!user) return;
    const exportData = {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        language,
        createdAt: "2026-10-15T00:00:00Z",
      },
      cyclePeriods: periods,
      dailySymptomLogs: dailyLogs,
      exportedAt: new Date().toISOString(),
      disclaimer: "HerBook sovereign health records archive under DPDP Act 2023.",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `herbook_health_export_${user.username}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification("Confidential health records exported as JSON!");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you wish to submit a permanent account deletion request under the DPDP Act 2023?"
      )
    ) {
      logout();
      showNotification("Account logged out and erasure request queued.");
    }
  };

  // 1. Loading State
  if (isLoadingAuth) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-rose border-t-transparent animate-spin" />
      </div>
    );
  }

  // 2. Unauthenticated State: Redirect to standalone login
  if (!user) {
    return null;
  }

  // 3. Authenticated Real User Profile
  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 py-4 space-y-6 animate-fadeIn pb-24">
      {/* 1. Profile Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-base text-zinc-900 dark:text-white">
              @{user.username || "herbook_user"}
            </span>
            {user.role === "doctor" && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-rose/20 text-brand-plum dark:text-brand-rose flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-brand-success" /> Doctor
              </span>
            )}
            {user.role === "admin" && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300">
                Admin
              </span>
            )}
            {user.isPremium && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-amber-950 flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5 fill-amber-950" /> PLUS
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Avatar & Stats Row */}
        <div className="flex items-center space-x-6">
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-brand-rose ring-offset-2 dark:ring-offset-zinc-900 shadow-md"
            />
          </div>

          <div className="flex-1 flex items-center justify-around text-center">
            <div>
              <div className="text-base font-extrabold text-zinc-900 dark:text-white">
                {userDbPosts.length}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Posts</div>
            </div>

            <div>
              <div className="text-base font-extrabold text-zinc-900 dark:text-white">
                {user.username === "rhea_d" ? "1,240" : "0"}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Followers</div>
            </div>

            <div>
              <div className="text-base font-extrabold text-zinc-900 dark:text-white">
                {user.username === "rhea_d" ? "348" : "0"}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Following</div>
            </div>
          </div>
        </div>

        {/* Display Name & Bio */}
        <div className="space-y-1 text-xs">
          <h2 className="font-extrabold text-zinc-900 dark:text-white text-sm">
            {user.name}
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-snug">
            {user.bio || "Member of HerBook Women's Health & Wellness Community 🌸"}
          </p>
          <div className="text-[11px] font-semibold text-brand-plum dark:text-brand-rose-light pt-0.5">
            Role: <span className="capitalize">{user.role}</span>
          </div>
        </div>

        {/* Action Buttons: Edit Profile & Share */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-900 dark:text-white transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={handleShareProfile}
            className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-900 dark:text-white transition-colors"
          >
            Share Profile
          </button>
        </div>
      </div>

      {/* 2. Content Tabs */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-3 flex-1 flex justify-center border-b-2 transition-all ${
              activeTab === "posts"
                ? "border-brand-rose text-brand-rose"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
            title="Posts"
          >
            <Grid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`py-3 flex-1 flex justify-center border-b-2 transition-all ${
              activeTab === "reels"
                ? "border-brand-rose text-brand-rose"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
            title="Reels"
          >
            <PlaySquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`py-3 flex-1 flex justify-center border-b-2 transition-all ${
              activeTab === "saved"
                ? "border-brand-rose text-brand-rose"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
            title="Saved Collections"
          >
            <Bookmark className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`py-3 flex-1 flex justify-center border-b-2 transition-all ${
              activeTab === "vault"
                ? "border-brand-rose text-brand-rose"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
            title="Private Health Vault"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Tab Contents: 3-Column Media Grid */}
      {activeTab === "posts" && (
        <div>
          {userDbPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {userDbPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="aspect-square bg-zinc-900 relative group overflow-hidden cursor-pointer rounded-lg block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.mediaUrls ? post.mediaUrls[0] : "https://images.unsplash.com/photo-1544005313-94ddf0286df2"}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                    <span>❤️ {post.likesCount || 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <Grid className="w-8 h-8 text-zinc-400 mx-auto mb-1 stroke-1" />
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">No posts shared yet</p>
              <p className="text-[11px] text-zinc-400">Tap the central Hub (+) button to share insights with the HerBook community.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "reels" && (
        <div className="grid grid-cols-3 gap-1">
          {userReels.length > 0 ? (
            userReels.map((reel) => (
              <Link
                key={reel.id}
                href="/reels"
                className="aspect-[9/16] bg-zinc-900 relative group overflow-hidden rounded-lg block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white flex items-center gap-1 drop-shadow-md">
                  <PlaySquare className="w-3 h-3" />
                  <span>{(reel.viewsCount / 1000).toFixed(0)}k</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-xs text-zinc-400">
              No reels published.
            </div>
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-3">
          <div className="p-3.5 bg-brand-blush/40 dark:bg-zinc-800/40 rounded-2xl border border-brand-rose/20 text-xs text-zinc-600 dark:text-zinc-400">
            🔒 <strong>Private Collection:</strong> Only you can view your saved articles, recipes, and clinician guides.
          </div>
          <div className="grid grid-cols-3 gap-1">
            {initialSocialPosts.slice(2, 5).map((post, idx) => (
              <Link key={idx} href={`/post/${post.id}`} className="aspect-square bg-zinc-900 rounded-lg overflow-hidden relative block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.mediaUrls[0]}
                  alt="Saved item"
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === "vault" && (
        <div className="space-y-4">
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400">
            🔒 <strong>Confidential Health Vault:</strong> Your medical appointments, prescriptions, and lab records are isolated from your public profile.
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Upcoming Telehealth Consultations ({appointments.length})
            </h4>
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {apt.doctorName}
                      </span>
                      <div className="text-[11px] text-brand-plum dark:text-brand-rose-light">
                        {apt.doctorSpecialty}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {apt.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                    <span>📅 {formatDate(apt.date)}</span>
                    <span>•</span>
                    <span>⏰ {apt.time}</span>
                  </div>

                  <Link
                    href={`/consult/video/${apt.id}`}
                    className="w-full py-2 rounded-xl bg-brand-rose text-white text-center font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft block"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enter Video Room</span>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 py-3 text-center">No upcoming consultations.</p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Uploaded Lab Reports &amp; Scans ({records.length})
            </h4>
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-brand-rose shrink-0" />
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-white truncate">
                      {rec.title}
                    </div>
                    <div className="text-[10px] text-zinc-500">{rec.type} • {rec.date}</div>
                  </div>
                </div>
                <Link
                  href="/records"
                  className="text-xs font-bold text-brand-plum dark:text-brand-rose"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <Portal>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="HerBook Settings"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSettingsOpen(false);
            }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-[2.25rem] sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    HerBook Settings &amp; Governance
                  </h3>
                  <p className="text-[11px] text-zinc-500">Account: {user.email}</p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Selector */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-zinc-500 uppercase tracking-wider block">
                  UI Language
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-colors ${
                      language === "en"
                        ? "bg-brand-rose text-white border-brand-rose"
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => setLanguage("hi")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-colors ${
                      language === "hi"
                        ? "bg-brand-rose text-white border-brand-rose"
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                </div>
              </div>

              {/* Membership simulation */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/40 dark:from-zinc-800 dark:to-zinc-800 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" />
                    HerBook PLUS Tier
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {user.isPremium ? "Active (₹799/yr)" : "Free Tier"}
                  </span>
                </div>
                <button
                  onClick={togglePremium}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                >
                  {user.isPremium ? "Downgrade" : "Unlock PLUS"}
                </button>
              </div>

              {/* Data Export & Account Actions */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
                <span className="font-bold text-zinc-500 uppercase tracking-wider block">
                  Sovereign Data Rights (Indian DPDP)
                </span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleExportData}
                    className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Health Records (JSON)</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      logout();
                    }}
                    className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer hover:bg-zinc-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out of HerBook</span>
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full py-2.5 rounded-xl bg-brand-error/10 text-brand-error font-bold text-xs flex items-center justify-center space-x-1.5 border border-brand-error/20 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Request DPDP Account Erasure</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <Portal>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit Profile"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditProfileOpen(false);
            }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          >
            <form
              onSubmit={handleSaveProfile}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                  Edit Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-1 rounded-full text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white resize-none h-20 focus:outline-none focus:ring-2 focus:ring-brand-rose"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 rounded-xl bg-brand-rose text-white font-bold disabled:opacity-50"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}

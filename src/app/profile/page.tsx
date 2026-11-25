"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useApp, UserRole } from "@/context/AppContext";
import { useCycle } from "@/context/CycleContext";
import { useCare } from "@/context/CareContext";
import { initialReels } from "@/data/reelsData";
import { initialSocialPosts } from "@/data/socialFeedData";
import { formatINR, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const {
    user,
    setUser,
    language,
    setLanguage,
    theme,
    toggleTheme,
    switchRole,
    togglePremium,
    showNotification,
  } = useApp();
  const { periods, dailyLogs } = useCycle();
  const { appointments, records } = useCare();

  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved" | "vault">("posts");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(
    "Passionate about women's wellness, PCOS advocacy & mindful living 🌸 Mumbai, India"
  );

  const userReels = initialReels.slice(0, 4);
  const userPosts = initialSocialPosts.slice(0, 6);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: editName.trim(),
    }));
    setIsEditProfileOpen(false);
    showNotification("Profile updated successfully!");
  };

  const handleShareProfile = () => {
    if (navigator.share) {
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
    const exportData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        language,
        createdAt: "2026-05-12T00:00:00Z",
      },
      cyclePeriods: periods,
      dailySymptomLogs: dailyLogs,
      exportedAt: new Date().toISOString(),
      disclaimer: "HerBook personal sovereign health records archive.",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `herbook_health_export_${user.name.toLowerCase().replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification("Health records exported as confidential JSON!");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you wish to permanently delete your HerBook account and purge all local cycle logs and appointments?"
      )
    ) {
      localStorage.clear();
      showNotification("Account erased. Reloading application...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 py-4 space-y-6 animate-fadeIn">
      {/* 1. Instagram-Style Profile Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="font-extrabold text-base text-zinc-900 dark:text-white">
              rhea_deshmukh
            </span>
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
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-brand-rose ring-offset-2 dark:ring-offset-zinc-900 shadow-md"
            />
          </div>

          <div className="flex-1 flex items-center justify-around text-center">
            <div>
              <div className="text-base font-extrabold text-zinc-900 dark:text-white">
                12
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Posts</div>
            </div>

            <div>
              <div className="text-base font-extrabold text-zinc-900 dark:text-white">
                1,240
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Followers</div>
            </div>

            <div>
              <div className="text-base font-extrabold text-zinc-900 dark:text-white">
                348
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
            {editBio}
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

      {/* 2. Instagram-Style Content Tabs */}
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
        <div className="grid grid-cols-3 gap-1">
          {userPosts.map((post, idx) => (
            <div
              key={idx}
              className="aspect-square bg-zinc-900 relative group overflow-hidden cursor-pointer rounded-lg"
              onClick={() => showNotification(`Opened post '${post.caption.slice(0, 30)}...'`)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.mediaUrls[0]}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                <span>❤️ {post.likesCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "reels" && (
        <div className="grid grid-cols-3 gap-1">
          {userReels.map((reel) => (
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
          ))}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-3">
          <div className="p-3.5 bg-brand-blush/40 dark:bg-zinc-800/40 rounded-2xl border border-brand-rose/20 text-xs text-zinc-600 dark:text-zinc-400">
            🔒 <strong>Private Collection:</strong> Only you can view your saved articles, recipes, and clinician guides.
          </div>
          <div className="grid grid-cols-3 gap-1">
            {initialSocialPosts.slice(2, 5).map((post, idx) => (
              <div key={idx} className="aspect-square bg-zinc-900 rounded-lg overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.mediaUrls[0]}
                  alt="Saved item"
                  className="w-full h-full object-cover"
                />
              </div>
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
            {appointments.map((apt) => (
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
            ))}
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-[2.25rem] sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                HerBook Settings &amp; Governance
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Switcher (Crucial for test evaluation) */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-zinc-500 uppercase tracking-wider block">
                Switch Test Role:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(["user", "doctor", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setIsSettingsOpen(false);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                      user.role === r
                        ? "bg-brand-plum text-white border-brand-plum"
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
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

            {/* Data Export & Account Purge */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
              <span className="font-bold text-zinc-500 uppercase tracking-wider block">
                Sovereign Data Rights (Indian DPDP)
              </span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleExportData}
                  className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Health Records (JSON)</span>
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-2.5 rounded-xl bg-brand-error/10 text-brand-error font-bold text-xs flex items-center justify-center space-x-1.5 border border-brand-error/20"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Permanently Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSaveProfile}
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
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Bio
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white resize-none h-20"
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
                className="px-5 py-2 rounded-xl bg-brand-rose text-white font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

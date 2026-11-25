"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Bell,
  Send,
  ShieldAlert,
  Moon,
  Sun,
  PlusSquare,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useCycle } from "@/context/CycleContext";

export const AppHeader = () => {
  const router = useRouter();
  const {
    user,
    theme,
    toggleTheme,
    setShowEmergencyModal,
    setIsNotificationsOpen,
    setIsMessagesOpen,
    setIsCreateContentOpen,
  } = useApp();
  const { predictions } = useCycle();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Instagram-Style "herbook." Wordmark */}
        <Link href="/" className="flex items-center space-x-1 group">
          <span className="font-display font-extrabold text-2xl tracking-tight text-brand-plum dark:text-white">
            herbook<span className="text-brand-rose">.</span>
          </span>
        </Link>

        {/* Right Tools: Cycle Shortcut, SOS, Notifications, Messages */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Create Post Action */}
          <button
            onClick={() => setIsCreateContentOpen(true)}
            className="p-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Create Post or Reel"
            aria-label="Create Content"
          >
            <PlusSquare className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Quick Cycle Status Pill */}
          <Link
            href="/track"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-brand-blush dark:bg-brand-plum/30 text-brand-plum dark:text-brand-rose text-xs font-extrabold border border-brand-rose/25 hover:border-brand-rose transition-colors"
            title="HerCycle Tracker"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-rose" />
            <span>D{predictions.currentCycleDay}</span>
          </Link>

          {/* Emergency SOS Shortcut */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="p-1.5 rounded-xl bg-brand-error/10 hover:bg-brand-error/20 text-brand-error text-xs font-bold border border-brand-error/20 transition-colors"
            title="Emergency Red-Flag Escalation (112 • 108)"
            aria-label="Emergency SOS"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </button>

          {/* Notifications Icon with Badge */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Notifications"
            aria-label="Open Notifications"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-rose ring-2 ring-white dark:ring-zinc-950" />
          </button>

          {/* Messages / Direct Messaging Icon */}
          <button
            onClick={() => setIsMessagesOpen(true)}
            className="relative p-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Messages"
            aria-label="Open Messages"
          >
            <Send className="w-5 h-5 stroke-[1.8] -rotate-12" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 stroke-[1.8]" />
            ) : (
              <Sun className="w-4 h-4 stroke-[1.8] text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

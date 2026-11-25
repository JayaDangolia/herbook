"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlaySquare,
  Plus,
  Users,
  User,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export const BottomNav = () => {
  const pathname = usePathname();
  const { user, isHubOpen, setIsHubOpen } = useApp();

  // Hide bottom nav during active full-screen video consultation room to avoid obstruction
  if (pathname.startsWith("/consult/video/")) {
    return null;
  }

  const isHome = pathname === "/";
  const isReels = pathname === "/reels";
  const isCircle = pathname === "/community";
  const isProfile = pathname === "/profile";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-200/80 dark:border-zinc-800 safe-bottom transition-colors shadow-lg">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Destination 1: Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            isHome
              ? "text-brand-plum dark:text-brand-rose"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <Home
            className={`w-5 h-5 transition-transform ${
              isHome ? "scale-110 text-brand-rose fill-brand-rose/20 stroke-[2.5]" : "stroke-[1.8]"
            }`}
          />
          <span className={`text-[10px] mt-0.5 ${isHome ? "font-bold text-brand-plum dark:text-brand-rose" : "font-medium"}`}>
            Home
          </span>
        </Link>

        {/* Destination 2: Reels */}
        <Link
          href="/reels"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            isReels
              ? "text-brand-plum dark:text-brand-rose"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <PlaySquare
            className={`w-5 h-5 transition-transform ${
              isReels ? "scale-110 text-brand-rose fill-brand-rose/20 stroke-[2.5]" : "stroke-[1.8]"
            }`}
          />
          <span className={`text-[10px] mt-0.5 ${isReels ? "font-bold text-brand-plum dark:text-brand-rose" : "font-medium"}`}>
            Reels
          </span>
        </Link>

        {/* Destination 3: Central Elevated HUB Button */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            type="button"
            onClick={() => setIsHubOpen(!isHubOpen)}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-brand-rose via-brand-rose-dark to-brand-plum text-white flex items-center justify-center shadow-lg hover:shadow-glow hover:scale-105 active:scale-95 transition-all border-4 border-white dark:border-zinc-950 group cursor-pointer"
            aria-label="Open Healthcare Services Hub"
          >
            <Plus
              className={`w-7 h-7 stroke-[3] transition-transform duration-300 ${
                isHubOpen ? "rotate-45" : "group-hover:rotate-90"
              }`}
            />
          </button>
        </div>

        {/* Destination 4: Circle */}
        <Link
          href="/community"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            isCircle
              ? "text-brand-plum dark:text-brand-rose"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <Users
            className={`w-5 h-5 transition-transform ${
              isCircle ? "scale-110 text-brand-rose fill-brand-rose/20 stroke-[2.5]" : "stroke-[1.8]"
            }`}
          />
          <span className={`text-[10px] mt-0.5 ${isCircle ? "font-bold text-brand-plum dark:text-brand-rose" : "font-medium"}`}>
            Circle
          </span>
        </Link>

        {/* Destination 5: Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            isProfile
              ? "text-brand-plum dark:text-brand-rose"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <div className="relative">
            {user?.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.avatarUrl}
                alt={user.name}
                className={`w-5 h-5 rounded-full object-cover transition-all ${
                  isProfile ? "ring-2 ring-brand-rose ring-offset-1 dark:ring-offset-zinc-900 scale-105" : "opacity-80"
                }`}
              />
            ) : (
              <User
                className={`w-5 h-5 transition-all ${
                  isProfile ? "text-brand-plum dark:text-brand-rose scale-105" : "opacity-80"
                }`}
              />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 ${isProfile ? "font-bold text-brand-plum dark:text-brand-rose" : "font-medium"}`}>
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
};

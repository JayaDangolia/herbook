"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Calendar,
  Video,
  PlaySquare,
  Users,
  BookOpen,
  ShoppingBag,
  ShieldAlert,
  Moon,
  Sun,
  Crown,
  FileText,
  User,
  ChevronDown,
  Activity,
  Menu,
  X,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export const Navbar = () => {
  const pathname = usePathname();
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    user,
    setShowEmergencyModal,
    togglePremium,
    openAuthModal,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home, icon: Heart },
    { href: "/track", label: t.nav.track, icon: Calendar },
    { href: "/consult", label: t.nav.consult, icon: Video },
    { href: "/reels", label: t.nav.reels, icon: PlaySquare },
    { href: "/community", label: t.nav.community, icon: Users },
    { href: "/learn", label: t.nav.learn, icon: BookOpen },
    { href: "/pcos", label: t.nav.pcos, icon: Activity },
    { href: "/shop", label: t.nav.shop, icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-rose via-brand-lavender to-brand-plum flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-brand-plum dark:text-brand-rose-light">
                  HerBook
                </span>
                {user?.isPremium && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-xs">
                    <Crown className="w-2.5 h-2.5 mr-0.5" /> PLUS
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
                Her Body. Her Health. Her World.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    isActive
                      ? "bg-brand-blush text-brand-plum dark:bg-brand-plum/40 dark:text-brand-rose-light"
                      : "text-zinc-700 dark:text-zinc-300 hover:text-brand-plum hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-rose" : "text-zinc-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: SOS, Language, Theme, Role Demo Switcher, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Red Flag Emergency Button */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-brand-error/10 hover:bg-brand-error/20 text-brand-error text-xs font-bold flex items-center space-x-1 border border-brand-error/25 transition-colors"
              title="Emergency Clinical Escalation"
            >
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* Language Selector */}
            <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200 dark:border-zinc-800 text-xs">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  language === "en"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  language === "hi"
                    ? "bg-white dark:bg-zinc-800 text-brand-plum dark:text-brand-rose-light shadow-xs font-bold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                हिं
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* User Account / Navigation Controls */}
            {user ? (
              <div className="flex items-center space-x-2">
                {(user.role === "admin" || user.role === "superadmin") && (
                  <Link
                    href="/admin"
                    className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                {user.role === "doctor" && (
                  <Link
                    href="/doctor-portal"
                    className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    <span>Doctor Hub</span>
                  </Link>
                )}

                {/* Profile Avatar */}
                <Link
                  href="/profile"
                  className="flex items-center space-x-1.5 p-1 rounded-full border-2 border-brand-rose/40 hover:border-brand-rose transition-colors"
                  title={`@${user.username} (${user.name})`}
                >
                  {user.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-blush dark:bg-brand-plum/40 text-brand-plum dark:text-brand-rose font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:opacity-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                    isActive
                      ? "bg-brand-blush text-brand-plum dark:bg-brand-plum/40 dark:text-brand-rose-light"
                      : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-rose" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-2 text-xs">
            <Link
              href="/doctor-portal"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-center font-medium text-zinc-800 dark:text-zinc-200"
            >
              Doctor Hub
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-center font-medium text-zinc-800 dark:text-zinc-200"
            >
              Admin Hub
            </Link>
            <Link
              href="/premium"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-center font-semibold"
            >
              Premium
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

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
} from "lucide-react";
import { useApp, UserRole } from "@/context/AppContext";

export const Navbar = () => {
  const pathname = usePathname();
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    user,
    switchRole,
    setShowEmergencyModal,
    togglePremium,
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
                {user.isPremium && (
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

            {/* Role Demo Switcher (Crucial for testing Doctor Portal vs Admin vs User) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
              >
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Role:</span>
                <span className="capitalize text-brand-plum dark:text-brand-rose font-bold">{user.role}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 text-zinc-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 text-xs animate-fadeIn">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                    Switch Test Persona
                  </div>
                  {(["user", "doctor", "admin"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                        user.role === r ? "font-bold text-brand-plum dark:text-brand-rose bg-brand-blush/40 dark:bg-brand-plum/20" : "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <span className="capitalize">{r === "user" ? "Patient / Regular User" : r === "doctor" ? "Verified Doctor Portal" : "Admin Dashboard"}</span>
                      {user.role === r && <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />}
                    </button>
                  ))}
                  <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1 px-2">
                    <button
                      onClick={() => {
                        togglePremium();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-1.5"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      {user.isPremium ? "Disable Premium Mode" : "Simulate Premium Unlock"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Portal Link */}
            <Link
              href="/profile"
              className="flex items-center space-x-1.5 p-1 rounded-full border-2 border-brand-rose/40 hover:border-brand-rose transition-colors"
              title="Profile & Privacy"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>

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

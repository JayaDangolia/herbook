"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { HealthcareHubModal } from "@/components/hub/HealthcareHubModal";
import { NotificationsDrawer } from "@/components/notifications/NotificationsDrawer";
import { MessagesDrawer } from "@/components/messages/MessagesDrawer";
import { CreateContentModal } from "@/components/social/CreateContentModal";
import { EmergencyModal } from "@/components/layout/EmergencyModal";
import { NotificationToast } from "@/components/layout/NotificationToast";
import { Heart } from "lucide-react";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
  "/guidelines",
  "/help",
  "/safety",
  "/account-deletion",
];

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoadingAuth } = useApp();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Client-side guard: If unauthenticated and on a protected route, redirect to /login
  useEffect(() => {
    if (!isLoadingAuth && !user && !isPublicRoute) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoadingAuth, isPublicRoute, pathname, router]);

  // Client-side redirect: If authenticated and visiting /login or /register, redirect to Home Feed
  useEffect(() => {
    if (!isLoadingAuth && user && (pathname === "/login" || pathname === "/register")) {
      router.replace("/");
    }
  }, [user, isLoadingAuth, pathname, router]);

  // 1. Branded Loading Splash Screen while checking session (never flash protected content)
  if (isLoadingAuth && !isPublicRoute) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFAFC] dark:bg-[#09080B] animate-fadeIn">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-rose via-brand-lavender to-brand-plum flex items-center justify-center shadow-glow animate-pulse">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <div className="text-center">
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-brand-plum dark:text-brand-rose-light">
              herbook.
            </h1>
            <p className="text-xs text-zinc-500 font-medium tracking-wide mt-1">
              Her Body. Her Health. Her World.
            </p>
          </div>
          <div className="w-6 h-6 border-2 border-brand-rose/20 border-t-brand-rose rounded-full animate-spin mt-4" />
        </div>
      </div>
    );
  }

  // 2. Standalone Public & Auth Screens: NO app header, NO bottom navigation, NO healthcare hub
  if (isPublicRoute) {
    return (
      <>
        <main className="min-h-screen bg-[#FFFAFC] dark:bg-[#09080B] text-[#29212D] dark:text-[#F4F4F6]">
          {children}
        </main>
        <NotificationToast />
      </>
    );
  }

  // 3. Fallback: If not authenticated, do not render protected application layout
  if (!user) {
    return null;
  }

  // 4. Authenticated Application Layout: Full Social First interface
  return (
    <>
      {/* Mobile-First Sticky App Header */}
      <AppHeader />

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-8rem)] pb-24">{children}</main>

      {/* 5-Destination Fixed Mobile Bottom Navigation with Hub '+' Button */}
      <BottomNav />

      {/* Healthcare Services Hub Launcher */}
      <HealthcareHubModal />

      {/* Social Modals & Drawers */}
      <NotificationsDrawer />
      <MessagesDrawer />
      <CreateContentModal />
      <EmergencyModal />
      <NotificationToast />
    </>
  );
}

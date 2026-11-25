import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { CycleProvider } from "@/context/CycleContext";
import { CareProvider } from "@/context/CareContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { HealthcareHubModal } from "@/components/hub/HealthcareHubModal";
import { NotificationsDrawer } from "@/components/notifications/NotificationsDrawer";
import { MessagesDrawer } from "@/components/messages/MessagesDrawer";
import { CreateContentModal } from "@/components/social/CreateContentModal";
import { EmergencyModal } from "@/components/layout/EmergencyModal";
import { NotificationToast } from "@/components/layout/NotificationToast";

export const metadata: Metadata = {
  title: "HerBook — Her Body. Her Health. Her World.",
  description:
    "Social-first women's health, wellness & community platform. Menstrual cycle tracking, doctor consultations across Allopathy, Ayurveda, and Homeopathy, educational reels, and peer support.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HerBook",
  },
};

export const viewport: Viewport = {
  themeColor: "#E98CA8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFAFC] dark:bg-[#09080B] text-[#29212D] dark:text-[#F4F4F6] antialiased selection:bg-brand-rose/30">
        <AppProvider>
          <CycleProvider>
            <CareProvider>
              <CommunityProvider>
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
              </CommunityProvider>
            </CareProvider>
          </CycleProvider>
        </AppProvider>
      </body>
    </html>
  );
}

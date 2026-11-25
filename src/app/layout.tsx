import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { CycleProvider } from "@/context/CycleContext";
import { CareProvider } from "@/context/CareContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { AppLayoutShell } from "@/components/layout/AppLayoutShell";

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
                <AppLayoutShell>{children}</AppLayoutShell>
              </CommunityProvider>
            </CareProvider>
          </CycleProvider>
        </AppProvider>
      </body>
    </html>
  );
}

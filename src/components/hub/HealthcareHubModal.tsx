"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  Video,
  Activity,
  BookOpen,
  ShoppingBag,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Heart,
  PhoneCall,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Portal } from "@/components/ui/Portal";

export const HealthcareHubModal = () => {
  const router = useRouter();
  const { isHubOpen, setIsHubOpen, setShowEmergencyModal } = useApp();

  React.useEffect(() => {
    if (!isHubOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsHubOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isHubOpen, setIsHubOpen]);

  if (!isHubOpen) return null;

  const handleServiceClick = (href?: string, isSos?: boolean) => {
    setIsHubOpen(false);
    if (isSos) {
      setShowEmergencyModal(true);
    } else if (href) {
      router.push(href);
    }
  };

  const services = [
    {
      id: "hercycle",
      name: "HerCycle",
      subtitle: "Period & Symptom Tracking",
      description: "Smart cycle predictions, symptom logging & discreet period alerts",
      icon: Calendar,
      gradient: "from-[#FFF1F5] to-[#F7CAD8]/40 dark:from-zinc-800 dark:to-brand-plum/30",
      iconColor: "text-brand-rose",
      iconBg: "bg-brand-rose/20 text-brand-plum dark:text-brand-rose",
      href: "/track",
    },
    {
      id: "hercare",
      name: "HerCare",
      subtitle: "Doctor Consultations",
      description: "15 verified doctors across Allopathy, Ayurveda & Homeopathy (₹550)",
      icon: Video,
      gradient: "from-[#F3EBF9] to-[#DECFF7]/40 dark:from-zinc-800 dark:to-brand-plum/30",
      iconColor: "text-brand-plum dark:text-brand-rose",
      iconBg: "bg-brand-lavender/25 text-brand-plum dark:text-brand-rose",
      href: "/consult",
    },
    {
      id: "pcos",
      name: "PCOS & Fertility",
      subtitle: "Hormonal & Ovulation Hub",
      description: "Rotterdam self-screener, symptom trends & fertility biomarkers",
      icon: Activity,
      gradient: "from-[#FFF8EE] to-[#FFE2C2]/40 dark:from-zinc-800 dark:to-brand-plum/30",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
      href: "/pcos",
    },
    {
      id: "herwell",
      name: "HerWell",
      subtitle: "Health Library & AI Assistant",
      description: "Clinician-reviewed articles & HerBot conversational health guide",
      icon: BookOpen,
      gradient: "from-[#F3F4FB] to-[#D9DCF7]/40 dark:from-zinc-800 dark:to-brand-plum/30",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400",
      href: "/learn",
    },
    {
      id: "shop",
      name: "Wellness Shop",
      subtitle: "Curated Period Care",
      description: "Medical-grade cups, graphene heat belts & spearmint teas",
      icon: ShoppingBag,
      gradient: "from-[#F0FBF7] to-[#C9F3E4]/40 dark:from-zinc-800 dark:to-brand-plum/30",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
      href: "/shop",
    },
    {
      id: "sos",
      name: "SOS Emergency",
      subtitle: "Clinical Red-Flag Protocol",
      description: "Emergency hospital escalation for severe pelvic pain or hemorrhage",
      icon: ShieldAlert,
      gradient: "from-[#FFF0F2] to-[#FFCCD3]/40 dark:from-zinc-800 dark:to-brand-plum/30",
      iconColor: "text-brand-error",
      iconBg: "bg-brand-error/20 text-brand-error",
      isSos: true,
    },
  ];

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your HerBook Hub"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsHubOpen(false);
        }}
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        {/* Bottom Sheet Modal Container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-[2.25rem] sm:rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6"
        >
        {/* Pull handle bar on mobile */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-2 mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-blush dark:bg-brand-plum/30 text-brand-plum dark:text-brand-rose text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Healthcare Services Launcher</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-display mt-1">
              Your HerBook Hub
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Everything you need, in one place.
            </p>
          </div>

          <button
            onClick={() => setIsHubOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            aria-label="Close Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Services in 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {services.map((serv) => {
            const Icon = serv.icon;
            return (
              <button
                key={serv.id}
                type="button"
                onClick={() => handleServiceClick(serv.href, serv.isSos)}
                className={`p-4 rounded-3xl bg-gradient-to-br ${serv.gradient} border border-zinc-200/80 dark:border-zinc-800 text-left hover:scale-[1.02] active:scale-[0.98] transition-all shadow-card group flex flex-col justify-between min-h-[140px]`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl ${serv.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="mt-3 space-y-0.5">
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight">
                    {serv.name}
                  </h3>
                  <div className="text-[10px] font-bold text-brand-plum dark:text-brand-rose-light line-clamp-1">
                    {serv.subtitle}
                  </div>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-tight pt-0.5">
                    {serv.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fast-Access SOS Emergency Safety Shortcut */}
        <div className="p-3.5 rounded-2xl bg-brand-error/10 border border-brand-error/25 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-brand-error shrink-0" />
            <div>
              <span className="font-bold text-brand-error block text-[11px]">
                Immediate Emergency Assistance
              </span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400">
                Direct Indian hospital helplines (112 • 108 • 1091)
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsHubOpen(false);
              setShowEmergencyModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-brand-error hover:bg-red-700 text-white font-bold text-[11px] shrink-0 transition-colors shadow-soft"
          >
            Open SOS
          </button>
        </div>
      </div>
    </div>
  </Portal>
);
};

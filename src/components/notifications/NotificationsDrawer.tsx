"use client";

import React, { useEffect } from "react";
import { X, Heart, MessageCircle, Calendar, Video, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Portal } from "@/components/ui/Portal";

export const NotificationsDrawer = () => {
  const { isNotificationsOpen, setIsNotificationsOpen } = useApp();

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isNotificationsOpen, setIsNotificationsOpen]);

  if (!isNotificationsOpen) return null;

  const notifications = [
    {
      id: "notif-1",
      type: "appointment",
      icon: Video,
      iconColor: "text-brand-plum dark:text-brand-rose",
      iconBg: "bg-brand-rose/15",
      title: "Telehealth Consultation Reminder",
      detail: "Your video consultation with Dr. Ananya Sharma is scheduled for today at 04:00 PM.",
      time: "20m ago",
      isUnread: true,
    },
    {
      id: "notif-2",
      type: "like",
      icon: Heart,
      iconColor: "text-brand-rose fill-brand-rose",
      iconBg: "bg-brand-rose/10",
      title: "meera_k and 14 others liked your post",
      detail: '"Switching from pads to menstrual cups in college hostels - my honest review"',
      time: "1h ago",
      isUnread: true,
    },
    {
      id: "notif-3",
      type: "comment",
      icon: MessageCircle,
      iconColor: "text-brand-lavender-dark",
      iconBg: "bg-brand-lavender/20",
      title: "dr_ananya_obgyn replied to your question",
      detail: '"Fasting insulin and HOMA-IR are wonderful first steps for understanding metabolic health."',
      time: "3h ago",
      isUnread: false,
    },
    {
      id: "notif-4",
      type: "discreet_cycle",
      icon: Calendar,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
      title: "Personal Wellness Cycle Update",
      detail: "You are currently on Cycle Day 17 (Luteal Phase). Gentle hydration and balanced rest advised.",
      time: "5h ago",
      isUnread: false,
    },
    {
      id: "notif-5",
      type: "follow",
      icon: UserPlus,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-950/60",
      title: "sneha_pcos_journey started following you",
      detail: "PCOS advocate & wellness creator from Delhi",
      time: "1d ago",
      isUnread: false,
    },
  ];

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsNotificationsOpen(false);
        }}
        className="fixed inset-0 z-[70] flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 w-full max-w-sm h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                  Notifications
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-rose text-white">
                  2 new
                </span>
              </div>

              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-all ${
                      n.isUnread
                        ? "bg-brand-blush/60 dark:bg-zinc-800/80 border-brand-rose/30 shadow-xs"
                        : "bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-700/60"
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <Icon className={`w-4 h-4 ${n.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-zinc-900 dark:text-white line-clamp-1">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-zinc-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 line-clamp-2 mt-0.5 leading-snug">
                          {n.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 text-center">
            Lock-screen alerts use discreet healthcare wording to protect your privacy.
          </div>
        </div>
      </div>
    </Portal>
  );
};

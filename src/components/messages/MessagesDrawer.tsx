"use client";

import React, { useState } from "react";
import { X, Send, ShieldCheck, User, MessageCircle, Clock, CheckCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Portal } from "@/components/ui/Portal";

interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  type: "doctor" | "sister";
  specialty?: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: { sender: "them" | "me"; text: string; time: string }[];
}

export const MessagesDrawer = () => {
  const { isMessagesOpen, setIsMessagesOpen, showNotification } = useApp();

  React.useEffect(() => {
    if (!isMessagesOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMessagesOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isMessagesOpen, setIsMessagesOpen]);

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "th-1",
      name: "Dr. Ananya Sharma",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
      type: "doctor",
      specialty: "Gynecology & PCOS Management",
      lastMessage: "Please ensure your ultrasound report is uploaded to the vault before our 4 PM call.",
      time: "25m ago",
      unread: true,
      messages: [
        {
          sender: "them",
          text: "Hello Rhea, looking forward to our consultation today.",
          time: "09:30 AM",
        },
        {
          sender: "them",
          text: "Please ensure your ultrasound report is uploaded to the vault before our 4 PM call.",
          time: "09:32 AM",
        },
      ],
    },
    {
      id: "th-2",
      name: "Sneha Kapoor",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      type: "sister",
      lastMessage: "Hey Rhea! Did the spearmint tea arrive? Let me know how the taste is!",
      time: "2h ago",
      unread: false,
      messages: [
        {
          sender: "them",
          text: "Hey Rhea! Did the spearmint tea arrive? Let me know how the taste is!",
          time: "Yesterday",
        },
      ],
    },
    {
      id: "th-3",
      name: "Dr. Vaidya Gayatri Nambiar",
      avatar: "https://images.unsplash.com/photo-1594824813583-9b6711728277?w=150&auto=format&fit=crop&q=80",
      type: "doctor",
      specialty: "Ayurvedic Women's Health",
      lastMessage: "I reviewed your dosha notes. Adding a pinch of cinnamon is recommended.",
      time: "1d ago",
      unread: false,
      messages: [
        {
          sender: "them",
          text: "I reviewed your dosha notes. Adding a pinch of cinnamon is recommended.",
          time: "1d ago",
        },
      ],
    },
  ]);

  if (!isMessagesOpen) return null;

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    const newMsg = {
      sender: "me" as const,
      text: replyText.trim(),
      time: "Just now",
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: newMsg.text,
            time: "Just now",
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    setReplyText("");
    showNotification("Message sent!");
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Messages & Direct Consults"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsMessagesOpen(false);
        }}
        className="fixed inset-0 z-[70] flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 w-full max-w-sm h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
        >
        {!activeThread ? (
          /* Threads List */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                  Messages &amp; Direct Consults
                </h3>
                <span className="text-[11px] text-zinc-500">
                  Separated doctor telemedicine queries &amp; peer DMs
                </span>
              </div>

              <button
                onClick={() => setIsMessagesOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                    t.unread
                      ? "bg-brand-blush/60 dark:bg-zinc-800/80 border-brand-rose/40 font-semibold"
                      : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-700/60"
                  }`}
                >
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700"
                    />
                    {t.type === "doctor" && (
                      <span className="absolute -bottom-1 -right-1 p-0.5 bg-brand-success text-white rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 shrink-0">{t.time}</span>
                    </div>
                    {t.specialty && (
                      <div className="text-[10px] text-brand-plum dark:text-brand-rose-light truncate">
                        {t.specialty}
                      </div>
                    )}
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 truncate mt-0.5">
                      {t.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Thread Conversation */
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => setActiveThreadId(null)}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-brand-plum dark:text-brand-rose"
                  >
                    ←
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {activeThread.name}
                    </h4>
                    <span className="text-[10px] text-zinc-500">
                      {activeThread.type === "doctor" ? "Verified Telemedicine Practitioner" : "Sister Circle"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMessagesOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages list */}
              <div className="py-4 space-y-3 overflow-y-auto max-h-[65vh] pr-1 text-xs">
                {activeThread.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      m.sender === "me" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        m.sender === "me"
                          ? "bg-brand-plum text-white rounded-br-xs"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-xs"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-zinc-400 mt-0.5 px-1">{m.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply bar */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-brand-rose text-white hover:bg-brand-rose-dark transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  </Portal>
);
};

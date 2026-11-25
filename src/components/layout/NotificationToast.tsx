"use client";

import React from "react";
import { CheckCircle, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const NotificationToast = () => {
  const { notificationMessage } = useApp();

  if (!notificationMessage) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-50 animate-fadeIn">
      <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700 dark:border-zinc-200 flex items-center space-x-2.5 text-xs font-semibold">
        <CheckCircle className="w-4 h-4 text-brand-rose shrink-0" />
        <span>{notificationMessage}</span>
      </div>
    </div>
  );
};

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, TranslationDictionary } from "@/data/translations";

export type UserRole =
  | "user"
  | "doctor"
  | "creator"
  | "reviewer"
  | "moderator"
  | "admin"
  | "superadmin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isPremium: boolean;
  avatarUrl: string;
  preferredLanguage: Language;
  privacyMode: boolean; // Conceal sensitive tags in community
  allowPersonalization: boolean;
  allowAnalytics: boolean;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  theme: "light" | "dark";
  toggleTheme: () => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchRole: (role: UserRole) => void;
  togglePremium: () => void;
  showEmergencyModal: boolean;
  setShowEmergencyModal: (show: boolean) => void;
  isHubOpen: boolean;
  setIsHubOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isMessagesOpen: boolean;
  setIsMessagesOpen: (open: boolean) => void;
  isCreateContentOpen: boolean;
  setIsCreateContentOpen: (open: boolean) => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
}

const defaultUser: UserProfile = {
  id: "usr-demo-101",
  name: "Rhea Deshmukh",
  email: "rhea.deshmukh@example.com",
  role: "user",
  isPremium: false,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  preferredLanguage: "en",
  privacyMode: false,
  allowPersonalization: true,
  allowAnalytics: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [isHubOpen, setIsHubOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState<boolean>(false);
  const [isCreateContentOpen, setIsCreateContentOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("herbook_lang") as Language;
      if (savedLang && (savedLang === "en" || savedLang === "hi")) {
        setLanguageState(savedLang);
      }
      const savedTheme = localStorage.getItem("herbook_theme") as "light" | "dark";
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
      }
    } catch {
      // Local storage unavailable
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("herbook_lang", lang);
    } catch {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      localStorage.setItem("herbook_theme", nextTheme);
    } catch {}
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const switchRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
    showNotification(`Switched role to: ${role.toUpperCase()}`);
  };

  const togglePremium = () => {
    setUser((prev) => {
      const nextPremium = !prev.isPremium;
      return { ...prev, isPremium: nextPremium };
    });
    showNotification(
      user.isPremium ? "Switched to Free Tier" : "Unlocked HerBook Premium Tier!"
    );
  };

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        user,
        setUser,
        switchRole,
        togglePremium,
        showEmergencyModal,
        setShowEmergencyModal,
        isHubOpen,
        setIsHubOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isMessagesOpen,
        setIsMessagesOpen,
        isCreateContentOpen,
        setIsCreateContentOpen,
        notificationMessage,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

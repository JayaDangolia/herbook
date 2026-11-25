"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, TranslationDictionary } from "@/data/translations";
import { AuthModal } from "@/components/auth/AuthModal";

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
  username: string;
  email: string;
  role: UserRole;
  isPremium?: boolean;
  avatarUrl: string;
  bio?: string;
  status?: string;
  preferredLanguage?: Language;
  privacyMode?: boolean;
  allowPersonalization?: boolean;
  allowAnalytics?: boolean;
  isEmailVerified?: boolean;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  theme: "light" | "dark";
  toggleTheme: () => void;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoadingAuth: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  // UI Drawer & Modal States
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [isHubOpen, setIsHubOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState<boolean>(false);
  const [isCreateContentOpen, setIsCreateContentOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  // Real Database Session Check
  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser({
            ...data.user,
            preferredLanguage: data.user.preferredLanguage || "en",
            isPremium: false,
          });
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

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

    checkSession();
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

  // Real Login
  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser({
          ...data.user,
          preferredLanguage: "en",
          isPremium: false,
        });
        return { success: true };
      }
      return { success: false, error: data.message || data.error || "Login failed" };
    } catch (e: any) {
      return { success: false, error: "Network error during login" };
    }
  };

  // Real Registration
  const register = async (name: string, username: string, email: string, pass: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser({
          ...data.user,
          preferredLanguage: "en",
          isPremium: false,
        });
        return { success: true };
      }
      return { success: false, error: data.message || data.error || "Registration failed" };
    } catch (e: any) {
      return { success: false, error: "Network error during registration" };
    }
  };

  // Real Logout
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      showNotification("You have been logged out.");
    }
  };

  // Deprecated client-only switcher: warns and requests real session
  const switchRole = (role: UserRole) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    showNotification(`Role is server-authorized. Your role is '${user.role}'.`);
  };

  const togglePremium = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    setUser((prev) => (prev ? { ...prev, isPremium: !prev.isPremium } : null));
    showNotification("HerBook Premium Tier toggled for current session.");
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
        isLoadingAuth,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        checkSession,
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
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

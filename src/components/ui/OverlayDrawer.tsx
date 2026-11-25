"use client";

import React, { useEffect, useRef } from "react";
import { Portal } from "./Portal";
import { X } from "lucide-react";

export interface OverlayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  lockScroll?: boolean;
  ariaLabel?: string;
  hideCloseButton?: boolean;
  headerRight?: React.ReactNode;
  contentClassName?: string;
}

export const OverlayDrawer: React.FC<OverlayDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  maxHeight = "max-h-[85vh]",
  closeOnBackdrop = true,
  closeOnEsc = true,
  lockScroll = true,
  ariaLabel = "Dialog",
  hideCloseButton = false,
  headerRight,
  contentClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Handle ESC key and focus management
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Focus first focusable element or container
    if (containerRef.current) {
      containerRef.current.focus();
    }

    // Lock body scroll
    let originalOverflow = "";
    if (lockScroll && typeof document !== "undefined") {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (lockScroll && typeof document !== "undefined") {
        document.body.style.overflow = originalOverflow;
      }
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus?.();
      }
    };
  }, [isOpen, closeOnEsc, lockScroll, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : ariaLabel}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all duration-200 animate-fadeIn"
      >
        <div
          ref={containerRef}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className={`bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-t-[2.25rem] sm:rounded-3xl ${maxWidth} w-full ${maxHeight} shadow-2xl flex flex-col justify-between overflow-hidden relative outline-none focus:outline-none transition-transform duration-200 ${contentClassName}`}
        >
          {/* Mobile drag / pull indicator */}
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <div className="font-extrabold text-sm text-zinc-900 dark:text-white flex-1 min-w-0 pr-2">
                {title}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {headerRight}
                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content & Body */}
          <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>
        </div>
      </div>
    </Portal>
  );
};

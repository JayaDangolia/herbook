"use client";

import React, { useState, useEffect } from "react";
import { X, Video, UploadCloud, ShieldCheck, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ReelLabel } from "@/data/reelsData";
import { Portal } from "@/components/ui/Portal";

interface UploadReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadReelModal: React.FC<UploadReelModalProps> = ({ isOpen, onClose }) => {
  const { user, showNotification } = useApp();

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Menstrual Health");
  const [label, setLabel] = useState<ReelLabel>("Personal Experience");
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim() || !agreedGuidelines) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showNotification("Reel submitted for clinical review & moderation!");
      onClose();
    }, 1000);
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create HerReel"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-brand-rose/15 text-brand-rose flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Create HerReel
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Publish educational or personal wellness videos
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Reel Video Upload Box */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-brand-rose mx-auto" />
              <div className="font-bold text-zinc-700 dark:text-zinc-300">
                Tap to Select Reel Video
              </div>
              <p className="text-[11px] text-zinc-400">
                MP4 or MOV up to 60 seconds (9:16 vertical ratio recommended)
              </p>
            </div>

            {/* Reel Title */}
            <div>
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                Reel Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 3 Signs You Might Have High Prolactin"
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                Health Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
              >
                <option value="Menstrual Health">Menstrual Health</option>
                <option value="PCOS / PCOD">PCOS / PCOD</option>
                <option value="Fertility &amp; Conception">Fertility &amp; Conception</option>
                <option value="Ayurvedic Wellness">Ayurvedic Wellness</option>
                <option value="Mental Health">Mental Health</option>
              </select>
            </div>

            {/* Content Labeling (Trust & Transparency Standard) */}
            <div>
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                Evidence Taxonomy Label
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    "Clinician Verified",
                    "Personal Experience",
                    "Ayurvedic Insight",
                  ] as ReelLabel[]
                ).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLabel(l)}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                      label === l
                        ? "bg-brand-rose/20 border-brand-rose text-brand-plum dark:text-brand-rose"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                Caption &amp; Key Takeaways
              </label>
              <textarea
                required
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Explain the context and cite evidence if discussing medical conditions..."
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white resize-none"
              />
            </div>

            {/* Clinical Certification Checkbox */}
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedGuidelines}
                  onChange={(e) => setAgreedGuidelines(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-brand-rose rounded shrink-0"
                />
                <span className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-normal">
                  I certify that this video does not promote unverified medical cures, harmful self-medication, or replace formal clinical diagnosis.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !agreedGuidelines}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Uploading Video..." : "Submit to Moderation Queue"}
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
};

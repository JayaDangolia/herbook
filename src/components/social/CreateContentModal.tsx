"use client";

import React, { useState } from "react";
import { X, Image, PlaySquare, Users, UploadCloud, Check, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Portal } from "@/components/ui/Portal";

export const CreateContentModal = () => {
  const { isCreateContentOpen, setIsCreateContentOpen, showNotification } = useApp();
  const [contentType, setContentType] = useState<"post" | "reel" | "community">("post");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("PCOS Awareness");
  const [tags, setTags] = useState("");
  const [agreed, setAgreed] = useState(false);

  React.useEffect(() => {
    if (!isCreateContentOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCreateContentOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isCreateContentOpen, setIsCreateContentOpen]);

  if (!isCreateContentOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !agreed) return;

    showNotification(
      contentType === "reel"
        ? "Reel submitted to clinical review & moderation queue!"
        : contentType === "community"
        ? "Discussion topic published to HerCircle!"
        : "Post published to your profile and social feed!"
    );
    setIsCreateContentOpen(false);
    setCaption("");
    setTags("");
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create New Content"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsCreateContentOpen(false);
        }}
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-[2.25rem] sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
              Create New Content
            </h3>
            <p className="text-xs text-zinc-500">Share health insights with the HerBook ecosystem</p>
          </div>
          <button
            onClick={() => setIsCreateContentOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setContentType("post")}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
              contentType === "post"
                ? "bg-brand-rose/15 border-brand-rose text-brand-plum dark:text-brand-rose"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Image className="w-4 h-4 text-brand-rose" />
            <span>Social Post</span>
          </button>

          <button
            type="button"
            onClick={() => setContentType("reel")}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
              contentType === "reel"
                ? "bg-brand-rose/15 border-brand-rose text-brand-plum dark:text-brand-rose"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <PlaySquare className="w-4 h-4 text-brand-lavender-dark" />
            <span>Short Reel</span>
          </button>

          <button
            type="button"
            onClick={() => setContentType("community")}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
              contentType === "community"
                ? "bg-brand-rose/15 border-brand-rose text-brand-plum dark:text-brand-rose"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Users className="w-4 h-4 text-brand-plum dark:text-brand-rose" />
            <span>Circle Talk</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Media upload box */}
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 text-center bg-zinc-50/50 dark:bg-zinc-800/20">
            <UploadCloud className="w-6 h-6 text-brand-rose mx-auto mb-1.5" />
            <div className="font-bold text-zinc-800 dark:text-zinc-200">
              {contentType === "reel" ? "Upload 9:16 Video (MP4)" : "Upload Photo or Infographic"}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">JPG, PNG, MP4 up to 50MB</p>
          </div>

          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Select Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
            >
              <option>PCOS Awareness</option>
              <option>Menstrual Health</option>
              <option>Cycle Nutrition</option>
              <option>Fertility Science</option>
              <option>Sisterhood &amp; College Life</option>
              <option>Mindful Living</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Caption &amp; Insights
            </label>
            <textarea
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your experience, clinical insight, or question..."
              className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white resize-none h-20"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Hashtags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. PCOS, Hormones, Nutrition"
              className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>

          <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-brand-rose rounded shrink-0"
            />
            <span>
              I certify that this post adheres to HerBook community standards and does not promote unverified medical cures.
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateContentOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!agreed}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold shadow-soft disabled:opacity-50"
            >
              Publish Content
            </button>
          </div>
        </form>
      </div>
    </div>
  </Portal>
);
};

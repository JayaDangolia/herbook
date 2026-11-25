"use client";

import React, { useState, useMemo } from "react";
import { PlaySquare, Plus, Filter, Sparkles, ShieldCheck } from "lucide-react";
import { initialReels, Reel } from "@/data/reelsData";
import { ReelViewer } from "@/components/reels/ReelViewer";
import { UploadReelModal } from "@/components/reels/UploadReelModal";
import { useApp } from "@/context/AppContext";

export default function ReelsPage() {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const categories = [
    "All Categories",
    "Menstrual Health",
    "PCOS Awareness",
    "Fertility & Ovulation",
    "Nutrition & Gut",
    "Fitness & Movement",
    "Mental Well-being",
    "Personal Journey",
  ];

  const filteredReels = useMemo(() => {
    if (selectedCategory === "All Categories") return initialReels;
    return initialReels.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-md sm:max-w-lg mx-auto px-3 sm:px-4 py-3 space-y-3 pb-24 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
              HerReels Video Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            <span className="text-xs text-zinc-500 font-medium">Verified Women&apos;s Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display mt-0.5">
            {t.reels.title}
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            {t.reels.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-rose to-brand-plum hover:from-brand-rose-dark hover:to-brand-plum-dark text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.reels.uploadReel}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? "bg-brand-plum text-white border-brand-plum shadow-soft"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-brand-rose"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vertical Reel Viewer Component */}
      <ReelViewer
        reels={filteredReels.length > 0 ? filteredReels : initialReels}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* Upload Modal */}
      <UploadReelModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}

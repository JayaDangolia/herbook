"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Clock,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Heart,
  Activity,
  Bot,
} from "lucide-react";
import { educationalArticles, Article } from "@/data/educationalArticles";
import { HerBotAssistant } from "@/components/well/HerBotAssistant";
import { useApp } from "@/context/AppContext";

export default function LearnPage() {
  const { user } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-6 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
              HerWell Learning &amp; AI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            <span className="text-xs text-zinc-500 font-medium">Clinician-Reviewed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display mt-0.5">
            Personalized Health Education
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Evidence-based clinical insights, hormonal literacy, and our dedicated AI health assistant.
          </p>
        </div>

        <Link
          href="/pcos"
          className="px-5 py-2.5 rounded-2xl bg-brand-plum hover:bg-brand-plum-dark text-white font-bold text-xs shadow-soft transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <Activity className="w-4 h-4 text-brand-rose" />
          <span>PCOS &amp; Fertility Dedicated Hub</span>
        </Link>
      </div>

      {/* HerWell AI Assistant Component */}
      <section className="space-y-3">
        <HerBotAssistant />
      </section>

      {/* Featured Clinician-Reviewed Articles Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-rose" />
              Clinician-Reviewed Health Library
            </h2>
            <p className="text-xs text-zinc-500">
              Authored and reviewed by practicing Indian gynecologists &amp; metabolic specialists
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {educationalArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 dark:bg-zinc-900/90 text-brand-plum dark:text-brand-rose backdrop-blur-md shadow-xs">
                    {art.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTimeMinutes} min read</span>
                    <span>•</span>
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Reviewed
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-plum dark:group-hover:text-brand-rose transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs mt-3">
                <span className="text-[11px] text-zinc-500 truncate max-w-[180px]">
                  By {art.reviewedBy}
                </span>
                <span className="text-brand-plum dark:text-brand-rose font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 transition-colors"
            >
              Close
            </button>

            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-blush dark:bg-brand-plum/40 text-brand-plum dark:text-brand-rose">
                {selectedArticle.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-2 leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center space-x-3 text-xs text-zinc-500 mt-2">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Clinician Reviewed by {selectedArticle.reviewedBy} ({selectedArticle.reviewerTitle})
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">
                Key Clinical Takeaways:
              </span>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
                {selectedArticle.keyTakeaways.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {selectedArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <Link
                href="/consult"
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-brand-rose text-white text-xs font-bold shadow-soft"
              >
                Book a Gynecologist Consult
              </Link>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs text-zinc-500 hover:underline"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Users, ArrowLeft, Heart, ShieldCheck } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 space-y-8 animate-fadeIn">
      <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-plum dark:text-brand-rose hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Login</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-rose/20 text-brand-rose flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-rose">
            Community Safety &amp; Trust
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
          HerBook Community Guidelines
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Our standards for building a supportive, uplifting, and safe environment for all women.
        </p>
      </div>

      <div className="space-y-5 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">1. Empathy, Kindness &amp; Peer Support</h2>
          <p>
            HerBook is a sanctuary for discussing sensitive health topics—such as PCOS, fertility challenges, endometriosis, and postpartum recovery. Treat every member with respect and compassionate understanding.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">2. No Medical Misinformation</h2>
          <p>
            You may share personal health journeys, but do not state unproven treatments as clinical medical facts. Only licensed Registered Medical Practitioners (RMPs) may provide medical consultations.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">3. Zero Tolerance for Harassment &amp; Bullying</h2>
          <p>
            Hate speech, body shaming, predatory messages, and harassment will result in immediate and permanent account suspension.
          </p>
        </section>
      </div>

      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-full bg-brand-rose text-white font-bold text-xs shadow-soft hover:bg-brand-rose-dark transition-all inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

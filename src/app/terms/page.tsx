import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, ShieldAlert } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 space-y-8 animate-fadeIn">
      {/* Header */}
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
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-rose">
            User Agreement
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
          HerBook Terms of Service
        </h1>
        <p className="text-xs text-zinc-500 font-mono">
          Effective: 26 November 2026 • Governing Law: Republic of India
        </p>
      </div>

      {/* Terms Body */}
      <div className="space-y-6 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. Eligibility &amp; Account Responsibility</h2>
          <p>
            HerBook is intended exclusively for individuals aged 18 years and older. You are responsible for maintaining the confidentiality of your login credentials. Providing false medical qualifications or impersonating healthcare practitioners is strictly prohibited and subject to legal action under the Indian Penal Code and Information Technology Act 2000.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. Medical Consultation Disclaimer</h2>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 space-y-1.5">
            <strong>Important Clinical &amp; Emergency Notice:</strong>
            <p className="text-[11px] leading-relaxed">
              HerBook provides educational wellness content and virtual consultation scheduling with independent Registered Medical Practitioners (RMPs). HerBook does NOT offer emergency medical services or autonomous artificial intelligence prescriptions. If you are experiencing a medical emergency, acute abdominal distress, or hemorrhage, please visit the nearest emergency room immediately or dial national emergency <strong>112</strong>.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. Telemedicine Practice Compliance</h2>
          <p>
            All virtual consultations comply with the <em>Telemedicine Practice Guidelines (2020)</em> issued by the Ministry of Health and Family Welfare (MoHFW) and the National Medical Commission (NMC). RMPs are solely responsible for clinical diagnosis, patient management, and issuing digital prescriptions where clinically indicated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Community Conduct &amp; Prohibited Content</h2>
          <p>
            Users agree not to post content that promotes unverified medical cures, harassment, commercial spam, or hate speech. Flagged content is moderated in accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021.
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
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

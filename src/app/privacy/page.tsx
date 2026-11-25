import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Heart, ArrowLeft, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-rose">
            Legal &amp; Privacy Compliance
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
          HerBook Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500 font-mono">
          Last Updated: 26 November 2026 • Statutory Compliance: Digital Personal Data Protection (DPDP) Act 2023
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. Our Core Commitment to Women&apos;s Privacy</h2>
          <p>
            HerBook is committed to protecting your sensitive reproductive, menstrual, and telehealth data. We operate under strict data minimization principles: your health logs are strictly isolated to your authenticated account and are never sold to advertisers or third-party data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. What Data We Collect</h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Account Identity:</strong> Full name, unique username, and email address for authentication.</li>
            <li><strong>Menstrual &amp; Cycle Logs:</strong> Period dates, flow intensity, mood, and symptoms (stored privately with Row-Level Security).</li>
            <li><strong>Health Records Vault:</strong> Lab reports, ultrasound scans, and prescriptions uploaded explicitly by you.</li>
            <li><strong>Teleconsultation Records:</strong> Appointment schedules, meeting room IDs, and doctor consultation notes.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. How Your Health Data is Isolated</h2>
          <p>
            Cycle records and medical vault documents are linked strictly to your unique user identifier. No other registered user, creator, or community member can view or search your private cycle logs or ultrasound reports. Sharing health records with Registered Medical Practitioners (RMPs) is 100% consent-gated and revocable by you at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Your Rights Under DPDP Act 2023</h2>
          <p>
            As a Data Principal in India, you have the statutory right to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Access a summary of your personal data and processing history.</li>
            <li>Request correction or updating of inaccurate records.</li>
            <li>Request complete erasure and account deletion (<Link href="/account-deletion" className="text-brand-rose underline">Account Deletion Portal</Link>).</li>
            <li>Grievance redressal through our designated Grievance Officer.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">5. Grievance Redressal Officer</h2>
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px] space-y-1">
            <div>Name: Compliance Grievance Cell, HerBook India</div>
            <div>Email: <a href="mailto:privacy@herbook.in" className="text-brand-rose underline">privacy@herbook.in</a></div>
            <div>Location: Mumbai, Maharashtra, India</div>
          </div>
        </section>
      </div>

      {/* Footer Return */}
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

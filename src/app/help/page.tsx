import React from "react";
import Link from "next/link";
import { LifeBuoy, ArrowLeft, Mail, MessageSquare } from "lucide-react";

export default function HelpCenterPage() {
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
            <LifeBuoy className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-rose">
            Support &amp; Grievance Redressal
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
          HerBook Help Center
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Find answers to common questions about your account, cycle tracking, doctor bookings, and security.
        </p>
      </div>

      <div className="space-y-6 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">How do I reset my password?</h2>
          <p>
            You can request a password reset link from the <Link href="/forgot-password" className="text-brand-rose underline">Forgot Password</Link> page. Enter your registered email address to receive instructions.
          </p>
        </section>

        <section className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Are my period records private?</h2>
          <p>
            Yes. Menstrual health records are private health data. They are never displayed on public feeds or member profiles, and are only accessible by you when logged into your account.
          </p>
        </section>

        <section className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-card space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Contacting Support</h2>
          <p>
            For technical assistance, account recovery, or feedback:
          </p>
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 font-mono text-[11px] space-y-1 mt-2">
            <div>Support Desk: <a href="mailto:support@herbook.in" className="text-brand-rose underline">support@herbook.in</a></div>
            <div>Response SLA: Within 24 business hours</div>
          </div>
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

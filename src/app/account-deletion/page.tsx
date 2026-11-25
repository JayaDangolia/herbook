import React from "react";
import Link from "next/link";
import { Trash2, ArrowLeft, ShieldAlert } from "lucide-react";

export default function AccountDeletionPage() {
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
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-error">
            DPDP Act 2023 Statutory Rights
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
          Account Deletion &amp; Data Erasure
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Under the Digital Personal Data Protection Act 2023, you have the full right to withdraw consent and request the permanent deletion of your account and personal health records.
        </p>
      </div>

      <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">What happens when you request deletion:</h2>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Your account identity and profile details will be permanently erased.</li>
            <li>All menstrual cycle history, symptom logs, and health vault files are permanently purged.</li>
            <li>Active doctor appointments that have not yet occurred will be cancelled.</li>
            <li>Statutory compliance audit records (such as completed billing tax records) are retained only as required under Indian law.</li>
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">How to request account deletion:</h2>
          <p>
            When logged into your account, you can initiate immediate deletion directly from your Account Settings tab. Alternatively, email our Data Protection Grievance Officer at <a href="mailto:privacy@herbook.in" className="text-brand-rose underline">privacy@herbook.in</a> with the subject <em>&ldquo;Account Deletion Request&rdquo;</em> from your registered email address.
          </p>
        </div>
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

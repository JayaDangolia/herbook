import React from "react";
import Link from "next/link";
import { ShieldAlert, PhoneCall, ArrowLeft, Heart, LifeBuoy } from "lucide-react";

export default function SafetyResourcesPage() {
  const helplines = [
    {
      name: "National Emergency Number",
      number: "112",
      description: "Immediate police, fire, and medical ambulance emergency response across India.",
      highlight: true,
    },
    {
      name: "Women in Distress Helpline",
      number: "1091",
      description: "24/7 emergency assistance for women in distress and immediate safety intervention.",
      highlight: true,
    },
    {
      name: "National Commission for Women (NCW)",
      number: "7827170170",
      description: "24/7 dedicated helpline for women facing domestic violence, harassment, or abuse.",
      highlight: false,
    },
    {
      name: "Tele-MANAS (Mental Health)",
      number: "14416",
      description: "Toll-free 24/7 government mental health counselling & psychological crisis support.",
      highlight: false,
    },
    {
      name: "Domestic Abuse Helpline",
      number: "181",
      description: "Toll-free emergency response and shelter referral for women affected by violence.",
      highlight: false,
    },
    {
      name: "KIRAN Mental Health Helpline",
      number: "1800-599-0019",
      description: "Ministry of Social Justice 24/7 psychological support and crisis management.",
      highlight: false,
    },
  ];

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
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-error">
            Emergency &amp; Safety Resources
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
          Women&apos;s Safety &amp; Crisis Support
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          If you or someone you know is in immediate danger or needs urgent support, please reach out directly to verified national hotlines.
        </p>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {helplines.map((item) => (
          <div
            key={item.number}
            className={`p-5 rounded-3xl border shadow-card space-y-2 transition-all ${
              item.highlight
                ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60"
                : "bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                {item.name}
              </span>
              <a
                href={`tel:${item.number.replace(/-/g, "")}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-rose text-white text-xs font-bold hover:bg-brand-rose-dark transition-colors shadow-soft"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{item.number}</span>
              </a>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Safety Note */}
      <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
        <strong className="text-zinc-900 dark:text-white block">Digital Safety Tips:</strong>
        <p>
          If you are sharing a device with someone you do not trust, remember to log out of your HerBook account after every session and use private browsing mode. Your safety and peace of mind always come first.
        </p>
      </div>

      {/* Return Button */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs shadow-soft transition-all inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

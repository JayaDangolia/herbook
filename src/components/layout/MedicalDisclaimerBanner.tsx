"use client";

import React, { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

export const MedicalDisclaimerBanner = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-brand-blush dark:bg-zinc-900 border-b border-brand-rose/20 text-xs text-brand-text dark:text-zinc-300 px-4 py-2 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-brand-plum dark:text-brand-rose shrink-0" />
          <p className="line-clamp-1 sm:line-clamp-none text-[11px] font-medium">
            <strong>Clinical Safety Protocol:</strong> HerBook content is for informational tracking and outpatient telehealth. For acute severe pain or hemorrhage, dial 112 / 108.
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-brand-plum dark:text-brand-rose text-[11px] font-bold flex items-center shrink-0 hover:underline"
        >
          {expanded ? "Less" : "Disclaimers"}
          {expanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-brand-rose/15 text-[11px] leading-relaxed space-y-1 text-zinc-600 dark:text-zinc-400 animate-fadeIn">
          <p>
            • <strong>Fertility Awareness:</strong> Predicted fertile windows and ovulation days are mathematical approximations based on historical data. They must NEVER be used as a contraceptive method.
          </p>
          <p>
            • <strong>Scope of Medical Systems:</strong> Allopathy provides evidence-based clinical investigation, diagnostics, and ultrasound testing for PCOS and fertility. Ayurveda and Homeopathy are distinct traditional and complementary modalities and should not replace clinical investigation when structural or endocrine disease is suspected.
          </p>
          <p>
            • <strong>Demonstration Notice:</strong> All doctor records and registration numbers in this build are synthetic representations for product evaluation.
          </p>
        </div>
      )}
    </div>
  );
};

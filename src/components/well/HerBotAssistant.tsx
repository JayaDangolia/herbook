"use client";

import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Stethoscope,
  Info,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestions?: string[];
}

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  pcos_questions: `Here are 4 structured clinical questions you can ask your gynecologist during your next appointment:
1. "Based on my cycle regularity and symptoms, do I meet the 2 out of 3 Rotterdam criteria for PCOS?"
2. "Should we evaluate my fasting insulin, lipid profile, and thyroid panel (TSH) to check for metabolic factors?"
3. "What lifestyle, nutrition, or physical activity habits should I prioritize first for my specific hormone profile?"
4. "If we are planning / not planning pregnancy right now, how does that influence our treatment strategy?"`,

  rotterdam: `The Rotterdam Criteria is the international gold standard clinical guideline established in 2003 to diagnose PCOS. A woman is diagnosed with PCOS if she has at least TWO of the following three features:
1. Oligo- or anovulation (irregular or missed periods).
2. Clinical or biochemical hyperandrogenism (excess facial/body hair, hormonal acne, or high blood testosterone).
3. Polycystic ovaries on pelvic ultrasound (12 or more 2–9mm follicles in either ovary, or increased ovarian volume >10ml).
Important: Polycystic ovarian appearance on ultrasound alone is NOT enough for a diagnosis without cycle irregularity or androgen symptoms.`,

  luteal_phase: `The luteal phase is the second half of your menstrual cycle, starting right after ovulation and lasting until your next period begins (typically 12 to 14 days).
During this time, the ruptured follicle transforms into the corpus luteum and secretes Progesterone. Progesterone warms your core body temperature slightly and stabilizes the uterine lining. A luteal phase under 10 days is called a 'short luteal phase' and can sometimes indicate insufficient progesterone levels.`,

  homeopathy_cure: `No, scientific clinical trials have not demonstrated that Homeopathy can cure PCOS or reverse ovarian cyst morphology. PCOS is a complex metabolic and neuro-endocrine condition.
While some women utilize homeopathy as a complementary supportive therapy for stress or subjective comfort, clinical gynecologists emphasize that evidence-based lifestyle changes, metabolic investigations (like insulin and glucose testing), and formal medical therapies must remain the primary standard of care.`,

  ultrasound_prep: `When organizing your pelvic ultrasound report:
1. Check the date and whether it was Transabdominal (requires a full bladder) or Transvaginal (empty bladder).
2. Look at Endometrial Thickness: normal thickness changes depending on which day of your cycle the scan was performed.
3. Review Ovarian Volume & Follicle Count: having multiple small immature follicles along the periphery is common in young women.
4. You can securely upload this scan to your HerBook Health Records vault and share it with your consulting gynecologist with one click!`,
};

export const HerBotAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Hello! I am HerWell Assistant, your educational health companion. I can help explain menstrual terminology, decode PCOS concepts, and prepare questions for your doctor.\n\n⚠️ Clinical Boundary: I provide medical education only. I do NOT diagnose conditions, prescribe medications, or replace emergency hospital care.",
      timestamp: "Just now",
      suggestions: [
        "What questions should I ask my gynecologist about PCOS?",
        "What does Rotterdam criteria mean?",
        "Why is my luteal phase important?",
        "Can Homeopathy cure PCOS?",
      ],
    },
  ]);

  const [inputText, setInputText] = useState("");

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    // Generate intelligent response with safety guardrails
    setTimeout(() => {
      let botReply = "";
      const lower = query.toLowerCase();

      if (lower.includes("emergency") || lower.includes("severe pain") || lower.includes("heavy bleed")) {
        botReply =
          "🚨 IMPORTANT SAFETY NOTICE: If you or someone you know is experiencing severe acute abdominal pain, continuous heavy bleeding (soaking 2+ pads/hr), or fainting, please contact emergency medical services (dial 112 / 108 in India) or visit the nearest hospital casualty immediately. HerBook does not provide emergency intervention.";
      } else if (lower.includes("question") || lower.includes("ask") || lower.includes("gynecologist")) {
        botReply = KNOWLEDGE_RESPONSES.pcos_questions;
      } else if (lower.includes("rotterdam") || lower.includes("criteria") || lower.includes("diagnose pcos")) {
        botReply = KNOWLEDGE_RESPONSES.rotterdam;
      } else if (lower.includes("luteal") || lower.includes("progesterone") || lower.includes("phase")) {
        botReply = KNOWLEDGE_RESPONSES.luteal_phase;
      } else if (lower.includes("homeopathy") || lower.includes("cure pcos")) {
        botReply = KNOWLEDGE_RESPONSES.homeopathy_cure;
      } else if (lower.includes("ultrasound") || lower.includes("scan") || lower.includes("report")) {
        botReply = KNOWLEDGE_RESPONSES.ultrasound_prep;
      } else {
        botReply = `Thank you for asking about "${query}". In reproductive endocrinology, hormone balance depends on the interplay between the pituitary gland and ovaries. For personalized medical advice, diagnosis, or prescription options, we encourage you to book a consultation with one of our verified practitioners in the HerCare directory.`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReply,
        timestamp: "Just now",
        suggestions: [
          "What questions should I ask my gynecologist about PCOS?",
          "Why is my luteal phase important?",
          "What does Rotterdam criteria mean?",
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-card space-y-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-rose to-brand-plum text-white flex items-center justify-center shadow-soft">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              HerWell Educational AI
              <span className="px-2 py-0.5 rounded text-[10px] bg-brand-blush dark:bg-brand-plum/40 text-brand-plum dark:text-brand-rose font-bold">
                Clinical Guardrails
              </span>
            </h3>
            <p className="text-[11px] text-zinc-500">
              Interactive women&apos;s health terminology &amp; doctor visit prep
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "reset",
                sender: "bot",
                text: "Chat refreshed. How can I help clarify your reproductive health questions today?",
                timestamp: "Just now",
                suggestions: [
                  "What questions should I ask my gynecologist about PCOS?",
                  "What does Rotterdam criteria mean?",
                ],
              },
            ])
          }
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="h-72 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                m.sender === "user"
                  ? "bg-brand-plum text-white rounded-tr-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-xs"
              }`}
            >
              {m.text}
            </div>

            {/* Prompt Suggestions */}
            {m.suggestions && m.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {m.suggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSend(sug)}
                    className="text-[11px] font-medium bg-brand-blush dark:bg-zinc-800 text-brand-plum dark:text-brand-rose-light px-2.5 py-1 rounded-xl border border-brand-rose/20 hover:border-brand-rose transition-colors text-left"
                  >
                    💬 {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about cycle terms, PCOS, or doctor prep questions..."
          className="flex-1 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

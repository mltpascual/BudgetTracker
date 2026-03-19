/**
 * TIPID — Onboarding Walkthrough
 * A step-by-step tutorial with the kalabaw mascot guiding new users
 * through key features: wallets, expenses, budgets, and backup.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTipidStore } from "@/lib/store";
import { ChevronRight, ChevronLeft, X, Wallet, PiggyBank, Target, Download } from "lucide-react";

const MASCOT_HAPPY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-happy-MhYqoPSPsRvFcB3CkzXrzP.webp";
const MASCOT_COIN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-coin-bBXSjJ8mXoXLhUFaH3AN8S.webp";
const MASCOT_THINKING = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-thinking-ERdmSJBcizk7YthAnj68Pg.webp";
const MASCOT_SLEEPING = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-sleeping-GBjfE7MhwqjwqwtgUX2c8K.webp";

interface Step {
  mascot: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  tip: string;
}

const STEPS: Step[] = [
  {
    mascot: MASCOT_HAPPY,
    icon: Wallet,
    iconColor: "#3b82f6",
    iconBg: "#dbeafe",
    title: "Welcome to Tipid!",
    description: "I'm Kalabaw, your budget buddy! Let me show you around so you can start managing your money like a pro.",
    tip: "Tip: All your data stays on your device — no servers, no accounts needed!",
  },
  {
    mascot: MASCOT_COIN,
    icon: PiggyBank,
    iconColor: "#22c55e",
    iconBg: "#dcfce7",
    title: "Track Your Expenses",
    description: "Tap the + button to quickly log expenses and income. Use the calculator-style numpad for fast entry!",
    tip: "Tip: Categorize every transaction so you can see where your money goes.",
  },
  {
    mascot: MASCOT_THINKING,
    icon: Target,
    iconColor: "#8b5cf6",
    iconBg: "#ede9fe",
    title: "Set Budgets & Goals",
    description: "Create monthly budgets per category and savings goals. I'll help you track your progress!",
    tip: "Tip: Start with your biggest expense categories like Food and Transport.",
  },
  {
    mascot: MASCOT_SLEEPING,
    icon: Download,
    iconColor: "#f97316",
    iconBg: "#fff7ed",
    title: "Backup Your Data",
    description: "Go to Settings to export your data as JSON or CSV. You can restore anytime from a backup!",
    tip: "Tip: Export a backup regularly to keep your data safe.",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const { updateSettings } = useTipidStore();
  const current = STEPS[step];

  const handleComplete = () => {
    updateSettings({ hasOnboarded: true });
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const isLast = step === STEPS.length - 1;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        className="relative w-[90%] max-w-[380px] bg-card rounded-3xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Top gradient area with mascot */}
        <div className="relative bg-gradient-to-b from-primary/10 to-transparent pt-8 pb-4 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={step}
              src={current.mascot}
              alt="Kalabaw"
              className="w-32 h-32 object-contain drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Icon badge */}
              <div className="flex justify-center mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: current.iconBg }}
                >
                  <current.icon className="w-5 h-5" style={{ color: current.iconColor }} />
                </div>
              </div>

              <h2 className="text-lg font-extrabold font-display text-center mb-2">
                {current.title}
              </h2>
              <p className="text-sm font-body text-center text-muted-foreground leading-relaxed mb-3">
                {current.description}
              </p>
              <div className="bg-primary/5 rounded-xl px-3 py-2.5 mb-4">
                <p className="text-xs font-body text-primary text-center leading-relaxed">
                  {current.tip}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => {
                if (isLast) {
                  handleComplete();
                } else {
                  setStep((s) => s + 1);
                }
              }}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold font-display text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              {isLast ? "Let's Get Started!" : "Next"}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

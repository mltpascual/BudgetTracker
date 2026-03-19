import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "tipid-onboarding-done";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Mabuhay sa Tipid!",
    description:
      "Ang budget buddy mo para sa araw-araw. I-track ang gastos, mag-set ng budget, at mag-ipon — lahat dito lang.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: <PlusCircle className="w-8 h-8" />,
    title: "Mag-add ng Transaction",
    description:
      'I-tap ang malaking "+" button sa baba para mag-record ng income o expense. Mabilis at madali lang!',
    color: "from-green-500/20 to-green-500/5",
  },
  {
    icon: <ArrowLeftRight className="w-8 h-8" />,
    title: "Swipe para Mag-edit/Delete",
    description:
      "Sa History page, i-swipe right ang transaction para i-edit, o swipe left para i-delete. Parang native app!",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: <PiggyBank className="w-8 h-8" />,
    title: "Budgets & Goals",
    description:
      "Mag-set ng monthly budget per category at savings goals. Makikita mo ang progress mo sa Dashboard.",
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Analytics & Insights",
    description:
      "Tingnan ang spending patterns mo sa Analytics. May charts, breakdowns, at smart insights para mas malinaw ang finances mo.",
    color: "from-purple-500/20 to-purple-500/5",
  },
];

export default function OnboardingWalkthrough() {
  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Show after a short delay to let the page render first
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, handleComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleComplete}
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-card text-card-foreground rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Skip button */}
            <button
              onClick={handleComplete}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Gradient header */}
            <div
              className={`bg-gradient-to-b ${step.color} px-8 pt-10 pb-6 flex flex-col items-center`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center text-primary shadow-lg mb-4"
                >
                  {step.icon}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${currentStep}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold text-center"
                >
                  {step.title}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentStep}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-muted-foreground text-center leading-relaxed"
                >
                  {step.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Footer: dots + nav */}
            <div className="px-8 pb-6 flex items-center justify-between">
              {/* Back button */}
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Step dots */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>

              {/* Next / Finish button */}
              <button
                onClick={handleNext}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isLast
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "hover:bg-muted"
                }`}
              >
                {isLast ? (
                  "Tara!"
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

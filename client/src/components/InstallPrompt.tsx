import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone;
    if (isStandalone) return;

    // Check if user dismissed before
    const dismissed = localStorage.getItem("tipid-install-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Detect iOS
    const ua = navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isiOS);

    if (isiOS) {
      // On iOS, show after a short delay since there's no beforeinstallprompt
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Listen for the beforeinstallprompt event (Chrome/Edge/Samsung)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a short delay
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
    } catch {
      // ignore
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem("tipid-install-dismissed", Date.now().toString());
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-3 right-3 z-50 mx-auto max-w-md"
        >
          <div className="bg-card text-card-foreground rounded-2xl shadow-lg border border-border p-4">
            {showIOSGuide ? (
              /* iOS Safari guide */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">I-install ang Tipid</h3>
                  <button
                    onClick={handleDismiss}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      1
                    </span>
                    <span>
                      I-tap ang{" "}
                      <span className="inline-flex items-center px-1 py-0.5 bg-muted rounded text-[10px]">
                        ⬆ Share
                      </span>{" "}
                      button sa Safari
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      2
                    </span>
                    <span>Scroll down at i-tap ang "Add to Home Screen"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      3
                    </span>
                    <span>I-tap ang "Add" — tapos na!</span>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="w-full text-xs text-muted-foreground py-1.5 hover:text-foreground transition-colors"
                >
                  Sige, gets ko na
                </button>
              </div>
            ) : (
              /* Standard install prompt */
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm">I-install ang Tipid</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Gamitin offline, mas mabilis, parang native app!
                  </p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={handleInstall}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Install
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Mamaya na
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-full hover:bg-muted transition-colors shrink-0"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      // Hide the "reconnected" banner after 3 seconds
      setTimeout(() => setShowReconnected(false), 3000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-amber-600 dark:bg-amber-700 text-white px-4 py-2.5 text-sm font-semibold shadow-lg"
        >
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>Walang internet — offline mode</span>
        </motion.div>
      )}

      {showReconnected && !isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-emerald-600 dark:bg-emerald-700 text-white px-4 py-2.5 text-sm font-semibold shadow-lg"
        >
          <Wifi className="w-4 h-4 flex-shrink-0" />
          <span>Naka-connect na ulit!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

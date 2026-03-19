/**
 * TIPID — App Layout
 * Mobile-first shell with bottom navigation bar (Tarsi-style).
 * On desktop, constrains to phone-width centered layout.
 */
import { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { Home, Plus, Wallet, CalendarDays, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { path: "/app", icon: Home, label: "Home" },
  { path: "/app/wallets", icon: Wallet, label: "Wallets" },
  { path: "/app/add", icon: Plus, label: "Add", isCenter: true },
  { path: "/app/history", icon: CalendarDays, label: "History" },
  { path: "/app/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex justify-center">
      {/* Phone container — max 430px on desktop */}
      <div className="w-full max-w-[430px] min-h-screen relative flex flex-col">
        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto pb-24">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card/90 backdrop-blur-xl border-t border-border/50 z-50">
          <div className="flex items-end justify-around px-2 pb-2 pt-1 safe-area-bottom">
            {NAV_ITEMS.map((item) => {
              const isActive = item.path === "/app"
                ? location === "/app" || location === "/app/"
                : location.startsWith(item.path);
              const Icon = item.icon;

              if (item.isCenter) {
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="relative -mt-7 z-10 block"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                      <Icon className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex flex-col items-center gap-0.5 py-2 px-3 active:scale-95 transition-transform relative"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={`text-[10px] font-body transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 w-8 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

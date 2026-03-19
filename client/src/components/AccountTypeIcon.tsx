/**
 * TIPID — AccountTypeIcon Component
 * Renders Lucide SVG icons for account types with tinted colored backgrounds.
 * Supports dark mode with adjusted background opacity.
 */
import {
  Banknote, Landmark, Smartphone, CreditCard, type LucideIcon,
} from "lucide-react";
import type { AccountType } from "@/lib/store";

interface AccountIconConfig {
  icon: LucideIcon;
  color: string;
  darkColor: string;
  bg: string;
  darkBg: string;
  label: string;
}

export const ACCOUNT_TYPE_CONFIG: Record<AccountType, AccountIconConfig> = {
  cash:    { icon: Banknote,    color: "#22c55e", darkColor: "#4ade80", bg: "#f0fdf4", darkBg: "rgba(34,197,94,0.15)", label: "Cash" },
  bank:    { icon: Landmark,    color: "#0ea5e9", darkColor: "#38bdf8", bg: "#f0f9ff", darkBg: "rgba(14,165,233,0.15)", label: "Bank" },
  ewallet: { icon: Smartphone, color: "#8b5cf6", darkColor: "#a78bfa", bg: "#f5f3ff", darkBg: "rgba(139,92,246,0.15)", label: "E-Wallet" },
  credit:  { icon: CreditCard,  color: "#f97316", darkColor: "#fb923c", bg: "#fff7ed", darkBg: "rgba(249,115,22,0.15)", label: "Credit" },
};

interface AccountTypeIconProps {
  type: AccountType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { container: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
  md: { container: "w-10 h-10 rounded-xl", icon: "w-5 h-5" },
  lg: { container: "w-12 h-12 rounded-xl", icon: "w-6 h-6" },
};

export default function AccountTypeIcon({ type, size = "md", className = "" }: AccountTypeIconProps) {
  const config = ACCOUNT_TYPE_CONFIG[type] || ACCOUNT_TYPE_CONFIG.cash;
  const Icon = config.icon;
  const s = SIZE_MAP[size];
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <div
      className={`${s.container} flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ backgroundColor: isDark ? config.darkBg : config.bg }}
    >
      <Icon className={s.icon} style={{ color: isDark ? config.darkColor : config.color }} strokeWidth={2} />
    </div>
  );
}

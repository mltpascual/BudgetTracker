/**
 * TIPID — Dashboard
 * Design: "Lightweight & Airy" — primary color as accent, not flood.
 * Compact quick links, refined balance card, subtle tip bubble.
 * Widget order and visibility are persisted in localStorage.
 */
import { useTipidStore, formatCurrency, type QuickTemplate } from "@/lib/store";
import CategoryIcon from "@/components/CategoryIcon";
import SpendingInsights from "@/components/SpendingInsights";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Target,
  HandCoins,
  TrendingUp,
  ChevronRight,
  Repeat,
  BarChart3,
  ArrowRightLeft,
  Settings2,
  GripVertical,
  Eye,
  EyeOff,
  RotateCcw,
  Zap,
  FileText,
  Plus,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import { useLanguage } from "@/lib/i18n";
import { toast } from "sonner";

const MASCOT_HAPPY =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-happy-MhYqoPSPsRvFcB3CkzXrzP.webp";
const MASCOT_COIN =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-coin-bBXSjJ8mXoXLhUFaH3AN8S.webp";

const TIPS_EN = [
  "Tip: Track every gastos, kahit barya lang!",
  "Tip: Set a monthly budget para hindi ma-overspend.",
  "Tip: Ipon muna bago gastos, pre!",
  "Tip: Review your spending every week.",
  "Tip: Small savings add up — konting tiis lang!",
  "Tip: Avoid impulse buying — sleep on it first!",
];

const TIPS_FIL = [
  "Tip: I-track lahat ng gastos, kahit barya lang!",
  "Tip: Mag-set ng monthly budget para hindi sobra!",
  "Tip: Ipon muna bago gastos, pre!",
  "Tip: I-review ang gastos mo every week.",
  "Tip: Maliit na ipon, malaki rin kapag naipon!",
  "Tip: Wag impulse buying — tulog muna bago bilhin!",
];

// ─── Widget Types ──────────────────────────────────────────────────
type WidgetId =
  | "tip-bubble"
  | "balance"
  | "budget-progress"
  | "quick-links"
  | "quick-templates"
  | "insights"
  | "recent"
  | "stats";

interface WidgetConfig {
  id: WidgetId;
  visible: boolean;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "tip-bubble", visible: true },
  { id: "balance", visible: true },
  { id: "budget-progress", visible: true },
  { id: "quick-links", visible: true },
  { id: "quick-templates", visible: true },
  { id: "insights", visible: true },
  { id: "recent", visible: true },
  { id: "stats", visible: true },
];

const WIDGET_STORAGE_KEY = "tipid-dashboard-widgets";

function loadWidgets(): WidgetConfig[] {
  try {
    const stored = localStorage.getItem(WIDGET_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as WidgetConfig[];
      const ids = new Set(parsed.map((w) => w.id));
      const merged = [...parsed];
      DEFAULT_WIDGETS.forEach((dw) => {
        if (!ids.has(dw.id)) merged.push(dw);
      });
      return merged;
    }
  } catch {}
  return DEFAULT_WIDGETS;
}

function saveWidgets(widgets: WidgetConfig[]) {
  localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(widgets));
}

// ─── Widget Label Map ──────────────────────────────────────────────
function getWidgetLabel(
  id: WidgetId,
  t: (key: any) => string,
  lang: string
): string {
  const map: Record<WidgetId, string> = {
    "tip-bubble": t("widgetsTipBubble"),
    balance: t("widgetsBalance"),
    "budget-progress": lang === "fil" ? "Budget Progress" : "Budget Progress",
    "quick-links": t("widgetsQuickLinks"),
    "quick-templates": lang === "fil" ? "Mabilisang Gastos" : "Quick Add",
    insights: t("widgetsInsights"),
    recent: t("widgetsRecent"),
    stats: t("widgetsStats"),
  };
  return map[id] || id;
}

export default function Dashboard() {
  const {
    transactions,
    accounts,
    budgets,
    goals,
    debts,
    categories,
    templates,
    settings,
    useTemplate,
  } = useTipidStore();
  const [showOnboarding, setShowOnboarding] = useState(!settings.hasOnboarded);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(loadWidgets);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const { lang, t } = useLanguage();
  const currency = settings.currency;

  const tips = lang === "fil" ? TIPS_FIL : TIPS_EN;
  const tip = useMemo(
    () => tips[Math.floor(Math.random() * tips.length)],
    [lang]
  );

  // Persist widget changes
  useEffect(() => {
    saveWidgets(widgets);
  }, [widgets]);

  // Current month stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = monthTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = monthTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const activeGoals = goals.length;
  const activeDebts = debts.filter((d) => d.paidAmount < d.totalAmount).length;

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashGreeting");
    if (hour < 17) return t("dashGreetingAfternoon");
    return t("dashGreetingEvening");
  }

  const quickLinks = [
    {
      label: t("dashBudgets"),
      icon: Target,
      href: "/app/budgets",
    },
    {
      label: t("dashGoals"),
      icon: TrendingUp,
      href: "/app/goals",
    },
    {
      label: t("dashDebts"),
      icon: HandCoins,
      href: "/app/debts",
    },
    {
      label: t("dashRecurring"),
      icon: Repeat,
      href: "/app/recurring",
    },
    {
      label: t("dashAnalytics"),
      icon: BarChart3,
      href: "/app/analytics",
    },
    {
      label: t("dashTransfer"),
      icon: ArrowRightLeft,
      href: "/app/transfer",
    },
    {
      label: lang === "fil" ? "Buod" : "Summary",
      icon: FileText,
      href: "/app/summary",
    },
  ];

  // Widget toggle
  const toggleWidget = useCallback((id: WidgetId) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  }, []);

  // Widget reorder
  const moveWidget = useCallback((fromIdx: number, toIdx: number) => {
    setWidgets((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  // Reset widgets
  const resetWidgets = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
  }, []);

  // ─── Widget Renderers ────────────────────────────────────────────
  const renderWidget = (widgetId: WidgetId) => {
    switch (widgetId) {
      /* ── Tip Bubble ─────────────────────────────────────────────── */
      case "tip-bubble":
        return (
          <motion.div
            className="flex items-center gap-3 px-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <img
              src={MASCOT_COIN}
              alt="tip"
              className="w-9 h-9 object-contain flex-shrink-0"
            />
            <div className="flex-1 bg-primary/8 dark:bg-primary/15 rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-primary/12 dark:border-primary/20">
              <p className="text-xs text-foreground/80 font-body leading-relaxed">
                {tip}
              </p>
            </div>
          </motion.div>
        );

      /* ── Balance Card ───────────────────────────────────────────── */
      case "balance":
        return (
          <motion.div
            className="relative overflow-hidden bg-primary rounded-2xl p-5 text-primary-foreground shadow-lg shadow-primary/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/8" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative z-10">
              <p className="text-xs opacity-75 font-body tracking-wide uppercase">
                {t("dashBalance")}
              </p>
              <p className="text-3xl font-extrabold font-display tabular-nums mt-1">
                {formatCurrency(totalBalance, currency)}
              </p>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] opacity-60 font-body">
                      {t("dashIncome")}
                    </p>
                    <p className="text-sm font-bold tabular-nums">
                      {formatCurrency(totalIncome, currency)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] opacity-60 font-body">
                      {t("dashExpense")}
                    </p>
                    <p className="text-sm font-bold tabular-nums">
                      {formatCurrency(totalExpense, currency)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      /* ── Budget Progress Bar ────────────────────────────────────── */
      case "budget-progress": {
        if (budgets.length === 0) {
          return (
            <motion.div
              className="bg-card rounded-2xl p-4 border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold font-display flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-primary" />
                  {lang === "fil" ? "Monthly Budget" : "Monthly Budget"}
                </h2>
                <Link href="/app/budgets">
                  <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5">
                    {lang === "fil" ? "Mag-set" : "Set Up"} <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground font-body">
                {lang === "fil"
                  ? "Wala ka pang budget. Mag-set ng monthly budget para ma-track ang spending mo."
                  : "No budgets set yet. Set up monthly budgets to track your spending."}
              </p>
            </motion.div>
          );
        }

        const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
        const totalBudgetSpent = budgets.reduce((sum, b) => {
          const catSpent = monthTransactions
            .filter((tx) => tx.type === "expense" && tx.categoryId === b.categoryId)
            .reduce((s, tx) => s + tx.amount, 0);
          return sum + catSpent;
        }, 0);
        const budgetPercent = totalBudgetLimit > 0 ? Math.min((totalBudgetSpent / totalBudgetLimit) * 100, 100) : 0;
        const budgetRemaining = totalBudgetLimit - totalBudgetSpent;
        const isOverBudget = budgetRemaining < 0;
        const isWarning = budgetPercent >= 80 && !isOverBudget;

        return (
          <motion.div
            className="bg-card rounded-2xl p-4 border border-border/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold font-display flex items-center gap-1.5">
                <Target className="w-4 h-4 text-primary" />
                {lang === "fil" ? "Monthly Budget" : "Monthly Budget"}
              </h2>
              <Link href="/app/budgets">
                <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5">
                  {lang === "fil" ? "Tingnan" : "Details"} <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 rounded-full bg-accent overflow-hidden mb-2.5">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${
                  isOverBudget
                    ? "bg-destructive"
                    : isWarning
                      ? "bg-amber-500"
                      : "bg-primary"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${budgetPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-body">
                  {lang === "fil" ? "Na-gastos" : "Spent"}
                </p>
                <p className={`text-sm font-bold font-body tabular-nums ${
                  isOverBudget ? "text-destructive" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                }`}>
                  {formatCurrency(totalBudgetSpent, currency)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-body">
                  {isOverBudget
                    ? lang === "fil" ? "Sobra" : "Over"
                    : lang === "fil" ? "Natitira" : "Remaining"}
                </p>
                <p className={`text-sm font-bold font-body tabular-nums ${
                  isOverBudget ? "text-destructive" : "text-foreground"
                }`}>
                  {isOverBudget ? "-" : ""}{formatCurrency(Math.abs(budgetRemaining), currency)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-body">
                  {lang === "fil" ? "Budget" : "Budget"}
                </p>
                <p className="text-sm font-bold font-body tabular-nums">
                  {formatCurrency(totalBudgetLimit, currency)}
                </p>
              </div>
            </div>

            {/* Warning text */}
            {isOverBudget && (
              <p className="text-[10px] text-destructive font-semibold font-body mt-2 flex items-center gap-1">
                {lang === "fil"
                  ? "Lagpas ka na sa budget mo ngayong buwan!"
                  : "You've exceeded your budget this month!"}
              </p>
            )}
            {isWarning && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold font-body mt-2">
                {lang === "fil"
                  ? `${Math.round(budgetPercent)}% na ng budget mo ang nagastos na.`
                  : `${Math.round(budgetPercent)}% of your budget has been used.`}
              </p>
            )}
          </motion.div>
        );
      }

      /* ── Quick Links — Compact 4-col grid ───────────────────────── */
      case "quick-links":
        return (
          <div className="grid grid-cols-4 gap-2">
            {quickLinks.map((link, i) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  className="bg-card rounded-xl p-2.5 flex flex-col items-center gap-1.5 border border-border/50 active:scale-95 transition-all hover:border-primary/30 hover:shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.03 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <link.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-semibold font-body text-foreground/80 text-center leading-tight">
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        );

      /* ── Spending Insights ──────────────────────────────────────── */
      case "insights":
        return <SpendingInsights />;

      /* ── Recent Transactions ────────────────────────────────────── */
      case "recent":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold font-display">
                {t("dashRecentTransactions")}
              </h2>
              <Link href="/app/history">
                <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
                  {t("dashViewAll")} <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-card rounded-2xl p-6 border border-border/50 text-center">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-sleeping-GBjfE7MhwqjwqwtgUX2c8K.webp"
                  alt="No transactions"
                  className="w-20 h-20 mx-auto mb-3 object-contain"
                />
                <p className="text-sm text-muted-foreground font-body">
                  {t("dashNoTransactions")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...transactions]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((tx) => {
                    const cat = categories.find(
                      (c) => c.id === tx.categoryId
                    );
                    return (
                      <div
                        key={tx.id}
                        className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3"
                      >
                        <CategoryIcon
                          categoryId={tx.categoryId}
                          iconName={cat?.icon}
                          color={cat?.color}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold font-body truncate">
                            {cat?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {tx.note ||
                              new Date(tx.date).toLocaleDateString("en-PH", {
                                month: "short",
                                day: "numeric",
                              })}
                          </p>
                        </div>
                        <p
                          className={`text-sm font-bold tabular-nums font-body ${
                            tx.type === "income"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-foreground"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {formatCurrency(tx.amount, currency)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </motion.div>
        );

      /* ── Quick Templates ────────────────────────────────────────── */
      case "quick-templates":
        if (templates.length === 0) return null;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold font-display flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                {lang === "fil" ? "Mabilisang Gastos" : "Quick Add"}
              </h2>
              <Link href="/app/settings">
                <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
                  {lang === "fil" ? "I-manage" : "Manage"}{" "}
                  <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {templates.map((tmpl) => {
                const cat = categories.find((c) => c.id === tmpl.categoryId);
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      useTemplate(tmpl.id);
                      toast.success(
                        lang === "fil"
                          ? `Na-log na: ${tmpl.name}`
                          : `Logged: ${tmpl.name}`
                      );
                    }}
                    className="flex-shrink-0 bg-card rounded-xl border border-border/50 p-3 flex flex-col items-center gap-1.5 min-w-[80px] hover:border-primary/30 active:scale-95 transition-all"
                  >
                    <CategoryIcon
                      categoryId={tmpl.categoryId}
                      iconName={cat?.icon}
                      color={cat?.color}
                      size="sm"
                    />
                    <span className="text-[10px] font-semibold font-body truncate w-full text-center">
                      {tmpl.name}
                    </span>
                    <span className="text-[10px] tabular-nums font-body text-muted-foreground">
                      {formatCurrency(tmpl.amount, currency)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      /* ── Stats Summary ──────────────────────────────────────────── */
      case "stats":
        if (activeGoals === 0 && activeDebts === 0) return null;
        return (
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                <PiggyBank className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wide">
                  {lang === "fil" ? "Goals" : "Goals"}
                </p>
                <p className="text-xl font-extrabold font-display">
                  {activeGoals}
                </p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                <HandCoins className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wide">
                  {lang === "fil" ? "Utang" : "Debts"}
                </p>
                <p className="text-xl font-extrabold font-display">
                  {activeDebts}
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const visibleWidgets = widgets.filter((w) => w.visible);

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">
      {/* Onboarding Walkthrough */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      {/* Greeting + Mascot + Customize Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-body">
            {getGreeting()}
            {settings.name ? `, ${settings.name}` : ""}!
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={`p-2 rounded-xl transition-colors ${
              isCustomizing
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <motion.img
            src={MASCOT_HAPPY}
            alt="Tipid Kalabaw"
            className="w-14 h-14 object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          />
        </div>
      </div>

      {/* Customize Panel */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display">
                  {t("widgetsCustomize")}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetWidgets}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-body"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t("widgetsReset")}
                  </button>
                  <button
                    onClick={() => setIsCustomizing(false)}
                    className="text-xs text-primary font-semibold font-body"
                  >
                    {t("widgetsDone")}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-body">
                {t("widgetsDragHint")}
              </p>
              <div className="space-y-1.5">
                {widgets.map((widget, idx) => (
                  <div
                    key={widget.id}
                    draggable
                    onDragStart={() => setDragIdx(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragIdx !== null && dragIdx !== idx) {
                        moveWidget(dragIdx, idx);
                        setDragIdx(idx);
                      }
                    }}
                    onDragEnd={() => setDragIdx(null)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors cursor-grab active:cursor-grabbing ${
                      dragIdx === idx
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-background"
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span
                      className={`text-sm font-body flex-1 ${
                        widget.visible
                          ? "text-foreground"
                          : "text-muted-foreground line-through"
                      }`}
                    >
                      {getWidgetLabel(widget.id, t, lang)}
                    </span>
                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        widget.visible
                          ? "text-primary hover:bg-primary/10"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {widget.visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Visible Widgets in Order */}
      {visibleWidgets.map((widget) => {
        const content = renderWidget(widget.id);
        if (!content) return null;
        return <div key={widget.id}>{content}</div>;
      })}
    </div>
  );
}

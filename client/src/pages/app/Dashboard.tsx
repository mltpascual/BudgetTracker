/**
 * TIPID — Dashboard
 * Home screen with customizable widgets: greeting, mascot tip, balance card,
 * quick links, spending insights, recent transactions, and stats summary.
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
      // Ensure all widget IDs exist (in case new widgets are added)
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
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      label: t("dashGoals"),
      icon: TrendingUp,
      href: "/app/goals",
      color:
        "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    },
    {
      label: t("dashDebts"),
      icon: HandCoins,
      href: "/app/debts",
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      label: t("dashRecurring"),
      icon: Repeat,
      href: "/app/recurring",
      color:
        "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    },
    {
      label: t("dashAnalytics"),
      icon: BarChart3,
      href: "/app/analytics",
      color:
        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    },
    {
      label: t("dashTransfer"),
      icon: ArrowRightLeft,
      href: "/app/transfer",
      color:
        "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    },
    {
      label: lang === "fil" ? "Buod" : "Summary",
      icon: FileText,
      href: "/app/summary",
      color:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
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
      case "tip-bubble":
        return (
          <motion.div
            className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm flex items-start gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <img
              src={MASCOT_COIN}
              alt="tip"
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {tip}
            </p>
          </motion.div>
        );

      case "balance":
        return (
          <motion.div
            className="bg-primary rounded-2xl p-5 text-primary-foreground shadow-lg shadow-primary/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm opacity-80 font-body">{t("dashBalance")}</p>
            <p className="text-3xl font-extrabold font-display tabular-nums mt-1">
              {formatCurrency(totalBalance, currency)}
            </p>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] opacity-70">{t("dashIncome")}</p>
                  <p className="text-sm font-bold tabular-nums">
                    {formatCurrency(totalIncome, currency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] opacity-70">{t("dashExpense")}</p>
                  <p className="text-sm font-bold tabular-nums">
                    {formatCurrency(totalExpense, currency)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "quick-links":
        return (
          <div className="grid grid-cols-3 gap-2">
            {quickLinks.map((link, i) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  className={`${link.color} rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <link.icon className="w-6 h-6" />
                  <span className="text-xs font-semibold font-body">
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        );

      case "insights":
        return <SpendingInsights />;

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
                          {formatCurrency(tx.amount, tx.currency)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </motion.div>
        );

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
                  {lang === "fil" ? "I-manage" : "Manage"} <ChevronRight className="w-3 h-3" />
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
                      {formatCurrency(tmpl.amount, tmpl.currency)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      case "stats":
        if (activeGoals === 0 && activeDebts === 0) return null;
        return (
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <p className="text-xs text-muted-foreground font-body">
                {lang === "fil" ? "Active Goals" : "Active Goals"}
              </p>
              <p className="text-2xl font-extrabold font-display mt-1">
                {activeGoals}
              </p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <p className="text-xs text-muted-foreground font-body">
                {lang === "fil" ? "Active na Utang" : "Active Debts"}
              </p>
              <p className="text-2xl font-extrabold font-display mt-1">
                {activeDebts}
              </p>
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

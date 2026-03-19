/**
 * TIPID — Spending Insights Component
 * Shows personalized spending insights based on transaction patterns.
 */
import { useMemo } from "react";
import { useTipidStore, formatCurrency } from "@/lib/store";
import { useLanguage } from "@/lib/i18n";
import CategoryIcon from "@/components/CategoryIcon";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
} from "lucide-react";

interface Insight {
  id: string;
  icon: typeof TrendingUp;
  iconColor: string;
  iconBg: string;
  text: string;
  categoryId?: string;
  type: "warning" | "positive" | "neutral" | "info";
}

export default function SpendingInsights() {
  const { transactions, categories, budgets, settings } = useTipidStore();
  const { t, lang } = useLanguage();
  const currency = settings.currency;

  const insights = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const dayOfMonth = now.getDate();

    // Current month expenses
    const thisMonthExpenses = transactions.filter((tx) => {
      const d = new Date(tx.date);
      return (
        tx.type === "expense" &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

    // Last month expenses
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthExpenses = transactions.filter((tx) => {
      const d = new Date(tx.date);
      return (
        tx.type === "expense" &&
        d.getMonth() === lastMonth &&
        d.getFullYear() === lastMonthYear
      );
    });

    const result: Insight[] = [];

    // No expenses insight
    if (thisMonthExpenses.length === 0) {
      result.push({
        id: "no-expenses",
        icon: CheckCircle,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: t("insightsNoExpenses"),
        type: "positive",
      });
      return result;
    }

    // Category totals this month
    const catTotals = new Map<string, number>();
    thisMonthExpenses.forEach((tx) => {
      catTotals.set(
        tx.categoryId,
        (catTotals.get(tx.categoryId) || 0) + tx.amount
      );
    });

    // Category totals last month
    const lastCatTotals = new Map<string, number>();
    lastMonthExpenses.forEach((tx) => {
      lastCatTotals.set(
        tx.categoryId,
        (lastCatTotals.get(tx.categoryId) || 0) + tx.amount
      );
    });

    // Top category insight
    let topCatId = "";
    let topCatAmount = 0;
    catTotals.forEach((amount, catId) => {
      if (amount > topCatAmount) {
        topCatId = catId;
        topCatAmount = amount;
      }
    });

    if (topCatId) {
      const cat = categories.find((c) => c.id === topCatId);
      if (cat) {
        const text = t("insightsTopCategory")
          .replace("{cat}", cat.name)
          .replace("{amt}", formatCurrency(topCatAmount, currency));
        result.push({
          id: "top-category",
          icon: BarChart3,
          iconColor: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          text,
          categoryId: topCatId,
          type: "info",
        });
      }
    }

    // Compare categories month-over-month
    catTotals.forEach((thisAmount, catId) => {
      const lastAmount = lastCatTotals.get(catId) || 0;
      if (lastAmount > 0) {
        const pctChange = Math.round(
          ((thisAmount - lastAmount) / lastAmount) * 100
        );
        const cat = categories.find((c) => c.id === catId);
        if (cat && Math.abs(pctChange) >= 20) {
          if (pctChange > 0) {
            const text = t("insightsSpentMore")
              .replace("{pct}", String(pctChange))
              .replace("{cat}", cat.name);
            result.push({
              id: `more-${catId}`,
              icon: TrendingUp,
              iconColor: "text-red-600 dark:text-red-400",
              iconBg: "bg-red-100 dark:bg-red-900/30",
              text,
              categoryId: catId,
              type: "warning",
            });
          } else {
            const text = t("insightsSpentLess")
              .replace("{pct}", String(Math.abs(pctChange)))
              .replace("{cat}", cat.name);
            result.push({
              id: `less-${catId}`,
              icon: TrendingDown,
              iconColor: "text-emerald-600 dark:text-emerald-400",
              iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
              text,
              categoryId: catId,
              type: "positive",
            });
          }
        }
      }
    });

    // Budget warnings
    budgets.forEach((budget) => {
      const spent = catTotals.get(budget.categoryId) || 0;
      const pct = Math.round((spent / budget.limit) * 100);
      const cat = categories.find((c) => c.id === budget.categoryId);
      if (cat && pct >= 80) {
        const text = t("insightsBudgetWarning")
          .replace("{pct}", String(pct))
          .replace("{cat}", cat.name);
        result.push({
          id: `budget-${budget.id}`,
          icon: AlertTriangle,
          iconColor:
            pct >= 100
              ? "text-red-600 dark:text-red-400"
              : "text-amber-600 dark:text-amber-400",
          iconBg:
            pct >= 100
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-amber-100 dark:bg-amber-900/30",
          text,
          categoryId: budget.categoryId,
          type: pct >= 100 ? "warning" : "neutral",
        });
      }
    });

    // Daily average insight
    if (dayOfMonth > 1) {
      const totalExpense = thisMonthExpenses.reduce(
        (sum, tx) => sum + tx.amount,
        0
      );
      const dailyAvg = totalExpense / dayOfMonth;
      const text = t("insightsDailyAvg").replace(
        "{amt}",
        formatCurrency(dailyAvg, currency)
      );
      result.push({
        id: "daily-avg",
        icon: Lightbulb,
        iconColor: "text-violet-600 dark:text-violet-400",
        iconBg: "bg-violet-100 dark:bg-violet-900/30",
        text,
        type: "info",
      });
    }

    // On track insight (if all budgets are under 80%)
    const allBudgetsOk = budgets.every((budget) => {
      const spent = catTotals.get(budget.categoryId) || 0;
      return spent / budget.limit < 0.8;
    });
    if (budgets.length > 0 && allBudgetsOk) {
      result.push({
        id: "on-track",
        icon: CheckCircle,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: t("insightsOnTrack"),
        type: "positive",
      });
    }

    return result.slice(0, 4); // Max 4 insights
  }, [transactions, categories, budgets, settings, lang]);

  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-base font-bold font-display mb-3">
        {t("insightsTitle")}
      </h2>
      <div className="space-y-2">
        {insights.map((insight, i) => {
          const cat = insight.categoryId
            ? categories.find((c) => c.id === insight.categoryId)
            : null;
          return (
            <motion.div
              key={insight.id}
              className="bg-card rounded-xl p-3 border border-border/50 flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.iconBg}`}
              >
                <insight.icon className={`w-4 h-4 ${insight.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-foreground leading-relaxed">
                  {insight.text}
                </p>
              </div>
              {cat && (
                <CategoryIcon
                  categoryId={cat.id}
                  iconName={cat.icon}
                  color={cat.color}
                  size="sm"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

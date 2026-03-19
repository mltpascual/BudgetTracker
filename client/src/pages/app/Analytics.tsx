/**
 * TIPID — Spending Analytics
 * Pie chart for category breakdown, bar chart for monthly trends.
 * Design: Tarsi-inspired green cards, Nunito display font.
 */
import { useState, useMemo } from "react";
import { useTipidStore, formatCurrency } from "@/lib/store";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function Analytics() {
  const { transactions, categories, settings } = useTipidStore();
  const [, navigate] = useLocation();
  const currency = settings.currency;

  // Month selector
  const [monthOffset, setMonthOffset] = useState(0);
  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const monthLabel = selectedDate.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  // Filter transactions for selected month
  const monthTx = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      }),
    [transactions, selectedMonth, selectedYear]
  );

  const totalIncome = monthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const netFlow = totalIncome - totalExpense;

  // Pie chart data — expense by category
  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    monthTx
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
      });
    return Array.from(map.entries())
      .map(([catId, amount]) => {
        const cat = categories.find((c) => c.id === catId);
        return {
          name: cat?.name || "Other",
          value: amount,
          color: cat?.color || "#64748b",
          icon: cat?.icon || "📦",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthTx, categories]);

  // Bar chart data — last 6 months income vs expense
  const barData = useMemo(() => {
    const months: { name: string; income: number; expense: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() + monthOffset - i);
      const m = d.getMonth();
      const y = d.getFullYear();
      const label = d.toLocaleDateString("en-PH", { month: "short" });
      const mTx = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getMonth() === m && td.getFullYear() === y;
      });
      months.push({
        name: label,
        income: mTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: mTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }
    return months;
  }, [transactions, monthOffset]);

  // Daily average
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysPassed = selectedYear === new Date().getFullYear() && selectedMonth === new Date().getMonth()
    ? new Date().getDate()
    : daysInMonth;
  const dailyAvg = daysPassed > 0 ? totalExpense / daysPassed : 0;

  // Top category
  const topCategory = pieData.length > 0 ? pieData[0] : null;

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/app")}
          className="w-8 h-8 rounded-full bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold font-display">Analytics</h1>
          <p className="text-xs text-muted-foreground font-body">
            Spending Insights
          </p>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between bg-card rounded-2xl px-4 py-3 border border-border/50">
        <button
          onClick={() => setMonthOffset((o) => o - 1)}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="text-sm font-bold font-display">{monthLabel}</p>
        <button
          onClick={() => setMonthOffset((o) => Math.min(o + 1, 0))}
          disabled={monthOffset >= 0}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          className="bg-card rounded-2xl p-3 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-[10px] text-muted-foreground font-body">Income</p>
          </div>
          <p className="text-sm font-bold tabular-nums font-body text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalIncome, currency)}
          </p>
        </motion.div>
        <motion.div
          className="bg-card rounded-2xl p-3 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            <p className="text-[10px] text-muted-foreground font-body">Expense</p>
          </div>
          <p className="text-sm font-bold tabular-nums font-body">
            {formatCurrency(totalExpense, currency)}
          </p>
        </motion.div>
        <motion.div
          className="bg-card rounded-2xl p-3 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] text-muted-foreground font-body">Net</p>
          </div>
          <p
            className={`text-sm font-bold tabular-nums font-body ${
              netFlow >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {netFlow >= 0 ? "+" : ""}
            {formatCurrency(netFlow, currency)}
          </p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        className="bg-card rounded-2xl p-4 border border-border/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-body">
              Daily Average Spend
            </p>
            <p className="text-base font-bold tabular-nums font-body mt-0.5">
              {formatCurrency(dailyAvg, currency)}
            </p>
          </div>
          {topCategory && (
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground font-body">
                Top Category
              </p>
              <p className="text-base font-bold font-body mt-0.5">
                {topCategory.icon} {topCategory.name}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Pie Chart — Category Breakdown */}
      <motion.div
        className="bg-card rounded-2xl p-4 border border-border/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-sm font-bold font-display mb-3">
          Expense By Category
        </h2>
        {pieData.length === 0 ? (
          <p className="text-xs text-muted-foreground font-body text-center py-8">
            No expenses this month.
          </p>
        ) : (
          <>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, currency)}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-3">
              {pieData.map((item) => {
                const pct =
                  totalExpense > 0
                    ? ((item.value / totalExpense) * 100).toFixed(1)
                    : "0";
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-body flex-1">
                      {item.icon} {item.name}
                    </span>
                    <span className="text-xs font-body tabular-nums text-muted-foreground">
                      {pct}%
                    </span>
                    <span className="text-xs font-bold font-body tabular-nums">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>

      {/* Bar Chart — Monthly Trend */}
      <motion.div
        className="bg-card rounded-2xl p-4 border border-border/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-sm font-bold font-display mb-3">
          6-Month Trend
        </h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={2} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fontFamily: "DM Sans" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fontFamily: "DM Sans" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                  return v;
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value, currency),
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "10px", fontFamily: "DM Sans" }}
              />
              <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * TIPID — History Page
 * Calendar-based monthly transaction history view.
 */
import { useState, useMemo } from "react";
import { useTipidStore, formatCurrency } from "@/lib/store";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";

export default function History() {
  const { transactions, categories, settings, deleteTransaction } = useTipidStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0=Sun

  const monthTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= monthStart && d <= monthEnd;
      }),
    [transactions, monthStart, monthEnd]
  );

  const dayTotals = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    monthTransactions.forEach((t) => {
      const key = format(new Date(t.date), "yyyy-MM-dd");
      const existing = map.get(key) || { income: 0, expense: 0 };
      if (t.type === "income") existing.income += t.amount;
      else existing.expense += t.amount;
      map.set(key, existing);
    });
    return map;
  }, [monthTransactions]);

  const selectedTransactions = selectedDate
    ? transactions
        .filter((t) => isSameDay(new Date(t.date), selectedDate))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const monthIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success("Transaction deleted");
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <h1 className="text-2xl font-extrabold font-display mb-1">History</h1>
      <p className="text-sm text-muted-foreground font-body mb-5">Calendar View</p>

      {/* Month Navigator */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 rounded-lg hover:bg-accent active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold font-display">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 rounded-lg hover:bg-accent active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Month Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-body">Income</p>
          <p className="text-sm font-bold tabular-nums font-body text-emerald-700 dark:text-emerald-300">
            {formatCurrency(monthIncome, settings.currency)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
          <p className="text-[10px] text-red-600 dark:text-red-400 font-body">Expense</p>
          <p className="text-sm font-bold tabular-nums font-body text-red-700 dark:text-red-300">
            {formatCurrency(monthExpense, settings.currency)}
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-2xl border border-border/50 p-3 mb-5">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-[10px] text-muted-foreground font-body py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {daysInMonth.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const totals = dayTotals.get(key);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const hasData = !!totals;

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all active:scale-95 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-accent"
                }`}
              >
                <span className="font-body">{format(day, "d")}</span>
                {hasData && !isSelected && (
                  <div className="flex gap-0.5 mt-0.5">
                    {totals.income > 0 && (
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    )}
                    {totals.expense > 0 && (
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Transactions */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-bold font-display mb-3">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          {selectedTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body text-center py-6">
              No transactions on this day.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedTransactions.map((tx) => {
                const cat = categories.find((c) => c.id === tx.categoryId);
                return (
                  <div
                    key={tx.id}
                    className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: (cat?.color || "#64748b") + "20" }}
                    >
                      {cat?.icon || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold font-body truncate">{cat?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{tx.note || "—"}</p>
                    </div>
                    <p
                      className={`text-sm font-bold tabular-nums font-body ${
                        tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

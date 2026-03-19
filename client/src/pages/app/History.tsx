/**
 * TIPID — History Page
 * Calendar-based monthly transaction history view with search & filter.
 */
import { useState, useMemo } from "react";
import { useTipidStore, formatCurrency, type Transaction } from "@/lib/store";
import CategoryIcon from "@/components/CategoryIcon";
import EditTransactionDialog from "@/components/EditTransactionDialog";
import SwipeableRow from "@/components/SwipeableRow";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
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
  const { transactions, categories, settings, deleteTransaction } =
    useTipidStore();
  const { t, lang } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">(
    "all"
  );
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const monthTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= monthStart && d <= monthEnd;
      }),
    [transactions, monthStart, monthEnd]
  );

  // Filtered transactions (search + filters applied)
  const filteredMonthTransactions = useMemo(() => {
    return monthTransactions.filter((tx) => {
      // Type filter
      if (filterType !== "all" && tx.type !== filterType) return false;
      // Category filter
      if (filterCategoryId !== "all" && tx.categoryId !== filterCategoryId)
        return false;
      // Search filter (note or category name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cat = categories.find((c) => c.id === tx.categoryId);
        const matchNote = tx.note?.toLowerCase().includes(q);
        const matchCat = cat?.name.toLowerCase().includes(q);
        const matchAmount = tx.amount.toString().includes(q);
        if (!matchNote && !matchCat && !matchAmount) return false;
      }
      return true;
    });
  }, [monthTransactions, filterType, filterCategoryId, searchQuery, categories]);

  const dayTotals = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    filteredMonthTransactions.forEach((t) => {
      const key = format(new Date(t.date), "yyyy-MM-dd");
      const existing = map.get(key) || { income: 0, expense: 0 };
      if (t.type === "income") existing.income += t.amount;
      else existing.expense += t.amount;
      map.set(key, existing);
    });
    return map;
  }, [filteredMonthTransactions]);

  const selectedTransactions = selectedDate
    ? filteredMonthTransactions
        .filter((t) => isSameDay(new Date(t.date), selectedDate))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
    : [];

  const monthIncome = filteredMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const monthExpense = filteredMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);



  const hasActiveFilters =
    filterType !== "all" || filterCategoryId !== "all" || searchQuery.trim() !== "";

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategoryId("all");
    setSearchQuery("");
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <div className="px-5 pt-6 pb-4">
      <h1 className="text-2xl font-extrabold font-display mb-1">
        {t("navHistory")}
      </h1>
      <p className="text-sm text-muted-foreground font-body mb-4">
        {lang === "fil" ? "Calendar View" : "Calendar View"}
      </p>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            lang === "fil"
              ? "Hanapin ang transaction..."
              : "Search transactions..."
          }
          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-card border border-border/50 text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="bg-card rounded-xl border border-border/50 p-3 space-y-3">
              {/* Type Filter */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-body mb-1.5">
                  {lang === "fil" ? "Uri" : "Type"}
                </p>
                <div className="flex gap-1.5">
                  {(
                    [
                      { val: "all", label: lang === "fil" ? "Lahat" : "All" },
                      {
                        val: "expense",
                        label: lang === "fil" ? "Gastos" : "Expense",
                      },
                      {
                        val: "income",
                        label: lang === "fil" ? "Kita" : "Income",
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setFilterType(opt.val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-colors ${
                        filterType === opt.val
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-body mb-1.5">
                  {lang === "fil" ? "Kategorya" : "Category"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilterCategoryId("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-colors ${
                      filterCategoryId === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "fil" ? "Lahat" : "All"}
                  </button>
                  {(filterType === "all" || filterType === "expense"
                    ? expenseCategories
                    : []
                  )
                    .concat(
                      filterType === "all" || filterType === "income"
                        ? incomeCategories
                        : []
                    )
                    .map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCategoryId(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-colors flex items-center gap-1.5 ${
                          filterCategoryId === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <CategoryIcon
                          categoryId={cat.id}
                          iconName={cat.icon}
                          color={cat.color}
                          size="xs"
                        />
                        {cat.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-destructive font-semibold font-body"
                >
                  <X className="w-3 h-3" />
                  {lang === "fil" ? "I-clear ang Filters" : "Clear Filters"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Badge */}
      {hasActiveFilters && !showFilters && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold font-body">
            {filteredMonthTransactions.length}{" "}
            {lang === "fil" ? "na resulta" : "results"}
          </span>
          <button
            onClick={clearFilters}
            className="text-[10px] text-destructive font-semibold flex items-center gap-0.5"
          >
            <X className="w-3 h-3" />
            {lang === "fil" ? "I-clear" : "Clear"}
          </button>
        </div>
      )}

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
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-body">
            {t("dashIncome")}
          </p>
          <p className="text-sm font-bold tabular-nums font-body text-emerald-700 dark:text-emerald-300">
            {formatCurrency(monthIncome, settings.currency)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
          <p className="text-[10px] text-red-600 dark:text-red-400 font-body">
            {t("dashExpense")}
          </p>
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
            <div
              key={d}
              className="text-center text-[10px] text-muted-foreground font-body py-1"
            >
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
              {lang === "fil"
                ? "Walang transactions sa araw na ito."
                : "No transactions on this day."}
            </p>
          ) : (
            <div className="space-y-2">
              {selectedTransactions.map((tx) => {
                const cat = categories.find((c) => c.id === tx.categoryId);
                return (
                  <SwipeableRow
                    key={tx.id}
                    onEdit={() => setEditingTransaction(tx)}
                    onDelete={() => {
                      deleteTransaction(tx.id);
                      toast.success(lang === "fil" ? "Na-delete na ang transaction" : "Transaction deleted");
                    }}
                    deleteLabel={`${cat?.name || "Unknown"} — ${formatCurrency(tx.amount, tx.currency)}`}
                  >
                    <div className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3">
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
                          {tx.note || "—"}
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
                  </SwipeableRow>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* All Filtered Transactions (when no date selected but search/filter active) */}
      {!selectedDate && hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-bold font-display mb-3">
            {lang === "fil" ? "Mga Resulta ng Filter" : "Filter Results"}
          </h3>
          {filteredMonthTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body text-center py-6">
              {lang === "fil"
                ? "Walang nakitang transactions."
                : "No transactions found."}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredMonthTransactions
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((tx) => {
                  const cat = categories.find((c) => c.id === tx.categoryId);
                  return (
                    <SwipeableRow
                      key={tx.id}
                      onEdit={() => setEditingTransaction(tx)}
                      onDelete={() => {
                        deleteTransaction(tx.id);
                        toast.success(lang === "fil" ? "Na-delete na ang transaction" : "Transaction deleted");
                      }}
                      deleteLabel={`${cat?.name || "Unknown"} — ${formatCurrency(tx.amount, tx.currency)}`}
                    >
                      <div className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3">
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
                            {tx.note || format(new Date(tx.date), "MMM d")}
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
                    </SwipeableRow>
                  );
                })}
            </div>
          )}
        </motion.div>
      )}

      {/* Edit Transaction Dialog */}
      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}

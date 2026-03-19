/**
 * TIPID — Recurring Transactions
 * Manage auto-repeating expenses/income (rent, subscriptions, bills).
 * Design: Tarsi-inspired green cards, Nunito display font.
 */
import { useState, useEffect } from "react";
import { useTipidStore, formatCurrency, type RecurringEntry } from "@/lib/store";
import CategoryIcon from "@/components/CategoryIcon";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  X,
  Repeat,
  Pause,
  Play,
  Trash2,
  CalendarClock,
} from "lucide-react";

const FREQUENCIES: { value: RecurringEntry["frequency"]; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function Recurring() {
  const {
    recurringEntries,
    categories,
    accounts,
    settings,
    addRecurring,
    updateRecurring,
    deleteRecurring,
    processRecurring,
  } = useTipidStore();
  const [, navigate] = useLocation();
  const [showAdd, setShowAdd] = useState(false);

  // Process recurring entries on mount
  useEffect(() => {
    processRecurring();
  }, [processRecurring]);

  // Add form state
  const [type, setType] = useState<"expense" | "income">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<RecurringEntry["frequency"]>("monthly");
  const [note, setNote] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const filteredCategories = categories.filter((c) => c.type === type);

  function handleAdd() {
    if (!categoryId || !amount || parseFloat(amount) <= 0 || !accountId) return;
    addRecurring({
      amount: parseFloat(amount),
      type,
      categoryId,
      accountId,
      note,
      frequency,
      nextDue: new Date(startDate).toISOString(),
      currency: settings.currency,
      active: true,
    });
    setShowAdd(false);
    setAmount("");
    setNote("");
    setCategoryId("");
  }

  function toggleActive(entry: RecurringEntry) {
    updateRecurring(entry.id, { active: !entry.active });
  }

  function formatNextDue(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app")}
            className="w-8 h-8 rounded-full bg-card border border-border/50 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold font-display">Recurring</h1>
            <p className="text-xs text-muted-foreground font-body">
              Auto-Repeating Entries
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* List */}
      {recurringEntries.length === 0 ? (
        <div className="text-center py-16">
          <Repeat className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground font-body">
            No recurring entries yet. Tap + to add one!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recurringEntries.map((entry) => {
            const cat = categories.find((c) => c.id === entry.categoryId);
            const acc = accounts.find((a) => a.id === entry.accountId);
            return (
              <motion.div
                key={entry.id}
                layout
                className={`bg-card rounded-2xl p-4 border border-border/50 ${
                  !entry.active ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <CategoryIcon
                    categoryId={entry.categoryId}
                    iconName={cat?.icon}
                    color={cat?.color}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold font-body truncate">
                        {cat?.name || "Unknown"}
                      </p>
                      <p
                        className={`text-sm font-bold tabular-nums font-body ${
                          entry.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                        }`}
                      >
                        {entry.type === "income" ? "+" : "-"}
                        {formatCurrency(entry.amount, entry.currency)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                        {entry.frequency}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {acc?.name || ""}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {entry.note}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1.5">
                      <CalendarClock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Next: {formatNextDue(entry.nextDue)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-border/30">
                  <button
                    onClick={() => toggleActive(entry)}
                    className="flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg"
                  >
                    {entry.active ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Resume
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteRecurring(entry.id)}
                    className="flex items-center gap-1 text-xs font-body text-destructive hover:text-destructive/80 transition-colors px-2 py-1 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Dialog */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              className="relative w-full max-w-[430px] bg-card rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold font-display">
                  New Recurring Entry
                </h2>
                <button onClick={() => setShowAdd(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Type Toggle */}
              <div className="flex gap-2 mb-4">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setType(t);
                      setCategoryId("");
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold font-body transition-colors ${
                      type === t
                        ? t === "expense"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {t === "expense" ? "Expense" : "Income"}
                  </button>
                ))}
              </div>

              {/* Category */}
              <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
                Category
              </p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-body transition-colors border ${
                      categoryId === cat.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-muted/50"
                    }`}
                  >
                    <CategoryIcon categoryId={cat.id} iconName={cat.icon} color={cat.color} size="sm" />
                    <span className="truncate w-full text-center text-[10px]">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Account */}
              <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
                Account
              </p>
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setAccountId(acc.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-body whitespace-nowrap border transition-colors ${
                      accountId === acc.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-muted/50"
                    }`}
                  >
                    <span>{acc.icon}</span>
                    {acc.name}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
                Amount
              </p>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-body mb-4 outline-none focus:border-primary"
              />

              {/* Frequency */}
              <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
                Frequency
              </p>
              <div className="flex gap-2 mb-4">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFrequency(f.value)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-body transition-colors border ${
                      frequency === f.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Start Date */}
              <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
                Start Date
              </p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-body mb-4 outline-none focus:border-primary"
              />

              {/* Note */}
              <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
                Note (Optional)
              </p>
              <input
                type="text"
                placeholder="e.g. Netflix subscription"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-body mb-6 outline-none focus:border-primary"
              />

              <button
                onClick={handleAdd}
                disabled={!categoryId || !amount || parseFloat(amount) <= 0}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold font-display text-sm disabled:opacity-40 active:scale-[0.98] transition-transform"
              >
                Add Recurring Entry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * TIPID — Budgets Page
 * Set monthly budgets per category and track spending.
 */
import { useState, useMemo } from "react";
import { useTipidStore, formatCurrency } from "@/lib/store";
import CategoryIcon from "@/components/CategoryIcon";
import { motion } from "framer-motion";
import { Plus, X, Check, Trash2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Budgets() {
  const { budgets, categories, transactions, settings, addBudget, updateBudget, deleteBudget } = useTipidStore();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ categoryId: "", limit: "" });

  const expenseCategories = categories.filter((c) => c.type === "expense");

  // Current month spending per category
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthSpending = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => {
        const d = new Date(t.date);
        return t.type === "expense" && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .forEach((t) => {
        map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
      });
    return map;
  }, [transactions, currentMonth, currentYear]);

  const handleSave = () => {
    if (!form.categoryId) {
      toast.error("Select a category");
      return;
    }
    const limit = parseFloat(form.limit);
    if (!limit || limit <= 0) {
      toast.error("Enter a valid budget amount");
      return;
    }
    if (editId) {
      updateBudget(editId, { categoryId: form.categoryId, limit });
      toast.success("Budget updated!");
    } else {
      addBudget({ categoryId: form.categoryId, limit, period: "monthly", currency: settings.currency });
      toast.success("Budget added!");
    }
    setShowForm(false);
    setEditId(null);
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate("/app")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold font-display">Budgets</h1>
          <p className="text-sm text-muted-foreground font-body">Monthly Spending Limits</p>
        </div>
        <button
          onClick={() => { setForm({ categoryId: "", limit: "" }); setEditId(null); setShowForm(true); }}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-muted-foreground font-body">
            No budgets set. Tap + to create one!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((b, i) => {
            const cat = categories.find((c) => c.id === b.categoryId);
            const spent = monthSpending.get(b.categoryId) || 0;
            const pct = Math.min((spent / b.limit) * 100, 100);
            const isOver = spent > b.limit;

            return (
              <motion.div
                key={b.id}
                className="bg-card rounded-2xl p-4 border border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <CategoryIcon
                    categoryId={b.categoryId}
                    iconName={cat?.icon}
                    color={cat?.color}
                    size="md"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold font-body">{cat?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      {formatCurrency(spent, settings.currency)} / {formatCurrency(b.limit, settings.currency)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteBudget(b.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isOver ? "bg-destructive" : "bg-primary"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                {isOver && (
                  <p className="text-xs text-destructive mt-1 font-body">
                    Over budget by {formatCurrency(spent - b.limit, settings.currency)}!
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowForm(false)}
        >
          <motion.div
            className="bg-card w-full max-w-[430px] rounded-t-3xl max-h-[85vh] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-3">
              <h2 className="text-lg font-bold font-display">
                {editId ? "Edit Budget" : "New Budget"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold font-body mb-2 block">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {expenseCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setForm({ ...form, categoryId: cat.id })}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all active:scale-95 ${
                          form.categoryId === cat.id
                            ? "bg-primary/15 border-2 border-primary"
                            : "bg-background border border-border"
                        }`}
                      >
                        <CategoryIcon categoryId={cat.id} iconName={cat.icon} color={cat.color} size="sm" />
                        <span className="text-[9px] font-body truncate w-full text-center">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold font-body mb-1 block">Monthly Limit</label>
                  <input
                    type="number"
                    value={form.limit}
                    onChange={(e) => setForm({ ...form, limit: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 pt-3 border-t border-border bg-card">
              <button
                onClick={handleSave}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold font-display flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Check className="w-5 h-5" />
                {editId ? "Update Budget" : "Add Budget"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

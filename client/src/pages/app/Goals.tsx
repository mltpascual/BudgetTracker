/**
 * TIPID — Goals Page
 * Savings goals with progress tracking.
 */
import { useState } from "react";
import { useTipidStore, formatCurrency } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, X, Check, Trash2, ArrowLeft, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Goals() {
  const { goals, settings, addGoal, updateGoal, deleteGoal } = useTipidStore();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [addAmountId, setAddAmountId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    note: "",
  });

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Enter a goal name"); return; }
    const target = parseFloat(form.targetAmount);
    if (!target || target <= 0) { toast.error("Enter a valid target amount"); return; }
    addGoal({
      name: form.name,
      targetAmount: target,
      currentAmount: parseFloat(form.currentAmount) || 0,
      deadline: form.deadline || "",
      note: form.note,
      currency: settings.currency,
    });
    toast.success("Goal added!");
    setShowForm(false);
    setForm({ name: "", targetAmount: "", currentAmount: "0", deadline: "", note: "" });
  };

  const handleAddToGoal = (id: string) => {
    const amt = parseFloat(addAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    updateGoal(id, { currentAmount: goal.currentAmount + amt });
    toast.success(`Added ${formatCurrency(amt, settings.currency)} to ${goal.name}!`);
    setAddAmountId(null);
    setAddAmount("");
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate("/app")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold font-display">Goals</h1>
          <p className="text-sm text-muted-foreground font-body">Savings Targets</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-10">
          <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground font-body">
            No goals yet. Start saving for something!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((g, i) => {
            const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
            const isComplete = g.currentAmount >= g.targetAmount;

            return (
              <motion.div
                key={g.id}
                className="bg-card rounded-2xl p-4 border border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold font-body">{g.name}</p>
                    {g.deadline && (
                      <p className="text-xs text-muted-foreground font-body">
                        Due: {new Date(g.deadline).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-body">
                    {formatCurrency(g.currentAmount, settings.currency)} / {formatCurrency(g.targetAmount, settings.currency)}
                  </p>
                  <p className="text-xs font-bold font-body text-primary">{pct.toFixed(0)}%</p>
                </div>

                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${isComplete ? "bg-emerald-500" : "bg-primary"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {!isComplete && (
                  addAmountId === g.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        placeholder="Amount"
                        className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-body"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddToGoal(g.id)}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold active:scale-95"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setAddAmountId(null); setAddAmount(""); }}
                        className="px-3 py-2 bg-muted rounded-xl text-sm font-body"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddAmountId(g.id)}
                      className="w-full py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold font-body active:scale-[0.98] transition-transform"
                    >
                      + Add Savings
                    </button>
                  )
                )}

                {isComplete && (
                  <p className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-bold font-body">
                    Goal Reached!
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Goal Form */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-[60] flex items-end justify-center"
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
              <h2 className="text-lg font-bold font-display">New Goal</h2>
              <button onClick={() => setShowForm(false)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold font-body mb-1 block">Goal Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. New Laptop"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold font-body mb-1 block">Target Amount</label>
                  <input
                    type="number"
                    value={form.targetAmount}
                    onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold font-body mb-1 block">Starting Amount (Optional)</label>
                  <input
                    type="number"
                    value={form.currentAmount}
                    onChange={(e) => setForm({ ...form, currentAmount: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold font-body mb-1 block">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
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
                Create Goal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * TIPID — Debts Page
 * Track debts (I owe someone) and receivables (someone owes me).
 */
import { useState } from "react";
import { useTipidStore, formatCurrency } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, X, Check, Trash2, ArrowLeft, HandCoins } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Debts() {
  const { debts, settings, addDebt, updateDebt, deleteDebt } = useTipidStore();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"owe" | "owed">("owe");
  const [payId, setPayId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [form, setForm] = useState({
    name: "",
    totalAmount: "",
    paidAmount: "0",
    dueDate: "",
    note: "",
    type: "owe" as "owe" | "owed",
  });

  const filteredDebts = debts.filter((d) => d.type === tab);

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Enter a name"); return; }
    const total = parseFloat(form.totalAmount);
    if (!total || total <= 0) { toast.error("Enter a valid amount"); return; }
    addDebt({
      name: form.name,
      totalAmount: total,
      paidAmount: parseFloat(form.paidAmount) || 0,
      dueDate: form.dueDate || "",
      note: form.note,
      type: form.type,
      currency: settings.currency,
    });
    toast.success(form.type === "owe" ? "Debt added!" : "Receivable added!");
    setShowForm(false);
    setForm({ name: "", totalAmount: "", paidAmount: "0", dueDate: "", note: "", type: tab });
  };

  const handlePay = (id: string) => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    const debt = debts.find((d) => d.id === id);
    if (!debt) return;
    const newPaid = Math.min(debt.paidAmount + amt, debt.totalAmount);
    updateDebt(id, { paidAmount: newPaid });
    toast.success(`Payment of ${formatCurrency(amt, settings.currency)} recorded!`);
    setPayId(null);
    setPayAmount("");
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate("/app")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold font-display">Debts</h1>
          <p className="text-sm text-muted-foreground font-body">Track What You Owe & Are Owed</p>
        </div>
        <button
          onClick={() => { setForm({ ...form, type: tab }); setShowForm(true); }}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-destructive/10 rounded-xl p-3">
          <p className="text-[10px] text-destructive font-body font-semibold uppercase tracking-wide">I Owe</p>
          <p className="text-lg font-extrabold font-display tabular-nums text-destructive">
            {formatCurrency(debts.filter(d => d.type === "owe").reduce((s, d) => s + (d.totalAmount - d.paidAmount), 0), settings.currency)}
          </p>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-3">
          <p className="text-[10px] text-emerald-600 font-body font-semibold uppercase tracking-wide">Owed To Me</p>
          <p className="text-lg font-extrabold font-display tabular-nums text-emerald-600">
            {formatCurrency(debts.filter(d => d.type === "owed").reduce((s, d) => s + (d.totalAmount - d.paidAmount), 0), settings.currency)}
          </p>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="bg-muted rounded-xl p-1 flex mb-5">
        {(["owe", "owed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold font-body transition-all ${
              tab === t
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {t === "owe" ? "I Owe" : "Owed To Me"}
          </button>
        ))}
      </div>

      {filteredDebts.length === 0 ? (
        <div className="text-center py-10">
          <HandCoins className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground font-body">
            {tab === "owe" ? "No debts. You're debt-free!" : "No one owes you money."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDebts.map((d, i) => {
            const remaining = d.totalAmount - d.paidAmount;
            const pct = (d.paidAmount / d.totalAmount) * 100;
            const isPaid = d.paidAmount >= d.totalAmount;

            return (
              <motion.div
                key={d.id}
                className="bg-card rounded-2xl p-4 border border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold font-body">{d.name}</p>
                    {d.dueDate && (
                      <p className="text-xs text-muted-foreground font-body">
                        Due: {new Date(d.dueDate).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                    {d.note && <p className="text-xs text-muted-foreground font-body mt-0.5">{d.note}</p>}
                  </div>
                  <button onClick={() => deleteDebt(d.id)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-body">
                      Paid: {formatCurrency(d.paidAmount, d.currency)}
                    </p>
                    <p className="text-sm font-bold tabular-nums font-body">
                      {isPaid ? "Fully Paid" : `${formatCurrency(remaining, d.currency)} remaining`}
                    </p>
                  </div>
                  <p className="text-lg font-extrabold tabular-nums font-display">
                    {formatCurrency(d.totalAmount, d.currency)}
                  </p>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${isPaid ? "bg-emerald-500" : "bg-primary"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {!isPaid && (
                  payId === d.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        placeholder="Amount"
                        className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-body"
                        autoFocus
                      />
                      <button
                        onClick={() => handlePay(d.id)}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold active:scale-95"
                      >
                        Pay
                      </button>
                      <button
                        onClick={() => { setPayId(null); setPayAmount(""); }}
                        className="px-3 py-2 bg-muted rounded-xl text-sm font-body"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPayId(d.id)}
                      className="w-full py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold font-body active:scale-[0.98] transition-transform"
                    >
                      {tab === "owe" ? "Record Payment" : "Record Collection"}
                    </button>
                  )
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowForm(false)}
        >
          <motion.div
            className="bg-card w-full max-w-[430px] rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold font-display">
                {form.type === "owe" ? "New Debt" : "New Receivable"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold font-body mb-1 block">
                  {form.type === "owe" ? "Who Do You Owe?" : "Who Owes You?"}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Juan"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                />
              </div>
              <div>
                <label className="text-sm font-semibold font-body mb-1 block">Total Amount</label>
                <input
                  type="number"
                  value={form.totalAmount}
                  onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                />
              </div>
              <div>
                <label className="text-sm font-semibold font-body mb-1 block">Due Date (Optional)</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                />
              </div>
              <div>
                <label className="text-sm font-semibold font-body mb-1 block">Note (Optional)</label>
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="e.g. For birthday party"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold font-display flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Check className="w-5 h-5" />
                {form.type === "owe" ? "Add Debt" : "Add Receivable"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

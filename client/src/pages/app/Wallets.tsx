/**
 * TIPID — Wallets Page
 * Manage multiple accounts (cash, bank, e-wallet).
 */
import { useState } from "react";
import { useTipidStore, formatCurrency, generateId, type Account, type AccountType } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, Wallet, ArrowRightLeft } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const ACCOUNT_ICONS: Record<AccountType, string> = {
  cash: "💵",
  bank: "🏦",
  ewallet: "📱",
  credit: "💳",
};

const ACCOUNT_COLORS: Record<AccountType, string> = {
  cash: "#22c55e",
  bank: "#0ea5e9",
  ewallet: "#8b5cf6",
  credit: "#f97316",
};

export default function Wallets() {
  const { accounts, settings, addAccount, updateAccount, deleteAccount, transactions } = useTipidStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", type: "cash" as AccountType, balance: "0" });

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const openAdd = () => {
    setForm({ name: "", type: "cash", balance: "0" });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (acc: Account) => {
    setForm({ name: acc.name, type: acc.type, balance: acc.balance.toString() });
    setEditId(acc.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Please enter an account name");
      return;
    }
    if (editId) {
      updateAccount(editId, {
        name: form.name,
        type: form.type,
        balance: parseFloat(form.balance) || 0,
        icon: ACCOUNT_ICONS[form.type],
        color: ACCOUNT_COLORS[form.type],
      });
      toast.success("Account updated!");
    } else {
      addAccount({
        name: form.name,
        type: form.type,
        balance: parseFloat(form.balance) || 0,
        currency: settings.currency,
        icon: ACCOUNT_ICONS[form.type],
        color: ACCOUNT_COLORS[form.type],
      });
      toast.success("Account added!");
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const hasTransactions = transactions.some((t) => t.accountId === id);
    if (hasTransactions) {
      toast.error("Cannot delete account with transactions");
      return;
    }
    deleteAccount(id);
    toast.success("Account deleted");
  };

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold font-display">Wallets</h1>
          <p className="text-sm text-muted-foreground font-body">Manage Your Accounts</p>
        </div>
        <button
          onClick={openAdd}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Total Balance */}
      <motion.div
        className="bg-primary rounded-2xl p-5 text-primary-foreground mb-5 shadow-lg shadow-primary/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm opacity-80 font-body">Total Balance</p>
        <p className="text-3xl font-extrabold font-display tabular-nums mt-1">
          {formatCurrency(totalBalance, settings.currency)}
        </p>
        <Link href="/app/transfer">
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold font-body active:scale-95 transition-transform">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Transfer Between Wallets
          </div>
        </Link>
      </motion.div>

      {/* Account List */}
      <div className="space-y-3">
        {accounts.map((acc, i) => (
          <motion.div
            key={acc.id}
            className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: acc.color + "20" }}
            >
              {acc.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold font-body">{acc.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{acc.type === 'ewallet' ? 'E-Wallet' : acc.type === 'credit' ? 'Credit Card' : acc.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold tabular-nums font-body">
                {formatCurrency(acc.balance, acc.currency)}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(acc)} className="p-1.5 rounded-lg hover:bg-accent">
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button onClick={() => handleDelete(acc.id)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-10">
          <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground font-body">No accounts yet. Add one to get started!</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowForm(false)}
        >
          <motion.div
            className="bg-card w-full max-w-[430px] rounded-t-3xl p-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold font-display">
                {editId ? "Edit Account" : "New Account"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold font-body mb-1 block">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. BDO Savings"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                />
              </div>

              <div>
                <label className="text-sm font-semibold font-body mb-1 block">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["cash", "bank", "ewallet", "credit"] as AccountType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        form.type === t
                          ? "bg-primary/15 border-2 border-primary"
                          : "bg-background border border-border"
                      }`}
                    >
                      <span className="text-xl">{ACCOUNT_ICONS[t]}</span>
                      <span className="text-[10px] capitalize font-body">{t === "ewallet" ? "E-Wallet" : t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold font-body mb-1 block">Initial Balance</label>
                <input
                  type="number"
                  value={form.balance}
                  onChange={(e) => setForm({ ...form, balance: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold font-display flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Check className="w-5 h-5" />
                {editId ? "Update Account" : "Add Account"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

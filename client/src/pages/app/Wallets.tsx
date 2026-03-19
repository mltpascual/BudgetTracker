/**
 * TIPID — Wallets Page
 * Manage multiple accounts (cash, bank, e-wallet).
 * Uses Lucide SVG icons with colored tinted backgrounds.
 */
import { useState } from "react";
import { useTipidStore, formatCurrency, generateId, type Account, type AccountType } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, Check, Wallet, ArrowRightLeft,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import AccountTypeIcon, { ACCOUNT_TYPE_CONFIG } from "@/components/AccountTypeIcon";

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
    const config = ACCOUNT_TYPE_CONFIG[form.type];
    if (editId) {
      updateAccount(editId, {
        name: form.name,
        type: form.type,
        balance: parseFloat(form.balance) || 0,
        icon: form.type,
        color: config.color,
      });
      toast.success("Account updated!");
    } else {
      addAccount({
        name: form.name,
        type: form.type,
        balance: parseFloat(form.balance) || 0,
        currency: settings.currency,
        icon: form.type,
        color: config.color,
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
            <AccountTypeIcon type={acc.type} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold font-body">{acc.name}</p>
              <p className="text-xs text-muted-foreground">{ACCOUNT_TYPE_CONFIG[acc.type]?.label || acc.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold tabular-nums font-body">
                {formatCurrency(acc.balance, settings.currency)}
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
            className="bg-card w-full max-w-[430px] rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
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
                  {(["cash", "bank", "ewallet", "credit"] as AccountType[]).map((t) => {
                    const config = ACCOUNT_TYPE_CONFIG[t];
                    return (
                      <button
                        key={t}
                        onClick={() => setForm({ ...form, type: t })}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                          form.type === t
                            ? "bg-primary/15 border-2 border-primary"
                            : "bg-background border border-border"
                        }`}
                      >
                        <AccountTypeIcon type={t} size="md" />
                        <span className="text-[10px] font-semibold font-body">{config.label}</span>
                      </button>
                    );
                  })}
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

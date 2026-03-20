/**
 * TIPID — Edit Transaction Dialog
 * Allows editing amount, category, note, and date of an existing transaction.
 */
import { useState, useEffect } from "react";
import { useTipidStore, type Transaction } from "@/lib/store";
import CategoryIcon from "@/components/CategoryIcon";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { format } from "date-fns";

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function EditTransactionDialog({
  transaction,
  onClose,
}: EditTransactionDialogProps) {
  const { categories, accounts, updateTransaction, deleteTransaction } =
    useTipidStore();
  const { lang } = useLanguage();

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setCategoryId(transaction.categoryId);
      setAccountId(transaction.accountId);
      setNote(transaction.note);
      setDate(format(new Date(transaction.date), "yyyy-MM-dd"));
      setType(transaction.type);
    }
  }, [transaction]);

  if (!transaction) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error(
        lang === "fil" ? "Maglagay ng valid na amount" : "Enter a valid amount"
      );
      return;
    }

    // Reverse old transaction effect on account balance
    const oldTx = transaction;
    const store = useTipidStore.getState();
    const account = store.accounts.find((a) => a.id === oldTx.accountId);
    if (account) {
      const reversal =
        oldTx.type === "income" ? -oldTx.amount : oldTx.amount;
      store.updateAccount(oldTx.accountId, {
        balance: account.balance + reversal,
      });
    }

    // Apply new transaction effect on account balance
    const newAccount = store.accounts.find((a) => a.id === accountId);
    if (newAccount) {
      const effect = type === "income" ? parsedAmount : -parsedAmount;
      // Re-read in case same account was just updated
      const freshAccount = useTipidStore.getState().accounts.find((a) => a.id === accountId);
      if (freshAccount) {
        store.updateAccount(accountId, {
          balance: freshAccount.balance + effect,
        });
      }
    }

    updateTransaction(transaction.id, {
      amount: parsedAmount,
      type,
      categoryId,
      accountId,
      note,
      date: new Date(date).toISOString(),
    });

    toast.success(
      lang === "fil"
        ? "Na-update na ang transaction"
        : "Transaction updated"
    );
    onClose();
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    toast.success(
      lang === "fil"
        ? "Na-delete na ang transaction"
        : "Transaction deleted"
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-background rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold font-display">
              {lang === "fil" ? "I-edit ang Transaction" : "Edit Transaction"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-accent"
            >
              <X className="w-5 h-5" />
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
                      ? "bg-red-500 text-white"
                      : "bg-emerald-500 text-white"
                    : "bg-accent text-muted-foreground"
                }`}
              >
                {t === "expense"
                  ? lang === "fil"
                    ? "Gastos"
                    : "Expense"
                  : lang === "fil"
                  ? "Kita"
                  : "Income"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
              {lang === "fil" ? "Halaga" : "Amount"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 text-lg font-bold tabular-nums font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
              {lang === "fil" ? "Kategorya" : "Category"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    categoryId === cat.id
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "bg-card hover:bg-accent"
                  }`}
                >
                  <CategoryIcon
                    categoryId={cat.id}
                    iconName={cat.icon}
                    color={cat.color}
                    size="sm"
                  />
                  <span className="text-[10px] font-body truncate w-full text-center">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className="mb-4">
            <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
              {lang === "fil" ? "Account" : "Account"}
            </label>
            <div className="flex gap-2 flex-wrap">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAccountId(acc.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold font-body transition-colors ${
                    accountId === acc.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {acc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
              {lang === "fil" ? "Petsa" : "Date"}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
              {lang === "fil" ? "Tala" : "Note"}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder={
                lang === "fil" ? "Magdagdag ng tala..." : "Add a note..."
              }
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-xl bg-destructive/10 text-destructive font-bold font-body text-sm hover:bg-destructive/20 transition-colors"
            >
              {lang === "fil" ? "I-delete" : "Delete"}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold font-body text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {lang === "fil" ? "I-save" : "Save"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

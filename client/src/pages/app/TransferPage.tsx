/**
 * TIPID — Transfer Between Wallets
 * Move money between accounts without logging as expense/income.
 * Design: Tarsi-inspired green cards, Nunito display font.
 */
import { useState } from "react";
import { useTipidStore, formatCurrency } from "@/lib/store";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRightLeft,
  ArrowDown,
  Trash2,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function TransferPage() {
  const { accounts, transfers, settings, addTransfer, deleteTransfer } =
    useTipidStore();
  const [, navigate] = useLocation();
  const currency = settings.currency;

  const [fromId, setFromId] = useState(accounts[0]?.id || "");
  const [toId, setToId] = useState(accounts[1]?.id || accounts[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  function handleTransfer() {
    const amt = parseFloat(amount);
    if (!fromId || !toId || fromId === toId || !amt || amt <= 0) {
      toast.error("Please select different accounts and enter a valid amount.");
      return;
    }
    const fromAcc = accounts.find((a) => a.id === fromId);
    if (fromAcc && fromAcc.balance < amt) {
      toast.error(`Insufficient balance in ${fromAcc.name}.`);
      return;
    }
    addTransfer({
      fromAccountId: fromId,
      toAccountId: toId,
      amount: amt,
      date: new Date().toISOString(),
      note,
      currency,
    });
    toast.success("Transfer completed!");
    setAmount("");
    setNote("");
  }

  function swapAccounts() {
    setFromId(toId);
    setToId(fromId);
  }

  const fromAcc = accounts.find((a) => a.id === fromId);
  const toAcc = accounts.find((a) => a.id === toId);

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/app/wallets")}
          className="w-8 h-8 rounded-full bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold font-display">Transfer</h1>
          <p className="text-xs text-muted-foreground font-body">
            Move Money Between Wallets
          </p>
        </div>
      </div>

      {/* Transfer Form */}
      <motion.div
        className="bg-card rounded-2xl p-5 border border-border/50 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* From Account */}
        <div>
          <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
            From
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setFromId(acc.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body whitespace-nowrap border transition-colors flex-shrink-0 ${
                  fromId === acc.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-muted/50 text-foreground"
                }`}
              >
                <span>{acc.icon}</span>
                <div className="text-left">
                  <p className="font-semibold">{acc.name}</p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">
                    {formatCurrency(acc.balance, acc.currency)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapAccounts}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4 text-muted-foreground rotate-90" />
          </button>
        </div>

        {/* To Account */}
        <div>
          <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
            To
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setToId(acc.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body whitespace-nowrap border transition-colors flex-shrink-0 ${
                  toId === acc.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-muted/50 text-foreground"
                }`}
              >
                <span>{acc.icon}</span>
                <div className="text-left">
                  <p className="font-semibold">{acc.name}</p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">
                    {formatCurrency(acc.balance, acc.currency)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
            Amount
          </p>
          <input
            type="number"
            placeholder="e.g. 1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-body outline-none focus:border-primary tabular-nums"
          />
        </div>

        {/* Note */}
        <div>
          <p className="text-xs font-semibold font-body text-muted-foreground mb-2">
            Note (Optional)
          </p>
          <input
            type="text"
            placeholder="e.g. ATM withdrawal"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-body outline-none focus:border-primary"
          />
        </div>

        {/* Preview */}
        {fromId && toId && fromId !== toId && amount && parseFloat(amount) > 0 && (
          <motion.div
            className="bg-primary/5 rounded-xl p-3 border border-primary/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-body">
              <span className="font-semibold">{fromAcc?.icon} {fromAcc?.name}</span>
              <ArrowDown className="w-3.5 h-3.5 text-primary rotate-[-90deg]" />
              <span className="font-bold text-primary">
                {formatCurrency(parseFloat(amount), currency)}
              </span>
              <ArrowDown className="w-3.5 h-3.5 text-primary rotate-[-90deg]" />
              <span className="font-semibold">{toAcc?.icon} {toAcc?.name}</span>
            </div>
          </motion.div>
        )}

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={
            !fromId || !toId || fromId === toId || !amount || parseFloat(amount) <= 0
          }
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold font-display text-sm disabled:opacity-40 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Transfer Now
        </button>
      </motion.div>

      {/* Transfer History */}
      {transfers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-bold font-display mb-3">
            Transfer History
          </h2>
          <div className="space-y-2">
            {[...transfers]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((tr) => {
                const from = accounts.find((a) => a.id === tr.fromAccountId);
                const to = accounts.find((a) => a.id === tr.toAccountId);
                return (
                  <div
                    key={tr.id}
                    className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold font-body">
                        {from?.icon} {from?.name || "?"} → {to?.icon}{" "}
                        {to?.name || "?"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tr.date).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {tr.note ? ` · ${tr.note}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold tabular-nums font-body text-primary">
                        {formatCurrency(tr.amount, tr.currency)}
                      </p>
                      <button
                        onClick={() => {
                          deleteTransfer(tr.id);
                          toast.success("Transfer reversed.");
                        }}
                        className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

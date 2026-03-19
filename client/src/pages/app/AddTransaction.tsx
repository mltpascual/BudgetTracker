/**
 * TIPID — Add Transaction
 * Calculator-style numpad for quick expense/income entry (Tarsi-inspired).
 */
import { useState, useCallback } from "react";
import { useTipidStore, formatCurrency } from "@/lib/store";
import CategoryIcon from "@/components/CategoryIcon";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Delete } from "lucide-react";
import { toast } from "sonner";

export default function AddTransaction() {
  const { categories, accounts, settings, addTransaction } = useTipidStore();
  const [, navigate] = useLocation();

  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [step, setStep] = useState<"amount" | "details">("amount");

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleNumpad = useCallback((key: string) => {
    setAmount((prev) => {
      if (key === "C") return "0";
      if (key === "⌫") return prev.length <= 1 ? "0" : prev.slice(0, -1);
      if (key === ".") {
        if (prev.includes(".")) return prev;
        return prev + ".";
      }
      // Limit decimal places to 2
      if (prev.includes(".") && prev.split(".")[1].length >= 2) return prev;
      if (prev === "0" && key !== ".") return key;
      return prev + key;
    });
  }, []);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      toast.error("Please enter an amount greater than 0");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!accountId) {
      toast.error("Please select an account");
      return;
    }

    addTransaction({
      amount: numAmount,
      type,
      categoryId,
      accountId,
      date: new Date(date).toISOString(),
      note,
      currency: settings.currency,
    });

    toast.success(
      type === "expense" ? "Expense added!" : "Income added!",
      { description: `${formatCurrency(numAmount, settings.currency)} recorded.` }
    );
    navigate("/app");
  };

  const numpadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 6rem)' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/app")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold font-display">Add Transaction</h1>
      </div>

      {/* Type Toggle */}
      <div className="px-5 mb-4">
        <div className="bg-muted rounded-xl p-1 flex">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); setCategoryId(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold font-body transition-all ${
                type === t
                  ? t === "expense"
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {t === "expense" ? "Expense" : "Income"}
            </button>
          ))}
        </div>
      </div>

      {step === "amount" ? (
        <>
          {/* Amount Display */}
          <div className="px-5 py-4 text-center flex-1 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground font-body mb-1">Amount</p>
            <motion.p
              key={amount}
              className="text-4xl font-extrabold font-display tabular-nums text-foreground"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
            >
              {formatCurrency(parseFloat(amount || "0"), settings.currency)}
            </motion.p>
          </div>

          {/* Numpad */}
          <div className="px-5 pb-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {numpadKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => handleNumpad(key)}
                  className={`h-14 rounded-xl text-xl font-semibold font-display transition-all active:scale-95 ${
                    key === "⌫"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-card border border-border/50 text-foreground hover:bg-accent"
                  }`}
                >
                  {key === "⌫" ? <Delete className="w-5 h-5 mx-auto" /> : key}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (parseFloat(amount) <= 0) {
                  toast.error("Enter an amount first");
                  return;
                }
                setStep("details");
              }}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold font-display text-base active:scale-[0.98] transition-transform"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        /* Details Step */
        <div className="px-5 flex-1 flex flex-col">
          {/* Amount summary */}
          <div className="text-center mb-5">
            <button onClick={() => setStep("amount")} className="text-primary text-sm font-semibold">
              {formatCurrency(parseFloat(amount), settings.currency)} — tap to edit
            </button>
          </div>

          {/* Category Selection */}
          <div className="mb-5">
            <p className="text-sm font-semibold font-body mb-2 text-foreground">Category</p>
            <div className="grid grid-cols-4 gap-2">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all active:scale-95 ${
                    categoryId === cat.id
                      ? "bg-primary/15 border-2 border-primary"
                      : "bg-card border border-border/50"
                  }`}
                >
                  <CategoryIcon categoryId={cat.id} iconName={cat.icon} color={cat.color} size="sm" />
                  <span className="text-[10px] font-body text-foreground truncate w-full text-center">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Selection */}
          <div className="mb-5">
            <p className="text-sm font-semibold font-body mb-2 text-foreground">Account</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAccountId(acc.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all active:scale-95 ${
                    accountId === acc.id
                      ? "bg-primary/15 border-2 border-primary"
                      : "bg-card border border-border/50"
                  }`}
                >
                  <span>{acc.icon}</span>
                  <span className="text-sm font-body font-medium">{acc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="mb-4">
            <p className="text-sm font-semibold font-body mb-2 text-foreground">Date</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-card border border-border/50 rounded-xl px-4 py-3 text-sm font-body text-foreground"
            />
          </div>

          {/* Note */}
          <div className="mb-6">
            <p className="text-sm font-semibold font-body mb-2 text-foreground">Note (Optional)</p>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Lunch sa Jollibee"
              className="w-full bg-card border border-border/50 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Submit */}
          <div className="mt-auto pb-6">
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold font-display text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Check className="w-5 h-5" />
              Save {type === "expense" ? "Expense" : "Income"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

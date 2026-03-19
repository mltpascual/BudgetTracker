/**
 * TIPID — Dashboard
 * Home screen with greeting, mascot tip, quick stats, budget overview, and quick links.
 */
import { useTipidStore, formatCurrency } from "@/lib/store";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Target,
  HandCoins,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useMemo } from "react";

const MASCOT_HAPPY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-happy-MhYqoPSPsRvFcB3CkzXrzP.webp";
const MASCOT_COIN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-coin-bBXSjJ8mXoXLhUFaH3AN8S.webp";

const TIPS = [
  "Tip: Track every gastos, kahit barya lang!",
  "Tip: Set a monthly budget para hindi ma-overspend.",
  "Tip: Ipon muna bago gastos, pre!",
  "Tip: Review your spending every week.",
  "Tip: Small savings add up — konting tiis lang!",
  "Tip: Avoid impulse buying — sleep on it first!",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const { transactions, accounts, budgets, goals, debts, categories, settings } = useTipidStore();
  const currency = settings.currency;

  const tip = useMemo(() => TIPS[Math.floor(Math.random() * TIPS.length)], []);

  // Current month stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const activeGoals = goals.length;
  const activeDebts = debts.filter((d) => d.paidAmount < d.totalAmount).length;

  const quickLinks = [
    { label: "Budgets", icon: Target, href: "/app/budgets", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { label: "Goals", icon: TrendingUp, href: "/app/goals", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
    { label: "Debts", icon: HandCoins, href: "/app/debts", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ];

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">
      {/* Greeting + Mascot */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-body">
            {getGreeting()}{settings.name ? `, ${settings.name}` : ""}!
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground">
            Dashboard
          </h1>
        </div>
        <motion.img
          src={MASCOT_HAPPY}
          alt="Tipid Kalabaw"
          className="w-14 h-14 object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        />
      </div>

      {/* Mascot Tip Bubble */}
      <motion.div
        className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm flex items-start gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <img src={MASCOT_COIN} alt="tip" className="w-10 h-10 object-contain flex-shrink-0" />
        <p className="text-sm text-muted-foreground font-body leading-relaxed">{tip}</p>
      </motion.div>

      {/* Total Balance Card */}
      <motion.div
        className="bg-primary rounded-2xl p-5 text-primary-foreground shadow-lg shadow-primary/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm opacity-80 font-body">Total Balance</p>
        <p className="text-3xl font-extrabold font-display tabular-nums mt-1">
          {formatCurrency(totalBalance, currency)}
        </p>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] opacity-70">Income</p>
              <p className="text-sm font-bold tabular-nums">{formatCurrency(totalIncome, currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] opacity-70">Expense</p>
              <p className="text-sm font-bold tabular-nums">{formatCurrency(totalExpense, currency)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3">
        {quickLinks.map((link, i) => (
          <Link key={link.href} href={link.href}>
            <motion.div
              className={`${link.color} rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <link.icon className="w-6 h-6" />
              <span className="text-xs font-semibold font-body">{link.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold font-display">Recent Transactions</h2>
          <Link href="/app/history">
            <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
              See All <ChevronRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-card rounded-2xl p-6 border border-border/50 text-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-sleeping-GBjfE7MhwqjwqwtgUX2c8K.webp"
              alt="No transactions"
              className="w-20 h-20 mx-auto mb-3 object-contain"
            />
            <p className="text-sm text-muted-foreground font-body">
              No transactions yet. Tap the + button to add one!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...transactions]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((tx) => {
                const cat = categories.find((c) => c.id === tx.categoryId);
                return (
                  <div
                    key={tx.id}
                    className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: (cat?.color || "#64748b") + "20" }}
                    >
                      {cat?.icon || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold font-body truncate">
                        {cat?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {tx.note || new Date(tx.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-bold tabular-nums font-body ${
                        tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount, tx.currency)}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </motion.div>

      {/* Stats Summary */}
      {(activeGoals > 0 || activeDebts > 0) && (
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <p className="text-xs text-muted-foreground font-body">Active Goals</p>
            <p className="text-2xl font-extrabold font-display mt-1">{activeGoals}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <p className="text-xs text-muted-foreground font-body">Active Debts</p>
            <p className="text-2xl font-extrabold font-display mt-1">{activeDebts}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * TIPID — Zustand Store
 * All data persisted in localStorage via zustand/persist.
 * Models: Transaction, Account, Budget, Goal, Debt, Receivable, RecurringEntry, Category
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────
export type TransactionType = "expense" | "income";
export type AccountType = "cash" | "bank" | "ewallet" | "credit";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  date: string; // ISO string
  note: string;
  currency: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  period: "monthly";
  currency: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  note: string;
  currency: string;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  note: string;
  type: "owe" | "owed"; // owe = I owe someone, owed = someone owes me
  currency: string;
}

export interface RecurringEntry {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  note: string;
  frequency: "daily" | "weekly" | "monthly";
  nextDue: string;
  currency: string;
  active: boolean;
}

export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  note: string;
  currency: string;
}

export interface UserSettings {
  name: string;
  currency: string;
  theme: "light" | "dark" | "system";
  hasOnboarded: boolean;
}

// ─── Default Data ────────────────────────────────────────────────────
const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food", icon: "🍚", color: "#ef4444", type: "expense" },
  { id: "transport", name: "Transport", icon: "🚌", color: "#f97316", type: "expense" },
  { id: "bills", name: "Bills", icon: "📱", color: "#8b5cf6", type: "expense" },
  { id: "shopping", name: "Shopping", icon: "🛒", color: "#ec4899", type: "expense" },
  { id: "health", name: "Health", icon: "💊", color: "#14b8a6", type: "expense" },
  { id: "entertainment", name: "Entertainment", icon: "🎮", color: "#6366f1", type: "expense" },
  { id: "education", name: "Education", icon: "📚", color: "#0ea5e9", type: "expense" },
  { id: "groceries", name: "Groceries", icon: "🥬", color: "#22c55e", type: "expense" },
  { id: "rent", name: "Rent", icon: "🏠", color: "#a855f7", type: "expense" },
  { id: "others-exp", name: "Others", icon: "📦", color: "#64748b", type: "expense" },
  { id: "salary", name: "Salary", icon: "💰", color: "#22c55e", type: "income" },
  { id: "freelance", name: "Freelance", icon: "💻", color: "#0ea5e9", type: "income" },
  { id: "business", name: "Business", icon: "🏪", color: "#f97316", type: "income" },
  { id: "gift", name: "Gift", icon: "🎁", color: "#ec4899", type: "income" },
  { id: "others-inc", name: "Others", icon: "💵", color: "#64748b", type: "income" },
];

const DEFAULT_ACCOUNTS: Account[] = [
  { id: "cash", name: "Cash", type: "cash", balance: 0, currency: "PHP", icon: "💵", color: "#22c55e" },
  { id: "bank", name: "Bank Account", type: "bank", balance: 0, currency: "PHP", icon: "🏦", color: "#0ea5e9" },
  { id: "gcash", name: "GCash", type: "ewallet", balance: 0, currency: "PHP", icon: "📱", color: "#0066ff" },
];

const DEFAULT_SETTINGS: UserSettings = {
  name: "",
  currency: "PHP",
  theme: "light",
  hasOnboarded: false,
};

// ─── Utility ─────────────────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Store Interface ─────────────────────────────────────────────────
interface TipidStore {
  // Data
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  recurringEntries: RecurringEntry[];
  transfers: Transfer[];
  settings: UserSettings;

  // Transaction actions
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Account actions
  addAccount: (a: Omit<Account, "id">) => void;
  updateAccount: (id: string, a: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Category actions
  addCategory: (c: Omit<Category, "id">) => void;

  // Budget actions
  addBudget: (b: Omit<Budget, "id">) => void;
  updateBudget: (id: string, b: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Goal actions
  addGoal: (g: Omit<Goal, "id">) => void;
  updateGoal: (id: string, g: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Debt actions
  addDebt: (d: Omit<Debt, "id">) => void;
  updateDebt: (id: string, d: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;

  // Recurring actions
  addRecurring: (r: Omit<RecurringEntry, "id">) => void;
  updateRecurring: (id: string, r: Partial<RecurringEntry>) => void;
  deleteRecurring: (id: string) => void;

  // Transfer actions
  addTransfer: (t: Omit<Transfer, "id">) => void;
  deleteTransfer: (id: string) => void;

  // Recurring processing
  processRecurring: () => void;

  // Settings
  updateSettings: (s: Partial<UserSettings>) => void;

  // Backup / Restore
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────
export const useTipidStore = create<TipidStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      accounts: DEFAULT_ACCOUNTS,
      categories: DEFAULT_CATEGORIES,
      budgets: [],
      goals: [],
      debts: [],
      recurringEntries: [],
      transfers: [],
      settings: DEFAULT_SETTINGS,

      // ── Transactions ──
      addTransaction: (t) => {
        const newT: Transaction = { ...t, id: generateId() };
        console.log("[Tipid-Storage] Adding transaction", newT.id);
        set((s) => {
          // Update account balance
          const accounts = s.accounts.map((a) => {
            if (a.id === newT.accountId) {
              return {
                ...a,
                balance: newT.type === "income"
                  ? a.balance + newT.amount
                  : a.balance - newT.amount,
              };
            }
            return a;
          });
          return { transactions: [...s.transactions, newT], accounts };
        });
      },
      updateTransaction: (id, t) =>
        set((s) => ({
          transactions: s.transactions.map((x) => (x.id === id ? { ...x, ...t } : x)),
        })),
      deleteTransaction: (id) =>
        set((s) => {
          const tx = s.transactions.find((x) => x.id === id);
          const accounts = tx
            ? s.accounts.map((a) => {
                if (a.id === tx.accountId) {
                  return {
                    ...a,
                    balance: tx.type === "income"
                      ? a.balance - tx.amount
                      : a.balance + tx.amount,
                  };
                }
                return a;
              })
            : s.accounts;
          return {
            transactions: s.transactions.filter((x) => x.id !== id),
            accounts,
          };
        }),

      // ── Accounts ──
      addAccount: (a) =>
        set((s) => ({ accounts: [...s.accounts, { ...a, id: generateId() }] })),
      updateAccount: (id, a) =>
        set((s) => ({
          accounts: s.accounts.map((x) => (x.id === id ? { ...x, ...a } : x)),
        })),
      deleteAccount: (id) =>
        set((s) => ({ accounts: s.accounts.filter((x) => x.id !== id) })),

      // ── Categories ──
      addCategory: (c) =>
        set((s) => ({ categories: [...s.categories, { ...c, id: generateId() }] })),

      // ── Budgets ──
      addBudget: (b) =>
        set((s) => ({ budgets: [...s.budgets, { ...b, id: generateId() }] })),
      updateBudget: (id, b) =>
        set((s) => ({
          budgets: s.budgets.map((x) => (x.id === id ? { ...x, ...b } : x)),
        })),
      deleteBudget: (id) =>
        set((s) => ({ budgets: s.budgets.filter((x) => x.id !== id) })),

      // ── Goals ──
      addGoal: (g) =>
        set((s) => ({ goals: [...s.goals, { ...g, id: generateId() }] })),
      updateGoal: (id, g) =>
        set((s) => ({
          goals: s.goals.map((x) => (x.id === id ? { ...x, ...g } : x)),
        })),
      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((x) => x.id !== id) })),

      // ── Debts ──
      addDebt: (d) =>
        set((s) => ({ debts: [...s.debts, { ...d, id: generateId() }] })),
      updateDebt: (id, d) =>
        set((s) => ({
          debts: s.debts.map((x) => (x.id === id ? { ...x, ...d } : x)),
        })),
      deleteDebt: (id) =>
        set((s) => ({ debts: s.debts.filter((x) => x.id !== id) })),

      // ── Recurring ──
      addRecurring: (r) =>
        set((s) => ({
          recurringEntries: [...s.recurringEntries, { ...r, id: generateId() }],
        })),
      updateRecurring: (id, r) =>
        set((s) => ({
          recurringEntries: s.recurringEntries.map((x) =>
            x.id === id ? { ...x, ...r } : x
          ),
        })),
      deleteRecurring: (id) =>
        set((s) => ({
          recurringEntries: s.recurringEntries.filter((x) => x.id !== id),
        })),

      // ── Transfers ──
      addTransfer: (t) => {
        const newT: Transfer = { ...t, id: generateId() };
        set((s) => {
          const accounts = s.accounts.map((a) => {
            if (a.id === newT.fromAccountId) {
              return { ...a, balance: a.balance - newT.amount };
            }
            if (a.id === newT.toAccountId) {
              return { ...a, balance: a.balance + newT.amount };
            }
            return a;
          });
          return { transfers: [...s.transfers, newT], accounts };
        });
      },
      deleteTransfer: (id) =>
        set((s) => {
          const tr = s.transfers.find((x) => x.id === id);
          const accounts = tr
            ? s.accounts.map((a) => {
                if (a.id === tr.fromAccountId) return { ...a, balance: a.balance + tr.amount };
                if (a.id === tr.toAccountId) return { ...a, balance: a.balance - tr.amount };
                return a;
              })
            : s.accounts;
          return { transfers: s.transfers.filter((x) => x.id !== id), accounts };
        }),

      // ── Process Recurring ──
      processRecurring: () => {
        const state = get();
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        let changed = false;
        const updatedEntries = state.recurringEntries.map((entry) => {
          if (!entry.active) return entry;
          let nextDue = new Date(entry.nextDue);
          const created: Omit<Transaction, "id">[] = [];
          while (nextDue <= now) {
            created.push({
              amount: entry.amount,
              type: entry.type,
              categoryId: entry.categoryId,
              accountId: entry.accountId,
              date: nextDue.toISOString(),
              note: `[Auto] ${entry.note}`,
              currency: entry.currency,
            });
            if (entry.frequency === "daily") nextDue.setDate(nextDue.getDate() + 1);
            else if (entry.frequency === "weekly") nextDue.setDate(nextDue.getDate() + 7);
            else nextDue.setMonth(nextDue.getMonth() + 1);
          }
          if (created.length > 0) {
            changed = true;
            created.forEach((t) => state.addTransaction(t));
            return { ...entry, nextDue: nextDue.toISOString() };
          }
          return entry;
        });
        if (changed) {
          set({ recurringEntries: updatedEntries });
          console.log("[Tipid] Processed recurring entries");
        }
      },

      // ── Settings ──
      updateSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),

      // ── Backup / Restore ──
      exportData: () => {
        const state = get();
        const data = {
          version: 1,
          exportedAt: new Date().toISOString(),
          transactions: state.transactions,
          accounts: state.accounts,
          categories: state.categories,
          budgets: state.budgets,
          goals: state.goals,
          debts: state.debts,
          recurringEntries: state.recurringEntries,
          transfers: state.transfers,
          settings: state.settings,
        };
        console.log("[Tipid-Storage] Exporting data");
        return JSON.stringify(data, null, 2);
      },
      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data.version) return false;
          console.log("[Tipid-Storage] Importing data from", data.exportedAt);
          set({
            transactions: data.transactions || [],
            accounts: data.accounts || DEFAULT_ACCOUNTS,
            categories: data.categories || DEFAULT_CATEGORIES,
            budgets: data.budgets || [],
            goals: data.goals || [],
            debts: data.debts || [],
            recurringEntries: data.recurringEntries || [],
            transfers: data.transfers || [],
            settings: data.settings || DEFAULT_SETTINGS,
          });
          return true;
        } catch (e) {
          console.error("[Tipid-Storage] Import failed", e);
          return false;
        }
      },
      resetAll: () => {
        console.log("[Tipid-Storage] Resetting all data");
        set({
          transactions: [],
          accounts: DEFAULT_ACCOUNTS,
          categories: DEFAULT_CATEGORIES,
          budgets: [],
          goals: [],
          debts: [],
          recurringEntries: [],
          transfers: [],
          settings: DEFAULT_SETTINGS,
        });
      },
    }),
    {
      name: "tipid-storage",
    }
  )
);

// ─── Selectors ───────────────────────────────────────────────────────
export const CURRENCY_SYMBOLS: Record<string, string> = {
  PHP: "₱",
  USD: "$",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  KRW: "₩",
  SGD: "S$",
  AUD: "A$",
  CAD: "C$",
};

export function formatCurrency(amount: number, currency: string = "PHP"): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency + " ";
  const formatted = Math.abs(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
}

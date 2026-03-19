/**
 * TIPID — Mock Data Generator
 * Generates realistic sample data for demo/testing purposes.
 */
import { generateId, type Transaction, type Account, type Budget, type Goal, type Debt, type RecurringEntry, type Transfer, type QuickTemplate } from "./store";

const EXPENSE_CATEGORIES = ["food", "transport", "bills", "shopping", "health", "entertainment", "education", "groceries", "rent", "others-exp"];
const INCOME_CATEGORIES = ["salary", "freelance", "business", "gift", "others-inc"];

const EXPENSE_NOTES: Record<string, string[]> = {
  food: ["Jollibee lunch", "Grab Food dinner", "Coffee at Starbucks", "Street food", "Mang Inasal", "Milk tea", "Office lunch", "Weekend brunch"],
  transport: ["Grab to work", "Jeepney fare", "Gas refill", "Parking fee", "LRT/MRT load", "Angkas ride"],
  bills: ["Globe postpaid", "Meralco bill", "Netflix sub", "Spotify premium", "Water bill", "Internet bill", "YouTube Premium"],
  shopping: ["Uniqlo shirt", "Lazada order", "Shopee haul", "New shoes", "Phone case"],
  health: ["Vitamins", "Doctor checkup", "Medicine", "Gym membership", "Dental cleaning"],
  entertainment: ["Movie tickets", "Concert tickets", "Steam game", "Board game night", "Karaoke"],
  education: ["Online course", "Books", "School supplies", "Udemy course"],
  groceries: ["SM Supermarket", "Puregold groceries", "Landers run", "S&R bulk buy", "Wet market"],
  rent: ["Monthly rent", "Condo dues", "Parking slot"],
  "others-exp": ["Haircut", "Laundry", "Pet food", "Gift for friend", "Donation"],
};

const INCOME_NOTES: Record<string, string[]> = {
  salary: ["Monthly salary", "13th month pay", "Overtime pay"],
  freelance: ["Web design project", "Logo design", "Consulting fee", "Writing gig"],
  business: ["Online store sales", "Commission", "Side hustle"],
  gift: ["Birthday money", "Christmas bonus", "Padala from abroad"],
  "others-inc": ["Sold old phone", "Cashback reward", "Refund"],
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(monthsBack: number): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  const diff = now.getTime() - start.getTime();
  return new Date(start.getTime() + Math.random() * diff).toISOString();
}

export function generateMockData(currency: string) {
  // Accounts
  const accounts: Account[] = [
    { id: "mock-cash", name: "Cash", type: "cash", balance: randomBetween(2000, 8000), currency, icon: "cash", color: "#22c55e" },
    { id: "mock-bdo", name: "BDO Savings", type: "bank", balance: randomBetween(15000, 50000), currency, icon: "bank", color: "#0ea5e9" },
    { id: "mock-gcash", name: "GCash", type: "ewallet", balance: randomBetween(1000, 5000), currency, icon: "ewallet", color: "#0066ff" },
    { id: "mock-credit", name: "BPI Credit Card", type: "credit", balance: randomBetween(-15000, -3000), currency, icon: "credit", color: "#ef4444" },
  ];

  const accountIds = accounts.map((a) => a.id);

  // Transactions — 3 months of data, ~5-8 per day
  const transactions: Transaction[] = [];
  for (let i = 0; i < 180; i++) {
    const isExpense = Math.random() < 0.78;
    const catId = isExpense ? randomItem(EXPENSE_CATEGORIES) : randomItem(INCOME_CATEGORIES);
    const notes = isExpense ? EXPENSE_NOTES[catId] || [""] : INCOME_NOTES[catId] || [""];
    
    let amount: number;
    if (isExpense) {
      switch (catId) {
        case "rent": amount = randomBetween(5000, 15000); break;
        case "groceries": amount = randomBetween(500, 3000); break;
        case "bills": amount = randomBetween(200, 2500); break;
        case "food": amount = randomBetween(50, 500); break;
        case "transport": amount = randomBetween(20, 300); break;
        case "shopping": amount = randomBetween(200, 3000); break;
        case "health": amount = randomBetween(100, 2000); break;
        case "entertainment": amount = randomBetween(100, 1500); break;
        case "education": amount = randomBetween(200, 2000); break;
        default: amount = randomBetween(50, 500);
      }
    } else {
      switch (catId) {
        case "salary": amount = randomBetween(15000, 45000); break;
        case "freelance": amount = randomBetween(3000, 15000); break;
        case "business": amount = randomBetween(1000, 10000); break;
        case "gift": amount = randomBetween(500, 5000); break;
        default: amount = randomBetween(100, 3000);
      }
    }

    transactions.push({
      id: generateId() + "-" + i,
      amount,
      type: isExpense ? "expense" : "income",
      categoryId: catId,
      accountId: randomItem(accountIds),
      date: randomDate(3),
      note: randomItem(notes),
      currency,
    });
  }

  // Budgets
  const budgets: Budget[] = [
    { id: "mock-b1", categoryId: "food", limit: 8000, period: "monthly", currency },
    { id: "mock-b2", categoryId: "transport", limit: 3000, period: "monthly", currency },
    { id: "mock-b3", categoryId: "bills", limit: 5000, period: "monthly", currency },
    { id: "mock-b4", categoryId: "shopping", limit: 4000, period: "monthly", currency },
    { id: "mock-b5", categoryId: "groceries", limit: 6000, period: "monthly", currency },
    { id: "mock-b6", categoryId: "entertainment", limit: 2000, period: "monthly", currency },
  ];

  // Goals
  const goals: Goal[] = [
    {
      id: "mock-g1",
      name: "Emergency Fund",
      targetAmount: 100000,
      currentAmount: randomBetween(25000, 65000),
      deadline: new Date(2026, 11, 31).toISOString(),
      note: "6 months of expenses",
      currency,
    },
    {
      id: "mock-g2",
      name: "New Laptop",
      targetAmount: 50000,
      currentAmount: randomBetween(10000, 35000),
      deadline: new Date(2026, 8, 1).toISOString(),
      note: "MacBook Air M3",
      currency,
    },
    {
      id: "mock-g3",
      name: "Japan Trip",
      targetAmount: 80000,
      currentAmount: randomBetween(15000, 45000),
      deadline: new Date(2027, 3, 1).toISOString(),
      note: "Cherry blossom season!",
      currency,
    },
  ];

  // Debts
  const debts: Debt[] = [
    {
      id: "mock-d1",
      name: "Juan — Lunch money",
      totalAmount: 500,
      paidAmount: 0,
      dueDate: new Date(2026, 3, 15).toISOString(),
      note: "Borrowed for Jollibee",
      type: "owe",
      currency,
    },
    {
      id: "mock-d2",
      name: "Maria — Concert ticket",
      totalAmount: 2500,
      paidAmount: 1000,
      dueDate: new Date(2026, 4, 1).toISOString(),
      note: "She'll pay back after payday",
      type: "owed",
      currency,
    },
    {
      id: "mock-d3",
      name: "Pedro — Grocery split",
      totalAmount: 1200,
      paidAmount: 600,
      dueDate: new Date(2026, 3, 30).toISOString(),
      note: "Split from last S&R trip",
      type: "owed",
      currency,
    },
  ];

  // Recurring entries
  const recurringEntries: RecurringEntry[] = [
    {
      id: "mock-r1",
      amount: 549,
      type: "expense",
      categoryId: "bills",
      accountId: "mock-gcash",
      note: "Netflix subscription",
      frequency: "monthly",
      nextDue: new Date(2026, 3, 5).toISOString(),
      currency,
      active: true,
    },
    {
      id: "mock-r2",
      amount: 159,
      type: "expense",
      categoryId: "bills",
      accountId: "mock-gcash",
      note: "Spotify Premium",
      frequency: "monthly",
      nextDue: new Date(2026, 3, 12).toISOString(),
      currency,
      active: true,
    },
    {
      id: "mock-r3",
      amount: 10000,
      type: "expense",
      categoryId: "rent",
      accountId: "mock-bdo",
      note: "Monthly condo rent",
      frequency: "monthly",
      nextDue: new Date(2026, 3, 1).toISOString(),
      currency,
      active: true,
    },
  ];

  // Transfers
  const transfers: Transfer[] = [
    {
      id: "mock-t1",
      fromAccountId: "mock-bdo",
      toAccountId: "mock-gcash",
      amount: 3000,
      date: randomDate(1),
      note: "GCash top-up",
      currency,
    },
    {
      id: "mock-t2",
      fromAccountId: "mock-cash",
      toAccountId: "mock-bdo",
      amount: 5000,
      date: randomDate(1),
      note: "Deposit savings",
      currency,
    },
  ];

  // Quick templates
  const templates: QuickTemplate[] = [
    {
      id: "mock-qt1",
      name: "Grab to Work",
      amount: 150,
      type: "expense",
      categoryId: "transport",
      accountId: "mock-gcash",
      note: "Daily commute",
      currency,
    },
    {
      id: "mock-qt2",
      name: "Jollibee Lunch",
      amount: 199,
      type: "expense",
      categoryId: "food",
      accountId: "mock-cash",
      note: "Chickenjoy meal",
      currency,
    },
    {
      id: "mock-qt3",
      name: "Coffee",
      amount: 180,
      type: "expense",
      categoryId: "food",
      accountId: "mock-gcash",
      note: "Starbucks iced coffee",
      currency,
    },
  ];

  return {
    accounts,
    transactions,
    budgets,
    goals,
    debts,
    recurringEntries,
    transfers,
    templates,
  };
}

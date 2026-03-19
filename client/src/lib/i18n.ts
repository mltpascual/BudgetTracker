/**
 * TIPID — Internationalization (i18n)
 * Supports English (en) and Filipino (fil) languages.
 * Filipino translations use casual Taglish style (not deep formal Tagalog).
 */

export type Language = "en" | "fil";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  fil: "Filipino",
};

type TranslationKeys = typeof en;

const en = {
  // ── Common ──
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  add: "Add",
  close: "Close",
  next: "Next",
  back: "Back",
  done: "Done",
  search: "Search",
  noData: "No data yet",
  comingSoon: "Coming Soon",

  // ── Navigation ──
  navHome: "Home",
  navWallets: "Wallets",
  navHistory: "History",
  navSettings: "Settings",

  // ── Dashboard ──
  dashGreeting: "Good morning",
  dashGreetingAfternoon: "Good afternoon",
  dashGreetingEvening: "Good evening",
  dashBalance: "Total Balance",
  dashIncome: "Income",
  dashExpense: "Expenses",
  dashQuickActions: "Quick Actions",
  dashBudgets: "Budgets",
  dashGoals: "Goals",
  dashDebts: "Debts",
  dashRecurring: "Recurring",
  dashAnalytics: "Analytics",
  dashTransfer: "Transfer",
  dashRecentTransactions: "Recent Transactions",
  dashViewAll: "View All",
  dashNoTransactions: "No transactions yet. Start tracking!",
  dashTipTitle: "Tipid Tip",

  // ── Add Transaction ──
  addTitle: "Add Transaction",
  addExpense: "Expense",
  addIncome: "Income",
  addAmount: "Amount",
  addCategory: "Category",
  addAccount: "Account",
  addNote: "Note",
  addDate: "Date",
  addSaveExpense: "Save Expense",
  addSaveIncome: "Save Income",
  addSelectCategory: "Select Category",
  addSelectAccount: "Select Account",
  addEnterNote: "Add a note (optional)",
  addSuccess: "Transaction saved!",

  // ── Wallets ──
  walletsTitle: "Wallets",
  walletsTotal: "Total Balance",
  walletsNewAccount: "New Account",
  walletsName: "Name",
  walletsType: "Type",
  walletsInitialBalance: "Initial Balance",
  walletsAddAccount: "Add Account",
  walletsCash: "Cash",
  walletsBank: "Bank",
  walletsEWallet: "E-Wallet",
  walletsCredit: "Credit",
  walletsTransfer: "Transfer Between Wallets",
  walletsDeleteConfirm: "Delete this account?",
  walletsNamePlaceholder: "e.g. BDO Savings",

  // ── History ──
  historyTitle: "History",
  historyNoTransactions: "No transactions this month",
  historyAllTransactions: "All Transactions",

  // ── Budgets ──
  budgetsTitle: "Budgets",
  budgetsMonthly: "Monthly Budget",
  budgetsAdd: "Add Budget",
  budgetsSpent: "spent",
  budgetsLeft: "left",
  budgetsOver: "over budget",
  budgetsNoBudgets: "No budgets set. Add one to start tracking!",
  budgetsAmount: "Budget Amount",

  // ── Goals ──
  goalsTitle: "Savings Goals",
  goalsAdd: "Add Goal",
  goalsTarget: "Target Amount",
  goalsSaved: "saved",
  goalsRemaining: "remaining",
  goalsCompleted: "Goal Reached!",
  goalsNoGoals: "No savings goals yet. Dream big!",
  goalsName: "Goal Name",
  goalsNamePlaceholder: "e.g. New Laptop, Vacation",
  goalsAddMoney: "Add Money",
  goalsAmount: "Amount to add",

  // ── Debts ──
  debtsTitle: "Debts & Receivables",
  debtsIOwe: "I Owe",
  debtsOwedToMe: "Owed To Me",
  debtsAdd: "Add Entry",
  debtsPerson: "Person",
  debtsPersonPlaceholder: "e.g. Juan, Maria",
  debtsAmount: "Amount",
  debtsNote: "Note",
  debtsMarkPaid: "Mark as Paid",
  debtsNoDebts: "No debts tracked. That's great!",

  // ── Recurring ──
  recurringTitle: "Recurring Transactions",
  recurringAdd: "Add Recurring",
  recurringDaily: "Daily",
  recurringWeekly: "Weekly",
  recurringMonthly: "Monthly",
  recurringFrequency: "Frequency",
  recurringActive: "Active",
  recurringPaused: "Paused",
  recurringNoEntries: "No recurring entries yet.",

  // ── Analytics ──
  analyticsTitle: "Analytics",
  analyticsByCategory: "By Category",
  analyticsMonthlyTrend: "Monthly Trend",
  analyticsTopCategory: "Top Category",
  analyticsTotalSpent: "Total Spent",
  analyticsAvgDaily: "Avg. Daily",
  analyticsTransactions: "Transactions",
  analyticsNoData: "No expense data for this month",

  // ── Transfer ──
  transferTitle: "Transfer",
  transferFrom: "From",
  transferTo: "To",
  transferAmount: "Amount",
  transferNote: "Note (optional)",
  transferSwap: "Swap",
  transferSubmit: "Transfer Now",
  transferSuccess: "Transfer completed!",
  transferSameAccount: "Cannot transfer to the same account",
  transferNeedTwo: "You need at least 2 accounts to transfer",

  // ── Settings ──
  settingsTitle: "Settings",
  settingsCustomize: "Customize Your App",
  settingsProfile: "Profile",
  settingsYourName: "Your Name",
  settingsCurrency: "Currency",
  settingsTheme: "Theme",
  settingsLight: "Light",
  settingsDark: "Dark",
  settingsSystem: "System",
  settingsReminders: "Reminders",
  settingsEnableReminders: "Enable Reminders",
  settingsReminderDesc: "Get reminded to log expenses",
  settingsDailyReminder: "Daily Reminder",
  settingsDailyDesc: "Log your expenses every day",
  settingsWeeklyReview: "Weekly Review",
  settingsWeeklyDesc: "Review your spending weekly",
  settingsBudgetAlerts: "Budget Alerts",
  settingsBudgetAlertsDesc: "Alert when budget exceeds 80%",
  settingsCategories: "Categories",
  settingsExport: "Export & Backup",
  settingsExportJSON: "Export JSON Backup",
  settingsExportJSONDesc: "Full data backup for restore",
  settingsExportCSV: "Export Transactions CSV",
  settingsExportCSVDesc: "Open in Excel or Google Sheets",
  settingsImportJSON: "Import JSON Backup",
  settingsImportJSONDesc: "Restore from a backup file",
  settingsTutorial: "Tutorial",
  settingsRestartOnboarding: "Restart Onboarding",
  settingsDangerZone: "Danger Zone",
  settingsResetAll: "Reset All Data",
  settingsResetConfirm: "Are you sure? This will delete ALL your data permanently.",
  settingsYesReset: "Yes, Reset",
  settingsLanguage: "Language",
  settingsNotifUnsupported: "Notifications are not supported in this browser.",
  settingsDisable: "Disable",
  settingsNewCategory: "New Category",
  settingsEditCategory: "Edit Category",
  settingsCategoryName: "Category Name",
  settingsCategoryNamePlaceholder: "e.g. Pets, Coffee, Gym",
  settingsIcon: "Icon",
  settingsColor: "Color",
  settingsPreview: "Preview",
  settingsUpdateCategory: "Update Category",
  settingsAddCategory: "Add Category",
  settingsAppVersion: "Tipid v1.3.0 — Budgeting Without The Stress",
  settingsLocalData: "All data stored locally on your device.",

  // ── Onboarding ──
  onboardingWelcome: "Welcome to Tipid!",
  onboardingWelcomeDesc: "Your kuripot kalabaw buddy is here to help you manage your money. Let's get started!",
  onboardingWallets: "Set Up Your Wallets",
  onboardingWalletsDesc: "Track your cash, bank accounts, and e-wallets all in one place.",
  onboardingExpenses: "Log Your Expenses",
  onboardingExpensesDesc: "Quick and easy expense tracking with our calculator-style input.",
  onboardingBudgets: "Set Your Budgets",
  onboardingBudgetsDesc: "Create monthly budgets for each category and stay on track.",
  onboardingBackup: "Backup Your Data",
  onboardingBackupDesc: "Export your data as JSON anytime. Your data stays on your device.",
  onboardingStart: "Let's Get Started!",

  // ── Landing ──
  landingHero: "Budgeting Without The Stress",
  landingHeroDesc: "Track expenses, manage budgets, and save money — all from your phone. No sign-up needed.",
  landingOpenApp: "Open App",
  landingFeatures: "Features",
  landingFeaturesDesc: "Everything you need to manage your money",
  landingCTA: "Start Budgeting Now",
  landingCTADesc: "Free. No sign-up. Your data stays on your device.",
  landingFooter: "Made with care for Pinoy budgeters",
};

const fil: TranslationKeys = {
  // ── Common ──
  save: "I-Save",
  cancel: "Cancel",
  delete: "I-Delete",
  edit: "I-Edit",
  add: "Dagdag",
  close: "Isara",
  next: "Susunod",
  back: "Bumalik",
  done: "Tapos Na",
  search: "Hanapin",
  noData: "Wala pang data",
  comingSoon: "Coming Soon",

  // ── Navigation ──
  navHome: "Home",
  navWallets: "Wallets",
  navHistory: "History",
  navSettings: "Settings",

  // ── Dashboard ──
  dashGreeting: "Magandang umaga",
  dashGreetingAfternoon: "Magandang hapon",
  dashGreetingEvening: "Magandang gabi",
  dashBalance: "Total Balance",
  dashIncome: "Kita",
  dashExpense: "Gastos",
  dashQuickActions: "Quick Actions",
  dashBudgets: "Budgets",
  dashGoals: "Goals",
  dashDebts: "Utang",
  dashRecurring: "Recurring",
  dashAnalytics: "Analytics",
  dashTransfer: "Transfer",
  dashRecentTransactions: "Recent na Transactions",
  dashViewAll: "Tingnan Lahat",
  dashNoTransactions: "Wala pang transactions. Mag-start na!",
  dashTipTitle: "Tipid Tip",

  // ── Add Transaction ──
  addTitle: "Mag-Add ng Transaction",
  addExpense: "Gastos",
  addIncome: "Kita",
  addAmount: "Halaga",
  addCategory: "Category",
  addAccount: "Account",
  addNote: "Note",
  addDate: "Petsa",
  addSaveExpense: "I-Save Gastos",
  addSaveIncome: "I-Save Kita",
  addSelectCategory: "Pumili ng Category",
  addSelectAccount: "Pumili ng Account",
  addEnterNote: "Mag-add ng note (optional)",
  addSuccess: "Na-save na ang transaction!",

  // ── Wallets ──
  walletsTitle: "Wallets",
  walletsTotal: "Total Balance",
  walletsNewAccount: "Bagong Account",
  walletsName: "Pangalan",
  walletsType: "Uri",
  walletsInitialBalance: "Starting Balance",
  walletsAddAccount: "Mag-Add ng Account",
  walletsCash: "Cash",
  walletsBank: "Bank",
  walletsEWallet: "E-Wallet",
  walletsCredit: "Credit",
  walletsTransfer: "Mag-Transfer sa Ibang Wallet",
  walletsDeleteConfirm: "I-delete ang account na ito?",
  walletsNamePlaceholder: "e.g. BDO Savings",

  // ── History ──
  historyTitle: "History",
  historyNoTransactions: "Walang transactions ngayong buwan",
  historyAllTransactions: "Lahat ng Transactions",

  // ── Budgets ──
  budgetsTitle: "Budgets",
  budgetsMonthly: "Monthly Budget",
  budgetsAdd: "Mag-Add ng Budget",
  budgetsSpent: "nagastos",
  budgetsLeft: "natitira",
  budgetsOver: "sobra sa budget",
  budgetsNoBudgets: "Wala pang budget. Mag-add para ma-track!",
  budgetsAmount: "Budget Amount",

  // ── Goals ──
  goalsTitle: "Savings Goals",
  goalsAdd: "Mag-Add ng Goal",
  goalsTarget: "Target Amount",
  goalsSaved: "na-save",
  goalsRemaining: "kulang pa",
  goalsCompleted: "Na-reach na ang Goal!",
  goalsNoGoals: "Wala pang savings goals. Mangarap ng malaki!",
  goalsName: "Pangalan ng Goal",
  goalsNamePlaceholder: "e.g. Bagong Laptop, Bakasyon",
  goalsAddMoney: "Mag-Add ng Pera",
  goalsAmount: "Halaga na idadagdag",

  // ── Debts ──
  debtsTitle: "Utang at Pinahiram",
  debtsIOwe: "Utang Ko",
  debtsOwedToMe: "Pinahiram Ko",
  debtsAdd: "Mag-Add",
  debtsPerson: "Tao",
  debtsPersonPlaceholder: "e.g. Juan, Maria",
  debtsAmount: "Halaga",
  debtsNote: "Note",
  debtsMarkPaid: "Bayad Na",
  debtsNoDebts: "Walang utang na naka-track. Magaling!",

  // ── Recurring ──
  recurringTitle: "Recurring Transactions",
  recurringAdd: "Mag-Add ng Recurring",
  recurringDaily: "Araw-Araw",
  recurringWeekly: "Lingguhan",
  recurringMonthly: "Buwanan",
  recurringFrequency: "Frequency",
  recurringActive: "Active",
  recurringPaused: "Naka-Pause",
  recurringNoEntries: "Wala pang recurring entries.",

  // ── Analytics ──
  analyticsTitle: "Analytics",
  analyticsByCategory: "Per Category",
  analyticsMonthlyTrend: "Monthly Trend",
  analyticsTopCategory: "Top Category",
  analyticsTotalSpent: "Total Gastos",
  analyticsAvgDaily: "Avg. Daily",
  analyticsTransactions: "Transactions",
  analyticsNoData: "Walang expense data ngayong buwan",

  // ── Transfer ──
  transferTitle: "Transfer",
  transferFrom: "Mula Sa",
  transferTo: "Papunta Sa",
  transferAmount: "Halaga",
  transferNote: "Note (optional)",
  transferSwap: "Palitan",
  transferSubmit: "I-Transfer Na",
  transferSuccess: "Na-transfer na!",
  transferSameAccount: "Hindi pwedeng mag-transfer sa same account",
  transferNeedTwo: "Kailangan mo ng 2 accounts para mag-transfer",

  // ── Settings ──
  settingsTitle: "Settings",
  settingsCustomize: "I-Customize Ang App Mo",
  settingsProfile: "Profile",
  settingsYourName: "Pangalan Mo",
  settingsCurrency: "Currency",
  settingsTheme: "Theme",
  settingsLight: "Light",
  settingsDark: "Dark",
  settingsSystem: "System",
  settingsReminders: "Reminders",
  settingsEnableReminders: "I-Enable ang Reminders",
  settingsReminderDesc: "Para ma-remind kang mag-log ng gastos",
  settingsDailyReminder: "Daily Reminder",
  settingsDailyDesc: "I-log ang gastos mo araw-araw",
  settingsWeeklyReview: "Weekly Review",
  settingsWeeklyDesc: "I-review ang gastos mo weekly",
  settingsBudgetAlerts: "Budget Alerts",
  settingsBudgetAlertsDesc: "Alert kapag 80% na ang budget",
  settingsCategories: "Categories",
  settingsExport: "Export & Backup",
  settingsExportJSON: "I-Export JSON Backup",
  settingsExportJSONDesc: "Full data backup para ma-restore",
  settingsExportCSV: "I-Export Transactions CSV",
  settingsExportCSVDesc: "Buksan sa Excel o Google Sheets",
  settingsImportJSON: "I-Import JSON Backup",
  settingsImportJSONDesc: "I-restore mula sa backup file",
  settingsTutorial: "Tutorial",
  settingsRestartOnboarding: "I-Restart ang Onboarding",
  settingsDangerZone: "Danger Zone",
  settingsResetAll: "I-Reset Lahat ng Data",
  settingsResetConfirm: "Sure ka ba? Madi-delete lahat ng data mo permanently.",
  settingsYesReset: "Oo, I-Reset",
  settingsLanguage: "Wika",
  settingsNotifUnsupported: "Hindi supported ang notifications sa browser na ito.",
  settingsDisable: "I-Disable",
  settingsNewCategory: "Bagong Category",
  settingsEditCategory: "I-Edit Category",
  settingsCategoryName: "Pangalan ng Category",
  settingsCategoryNamePlaceholder: "e.g. Pets, Coffee, Gym",
  settingsIcon: "Icon",
  settingsColor: "Kulay",
  settingsPreview: "Preview",
  settingsUpdateCategory: "I-Update Category",
  settingsAddCategory: "I-Add Category",
  settingsAppVersion: "Tipid v1.3.0 — Budgeting Nang Walang Stress",
  settingsLocalData: "Lahat ng data ay naka-save sa device mo.",

  // ── Onboarding ──
  onboardingWelcome: "Welcome sa Tipid!",
  onboardingWelcomeDesc: "Ang kuripot na kalabaw buddy mo ay nandito para tulungan kang i-manage ang pera mo. Tara na!",
  onboardingWallets: "I-Setup ang Wallets Mo",
  onboardingWalletsDesc: "I-track ang cash, bank accounts, at e-wallets mo sa isang lugar.",
  onboardingExpenses: "I-Log ang Gastos Mo",
  onboardingExpensesDesc: "Mabilis at madaling expense tracking gamit ang calculator-style input.",
  onboardingBudgets: "I-Set ang Budgets Mo",
  onboardingBudgetsDesc: "Gumawa ng monthly budgets per category at manatiling on track.",
  onboardingBackup: "I-Backup ang Data Mo",
  onboardingBackupDesc: "I-export ang data mo bilang JSON anytime. Naka-save ang data mo sa device mo.",
  onboardingStart: "Tara Na!",

  // ── Landing ──
  landingHero: "Budgeting Nang Walang Stress",
  landingHeroDesc: "I-track ang gastos, i-manage ang budgets, at mag-ipon — lahat mula sa phone mo. Walang sign-up needed.",
  landingOpenApp: "Buksan Ang App",
  landingFeatures: "Features",
  landingFeaturesDesc: "Lahat ng kailangan mo para i-manage ang pera mo",
  landingCTA: "Mag-Budget Na",
  landingCTADesc: "Libre. Walang sign-up. Naka-save ang data mo sa device mo.",
  landingFooter: "Gawa nang may malasakit para sa Pinoy budgeters",
};

const translations: Record<Language, TranslationKeys> = { en, fil };

const LANG_STORAGE_KEY = "tipid-language";

export function getLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "en" || stored === "fil") return stored;
  } catch {}
  return "en";
}

export function setLanguage(lang: Language) {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

export function t(key: keyof TranslationKeys, lang?: Language): string {
  const currentLang = lang || getLanguage();
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

// React hook for language
import { useState, useEffect, useCallback } from "react";

export function useLanguage() {
  const [lang, setLang] = useState<Language>(getLanguage);

  const changeLang = useCallback((newLang: Language) => {
    setLanguage(newLang);
    setLang(newLang);
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent("tipid-lang-change", { detail: newLang }));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<Language>;
      setLang(custom.detail);
    };
    window.addEventListener("tipid-lang-change", handler);
    return () => window.removeEventListener("tipid-lang-change", handler);
  }, []);

  const translate = useCallback(
    (key: keyof TranslationKeys) => t(key, lang),
    [lang]
  );

  return { lang, changeLang, t: translate };
}

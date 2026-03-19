/**
 * TIPID — Settings Page
 * User profile, currency, theme, export (JSON/CSV), category management,
 * backup/restore, onboarding trigger, and data management.
 */
import { useState, useRef } from "react";
import { useTipidStore, CURRENCY_SYMBOLS, type Category } from "@/lib/store";
import CategoryIcon, { AVAILABLE_ICONS, ICON_NAME_MAP } from "@/components/CategoryIcon";
import { useTheme, COLOR_THEMES, type ColorTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Palette,
  DollarSign,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  FileSpreadsheet,
  FileJson,
  Tag,
  Plus,
  X,
  Check,
  Pencil,
  BookOpen,
  Bell,
  BellOff,
  Paintbrush,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import {
  getReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  isNotificationSupported,
  getNotificationPermission,
  type ReminderSettings,
} from "@/hooks/useNotifications";
import { useLanguage, LANGUAGE_LABELS, type Language } from "@/lib/i18n";
import { Languages } from "lucide-react";

const MASCOT_THINKING = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-thinking-ERdmSJBcizk7YthAnj68Pg.webp";

const CATEGORY_COLORS = [
  "#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444",
  "#6366f1", "#0ea5e9", "#22c55e", "#a855f7", "#64748b",
  "#eab308", "#d946ef", "#06b6d4", "#f43f5e", "#78716c",
];

export default function Settings() {
  const {
    settings, updateSettings, exportData, importData, resetAll,
    transactions, categories, accounts, addTransaction,
    addCategory, updateCategory, deleteCategory,
    loadMockData, clearMockData, hasMockData,
  } = useTipidStore();
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const csvFileRef = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);
  const [name, setName] = useState(settings.name);
  const [mockLoaded, setMockLoaded] = useState(() => hasMockData());

  // Category management state
  const [showCatForm, setShowCatForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({
    name: "",
    icon: "Package",
    color: "#64748b",
    type: "expense" as "expense" | "income",
  });

  // ── Export Handlers ──
  const handleExportJSON = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tipid-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON backup downloaded!");
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Category", "Account", "Amount", "Currency", "Note"];
    const rows = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((t) => {
        const cat = categories.find((c) => c.id === t.categoryId);
        const acc = accounts.find((a) => a.id === t.accountId);
        return [
          new Date(t.date).toLocaleDateString("en-PH"),
          t.type,
          cat?.name || "Unknown",
          acc?.name || "Unknown",
          t.amount.toFixed(2),
          t.currency,
          `"${(t.note || "").replace(/"/g, '""')}"`,
        ].join(",");
      });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tipid-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const success = importData(json);
      if (success) {
        toast.success("Data imported successfully!");
        setName(useTipidStore.getState().settings.name);
      } else {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.trim().split("\n");
        if (lines.length < 2) {
          toast.error("CSV file is empty or has no data rows");
          return;
        }
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const dateIdx = headers.findIndex(h => h === "date");
        const typeIdx = headers.findIndex(h => h === "type");
        const catIdx = headers.findIndex(h => h === "category");
        const accIdx = headers.findIndex(h => h === "account");
        const amtIdx = headers.findIndex(h => h === "amount");
        const curIdx = headers.findIndex(h => h === "currency");
        const noteIdx = headers.findIndex(h => h === "note");
        if (dateIdx === -1 || typeIdx === -1 || amtIdx === -1) {
          toast.error("CSV must have Date, Type, and Amount columns");
          return;
        }
        let imported = 0;
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].match(/("[^"]*"|[^,]+)/g)?.map(v => v.replace(/^"|"$/g, "").trim()) || [];
          if (vals.length < 3) continue;
          const dateStr = vals[dateIdx];
          const type = vals[typeIdx]?.toLowerCase() as "expense" | "income";
          if (type !== "expense" && type !== "income") continue;
          const amount = parseFloat(vals[amtIdx]);
          if (isNaN(amount) || amount <= 0) continue;
          const catName = catIdx >= 0 ? vals[catIdx] : "";
          const accName = accIdx >= 0 ? vals[accIdx] : "";
          const currency = curIdx >= 0 ? vals[curIdx] : settings.currency;
          const note = noteIdx >= 0 ? vals[noteIdx] : "";
          const cat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase() && c.type === type);
          const acc = accounts.find(a => a.name.toLowerCase() === accName.toLowerCase());
          const parsedDate = new Date(dateStr);
          const date = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
          addTransaction({
            amount,
            type,
            categoryId: cat?.id || (type === "expense" ? "others-exp" : "others-inc"),
            accountId: acc?.id || accounts[0]?.id || "cash",
            date,
            note: note || `[CSV Import] Row ${i}`,
            currency,
          });
          imported++;
        }
        if (imported > 0) {
          toast.success(`Imported ${imported} transactions from CSV!`);
        } else {
          toast.error("No valid transactions found in CSV");
        }
      } catch (err) {
        console.error("CSV import error:", err);
        toast.error("Failed to parse CSV file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    resetAll();
    setName("");
    setShowReset(false);
    toast.success("All data has been reset");
  };

  const handleSaveName = () => {
    updateSettings({ name });
    toast.success("Name updated!");
  };

  // ── Category Handlers ──
  const openAddCategory = () => {
    setEditCat(null);
    setCatForm({ name: "", icon: "Package", color: "#64748b", type: "expense" });
    setShowCatForm(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditCat(cat);
    setCatForm({ name: cat.name, icon: cat.icon, color: cat.color, type: cat.type });
    setShowCatForm(true);
  };

  const handleSaveCategory = () => {
    if (!catForm.name.trim()) {
      toast.error("Enter a category name");
      return;
    }
    if (editCat) {
      updateCategory(editCat.id, catForm);
      toast.success("Category updated!");
    } else {
      addCategory(catForm);
      toast.success("Category added!");
    }
    setShowCatForm(false);
  };

  const handleDeleteCategory = (cat: Category) => {
    const inUse = transactions.some((t) => t.categoryId === cat.id);
    if (inUse) {
      toast.error("Cannot delete — this category has transactions");
      return;
    }
    deleteCategory(cat.id);
    toast.success("Category deleted");
  };

  // ── Onboarding ──
  const handleRestartOnboarding = () => {
    updateSettings({ hasOnboarded: false });
    toast.success("Onboarding will show on next visit to Dashboard");
  };

  // ── Notification State ──
  const [reminders, setReminders] = useState<ReminderSettings>(getReminderSettings);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">(
    isNotificationSupported() ? Notification.permission : "unsupported"
  );

  const updateReminders = (patch: Partial<ReminderSettings>) => {
    const updated = { ...reminders, ...patch };
    setReminders(updated);
    saveReminderSettings(updated);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifPerm(granted ? "granted" : "denied");
    if (granted) {
      updateReminders({ enabled: true });
      toast.success("Notifications enabled!");
    } else {
      toast.error("Notification permission denied. Enable it in browser settings.");
    }
  };

  const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const { lang, changeLang, t } = useLanguage();

  const currencies = Object.keys(CURRENCY_SYMBOLS);

  return (
    <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold font-display">{t("settingsTitle")}</h1>
          <p className="text-sm text-muted-foreground font-body">{t("settingsCustomize")}</p>
        </div>
        <img src={MASCOT_THINKING} alt="Settings" className="w-12 h-12 object-contain" />
      </div>

      <div className="space-y-4">
        {/* Profile Section */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">Profile</h2>
          </div>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-body"
            />
            <button
              onClick={handleSaveName}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold active:scale-95 transition-transform"
            >
              Save
            </button>
          </div>
        </motion.div>

        {/* Language Section */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Languages className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">{t("settingsLanguage")}</h2>
          </div>
          <div className="flex gap-2">
            {(["en", "fil"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  changeLang(l);
                  toast.success(l === "fil" ? "Wika: Filipino" : "Language: English");
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-body font-semibold transition-all active:scale-95 ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border"
                }`}
              >
                {l === "en" ? "🇺🇸 English" : "🇵🇭 Filipino"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Currency Section */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">{t("settingsCurrency")}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {currencies.map((c) => (
              <button
                key={c}
                onClick={() => {
                  updateSettings({ currency: c });
                  toast.success(`Currency set to ${c}`);
                }}
                className={`px-3 py-2 rounded-xl text-sm font-body transition-all active:scale-95 ${
                  settings.currency === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border"
                }`}
              >
                {CURRENCY_SYMBOLS[c]} {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Theme Section */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">{t("settingsTheme")}</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "light", icon: Sun, label: t("settingsLight") },
              { value: "dark", icon: Moon, label: t("settingsDark") },
              { value: "system", icon: Monitor, label: t("settingsSystem") },
            ] as const).map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value);
                  updateSettings({ theme: t.value });
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-95 ${
                  theme === t.value
                    ? "bg-primary/15 border-2 border-primary"
                    : "bg-background border border-border"
                }`}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-xs font-body font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── Color Theme ─── */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.105 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Paintbrush className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">{lang === "fil" ? "Kulay ng Tema" : "Color Theme"}</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_THEMES.map((ct) => (
              <button
                key={ct.id}
                onClick={() => {
                  setColorTheme(ct.id);
                  toast.success(lang === "fil" ? `Tema: ${ct.nameFil}` : `Theme: ${ct.name}`);
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-95 ${
                  colorTheme === ct.id
                    ? "bg-primary/15 border-2 border-primary"
                    : "bg-background border border-border"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: ct.preview }}
                />
                <span className="text-[10px] font-body font-medium leading-tight text-center">
                  {lang === "fil" ? ct.nameFil : ct.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── Mock Data Toggle ─── */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.107 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">{lang === "fil" ? "Demo Data" : "Demo Data"}</h2>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-3">
            {lang === "fil"
              ? "Mag-load ng sample data para ma-test ang lahat ng features ng app."
              : "Load sample data to test and explore all app features."}
          </p>
          <div className="flex gap-2">
            {!mockLoaded ? (
              <button
                onClick={() => {
                  loadMockData();
                  setMockLoaded(true);
                  toast.success(lang === "fil" ? "Na-load na ang demo data!" : "Demo data loaded!");
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold font-body active:scale-95 transition-transform"
              >
                {lang === "fil" ? "I-load ang Demo Data" : "Load Demo Data"}
              </button>
            ) : (
              <button
                onClick={() => {
                  clearMockData();
                  setMockLoaded(false);
                  toast.success(lang === "fil" ? "Na-clear na ang demo data!" : "Demo data cleared!");
                }}
                className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-bold font-body active:scale-95 transition-transform"
              >
                {lang === "fil" ? "I-clear ang Demo Data" : "Clear Demo Data"}
              </button>
            )}
          </div>
        </motion.div>

        {/* ─── Notifications & Reminders ─── */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold font-display">{t("settingsReminders")}</h2>
            </div>
            {reminders.enabled ? (
              <button
                onClick={() => {
                  updateReminders({ enabled: false });
                  toast.success("Reminders disabled");
                }}
                className="text-[10px] px-2 py-1 rounded-lg bg-destructive/10 text-destructive font-semibold"
              >
                {t("settingsDisable")}
              </button>
            ) : null}
          </div>

          {notifPerm === "unsupported" ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
              <BellOff className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-body">
                {t("settingsNotifUnsupported")}
              </p>
            </div>
          ) : !reminders.enabled ? (
            <button
              onClick={handleEnableNotifications}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <span className="text-sm font-body font-semibold block">{t("settingsEnableReminders")}</span>
                  <span className="text-[10px] text-muted-foreground">{t("settingsReminderDesc")}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-primary" />
            </button>
          ) : (
            <div className="space-y-3">
              {/* Daily Reminder */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                <div>
                  <p className="text-sm font-body font-semibold">{t("settingsDailyReminder")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("settingsDailyDesc")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={reminders.dailyTime}
                    onChange={(e) => updateReminders({ dailyTime: e.target.value })}
                    className="text-xs bg-muted rounded-lg px-2 py-1 font-body border-none outline-none"
                  />
                  <button
                    onClick={() => updateReminders({ dailyReminder: !reminders.dailyReminder })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      reminders.dailyReminder ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        reminders.dailyReminder ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Weekly Reminder */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                <div>
                  <p className="text-sm font-body font-semibold">{t("settingsWeeklyReview")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("settingsWeeklyDesc")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={reminders.weeklyDay}
                    onChange={(e) => updateReminders({ weeklyDay: parseInt(e.target.value) })}
                    className="text-xs bg-muted rounded-lg px-2 py-1 font-body border-none outline-none"
                  >
                    {DAYS_OF_WEEK.map((d, i) => (
                      <option key={i} value={i}>{d.slice(0, 3)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => updateReminders({ weeklyReminder: !reminders.weeklyReminder })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      reminders.weeklyReminder ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        reminders.weeklyReminder ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Budget Alerts */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                <div>
                  <p className="text-sm font-body font-semibold">{t("settingsBudgetAlerts")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("settingsBudgetAlertsDesc")}</p>
                </div>
                <button
                  onClick={() => updateReminders({ budgetAlerts: !reminders.budgetAlerts })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    reminders.budgetAlerts ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      reminders.budgetAlerts ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* ─── Category Management ─── */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold font-display">{t("settingsCategories")}</h2>
            </div>
            <button
              onClick={openAddCategory}
              className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
          </div>

          {/* Expense categories */}
          <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Expense
          </p>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {categories
              .filter((c) => c.type === "expense")
              .map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-background border border-border/50 group"
                >
                  <CategoryIcon categoryId={cat.id} iconName={cat.icon} color={cat.color} size="sm" />
                  <span className="text-xs font-body flex-1 truncate">{cat.name}</span>
                  <button
                    onClick={() => openEditCategory(cat)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
          </div>

          {/* Income categories */}
          <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Income
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {categories
              .filter((c) => c.type === "income")
              .map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-background border border-border/50 group"
                >
                  <CategoryIcon categoryId={cat.id} iconName={cat.icon} color={cat.color} size="sm" />
                  <span className="text-xs font-body flex-1 truncate">{cat.name}</span>
                  <button
                    onClick={() => openEditCategory(cat)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
          </div>
        </motion.div>

        {/* ─── Export Section ─── */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">{t("settingsExport")}</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportJSON}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <FileJson className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold font-body">Export JSON</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold font-body">Export CSV</span>
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold font-body">Import JSON</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => csvFileRef.current?.click()}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold font-body">Import CSV</span>
            </button>
            <input
              ref={csvFileRef}
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </div>
        </motion.div>

        {/* Onboarding */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">{t("settingsTutorial")}</h2>
          </div>
          <button
            onClick={handleRestartOnboarding}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-body">{t("settingsRestartOnboarding")}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-destructive/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="w-4 h-4 text-destructive" />
            <h2 className="text-sm font-bold font-display text-destructive">{t("settingsDangerZone")}</h2>
          </div>
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold font-body active:scale-[0.98] transition-transform"
            >
              {t("settingsResetAll")}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-destructive font-body">
                {t("settingsResetConfirm")}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 p-3 rounded-xl bg-background border border-border text-sm font-body"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 p-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold font-body active:scale-[0.98] transition-transform"
                >
                  {t("settingsYesReset")}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* App Info */}
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-xs text-muted-foreground font-body">
            {t("settingsAppVersion")}
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-body mt-1">
            {t("settingsLocalData")}
          </p>
        </motion.div>
      </div>

      {/* ─── Category Add/Edit Sheet ─── */}
      <AnimatePresence>
        {showCatForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowCatForm(false)} />
            <motion.div
              className="relative w-full max-w-[430px] bg-card rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold font-display">
                  {editCat ? t("settingsEditCategory") : t("settingsNewCategory")}
                </h2>
                <button onClick={() => setShowCatForm(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Type Toggle */}
              <div className="flex gap-2 mb-4">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCatForm({ ...catForm, type: t })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold font-body transition-colors ${
                      catForm.type === t
                        ? t === "expense"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {t === "expense" ? lang === "fil" ? "Gastos" : "Expense" : lang === "fil" ? "Kita" : "Income"}
                  </button>
                ))}
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
                  {t("settingsCategoryName")}
                </label>
                <input
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder={t("settingsCategoryNamePlaceholder")}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                />
              </div>

              {/* Icon Picker */}
              <div className="mb-4">
                <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
                  {t("settingsIcon")}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCatForm({ ...catForm, icon: item.id })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                          catForm.icon === item.id
                            ? "bg-primary/15 border-2 border-primary"
                            : "bg-background border border-border/50"
                        }`}
                      >
                        <Icon className="w-5 h-5" style={{ color: catForm.color }} />
                        <span className="text-[8px] font-body truncate w-full text-center">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker */}
              <div className="mb-5">
                <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
                  {t("settingsColor")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCatForm({ ...catForm, color })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        catForm.color === color
                          ? "ring-2 ring-offset-2 ring-primary scale-110"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mb-5 p-3 bg-muted/50 rounded-xl flex items-center gap-3">
                <CategoryIcon categoryId="__preview" iconName={catForm.icon} color={catForm.color} size="lg" />
                <div>
                  <p className="text-sm font-semibold font-body">{catForm.name || t("settingsPreview")}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{catForm.type}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {editCat && (
                  <button
                    onClick={() => {
                      handleDeleteCategory(editCat);
                      setShowCatForm(false);
                    }}
                    className="px-4 py-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-bold font-body active:scale-[0.98] transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold font-display text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <Check className="w-5 h-5" />
                  {editCat ? t("settingsUpdateCategory") : t("settingsAddCategory")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

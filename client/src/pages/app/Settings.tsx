/**
 * TIPID — Settings Page
 * User profile, currency, theme, export (JSON/CSV), category management,
 * backup/restore, onboarding trigger, and data management.
 */
import { useState, useRef } from "react";
import { useTipidStore, CURRENCY_SYMBOLS, type Category } from "@/lib/store";
import CategoryIcon, { AVAILABLE_ICONS, ICON_NAME_MAP } from "@/components/CategoryIcon";
import { useTheme } from "@/contexts/ThemeContext";
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
} from "lucide-react";
import { toast } from "sonner";

const MASCOT_THINKING = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-thinking-ERdmSJBcizk7YthAnj68Pg.webp";

const CATEGORY_COLORS = [
  "#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444",
  "#6366f1", "#0ea5e9", "#22c55e", "#a855f7", "#64748b",
  "#eab308", "#d946ef", "#06b6d4", "#f43f5e", "#78716c",
];

export default function Settings() {
  const {
    settings, updateSettings, exportData, importData, resetAll,
    transactions, categories, accounts,
    addCategory, updateCategory, deleteCategory,
  } = useTipidStore();
  const { theme, setTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);
  const [name, setName] = useState(settings.name);

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

  const currencies = Object.keys(CURRENCY_SYMBOLS);

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold font-display">Settings</h1>
          <p className="text-sm text-muted-foreground font-body">Customize Your App</p>
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

        {/* Currency Section */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">Currency</h2>
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
            <h2 className="text-sm font-bold font-display">Theme</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
              { value: "system", icon: Monitor, label: "System" },
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
              <h2 className="text-sm font-bold font-display">Categories</h2>
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
            <h2 className="text-sm font-bold font-display">Export & Backup</h2>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileJson className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <span className="text-sm font-body block">Export JSON Backup</span>
                  <span className="text-[10px] text-muted-foreground">Full data backup for restore</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <span className="text-sm font-body block">Export Transactions CSV</span>
                  <span className="text-[10px] text-muted-foreground">Open in Excel or Google Sheets</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Upload className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <span className="text-sm font-body block">Import JSON Backup</span>
                  <span className="text-[10px] text-muted-foreground">Restore from a backup file</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleImport}
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
            <h2 className="text-sm font-bold font-display">Tutorial</h2>
          </div>
          <button
            onClick={handleRestartOnboarding}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-body">Restart Onboarding</span>
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
            <h2 className="text-sm font-bold font-display text-destructive">Danger Zone</h2>
          </div>
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold font-body active:scale-[0.98] transition-transform"
            >
              Reset All Data
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-destructive font-body">
                Are you sure? This will delete ALL your data permanently.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 p-3 rounded-xl bg-background border border-border text-sm font-body"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 p-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold font-body active:scale-[0.98] transition-transform"
                >
                  Yes, Reset
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
            Tipid v1.2.0 — Budgeting Without The Stress
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-body mt-1">
            All data stored locally on your device.
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
                  {editCat ? "Edit Category" : "New Category"}
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
                    {t === "expense" ? "Expense" : "Income"}
                  </button>
                ))}
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
                  Category Name
                </label>
                <input
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Pets, Coffee, Gym"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-body"
                />
              </div>

              {/* Icon Picker */}
              <div className="mb-4">
                <label className="text-xs font-semibold font-body text-muted-foreground mb-1.5 block">
                  Icon
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
                  Color
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
                  <p className="text-sm font-semibold font-body">{catForm.name || "Preview"}</p>
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
                  {editCat ? "Update Category" : "Add Category"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

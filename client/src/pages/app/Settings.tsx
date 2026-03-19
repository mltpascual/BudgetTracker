/**
 * TIPID — Settings Page
 * User profile, currency, theme, backup/restore, and data management.
 */
import { useState, useRef } from "react";
import { useTipidStore, CURRENCY_SYMBOLS } from "@/lib/store";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
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
  Info,
} from "lucide-react";
import { toast } from "sonner";

const MASCOT_THINKING = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-thinking-ERdmSJBcizk7YthAnj68Pg.webp";

export default function Settings() {
  const { settings, updateSettings, exportData, importData, resetAll } = useTipidStore();
  const { theme, setTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);
  const [name, setName] = useState(settings.name);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tipid-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded!");
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

        {/* Backup & Restore */}
        <motion.div
          className="bg-card rounded-2xl p-4 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-display">Backup & Restore</h2>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-primary" />
                <span className="text-sm font-body">Export Data (JSON)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-sm font-body">Import Data (JSON)</span>
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
            Tipid v1.0.0 — Budgeting Without The Stress
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-body mt-1">
            All data stored locally on your device.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

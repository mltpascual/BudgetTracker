/**
 * TIPID — useNotifications Hook
 * Manages browser push notification reminders for budget tracking.
 * Stores reminder preferences in localStorage.
 */

export interface ReminderSettings {
  enabled: boolean;
  dailyReminder: boolean;
  dailyTime: string; // HH:mm format
  weeklyReminder: boolean;
  weeklyDay: number; // 0=Sunday, 1=Monday, etc.
  weeklyTime: string;
  budgetAlerts: boolean; // Alert when budget exceeds 80%
}

const STORAGE_KEY = "tipid-reminders";
const LAST_DAILY_KEY = "tipid-last-daily-reminder";
const LAST_WEEKLY_KEY = "tipid-last-weekly-reminder";

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  dailyReminder: true,
  dailyTime: "20:00",
  weeklyReminder: true,
  weeklyDay: 0, // Sunday
  weeklyTime: "10:00",
  budgetAlerts: true,
};

export function getReminderSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_REMINDERS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_REMINDERS;
}

export function saveReminderSettings(settings: ReminderSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export function sendNotification(title: string, body: string, icon?: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      icon: icon || "/favicon.ico",
      badge: "/icon-192.png",
      tag: "tipid-reminder",
    });
  } catch {
    // Fallback for mobile — use service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        title,
        body,
        icon: icon || "/favicon.ico",
      });
    }
  }
}

/**
 * Check if it's time to send reminders. Called on app open.
 */
export function checkAndSendReminders() {
  const settings = getReminderSettings();
  if (!settings.enabled) return;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  // Daily reminder
  if (settings.dailyReminder) {
    const lastDaily = localStorage.getItem(LAST_DAILY_KEY);
    if (lastDaily !== todayStr && currentTime >= settings.dailyTime) {
      sendNotification(
        "Tipid Reminder",
        "Have you logged your expenses today? Keep your budget on track! 🐃",
      );
      localStorage.setItem(LAST_DAILY_KEY, todayStr);
    }
  }

  // Weekly reminder
  if (settings.weeklyReminder && now.getDay() === settings.weeklyDay) {
    const weekKey = `${todayStr}-weekly`;
    const lastWeekly = localStorage.getItem(LAST_WEEKLY_KEY);
    if (lastWeekly !== weekKey && currentTime >= settings.weeklyTime) {
      sendNotification(
        "Tipid Weekly Review",
        "Time for your weekly budget review! Check your spending trends. 📊",
      );
      localStorage.setItem(LAST_WEEKLY_KEY, weekKey);
    }
  }
}

/**
 * Check budget alerts — call when adding a transaction
 */
export function checkBudgetAlert(categoryName: string, spent: number, budgetAmount: number) {
  const settings = getReminderSettings();
  if (!settings.enabled || !settings.budgetAlerts) return;

  const percentage = (spent / budgetAmount) * 100;
  if (percentage >= 100) {
    sendNotification(
      "Budget Exceeded!",
      `You've exceeded your ${categoryName} budget (${Math.round(percentage)}% used).`,
    );
  } else if (percentage >= 80) {
    sendNotification(
      "Budget Warning",
      `You've used ${Math.round(percentage)}% of your ${categoryName} budget.`,
    );
  }
}

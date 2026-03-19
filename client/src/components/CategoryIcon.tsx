/**
 * TIPID — CategoryIcon Component
 * Renders Lucide SVG icons with tinted colored backgrounds instead of emojis.
 * Each category gets a distinct icon + color pairing.
 */
import {
  UtensilsCrossed,
  Bus,
  Smartphone,
  ShoppingBag,
  Heart,
  Gamepad2,
  GraduationCap,
  ShoppingCart,
  Home,
  Package,
  Banknote,
  Laptop,
  Store,
  Gift,
  Coins,
  Zap,
  Briefcase,
  Music,
  Plane,
  Dumbbell,
  Baby,
  PawPrint,
  Fuel,
  Wifi,
  Coffee,
  type LucideIcon,
} from "lucide-react";

// Map of category id → { icon, color }
// Colors are vibrant and each has a light tinted background
export interface CategoryIconConfig {
  icon: LucideIcon;
  color: string; // The main icon stroke color
  bg: string;    // The light tinted background
}

const CATEGORY_ICON_MAP: Record<string, CategoryIconConfig> = {
  // Expense categories
  food:          { icon: UtensilsCrossed, color: "#f97316", bg: "#fff7ed" },
  transport:     { icon: Bus,             color: "#3b82f6", bg: "#eff6ff" },
  bills:         { icon: Smartphone,      color: "#8b5cf6", bg: "#f5f3ff" },
  shopping:      { icon: ShoppingBag,     color: "#ec4899", bg: "#fdf2f8" },
  health:        { icon: Heart,           color: "#ef4444", bg: "#fef2f2" },
  entertainment: { icon: Gamepad2,        color: "#6366f1", bg: "#eef2ff" },
  education:     { icon: GraduationCap,   color: "#0ea5e9", bg: "#f0f9ff" },
  groceries:     { icon: ShoppingCart,     color: "#22c55e", bg: "#f0fdf4" },
  rent:          { icon: Home,            color: "#a855f7", bg: "#faf5ff" },
  "others-exp":  { icon: Package,         color: "#64748b", bg: "#f8fafc" },
  // Income categories
  salary:        { icon: Banknote,        color: "#22c55e", bg: "#f0fdf4" },
  freelance:     { icon: Laptop,          color: "#0ea5e9", bg: "#f0f9ff" },
  business:      { icon: Store,           color: "#f97316", bg: "#fff7ed" },
  gift:          { icon: Gift,            color: "#ec4899", bg: "#fdf2f8" },
  "others-inc":  { icon: Coins,           color: "#64748b", bg: "#f8fafc" },
  // Extra icons for custom categories
  utilities:     { icon: Zap,             color: "#eab308", bg: "#fefce8" },
  work:          { icon: Briefcase,       color: "#6366f1", bg: "#eef2ff" },
  music:         { icon: Music,           color: "#d946ef", bg: "#fdf4ff" },
  travel:        { icon: Plane,           color: "#06b6d4", bg: "#ecfeff" },
  fitness:       { icon: Dumbbell,        color: "#f43f5e", bg: "#fff1f2" },
  kids:          { icon: Baby,            color: "#f472b6", bg: "#fdf2f8" },
  pets:          { icon: PawPrint,        color: "#a3e635", bg: "#f7fee7" },
  gas:           { icon: Fuel,            color: "#78716c", bg: "#fafaf9" },
  internet:      { icon: Wifi,            color: "#2563eb", bg: "#eff6ff" },
  coffee:        { icon: Coffee,          color: "#92400e", bg: "#fffbeb" },
};

// Fallback icon
const FALLBACK: CategoryIconConfig = {
  icon: Package,
  color: "#64748b",
  bg: "#f8fafc",
};

// All available icon options for the icon picker
export const AVAILABLE_ICONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "UtensilsCrossed", label: "Food", icon: UtensilsCrossed },
  { id: "Bus", label: "Transport", icon: Bus },
  { id: "Smartphone", label: "Phone", icon: Smartphone },
  { id: "ShoppingBag", label: "Shopping", icon: ShoppingBag },
  { id: "Heart", label: "Health", icon: Heart },
  { id: "Gamepad2", label: "Gaming", icon: Gamepad2 },
  { id: "GraduationCap", label: "Education", icon: GraduationCap },
  { id: "ShoppingCart", label: "Groceries", icon: ShoppingCart },
  { id: "Home", label: "Home", icon: Home },
  { id: "Package", label: "Package", icon: Package },
  { id: "Banknote", label: "Money", icon: Banknote },
  { id: "Laptop", label: "Laptop", icon: Laptop },
  { id: "Store", label: "Store", icon: Store },
  { id: "Gift", label: "Gift", icon: Gift },
  { id: "Coins", label: "Coins", icon: Coins },
  { id: "Zap", label: "Utilities", icon: Zap },
  { id: "Briefcase", label: "Work", icon: Briefcase },
  { id: "Music", label: "Music", icon: Music },
  { id: "Plane", label: "Travel", icon: Plane },
  { id: "Dumbbell", label: "Fitness", icon: Dumbbell },
  { id: "Baby", label: "Kids", icon: Baby },
  { id: "PawPrint", label: "Pets", icon: PawPrint },
  { id: "Fuel", label: "Gas", icon: Fuel },
  { id: "Wifi", label: "Internet", icon: Wifi },
  { id: "Coffee", label: "Coffee", icon: Coffee },
];

// Map icon name string → LucideIcon component
export const ICON_NAME_MAP: Record<string, LucideIcon> = Object.fromEntries(
  AVAILABLE_ICONS.map((i) => [i.id, i.icon])
);

export function getCategoryIconConfig(categoryId: string): CategoryIconConfig {
  return CATEGORY_ICON_MAP[categoryId] || FALLBACK;
}

interface CategoryIconProps {
  categoryId: string;
  /** Custom icon name override (for custom categories) */
  iconName?: string;
  /** Custom color override */
  color?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  xs: { container: "w-5 h-5 rounded", icon: "w-3 h-3" },
  sm: { container: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
  md: { container: "w-10 h-10 rounded-xl", icon: "w-5 h-5" },
  lg: { container: "w-12 h-12 rounded-xl", icon: "w-6 h-6" },
};

export default function CategoryIcon({
  categoryId,
  iconName,
  color,
  size = "md",
  className = "",
}: CategoryIconProps) {
  const config = getCategoryIconConfig(categoryId);
  const IconComponent = iconName ? (ICON_NAME_MAP[iconName] || config.icon) : config.icon;
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const iconColor = color || config.color;
  // In dark mode, use a semi-transparent version of the color for the background
  const bgColor = isDark
    ? (color ? color + "25" : config.color + "20")
    : (color ? color + "15" : config.bg);
  const sizes = SIZE_MAP[size];

  return (
    <div
      className={`${sizes.container} flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <IconComponent
        className={sizes.icon}
        style={{ color: iconColor }}
        strokeWidth={2}
      />
    </div>
  );
}

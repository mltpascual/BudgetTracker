import React, { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";
export type ColorTheme = "green" | "ocean" | "terracotta" | "lavender" | "teal" | "charcoal";

interface ThemeContextType {
  theme: Mode;
  setTheme: (t: Mode) => void;
  resolvedTheme: "light" | "dark";
  switchable: boolean;
  toggleTheme?: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Mode;
  switchable?: boolean;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const COLOR_THEMES: { id: ColorTheme; name: string; nameFil: string; preview: string }[] = [
  { id: "green", name: "Mint Green", nameFil: "Berdeng Mint", preview: "oklch(0.65 0.19 145)" },
  { id: "ocean", name: "Ocean Blue", nameFil: "Asul ng Dagat", preview: "oklch(0.55 0.18 250)" },
  { id: "terracotta", name: "Warm Terracotta", nameFil: "Mainit na Terracotta", preview: "oklch(0.62 0.16 45)" },
  { id: "lavender", name: "Soft Lavender", nameFil: "Malambot na Lavender", preview: "oklch(0.58 0.18 300)" },
  { id: "teal", name: "Deep Teal", nameFil: "Malalim na Teal", preview: "oklch(0.58 0.14 195)" },
  { id: "charcoal", name: "Charcoal + Gold", nameFil: "Uling at Ginto", preview: "oklch(0.72 0.16 85)" },
];

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Mode>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme") as Mode | null;
      return stored || defaultTheme;
    }
    return defaultTheme;
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem("colorTheme") as ColorTheme | null;
    return stored || "teal";
  });

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  // Apply dark/light mode class
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, resolvedTheme, switchable]);

  // Apply color theme class
  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    COLOR_THEMES.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
    });
    // Add current theme class (teal is default/root, no class needed)
    if (colorTheme !== "teal") {
      root.classList.add(`theme-${colorTheme}`);
    }
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setThemeState("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: Mode) => {
    setThemeState(t);
  };

  const setColorTheme = (c: ColorTheme) => {
    setColorThemeState(c);
  };

  const toggleTheme = switchable
    ? () => setThemeState((prev) => (prev === "light" ? "dark" : "light"))
    : undefined;

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resolvedTheme, switchable, toggleTheme, colorTheme, setColorTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

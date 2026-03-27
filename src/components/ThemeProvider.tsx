"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { style } from "@/app/resources";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const root = document.documentElement;
      const initialTheme = localStorage.getItem("data-theme") as Theme;
      if (initialTheme) {
        setThemeState(initialTheme);
      } else {
        setThemeState(style.theme as Theme || "dark");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      const root = document.documentElement;
      let resolvedTheme = newTheme;
      if (newTheme === "system") {
        resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      root.setAttribute("data-theme", resolvedTheme);
      localStorage.setItem("data-theme", newTheme);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ORDER = ["light", "dark", "high-contrast"] as const;
const LABEL: Record<string, string> = {
  light: "Light",
  dark: "Dark",
  "high-contrast": "High contrast",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function cycle() {
    const current = (theme as string) || "light";
    const idx = ORDER.indexOf(current as (typeof ORDER)[number]);
    setTheme(ORDER[(idx + 1) % ORDER.length]);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label="Cycle theme"
      className="font-ui text-xs uppercase tracking-wider px-3 py-1.5 border rule hover:border-[var(--accent)]"
      style={{ color: "var(--text-muted)" }}
    >
      {mounted ? LABEL[theme as string] || "Light" : "Theme"}
    </button>
  );
}

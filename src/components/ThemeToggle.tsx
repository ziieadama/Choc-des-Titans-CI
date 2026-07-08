"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLocale } from "./LocaleProvider";

/** Bascule clair/soleil ↔ sombre/lune, persistée dans localStorage. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useLocale();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("cdt-theme", next);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? t("nav.theme.light") : t("nav.theme.dark")}
      title={theme === "dark" ? t("nav.theme.light") : t("nav.theme.dark")}
      className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white hover:rotate-12 ${className}`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

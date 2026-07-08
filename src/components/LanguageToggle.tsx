"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

/** Sélecteur FR/EN — cookie + refresh des composants serveur. */
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: "fr" | "en") => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${365 * 24 * 3600};samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-white/8 p-0.5 text-[11px] font-bold uppercase tracking-wider ${pending ? "opacity-60" : ""} ${className}`}
      role="group"
      aria-label="Langue / Language"
    >
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-pressed={locale === l}
          className={`cursor-pointer rounded-full px-2.5 py-1.5 transition-all ${
            locale === l
              ? "bg-blue text-white shadow-glow-blue"
              : "text-white/55 hover:text-white"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

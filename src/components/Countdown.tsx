"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";

interface CountdownProps {
  target: string; // ISO date
  compact?: boolean;
}

const compute = (target: string) => {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    j: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
};

export default function Countdown({ target, compact = false }: CountdownProps) {
  const { t } = useLocale();
  const [time, setTime] = useState<ReturnType<typeof compute> | undefined>(undefined);

  useEffect(() => {
    setTime(compute(target));
    const id = setInterval(() => setTime(compute(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  // Rendu serveur / avant hydratation : placeholders stables
  const units = [
    { label: t("common.days"), value: time?.j },
    { label: t("common.hours"), value: time?.h },
    { label: t("common.min"), value: time?.m },
    { label: t("common.sec"), value: time?.s },
  ];

  if (time === null) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md bg-red/15 px-4 py-2 text-sm font-bold uppercase tracking-widest text-red">
        <span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-red" />
        {t("common.itsNow")}
      </span>
    );
  }

  return (
    <div className={`flex ${compact ? "gap-2" : "gap-3 sm:gap-4"}`} role="timer" aria-label="Compte à rebours avant le prochain événement">
      {units.map((u) => (
        <div
          key={u.label}
          className={`glass-light flex flex-col items-center justify-center rounded-lg ${
            compact ? "h-14 w-14" : "h-20 w-20 sm:h-24 sm:w-24"
          }`}
        >
          <span
            className={`font-display tabular text-white leading-none ${
              compact ? "text-xl" : "text-3xl sm:text-4xl"
            }`}
          >
            {u.value !== undefined ? String(u.value).padStart(2, "0") : "--"}
          </span>
          <span
            className={`mt-1 uppercase tracking-widest text-white/50 ${
              compact ? "text-[9px]" : "text-[10px] sm:text-xs"
            }`}
          >
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { Fighter } from "@/data/types";
import type { DictKey } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

const labels: Record<keyof Fighter["stats"], DictKey> = {
  puissance: "fighter.stats.puissance",
  vitesse: "fighter.stats.vitesse",
  technique: "fighter.stats.technique",
  endurance: "fighter.stats.endurance",
};

/** Barres de statistiques animées d'un combattant. */
export default function StatBars({ stats }: { stats: Fighter["stats"] }) {
  const { t } = useLocale();
  return (
    <div className="space-y-4">
      {(Object.keys(labels) as (keyof Fighter["stats"])[]).map((key, i) => (
        <div key={key}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-white/70">
              {t(labels[key])}
            </span>
            <span className="tabular font-bold text-blue-light">{stats[key]}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${stats[key]}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-blue-dark via-blue to-blue-light"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

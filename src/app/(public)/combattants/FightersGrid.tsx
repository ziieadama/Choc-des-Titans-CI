"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Fighter } from "@/data/types";
import { weightOrder } from "@/data/fighters";
import { useLocale } from "@/components/LocaleProvider";
import SectionHeader from "@/components/SectionHeader";
import FighterCard from "@/components/FighterCard";

/** Grille filtrable du roster (données à jour passées par le serveur). */
export default function FightersGrid({ fighters }: { fighters: Fighter[] }) {
  const { t, locale } = useLocale();
  const [filter, setFilter] = useState<string>("all");

  const shown =
    filter === "all" ? fighters : fighters.filter((f) => f.weightClass === filter);

  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker={t("fighters.kicker")}
          title={t("fighters.title")}
          description={t("fighters.desc")}
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {["all", ...weightOrder].map((w) => (
            <button
              key={w}
              onClick={() => setFilter(w)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filter === w
                  ? "bg-blue text-white shadow-glow-blue"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {w === "all" ? t("fighters.allFilter") : w}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((f) => (
              <motion.div
                key={f.slug}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
              >
                <FighterCard fighter={f} locale={locale} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
